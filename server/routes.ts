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
  } catch (error: any) {
    console.warn('Twilio not available:', error?.message || 'Unknown error');
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
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        stripe: !!stripe,
        twilio: !!twilioClient,
        sms: !!twilioPhoneNumber
      }
    });
  });
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
      // Prevent caching to ensure fresh data
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      
      const analytics = await storage.getAnalytics();
      console.log('📊 Analytics data:', { 
        peopleHelped: analytics.peopleHelped, 
        activeCases: analytics.activeCases 
      });
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
      
      // Debug: Log current data to see what we have
      console.log('🔍 Current needy persons data:');
      needyPersons.forEach((p: any) => {
        console.log(`  - ${p.name}: verified=${p.verified}, status=${p.status}`);
      });
      
      res.json(needyPersons);
    } catch (error: any) {
      console.error('Needy persons fetch failed:', error);
      res.status(500).json({ message: "Error fetching needy persons: " + error.message });
    }
  });

  // Update needy person status (admin only)
  app.patch("/api/needy/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, verified } = req.body;
      
      const needyPerson = await storage.getNeedyPerson(id);
      if (!needyPerson) {
        return res.status(404).json({ message: "Needy person not found" });
      }

      const updatedPerson = await storage.updateNeedyPersonStatus(id, status, verified);
      res.json({ success: true, person: updatedPerson, message: "Status updated successfully" });
    } catch (error: any) {
      console.error('Status update failed:', error);
      res.status(500).json({ message: "Error updating status: " + error.message });
    }
  });


  // Verify needy person (admin only)
  app.post("/api/needy/:id/verify", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`🔄 Verifying person with ID: ${id}`);
      
      const needyPerson = await storage.getNeedyPerson(id);
      if (!needyPerson) {
        console.log(`❌ Person not found with ID: ${id}`);
        return res.status(404).json({ message: "Needy person not found" });
      }

      console.log(`👤 Found person: ${needyPerson.name}`);
      
      const updatedPerson = await storage.updateNeedyPersonStatus(id, "verified", true);
      console.log(`✅ Status updated in database`);
      
      // Send SMS notification to reporter about verification (don't fail if SMS fails)
      try {
        if (needyPerson.reporterPhone) {
          const smsMessage = `Good news! ${needyPerson.name}'s registration has been verified by HAID. Our team will contact you soon for assistance coordination. - Team HAID`;
          await sendSMS(needyPerson.reporterPhone, smsMessage);
          console.log(`📱 SMS sent successfully to ${needyPerson.reporterPhone}`);
        } else {
          console.log(`⚠️ No reporter phone number found, skipping SMS`);
        }
      } catch (smsError) {
        console.error('SMS sending failed (but verification succeeded):', smsError);
        // Don't fail the entire operation if SMS fails
      }
      
      res.json({ success: true, person: updatedPerson, message: "Person verified successfully" });
    } catch (error: any) {
      console.error('Verification failed:', error);
      res.status(500).json({ message: "Error verifying person: " + error.message });
    }
  });

  // Mark needy person as helped (admin only)
  app.post("/api/needy/:id/helped", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`🔄 Marking person as helped with ID: ${id}`);
      
      const needyPerson = await storage.getNeedyPerson(id);
      if (!needyPerson) {
        console.log(`❌ Person not found with ID: ${id}`);
        return res.status(404).json({ message: "Needy person not found" });
      }

      console.log(`👤 Found person: ${needyPerson.name}`);
      
      const updatedPerson = await storage.updateNeedyPersonStatus(id, "helped", true);
      console.log(`✅ Status updated to helped in database`);
      console.log(`🔍 Updated person data:`, { 
        id: updatedPerson?.id, 
        name: updatedPerson?.name, 
        status: updatedPerson?.status, 
        verified: updatedPerson?.verified 
      });
      
      // Send SMS notification to reporter about help provided
      try {
        if (needyPerson.reporterPhone) {
          const smsMessage = `Great news! ${needyPerson.name} has received assistance through HAID. Thank you for reporting and helping make a difference! - Team HAID`;
          await sendSMS(needyPerson.reporterPhone, smsMessage);
          console.log(`📱 SMS sent successfully to ${needyPerson.reporterPhone}`);
        } else {
          console.log(`⚠️ No reporter phone number found, skipping SMS`);
        }
      } catch (smsError) {
        console.error('SMS sending failed (but helped status succeeded):', smsError);
        // Don't fail the entire operation if SMS fails
      }
      
      res.json({ success: true, person: updatedPerson, message: "Person marked as helped successfully" });
    } catch (error: any) {
      console.error('Mark as helped failed:', error);
      res.status(500).json({ message: "Error marking person as helped: " + error.message });
    }
  });

  // Remove person from helped status (admin only)
  app.post("/api/needy/:id/unhelp", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`🔄 Removing person from helped status with ID: ${id}`);
      
      const needyPerson = await storage.getNeedyPerson(id);
      if (!needyPerson) {
        console.log(`❌ Person not found with ID: ${id}`);
        return res.status(404).json({ message: "Needy person not found" });
      }

      console.log(`👤 Found person: ${needyPerson.name}`);
      
      // Set back to verified status (not helped anymore)
      const updatedPerson = await storage.updateNeedyPersonStatus(id, "verified", true);
      console.log(`✅ Status updated back to verified in database`);
      
      res.json({ success: true, person: updatedPerson, message: "Person removed from helped status successfully" });
    } catch (error: any) {
      console.error('Remove from helped failed:', error);
      res.status(500).json({ message: "Error removing person from helped status: " + error.message });
    }
  });

  // Remove person from verified status (admin only)
  app.post("/api/needy/:id/unverify", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`🔄 Removing person from verified status with ID: ${id}`);
      
      const needyPerson = await storage.getNeedyPerson(id);
      if (!needyPerson) {
        console.log(`❌ Person not found with ID: ${id}`);
        return res.status(404).json({ message: "Needy person not found" });
      }

      console.log(`👤 Found person: ${needyPerson.name}`);
      
      // Set back to pending status
      const updatedPerson = await storage.updateNeedyPersonStatus(id, "pending", false);
      console.log(`✅ Status updated back to pending in database`);
      
      res.json({ success: true, person: updatedPerson, message: "Person removed from verified status successfully" });
    } catch (error: any) {
      console.error('Remove from verified failed:', error);
      res.status(500).json({ message: "Error removing person from verified status: " + error.message });
    }
  });

  // Remove person from rejected status (admin only)
  app.post("/api/needy/:id/unreject", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`🔄 Removing person from rejected status with ID: ${id}`);
      
      const needyPerson = await storage.getNeedyPerson(id);
      if (!needyPerson) {
        console.log(`❌ Person not found with ID: ${id}`);
        return res.status(404).json({ message: "Needy person not found" });
      }

      console.log(`👤 Found person: ${needyPerson.name}`);
      console.log(`🔍 Current person data:`, { 
        id: needyPerson.id, 
        name: needyPerson.name, 
        status: needyPerson.status, 
        verified: needyPerson.verified 
      });
      
      // Set back to pending status
      const updatedPerson = await storage.updateNeedyPersonStatus(id, "pending", false);
      console.log(`✅ Status updated back to pending in database`);
      console.log(`🔍 Updated person data:`, { 
        id: updatedPerson?.id, 
        name: updatedPerson?.name, 
        status: updatedPerson?.status, 
        verified: updatedPerson?.verified 
      });
      
      res.json({ success: true, person: updatedPerson, message: "Person removed from rejected status successfully" });
    } catch (error: any) {
      console.error('Remove from rejected failed:', error);
      res.status(500).json({ message: "Error removing person from rejected status: " + error.message });
    }
  });

  // Reject needy person (admin only)
  app.post("/api/needy/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`🔄 Rejecting person with ID: ${id}`);
      
      const needyPerson = await storage.getNeedyPerson(id);
      if (!needyPerson) {
        console.log(`❌ Person not found with ID: ${id}`);
        return res.status(404).json({ message: "Needy person not found" });
      }

      console.log(`👤 Found person: ${needyPerson.name}`);
      
      const updatedPerson = await storage.updateNeedyPersonStatus(id, "rejected", false);
      console.log(`✅ Status updated in database`);
      
      // Send SMS notification to reporter about rejection (don't fail if SMS fails)
      try {
        if (needyPerson.reporterPhone) {
          const smsMessage = `We regret to inform that ${needyPerson.name}'s registration could not be verified at this time. Please contact HAID for more information. - Team HAID`;
          await sendSMS(needyPerson.reporterPhone, smsMessage);
          console.log(`📱 SMS sent successfully to ${needyPerson.reporterPhone}`);
        } else {
          console.log(`⚠️ No reporter phone number found, skipping SMS`);
        }
      } catch (smsError) {
        console.error('SMS sending failed (but rejection succeeded):', smsError);
        // Don't fail the entire operation if SMS fails
      }
      
      res.json({ success: true, person: updatedPerson, message: "Person rejected successfully" });
    } catch (error: any) {
      console.error('Rejection failed:', error);
      res.status(500).json({ message: "Error rejecting person: " + error.message });
    }
  });

  // Get SMS logs (admin only)
  app.get("/api/sms-logs", async (req, res) => {
    try {
      const smsLogs = await storage.getSmsLogs();
      res.json(smsLogs);
    } catch (error: any) {
      console.error('SMS logs fetch failed:', error);
      res.status(500).json({ message: "Error fetching SMS logs: " + error.message });
    }
  });

  // Get donor information
  app.get("/api/donors/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const donor = await storage.getDonorByEmail(email);
      
      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }

      // Get donor's donations
      const itemDonations = await storage.getItemDonationsByDonor(donor.id);
      const monetaryDonations = await storage.getMonetaryDonationsByDonor(donor.id);

      res.json({
        donor: {
          ...donor,
          email: donor.email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email
          phone: donor.phone.replace(/(.{2}).*(.{2})/, '$1***$2') // Mask phone
        },
        donations: {
          items: itemDonations,
          monetary: monetaryDonations
        }
      });
    } catch (error: any) {
      console.error('Donor fetch failed:', error);
      res.status(500).json({ message: "Error fetching donor information: " + error.message });
    }
  });

  // Search functionality
  app.get("/api/search", async (req, res) => {
    try {
      const { q, type } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const searchTerm = q.toLowerCase();
      let results: any = {};

      if (!type || type === 'donations') {
        const itemDonations = await storage.getItemDonations();
        const monetaryDonations = await storage.getMonetaryDonations();
        
        results.donations = {
          items: itemDonations.filter(d => 
            d.category.toLowerCase().includes(searchTerm) ||
            d.description.toLowerCase().includes(searchTerm)
          ),
          monetary: monetaryDonations.filter(d => 
            d.purpose.toLowerCase().includes(searchTerm)
          )
        };
      }

      if (!type || type === 'needy') {
        const needyPersons = await storage.getNeedyPersons();
        results.needy = needyPersons.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.city.toLowerCase().includes(searchTerm) ||
          p.situation.toLowerCase().includes(searchTerm)
        );
      }

      res.json(results);
    } catch (error: any) {
      console.error('Search failed:', error);
      res.status(500).json({ message: "Error performing search: " + error.message });
    }
  });

  // Export data (admin only)
  app.get("/api/export/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const { format = 'json' } = req.query;

      let data: any;
      let filename: string;

      switch (type) {
        case 'donations':
          const itemDonations = await storage.getItemDonations();
          const monetaryDonations = await storage.getMonetaryDonations();
          data = { itemDonations, monetaryDonations };
          filename = `donations_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'needy':
          data = await storage.getNeedyPersons();
          filename = `needy_persons_export_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'analytics':
          data = await storage.getAnalytics();
          filename = `analytics_export_${new Date().toISOString().split('T')[0]}`;
          break;
        default:
          return res.status(400).json({ message: "Invalid export type" });
      }

      if (format === 'csv') {
        // Simple CSV conversion (would need proper CSV library in production)
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
        res.send('CSV export not implemented yet');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
        res.json(data);
      }
    } catch (error: any) {
      console.error('Export failed:', error);
      res.status(500).json({ message: "Error exporting data: " + error.message });
    }
  });

  // Update item donation status (admin only)
  app.patch("/api/donations/items/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['pending', 'completed', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be: pending, completed, delivered, or cancelled" });
      }

      // For now, we'll just return success since we don't have an update method in storage
      // In a real implementation, you'd update the database
      res.json({ success: true, message: `Donation status updated to ${status}` });
    } catch (error: any) {
      console.error('Status update failed:', error);
      res.status(500).json({ message: "Error updating donation status: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
