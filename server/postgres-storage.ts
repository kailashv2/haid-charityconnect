import { eq, desc, and, like, sql } from "drizzle-orm";
import { getDatabase } from "./db";
import { 
  donors, 
  itemDonations, 
  monetaryDonations, 
  needyPersons, 
  smsLogs,
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
import { IStorage } from "./storage";

export class PostgresStorage implements IStorage {
  private db = getDatabase();

  // Donors
  async createDonor(donor: InsertDonor): Promise<Donor> {
    const [newDonor] = await this.db.insert(donors).values(donor).returning();
    return newDonor;
  }

  async getDonor(id: string): Promise<Donor | undefined> {
    const [donor] = await this.db.select().from(donors).where(eq(donors.id, id));
    return donor;
  }

  async getDonorByEmail(email: string): Promise<Donor | undefined> {
    const [donor] = await this.db.select().from(donors).where(eq(donors.email, email));
    return donor;
  }

  // Item Donations
  async createItemDonation(donation: InsertItemDonation & { donorId: string }): Promise<ItemDonation> {
    const [newDonation] = await this.db.insert(itemDonations).values(donation).returning();
    return newDonation;
  }

  async getItemDonations(): Promise<ItemDonation[]> {
    return await this.db.select({
      id: itemDonations.id,
      donorId: itemDonations.donorId,
      category: itemDonations.category,
      condition: itemDonations.condition,
      description: itemDonations.description,
      quantity: itemDonations.quantity,
      pickupDate: itemDonations.pickupDate,
      pickupTimeSlot: itemDonations.pickupTimeSlot,
      pickupInstructions: itemDonations.pickupInstructions,
      status: itemDonations.status,
      createdAt: itemDonations.createdAt,
      donorName: donors.name,
      donorEmail: donors.email,
      donorPhone: donors.phone,
      donorCity: donors.city
    })
    .from(itemDonations)
    .leftJoin(donors, eq(itemDonations.donorId, donors.id))
    .orderBy(desc(itemDonations.createdAt));
  }

  async getItemDonationsByDonor(donorId: string): Promise<ItemDonation[]> {
    return await this.db.select().from(itemDonations)
      .where(eq(itemDonations.donorId, donorId))
      .orderBy(desc(itemDonations.createdAt));
  }

  // Monetary Donations
  async createMonetaryDonation(donation: InsertMonetaryDonation & { donorId: string }): Promise<MonetaryDonation> {
    const [newDonation] = await this.db.insert(monetaryDonations).values(donation).returning();
    return newDonation;
  }

  async updateMonetaryDonationPayment(id: string, paymentIntentId: string, status: string): Promise<MonetaryDonation | undefined> {
    const [updatedDonation] = await this.db.update(monetaryDonations)
      .set({ 
        stripePaymentIntentId: paymentIntentId, 
        status: status 
      })
      .where(eq(monetaryDonations.id, id))
      .returning();
    return updatedDonation;
  }

  async getMonetaryDonations(): Promise<MonetaryDonation[]> {
    return await this.db.select({
      id: monetaryDonations.id,
      donorId: monetaryDonations.donorId,
      amount: monetaryDonations.amount,
      purpose: monetaryDonations.purpose,
      message: monetaryDonations.message,
      stripePaymentIntentId: monetaryDonations.stripePaymentIntentId,
      status: monetaryDonations.status,
      createdAt: monetaryDonations.createdAt,
      donorName: donors.name,
      donorEmail: donors.email,
      donorPhone: donors.phone,
      donorCity: donors.city
    })
    .from(monetaryDonations)
    .leftJoin(donors, eq(monetaryDonations.donorId, donors.id))
    .orderBy(desc(monetaryDonations.createdAt));
  }

  async getMonetaryDonationsByDonor(donorId: string): Promise<MonetaryDonation[]> {
    return await this.db.select().from(monetaryDonations)
      .where(eq(monetaryDonations.donorId, donorId))
      .orderBy(desc(monetaryDonations.createdAt));
  }

  // Needy Persons
  async createNeedyPerson(person: InsertNeedyPerson): Promise<NeedyPerson> {
    const personData = {
      ...person,
      needs: person.needs as string[]
    };
    const [newPerson] = await this.db.insert(needyPersons).values(personData).returning();
    return newPerson;
  }

  async getNeedyPersons(): Promise<NeedyPerson[]> {
    return await this.db.select().from(needyPersons).orderBy(desc(needyPersons.createdAt));
  }

  async getNeedyPerson(id: string): Promise<NeedyPerson | undefined> {
    const [person] = await this.db.select().from(needyPersons).where(eq(needyPersons.id, id));
    return person;
  }

  async updateNeedyPersonStatus(id: string, status: string, verified?: boolean): Promise<NeedyPerson | undefined> {
    const updateData: any = { status };
    if (verified !== undefined) {
      updateData.verified = verified;
    }

    const [updatedPerson] = await this.db.update(needyPersons)
      .set(updateData)
      .where(eq(needyPersons.id, id))
      .returning();
    return updatedPerson;
  }

  // SMS Logs
  async createSmsLog(log: InsertSmsLog): Promise<SmsLog> {
    const [newLog] = await this.db.insert(smsLogs).values(log).returning();
    return newLog;
  }

  async getSmsLogs(): Promise<SmsLog[]> {
    return await this.db.select().from(smsLogs).orderBy(desc(smsLogs.createdAt));
  }

  // Analytics
  async getAnalytics() {
    // Get actual data arrays to ensure consistency with API endpoints
    const itemDonationsArray = await this.getItemDonations();
    const monetaryDonationsArray = await this.getMonetaryDonations();
    const needyPersonsArray = await this.getNeedyPersons();

    // Calculate counts from actual data
    const totalItemDonations = itemDonationsArray.length;
    const totalMonetaryDonations = monetaryDonationsArray.length;
    const totalDonations = totalItemDonations + totalMonetaryDonations;
    
    // Calculate monetary amount from completed donations
    const totalMonetaryAmount = monetaryDonationsArray
      .filter(d => d.status === "completed")
      .reduce((sum, d) => sum + parseFloat(d.amount), 0);
    
    // Calculate people helped and active cases
    const peopleHelped = needyPersonsArray.filter(p => p.verified).length;
    const activeCases = needyPersonsArray.filter(p => p.status === "pending").length;

    // Monthly trend - calculated from real data (last 6 months)
    const monthlyTrend = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const month = date.getMonth();
      
      // Count donations for this month
      const monthItemDonations = itemDonationsArray.filter(d => {
        if (!d.createdAt) return false;
        const donationDate = new Date(d.createdAt);
        return donationDate.getFullYear() === year && donationDate.getMonth() === month;
      });
      
      const monthMonetaryDonations = monetaryDonationsArray.filter(d => {
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

    // Donations by category - calculated from actual data
    const categoryCount: Record<string, number> = {};
    itemDonationsArray.forEach(d => {
      categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
    });
    const donationsByCategory = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }));

    // Needs by category - calculated from actual data
    const needsCount: Record<string, number> = {};
    needyPersonsArray.forEach(p => {
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

    // Donations by region - get donors for region calculation
    const allDonors = await this.db.select().from(donors);
    const regionCount: Record<string, number> = {};
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

  // Search functionality
  async searchDonations(query: string) {
    const itemResults = await this.db.select().from(itemDonations)
      .where(
        sql`${itemDonations.category} ILIKE ${`%${query}%`} OR ${itemDonations.description} ILIKE ${`%${query}%`}`
      );

    const monetaryResults = await this.db.select().from(monetaryDonations)
      .where(sql`${monetaryDonations.purpose} ILIKE ${`%${query}%`}`);

    return { items: itemResults, monetary: monetaryResults };
  }

  async searchNeedyPersons(query: string) {
    return await this.db.select().from(needyPersons)
      .where(
        sql`${needyPersons.name} ILIKE ${`%${query}%`} OR ${needyPersons.city} ILIKE ${`%${query}%`} OR ${needyPersons.situation} ILIKE ${`%${query}%`}`
      );
  }
}
