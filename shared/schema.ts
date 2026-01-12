import { pgTable, text, serial, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  ping: integer("ping").notNull(), // ms
  downloadSpeed: doublePrecision("download_speed").notNull(), // Mbps
  uploadSpeed: doublePrecision("upload_speed").notNull(), // Mbps
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true,
});

export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type TestResult = typeof testResults.$inferSelect;
