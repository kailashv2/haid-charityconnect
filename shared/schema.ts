import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const donors = pgTable("donors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  pan: text("pan"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const itemDonations = pgTable("item_donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  donorId: varchar("donor_id").references(() => donors.id).notNull(),
  category: text("category").notNull(),
  condition: text("condition").notNull(),
  description: text("description").notNull(),
  quantity: text("quantity"),
  pickupDate: text("pickup_date"),
  pickupTimeSlot: text("pickup_time_slot"),
  pickupInstructions: text("pickup_instructions"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const monetaryDonations = pgTable("monetary_donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  donorId: varchar("donor_id").references(() => donors.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  purpose: text("purpose").notNull(),
  message: text("message"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const needyPersons = pgTable("needy_persons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone"),
  familySize: integer("family_size"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  needs: json("needs").$type<string[]>().notNull(),
  situation: text("situation").notNull(),
  income: decimal("income", { precision: 10, scale: 2 }),
  reporterName: text("reporter_name").notNull(),
  reporterPhone: text("reporter_phone").notNull(),
  reporterEmail: text("reporter_email").notNull(),
  reporterRelationship: text("reporter_relationship").notNull(),
  verified: boolean("verified").default(false),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const smsLogs = pgTable("sms_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull(),
  twilioSid: text("twilio_sid"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertDonorSchema = createInsertSchema(donors).omit({
  id: true,
  createdAt: true,
});

export const insertItemDonationSchema = createInsertSchema(itemDonations).omit({
  id: true,
  donorId: true,
  status: true,
  createdAt: true,
});

export const insertMonetaryDonationSchema = createInsertSchema(monetaryDonations).omit({
  id: true,
  donorId: true,
  stripePaymentIntentId: true,
  status: true,
  createdAt: true,
});

export const insertNeedyPersonSchema = createInsertSchema(needyPersons).omit({
  id: true,
  verified: true,
  status: true,
  createdAt: true,
});

export const insertSmsLogSchema = createInsertSchema(smsLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type Donor = typeof donors.$inferSelect;
export type InsertDonor = z.infer<typeof insertDonorSchema>;

export type ItemDonation = typeof itemDonations.$inferSelect;
export type InsertItemDonation = z.infer<typeof insertItemDonationSchema>;

export type MonetaryDonation = typeof monetaryDonations.$inferSelect;
export type InsertMonetaryDonation = z.infer<typeof insertMonetaryDonationSchema>;

export type NeedyPerson = typeof needyPersons.$inferSelect;
export type InsertNeedyPerson = z.infer<typeof insertNeedyPersonSchema>;

export type SmsLog = typeof smsLogs.$inferSelect;
export type InsertSmsLog = z.infer<typeof insertSmsLogSchema>;
