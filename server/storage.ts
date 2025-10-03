import { 
  type Donor, 
  type InsertDonor,
  type ItemDonation,
  type InsertItemDonation,
  type MonetaryDonation,
  type InsertMonetaryDonation,
  type NeedyPerson,
  type InsertNeedyPerson,
  type SmsLog,
  type InsertSmsLog
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Donors
  createDonor(donor: InsertDonor): Promise<Donor>;
  getDonor(id: string): Promise<Donor | undefined>;
  getDonorByEmail(email: string): Promise<Donor | undefined>;

  // Item Donations
  createItemDonation(donation: InsertItemDonation & { donorId: string }): Promise<ItemDonation>;
  getItemDonations(): Promise<ItemDonation[]>;
  getItemDonationsByDonor(donorId: string): Promise<ItemDonation[]>;

  // Monetary Donations
  createMonetaryDonation(donation: InsertMonetaryDonation & { donorId: string }): Promise<MonetaryDonation>;
  updateMonetaryDonationPayment(id: string, paymentIntentId: string, status: string): Promise<MonetaryDonation | undefined>;
  getMonetaryDonations(): Promise<MonetaryDonation[]>;
  getMonetaryDonationsByDonor(donorId: string): Promise<MonetaryDonation[]>;

  // Needy Persons
  createNeedyPerson(person: InsertNeedyPerson): Promise<NeedyPerson>;
  getNeedyPersons(): Promise<NeedyPerson[]>;
  getNeedyPerson(id: string): Promise<NeedyPerson | undefined>;
  updateNeedyPersonStatus(id: string, status: string, verified?: boolean): Promise<NeedyPerson | undefined>;

  // SMS Logs
  createSmsLog(log: InsertSmsLog): Promise<SmsLog>;
  getSmsLogs(): Promise<SmsLog[]>;

  // Analytics
  getAnalytics(): Promise<{
    totalDonations: number;
    totalMonetaryAmount: number;
    totalItemDonations: number;
    peopleHelped: number;
    activeCases: number;
    monthlyTrend: Array<{ month: string; count: number; amount: number }>;
    donationsByCategory: Array<{ category: string; count: number }>;
    needsByCategory: Array<{ category: string; count: number }>;
    donationsByRegion: Array<{ region: string; count: number }>;
  }>;
}

export class MemStorage implements IStorage {
  private donors: Map<string, Donor> = new Map();
  private itemDonations: Map<string, ItemDonation> = new Map();
  private monetaryDonations: Map<string, MonetaryDonation> = new Map();
  private needyPersons: Map<string, NeedyPerson> = new Map();
  private smsLogs: Map<string, SmsLog> = new Map();

  async createDonor(insertDonor: InsertDonor): Promise<Donor> {
    const id = randomUUID();
    const donor: Donor = {
      ...insertDonor,
      id,
      createdAt: new Date(),
      address: insertDonor.address || null,
      city: insertDonor.city || null,
      state: insertDonor.state || null,
      pincode: insertDonor.pincode || null,
      pan: insertDonor.pan || null,
    };
    this.donors.set(id, donor);
    return donor;
  }

  async getDonor(id: string): Promise<Donor | undefined> {
    return this.donors.get(id);
  }

  async getDonorByEmail(email: string): Promise<Donor | undefined> {
    return Array.from(this.donors.values()).find(donor => donor.email === email);
  }

  async createItemDonation(donation: InsertItemDonation & { donorId: string }): Promise<ItemDonation> {
    const id = randomUUID();
    const itemDonation: ItemDonation = {
      ...donation,
      id,
      status: "pending",
      createdAt: new Date(),
      quantity: donation.quantity || null,
      pickupDate: donation.pickupDate || null,
      pickupTimeSlot: donation.pickupTimeSlot || null,
      pickupInstructions: donation.pickupInstructions || null,
    };
    this.itemDonations.set(id, itemDonation);
    return itemDonation;
  }

  async getItemDonations(): Promise<ItemDonation[]> {
    return Array.from(this.itemDonations.values());
  }

  async getItemDonationsByDonor(donorId: string): Promise<ItemDonation[]> {
    return Array.from(this.itemDonations.values()).filter(d => d.donorId === donorId);
  }

  async createMonetaryDonation(donation: InsertMonetaryDonation & { donorId: string }): Promise<MonetaryDonation> {
    const id = randomUUID();
    const monetaryDonation: MonetaryDonation = {
      ...donation,
      id,
      status: "pending",
      stripePaymentIntentId: null,
      createdAt: new Date(),
      message: donation.message || null,
    };
    this.monetaryDonations.set(id, monetaryDonation);
    return monetaryDonation;
  }

  async updateMonetaryDonationPayment(id: string, paymentIntentId: string, status: string): Promise<MonetaryDonation | undefined> {
    const donation = this.monetaryDonations.get(id);
    if (donation) {
      donation.stripePaymentIntentId = paymentIntentId;
      donation.status = status;
      this.monetaryDonations.set(id, donation);
    }
    return donation;
  }

  async getMonetaryDonations(): Promise<MonetaryDonation[]> {
    return Array.from(this.monetaryDonations.values());
  }

  async getMonetaryDonationsByDonor(donorId: string): Promise<MonetaryDonation[]> {
    return Array.from(this.monetaryDonations.values()).filter(d => d.donorId === donorId);
  }

  async createNeedyPerson(insertNeedy: InsertNeedyPerson): Promise<NeedyPerson> {
    const id = randomUUID();
    const needyPerson: NeedyPerson = {
      id,
      name: insertNeedy.name,
      age: insertNeedy.age,
      gender: insertNeedy.gender,
      phone: insertNeedy.phone || null,
      familySize: insertNeedy.familySize || null,
      address: insertNeedy.address,
      city: insertNeedy.city,
      state: insertNeedy.state,
      pincode: insertNeedy.pincode,
      needs: insertNeedy.needs as string[],
      situation: insertNeedy.situation,
      income: insertNeedy.income ? insertNeedy.income.toString() : null,
      reporterName: insertNeedy.reporterName,
      reporterPhone: insertNeedy.reporterPhone,
      reporterEmail: insertNeedy.reporterEmail,
      reporterRelationship: insertNeedy.reporterRelationship,
      verified: false,
      status: "pending",
      createdAt: new Date(),
    };
    this.needyPersons.set(id, needyPerson);
    return needyPerson;
  }

  async getNeedyPersons(): Promise<NeedyPerson[]> {
    return Array.from(this.needyPersons.values());
  }

  async getNeedyPerson(id: string): Promise<NeedyPerson | undefined> {
    return this.needyPersons.get(id);
  }

  async updateNeedyPersonStatus(id: string, status: string, verified?: boolean): Promise<NeedyPerson | undefined> {
    const needyPerson = this.needyPersons.get(id);
    if (needyPerson) {
      needyPerson.status = status;
      if (verified !== undefined) {
        needyPerson.verified = verified;
      }
      this.needyPersons.set(id, needyPerson);
    }
    return needyPerson;
  }

  async createSmsLog(insertLog: InsertSmsLog): Promise<SmsLog> {
    const id = randomUUID();
    const smsLog: SmsLog = {
      ...insertLog,
      id,
      createdAt: new Date(),
      twilioSid: insertLog.twilioSid || null,
    };
    this.smsLogs.set(id, smsLog);
    return smsLog;
  }

  async getSmsLogs(): Promise<SmsLog[]> {
    return Array.from(this.smsLogs.values());
  }

  async getAnalytics() {
    const itemDonations = Array.from(this.itemDonations.values());
    const monetaryDonations = Array.from(this.monetaryDonations.values());
    const needyPersons = Array.from(this.needyPersons.values());

    const totalDonations = itemDonations.length + monetaryDonations.length;
    const totalMonetaryAmount = monetaryDonations
      .filter(d => d.status === "completed")
      .reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const totalItemDonations = itemDonations.length;
    const peopleHelped = needyPersons.filter(p => p.verified).length;
    const activeCases = needyPersons.filter(p => p.status === "pending").length;

    // Monthly trend - calculated from real data (last 6 months)
    const monthlyTrend = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const month = date.getMonth();
      
      // Count donations for this month
      const monthItemDonations = itemDonations.filter(d => {
        if (!d.createdAt) return false;
        const donationDate = new Date(d.createdAt);
        return donationDate.getFullYear() === year && donationDate.getMonth() === month;
      });
      
      const monthMonetaryDonations = monetaryDonations.filter(d => {
        if (!d.createdAt) return false;
        const donationDate = new Date(d.createdAt);
        return donationDate.getFullYear() === year && donationDate.getMonth() === month;
      });
      
      const monthCount = monthItemDonations.length + monthMonetaryDonations.length;
      const monthAmount = monthMonetaryDonations
        .filter(d => d.status === "completed")
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);
      
      monthlyTrend.push({
        month: monthName,
        count: monthCount,
        amount: monthAmount
      });
    }

    // Donations by category
    const categoryCount: Record<string, number> = {};
    itemDonations.forEach(d => {
      categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
    });
    const donationsByCategory = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }));

    // Needs by category
    const needsCount: Record<string, number> = {};
    needyPersons.forEach(p => {
      if (Array.isArray(p.needs)) {
        p.needs.forEach((need: string) => {
          needsCount[need] = (needsCount[need] || 0) + 1;
        });
      }
    });
    const needsByCategory = Object.entries(needsCount).map(([category, count]) => ({
      category,
      count,
    }));

    // Donations by region
    const regionCount: Record<string, number> = {};
    const allDonors = Array.from(this.donors.values());
    allDonors.forEach(d => {
      if (d.city) {
        regionCount[d.city] = (regionCount[d.city] || 0) + 1;
      }
    });
    const donationsByRegion = Object.entries(regionCount).map(([region, count]) => ({
      region,
      count,
    }));

    return {
      totalDonations,
      totalMonetaryAmount,
      totalItemDonations,
      peopleHelped,
      activeCases,
      monthlyTrend,
      donationsByCategory,
      needsByCategory,
      donationsByRegion,
    };
  }
}

import { PostgresStorage } from "./postgres-storage";

// Use PostgreSQL if DATABASE_URL is provided, otherwise use in-memory storage
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage() 
  : new MemStorage();

console.log(`📊 Using ${process.env.DATABASE_URL ? 'PostgreSQL' : 'In-Memory'} storage`);
