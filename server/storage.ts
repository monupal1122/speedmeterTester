import { type TestResult, type InsertTestResult } from "@shared/schema";

export interface IStorage {
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getTestResults(): Promise<TestResult[]>;
}

export class MemStorage implements IStorage {
  private results: TestResult[] = [];
  private idCounter = 1;

  async createTestResult(insertResult: InsertTestResult): Promise<TestResult> {
    const result: TestResult = {
      ...insertResult,
      id: this.idCounter++,
      createdAt: new Date(),
    };
    this.results.push(result);
    return result;
  }

  async getTestResults(): Promise<TestResult[]> {
    return this.results.sort((a, b) => b.id - a.id);
  }
}

export const storage = new MemStorage();
