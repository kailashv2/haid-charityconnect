import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  insertDonorSchema,
  insertItemDonationSchema,
  insertMonetaryDonationSchema,
  insertNeedyPersonSchema
} from "@shared/schema";
import { z } from "zod";

// Initialize Stripe (optional)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  });
} else {
  console.warn('Stripe not configured: STRIPE_SECRET_KEY not provided');
}

// Initialize Twilio
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: any = null;
if (twilioAccountSid && twilioAuthToken) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(twilioAccountSid, twilioAuthToken);
  } catch (error) {
    console.warn('Twilio not available:', error.message);
  }
}

async function sendSMS(phone: string, message: string) {
  if (!twilioClient || !twilioPhoneNumber) {
    console.warn('SMS service not configured');
    // Log the SMS attempt
    await storage.createSmsLog({
      phone,
      message,
      status: "failed",
      twilioSid: null,
    });
    return;
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phone,
    });

    await storage.createSmsLog({
      phone,
      message,
      status: "sent",
      twilioSid: result.sid,
    });

    console.log('SMS sent successfully:', result.sid);
  } catch (error) {
    console.error('SMS sending failed:', error);
    await storage.createSmsLog({
      phone,
      message,
      status: "failed",
      twilioSid: null,
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create payment intent for monetary donations
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      if (!stripe) {
        return res.status(503).json({ message: "Payment processing not available. Please contact administrator to configure Stripe." });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "inr",
        metadata: {
          type: "donation"
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Payment intent creation failed:', error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Submit item donation
  app.post("/api/donations/items", async (req, res) => {
    try {
      const donorData = insertDonorSchema.parse(req.body.donor);
      const itemData = insertItemDonationSchema.parse(req.body.item);
      const pickupData = req.body.pickup || {};

      // Create or find donor
      let donor = await storage.getDonorByEmail(donorData.email);
      if (!donor) {
        donor = await storage.createDonor(donorData);
      }

      // Create item donation
      const itemDonation = await storage.createItemDonation({
        ...itemData,
        donorId: donor.id,
        pickupDate: pickupData.date,
        pickupTimeSlot: pickupData.timeSlot,
        pickupInstructions: pickupData.instructions,
      });

      // Send SMS notification
      const smsMessage = `Thank you ${donor.name} for your kind donation of ${itemData.category}. Your contribution will help the needy. Our team will contact you soon for pickup. - Team HAID`;
      await sendSMS(donor.phone, smsMessage);

      res.json({ success: true, donation: itemDonation });
    } catch (error: any) {
      console.error('Item donation creation failed:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating item donation: " + error.message });
    }
  });

  // Submit monetary donation
  app.post("/api/donations/money", async (req, res) => {
    try {
      const donorData = insertDonorSchema.parse(req.body.donor);
      const donationData = insertMonetaryDonationSchema.parse(req.body.donation);
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID is required" });
      }

      // Verify payment with Stripe
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing not available. Please contact administrator to configure Stripe." });
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment not completed" });
      }

      // Create or find donor
      let donor = await storage.getDonorByEmail(donorData.email);
      if (!donor) {
        donor = await storage.createDonor(donorData);
      }

      // Create monetary donation
      const monetaryDonation = await storage.createMonetaryDonation({
        ...donationData,
        donorId: donor.id,
      });

      // Update donation with payment info
      await storage.updateMonetaryDonationPayment(
        monetaryDonation.id,
        paymentIntentId,
        "completed"
      );

      // Send SMS notification
      const amount = parseFloat(donationData.amount);
      const smsMessage = `Thank you ${donor.name} for your generous donation of ₹${amount.toLocaleString()}. Your contribution will make a real difference in helping those in need. - Team HAID`;
      await sendSMS(donor.phone, smsMessage);

      res.json({ success: true, donation: monetaryDonation });
    } catch (error: any) {
      console.error('Monetary donation creation failed:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating monetary donation: " + error.message });
    }
  });

  // Register needy person
  app.post("/api/needy", async (req, res) => {
    try {
      const needyData = insertNeedyPersonSchema.parse(req.body);

      const needyPerson = await storage.createNeedyPerson(needyData);

      // Send SMS notification to reporter
      const smsMessage = `Thank you ${needyData.reporterName} for registering ${needyData.name} with HAID. Our team will verify the information and contact you soon. - Team HAID`;
      await sendSMS(needyData.reporterPhone, smsMessage);

      res.json({ success: true, person: needyPerson });
    } catch (error: any) {
      console.error('Needy person registration failed:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error registering needy person: " + error.message });
    }
  });

  // Get analytics data
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error: any) {
      console.error('Analytics fetch failed:', error);
      res.status(500).json({ message: "Error fetching analytics: " + error.message });
    }
  });

  // Get all donations (for admin)
  app.get("/api/donations", async (req, res) => {
    try {
      const itemDonations = await storage.getItemDonations();
      const monetaryDonations = await storage.getMonetaryDonations();
      res.json({ itemDonations, monetaryDonations });
    } catch (error: any) {
      console.error('Donations fetch failed:', error);
      res.status(500).json({ message: "Error fetching donations: " + error.message });
    }
  });

  // Get all needy persons (for admin)
  app.get("/api/needy", async (req, res) => {
    try {
      const needyPersons = await storage.getNeedyPersons();
      res.json(needyPersons);
    } catch (error: any) {
      console.error('Needy persons fetch failed:', error);
      res.status(500).json({ message: "Error fetching needy persons: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
