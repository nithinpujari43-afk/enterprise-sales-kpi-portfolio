/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Customer {
  id: string;
  name: string;
  email: string;
  segment: "Enterprise" | "Mid-Market" | "SMB";
  industry: string;
  joinedDate: string;
}

export interface Product {
  id: string;
  name: string;
  category: "Software License" | "Cloud SaaS" | "Hardware Hardware" | "Professional Services";
  cost: number;
  unitPrice: number;
  margin: number; // calculated base margin
}

export interface Region {
  id: string;
  name: string;
  territory: "North" | "South" | "East" | "West";
  manager: string;
}

export interface SalesRep {
  id: string;
  name: string;
  regionId: string;
  annualTarget: number;
  seniority: "Junior" | "Mid-Level" | "Senior";
}

export interface CalendarDay {
  date: string;
  year: number;
  quarter: string;
  month: string;
  monthIndex: number; // 1-12
  dayOfWeek: string;
  isWeekend: boolean;
}

// Raw sales order table (uncleaned)
export interface OrderRaw {
  orderId: string;
  orderDate: string;
  customerId: string;
  productId: string;
  salesRepId: string;
  quantity: number | null;
  unitPrice: number | null;
  revenue: number | null;
  cost: number | null;
  status: string; // duplicate, missing, outlier, or valid
  issueDescription?: string;
}

// Cleaned and modeled fact table
export interface OrderClean {
  orderId: string;
  orderDate: string;
  customerId: string;
  productId: string;
  salesRepId: string;
  quantity: number;
  unitPrice: number;
  revenue: number;
  cost: number;
  profit: number;
  marginPercent: number;
}

// DAX formula definition
export interface DaxMeasure {
  name: string;
  category: "Revenue & Sales" | "Growth & Time Intelligence" | "Customer Cohorts & Retention" | "Advanced & Rankings";
  formula: string;
  explanation: string;
  optimizedNotes: string;
  businessImpact: string;
}

// Business Insight definition
export interface BusinessInsight {
  id: string;
  title: string;
  category: "Revenue" | "Profitability" | "Customer Retention" | "Regional" | "Sales Reps";
  observation: string;
  businessImpact: string;
  recommendation: string;
  severity: "high" | "medium" | "low";
}

// Interview Question definition
export interface InterviewQuestion {
  id: number;
  phase: string;
  question: string;
  answer: string;
  interviewerTips: string;
}
