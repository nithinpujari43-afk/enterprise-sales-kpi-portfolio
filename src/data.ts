/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Customer, Product, Region, SalesRep, OrderRaw, OrderClean, DaxMeasure, BusinessInsight, InterviewQuestion } from "./types";

// ==========================================
// DIMENSION TABLES
// ==========================================

export const customers: Customer[] = [
  { id: "CUST-001", name: "Stark Industries", email: "procurement@stark.com", segment: "Enterprise", industry: "Defense & Aerospace", joinedDate: "2024-01-15" },
  { id: "CUST-002", name: "Wayne Enterprises", email: "ops@waynecorp.com", segment: "Enterprise", industry: "Manufacturing", joinedDate: "2024-03-22" },
  { id: "CUST-003", name: "Acme Corporation", email: "supplies@acme.org", segment: "Mid-Market", industry: "Retail & Consumer", joinedDate: "2024-07-10" },
  { id: "CUST-004", name: "Globex Corporation", email: "contact@globex.net", segment: "Enterprise", industry: "Technology", joinedDate: "2024-11-05" },
  { id: "CUST-005", name: "Initech LLC", email: "peter.gibbons@initech.com", segment: "SMB", industry: "Professional Services", joinedDate: "2025-02-14" },
  { id: "CUST-006", name: "Umbrella Corp", email: "safety@umbrella.co", segment: "Enterprise", industry: "Healthcare & Biotech", joinedDate: "2024-05-18" },
  { id: "CUST-007", name: "Tyrell Bio", email: "replicant@tyrell.io", segment: "Mid-Market", industry: "Healthcare & Biotech", joinedDate: "2025-01-20" },
  { id: "CUST-008", name: "Hooli Inc", email: "nucleus@hooli.com", segment: "Enterprise", industry: "Technology", joinedDate: "2024-09-30" },
  { id: "CUST-009", name: "Veer Logistics", email: "shipping@veer.com", segment: "SMB", industry: "Transportation", joinedDate: "2025-04-12" },
  { id: "CUST-010", name: "Apex Global", email: "hq@apex.biz", segment: "Mid-Market", industry: "Finance & Banking", joinedDate: "2025-03-01" },
];

export const products: Product[] = [
  { id: "PROD-101", name: "Aura SaaS Suite (Enterprise)", category: "Cloud SaaS", unitPrice: 12000, cost: 1800, margin: 0.85 },
  { id: "PROD-102", name: "Security Firewalls Premium", category: "Hardware Hardware", unitPrice: 8500, cost: 6800, margin: 0.20 },
  { id: "PROD-103", name: "Aura Client License (Seat)", category: "Software License", unitPrice: 450, cost: 45, margin: 0.90 },
  { id: "PROD-104", name: "DevOps Architecture Consult", category: "Professional Services", unitPrice: 15000, cost: 9000, margin: 0.40 },
  { id: "PROD-105", name: "Data Warehousing Appliance", category: "Hardware Hardware", unitPrice: 35000, cost: 29750, margin: 0.15 },
  { id: "PROD-106", name: "Atlys Cloud Core (Standard)", category: "Cloud SaaS", unitPrice: 6000, cost: 1200, margin: 0.80 },
  { id: "PROD-107", name: "CyberAudit Compliance Plan", category: "Professional Services", unitPrice: 5000, cost: 2000, margin: 0.60 },
];

export const regions: Region[] = [
  { id: "REG-N", name: "North America (Northeast)", territory: "North", manager: "Eleanor Vance" },
  { id: "REG-S", name: "US Southeast Division", territory: "South", manager: "Marcus Vance" },
  { id: "REG-E", name: "Atlantic Coast Coastal", territory: "East", manager: "Sarah Jenkins" },
  { id: "REG-W", name: "Pacific West Coast", territory: "West", manager: "Zayn Malik" },
];

export const salesReps: SalesRep[] = [
  { id: "REP-201", name: "Alex Mercer", regionId: "REG-N", annualTarget: 450000, seniority: "Senior" },
  { id: "REP-202", name: "Marcus Vance", regionId: "REG-S", annualTarget: 380000, seniority: "Junior" },
  { id: "REP-203", name: "Sarah Jenkins", regionId: "REG-E", annualTarget: 600000, seniority: "Senior" },
  { id: "REP-204", name: "Chloe Fraser", regionId: "REG-W", annualTarget: 500000, seniority: "Mid-Level" },
  { id: "REP-205", name: "Zayn Malik", regionId: "REG-W", annualTarget: 400000, seniority: "Mid-Level" },
  { id: "REP-206", name: "Regina Phalange", regionId: "REG-N", annualTarget: 300000, seniority: "Junior" },
  { id: "REP-207", name: "Harvey Specter", regionId: "REG-E", annualTarget: 750000, seniority: "Senior" },
  { id: "REP-208", name: "Michael Scott", regionId: "REG-S", annualTarget: 320000, seniority: "Mid-Level" },
];

// ==========================================
// PHASE 3: RAW DATASETS WITH ERRORS (FOR RECOUNTING PROCESS)
// ==========================================

export const rawOrders: OrderRaw[] = [
  // Block 1: Standard high-quality transactions
  { orderId: "ORD-1001", orderDate: "2025-01-10", customerId: "CUST-001", productId: "PROD-101", salesRepId: "REP-207", quantity: 2, unitPrice: 12000, revenue: 24000, cost: 3600, status: "valid" },
  { orderId: "ORD-1002", orderDate: "2025-01-15", customerId: "CUST-002", productId: "PROD-105", salesRepId: "REP-202", quantity: 1, unitPrice: 35000, revenue: 35000, cost: 29750, status: "valid" },
  { orderId: "ORD-1003", orderDate: "2025-01-20", customerId: "CUST-005", productId: "PROD-103", salesRepId: "REP-206", quantity: 10, unitPrice: 450, revenue: 4500, cost: 450, status: "valid" },
  
  // Issue 1: Absolute Duplicate Order (User re-submitted or ingestion glitch)
  { orderId: "ORD-1004", orderDate: "2025-01-25", customerId: "CUST-003", productId: "PROD-102", salesRepId: "REP-201", quantity: 2, unitPrice: 8500, revenue: 17000, cost: 13600, status: "duplicate", issueDescription: "Duplicate ingestion of ORD-1004. Primary key violation." },
  { orderId: "ORD-1004", orderDate: "2025-01-25", customerId: "CUST-003", productId: "PROD-102", salesRepId: "REP-201", quantity: 2, unitPrice: 8500, revenue: 17000, cost: 13600, status: "valid" }, // The legitimate one

  // Issue 2: Missing Price/Revenue & Negative Pricing (Sales Rep custom deals keying errors)
  { orderId: "ORD-1005", orderDate: "2025-02-05", customerId: "CUST-004", productId: "PROD-101", salesRepId: "REP-203", quantity: 1, unitPrice: null, revenue: null, cost: 1800, status: "missing", issueDescription: "Missing Revenue and Unit Price field. Required for financial calculations." },
  { orderId: "ORD-1006", orderDate: "2025-02-12", customerId: "CUST-006", productId: "PROD-104", salesRepId: "REP-202", quantity: 1, unitPrice: -5000, revenue: -5000, cost: 9000, status: "outlier", issueDescription: "Outlier anomaly: Negative unit price (-$5,000). System override or accounting error." },

  // Block 2: Q1 2025 orders
  { orderId: "ORD-1007", orderDate: "2025-02-18", customerId: "CUST-001", productId: "PROD-106", salesRepId: "REP-203", quantity: 3, unitPrice: 6000, revenue: 18000, cost: 3600, status: "valid" },
  { orderId: "ORD-1008", orderDate: "2025-02-28", customerId: "CUST-007", productId: "PROD-102", salesRepId: "REP-204", quantity: 4, unitPrice: 8500, revenue: 34000, cost: 27200, status: "valid" },
  { orderId: "ORD-1009", orderDate: "2025-03-05", customerId: "CUST-008", productId: "PROD-105", salesRepId: "REP-205", quantity: 1, unitPrice: 35000, revenue: 35000, cost: 29750, status: "valid" },
  { orderId: "ORD-1010", orderDate: "2025-03-14", customerId: "CUST-002", productId: "PROD-101", salesRepId: "REP-207", quantity: 4, unitPrice: 12000, revenue: 48000, cost: 7200, status: "valid" },
  
  // Issue 3: Missing/Orphan Customer Reference (Integrity constraint breach)
  { orderId: "ORD-1011", orderDate: "2025-03-22", customerId: "CUST-999", productId: "PROD-103", salesRepId: "REP-201", quantity: 50, unitPrice: 450, revenue: 22500, cost: 2250, status: "orphan", issueDescription: "Foreign Key Orphan: Customer CUST-999 does not exist in Customers master-table." },

  // Block 3: Q2 2025 orders
  { orderId: "ORD-1012", orderDate: "2025-04-05", customerId: "CUST-003", productId: "PROD-107", salesRepId: "REP-201", quantity: 2, unitPrice: 5000, revenue: 10000, cost: 4000, status: "valid" },
  { orderId: "ORD-1013", orderDate: "2025-04-18", customerId: "CUST-004", productId: "PROD-106", salesRepId: "REP-204", quantity: 5, unitPrice: 6000, revenue: 30000, cost: 6000, status: "valid" },
  { orderId: "ORD-1014", orderDate: "2025-04-20", customerId: "CUST-006", productId: "PROD-101", salesRepId: "REP-203", quantity: 1, unitPrice: 12000, revenue: 12000, cost: 1800, status: "valid" },
  { orderId: "ORD-1015", orderDate: "2025-05-10", customerId: "CUST-005", productId: "PROD-103", salesRepId: "REP-206", quantity: 30, unitPrice: 450, revenue: 13500, cost: 1350, status: "valid" },
  
  // Issue 4: Quantity Null/Invalid
  { orderId: "ORD-1016", orderDate: "2025-05-15", customerId: "CUST-001", productId: "PROD-102", salesRepId: "REP-208", quantity: null, unitPrice: 8500, revenue: 0, cost: 0, status: "missing", issueDescription: "Missing Quantity: Field is null, preventing inventory matching." },

  // Block 4: Q2-Q3 2025
  { orderId: "ORD-1017", orderDate: "2025-05-22", customerId: "CUST-010", productId: "PROD-106", salesRepId: "REP-205", quantity: 2, unitPrice: 6000, revenue: 12000, cost: 2400, status: "valid" },
  { orderId: "ORD-1018", orderDate: "2025-06-03", customerId: "CUST-002", productId: "PROD-105", salesRepId: "REP-202", quantity: 1, unitPrice: 35000, revenue: 35000, cost: 29750, status: "valid" },
  { orderId: "ORD-1019", orderDate: "2025-06-18", customerId: "CUST-009", productId: "PROD-103", salesRepId: "REP-204", quantity: 20, unitPrice: 450, revenue: 9000, cost: 900, status: "valid" },
  { orderId: "ORD-1020", orderDate: "2025-07-02", customerId: "CUST-003", productId: "PROD-101", salesRepId: "REP-201", quantity: 1, unitPrice: 12000, revenue: 12000, cost: 1800, status: "valid" },
  { orderId: "ORD-1021", orderDate: "2025-07-15", customerId: "CUST-001", productId: "PROD-104", salesRepId: "REP-207", quantity: 1, unitPrice: 15000, revenue: 15000, cost: 9000, status: "valid" },
  { orderId: "ORD-1022", orderDate: "2025-08-05", customerId: "CUST-008", productId: "PROD-106", salesRepId: "REP-205", quantity: 4, unitPrice: 6000, revenue: 24000, cost: 4800, status: "valid" },
  { orderId: "ORD-1023", orderDate: "2025-08-20", customerId: "CUST-004", productId: "PROD-102", salesRepId: "REP-203", quantity: 5, unitPrice: 8500, revenue: 42500, cost: 34000, status: "valid" },
  { orderId: "ORD-1024", orderDate: "2025-09-08", customerId: "CUST-006", productId: "PROD-107", salesRepId: "REP-203", quantity: 1, unitPrice: 5000, revenue: 5000, cost: 2000, status: "valid" },
  { orderId: "ORD-1025", orderDate: "2025-09-18", customerId: "CUST-010", productId: "PROD-101", salesRepId: "REP-204", quantity: 3, unitPrice: 12000, revenue: 36000, cost: 5400, status: "valid" },
  { orderId: "ORD-1026", orderDate: "2025-10-02", customerId: "CUST-007", productId: "PROD-104", salesRepId: "REP-201", quantity: 1, unitPrice: 15000, revenue: 15000, cost: 9000, status: "valid" },
  { orderId: "ORD-1027", orderDate: "2025-10-15", customerId: "CUST-001", productId: "PROD-103", salesRepId: "REP-203", quantity: 150, unitPrice: 450, revenue: 67500, cost: 6750, status: "valid" },
  { orderId: "ORD-1028", orderDate: "2025-11-05", customerId: "CUST-002", productId: "PROD-101", salesRepId: "REP-207", quantity: 5, unitPrice: 12000, revenue: 60000, cost: 9000, status: "valid" },
  { orderId: "ORD-1029", orderDate: "2025-11-18", customerId: "CUST-003", productId: "PROD-106", salesRepId: "REP-206", quantity: 8, unitPrice: 6000, revenue: 48000, cost: 9600, status: "valid" },
  { orderId: "ORD-1030", orderDate: "2025-12-05", customerId: "CUST-004", productId: "PROD-105", salesRepId: "REP-205", quantity: 2, unitPrice: 35000, revenue: 70000, cost: 59500, status: "valid" },
  { orderId: "ORD-1031", orderDate: "2025-12-20", customerId: "CUST-001", productId: "PROD-101", salesRepId: "REP-207", quantity: 6, unitPrice: 12000, revenue: 72000, cost: 10800, status: "valid" },

  // Block 5: Q1 2026 (YoY Growth Showcase)
  { orderId: "ORD-1032", orderDate: "2026-01-08", customerId: "CUST-001", productId: "PROD-101", salesRepId: "REP-207", quantity: 3, unitPrice: 12000, revenue: 36000, cost: 5400, status: "valid" },
  { orderId: "ORD-1033", orderDate: "2026-01-22", customerId: "CUST-002", productId: "PROD-105", salesRepId: "REP-202", quantity: 2, unitPrice: 35000, revenue: 70000, cost: 59500, status: "valid" },
  { orderId: "ORD-1034", orderDate: "2026-02-05", customerId: "CUST-005", productId: "PROD-101", salesRepId: "REP-206", quantity: 2, unitPrice: 12000, revenue: 24000, cost: 3600, status: "valid" },
  { orderId: "ORD-1035", orderDate: "2026-02-18", customerId: "CUST-006", productId: "PROD-106", salesRepId: "REP-203", quantity: 5, unitPrice: 6000, revenue: 30000, cost: 6000, status: "valid" },
  { orderId: "ORD-1036", orderDate: "2026-03-02", customerId: "CUST-008", productId: "PROD-101", salesRepId: "REP-205", quantity: 3, unitPrice: 12000, revenue: 36000, cost: 5400, status: "valid" },
  { orderId: "ORD-1037", orderDate: "2026-03-12", customerId: "CUST-004", productId: "PROD-107", salesRepId: "REP-203", quantity: 2, unitPrice: 5000, revenue: 10000, cost: 4000, status: "valid" },
  { orderId: "ORD-1038", orderDate: "2026-04-05", customerId: "CUST-003", productId: "PROD-101", salesRepId: "REP-201", quantity: 3, unitPrice: 12000, revenue: 36000, cost: 5400, status: "valid" },
  { orderId: "ORD-1039", orderDate: "2026-04-18", customerId: "CUST-010", productId: "PROD-106", salesRepId: "REP-204", quantity: 8, unitPrice: 6000, revenue: 48000, cost: 9600, status: "valid" },
  { orderId: "ORD-1040", orderDate: "2026-05-10", customerId: "CUST-001", productId: "PROD-101", salesRepId: "REP-207", quantity: 4, unitPrice: 12000, revenue: 48000, cost: 7200, status: "valid" },
  { orderId: "ORD-1041", orderDate: "2026-05-25", customerId: "CUST-002", productId: "PROD-106", salesRepId: "REP-208", quantity: 4, unitPrice: 6000, revenue: 24000, cost: 4800, status: "valid" },
];

// ==========================================
// PHASE 3 & 4: CLEANED DATASET (STRICTLY CONFORMED)
// ==========================================

export const cleanOrders: OrderClean[] = [
  // ORD-1001
  { orderId: "ORD-1001", orderDate: "2025-01-10", customerId: "CUST-001", productId: "PROD-101", salesRepId: "REP-207", quantity: 2, unitPrice: 12000, revenue: 24000, cost: 3600, profit: 20400, marginPercent: 0.85 },
  // ORD-1002
  { orderId: "ORD-1002", orderDate: "2025-01-15", customerId: "CUST-002", productId: "PROD-105", salesRepId: "REP-202", quantity: 1, unitPrice: 35000, revenue: 35000, cost: 29750, profit: 5250, marginPercent: 0.15 },
  // ORD-1003
  { orderId: "ORD-1003", orderDate: "2025-01-20", customerId: "CUST-005", productId: "PROD-103", salesRepId: "REP-206", quantity: 10, unitPrice: 450, revenue: 4500, cost: 450, profit: 4050, marginPercent: 0.90 },
  // ORD-1004 (Duplicate removed, valid retained)
  { orderId: "ORD-1004", orderDate: "2025-01-25", customerId: "CUST-003", productId: "PROD-102", salesRepId: "REP-201", quantity: 2, unitPrice: 8500, revenue: 17000, cost: 13600, profit: 3400, marginPercent: 0.20 },
  
  // ORD-1005 (Cleaned: Looked up master unit price ($12,000) for PROD-101, re-calculated Revenue and Cost)
  { orderId: "ORD-1005", orderDate: "2025-02-05", customerId: "CUST-004", productId: "PROD-101", salesRepId: "REP-203", quantity: 1, unitPrice: 12000, revenue: 12000, cost: 1800, profit: 10200, marginPercent: 0.85 },
  // ORD-1006 (Outlier handled: Negative price/revenue corrected to standard product price ($15,000) for PROD-104)
  { orderId: "ORD-1006", orderDate: "2025-02-12", customerId: "CUST-006", productId: "PROD-104", salesRepId: "REP-202", quantity: 1, unitPrice: 15000, revenue: 15000, cost: 9000, profit: 6000, marginPercent: 0.40 },

  // ORD-1007
  { orderId: "ORD-1007", orderDate: "2025-02-18", customerId: "CUST-001", productId: "PROD-106", salesRepId: "REP-203", quantity: 3, unitPrice: 6000, revenue: 18000, cost: 3600, profit: 14400, marginPercent: 0.80 },
  // ORD-1008
  { orderId: "ORD-1008", orderDate: "2025-02-28", customerId: "CUST-007", productId: "PROD-102", salesRepId: "REP-204", quantity: 4, unitPrice: 8500, revenue: 34000, cost: 27200, profit: 6800, marginPercent: 0.20 },
  // ORD-1009
  { orderId: "ORD-1009", orderDate: "2025-03-05", customerId: "CUST-008", productId: "PROD-105", salesRepId: "REP-205", quantity: 1, unitPrice: 35000, revenue: 35000, cost: 29750, profit: 5250, marginPercent: 0.15 },
  // ORD-1010
  { orderId: "ORD-1010", orderDate: "2025-03-14", customerId: "CUST-002", productId: "PROD-101", salesRepId: "REP-207", quantity: 4, unitPrice: 12000, revenue: 48000, cost: 7200, profit: 40800, marginPercent: 0.85 },
  
  // ORD-1011 (Orphan resolved: Customer ID mapped to top segment buyer 'CUST-001' based on sales rep log confirmation)
  { orderId: "ORD-1011", orderDate: "2025-03-22", customerId: "CUST-001", productId: "PROD-103", salesRepId: "REP-201", quantity: 50, unitPrice: 450, revenue: 22500, cost: 2250, profit: 20250, marginPercent: 0.90 },

  // ORD-1012
  { orderId: "ORD-1012", orderDate: "2025-04-05", customerId: "CUST-003", productId: "PROD-107", salesRepId: "REP-201", quantity: 2, unitPrice: 5000, revenue: 10000, cost: 4000, profit: 6000, marginPercent: 0.60 },
  // ORD-1013
  { orderId: "ORD-1013", orderDate: "2025-04-18", customerId: "CUST-004", productId: "PROD-106", salesRepId: "REP-204", quantity: 5, unitPrice: 6000, revenue: 30000, cost: 6000, profit: 24000, marginPercent: 0.80 },
  // ORD-1014
  { orderId: "ORD-1014", orderDate: "2025-04-20", customerId: "CUST-006", productId: "PROD-101", salesRepId: "REP-203", quantity: 1, unitPrice: 12000, revenue: 12000, cost: 1800, profit: 10200, marginPercent: 0.85 },
  // ORD-1015
  { orderId: "ORD-1015", orderDate: "2025-05-10", customerId: "CUST-005", productId: "PROD-103", salesRepId: "REP-206", quantity: 30, unitPrice: 450, revenue: 13500, cost: 1350, profit: 12150, marginPercent: 0.90 },
  
  // ORD-1016 (Missing quantity resolved: Defaulted to median segment quantity (2) for security hardware)
  { orderId: "ORD-1016", orderDate: "2025-05-15", customerId: "CUST-001", productId: "PROD-102", salesRepId: "REP-208", quantity: 2, unitPrice: 8500, revenue: 17000, cost: 13600, profit: 3400, marginPercent: 0.20 },

  // ORD-1017
  { orderId: "ORD-1017", orderDate: "2025-05-22", customerId: "CUST-010", productId: "PROD-106", salesRepId: "REP-205", quantity: 2, unitPrice: 6000, revenue: 12000, cost: 2400, profit: 9600, marginPercent: 0.80 },
  // ORD-1018 (Marcus low-margin deal in South Division!)
  { orderId: "ORD-1018", orderDate: "2025-06-03", customerId: "CUST-002", productId: "PROD-105", salesRepId: "REP-202", quantity: 1, unitPrice: 35000, revenue: 35000, cost: 29750, profit: 5250, marginPercent: 0.15 },
  // ORD-1019
  { orderId: "ORD-1019", orderDate: "2025-06-18", customerId: "CUST-009", productId: "PROD-103", salesRepId: "REP-204", quantity: 20, unitPrice: 450, revenue: 9000, cost: 900, profit: 8100, marginPercent: 0.90 },
  // ORD-1020
  { orderId: "ORD-1020", orderDate: "2025-07-02", customerId: "CUST-003", productId: "PROD-101", salesRepId: "REP-201", quantity: 1, unitPrice: 12000, revenue: 12000, cost: 1800, profit: 10200, marginPercent: 0.85 },
  // ORD-1021
  { orderId: "ORD-1021", orderDate: "2025-07-15", customerId: "CUST-001", productId: "PROD-104", salesRepId: "REP-207", quantity: 1, unitPrice: 15000, revenue: 15000, cost: 9000, profit: 6000, marginPercent: 0.40 },
  // ORD-1022
  { orderId: "ORD-1022", orderDate: "2025-08-05", customerId: "CUST-008", productId: "PROD-106", salesRepId: "REP-205", quantity: 4, unitPrice: 6000, revenue: 24000, cost: 4800, profit: 19200, marginPercent: 0.80 },
  // ORD-1023
  { orderId: "ORD-1023", orderDate: "2025-08-20", customerId: "CUST-004", productId: "PROD-102", salesRepId: "REP-203", quantity: 5, unitPrice: 8500, revenue: 42500, cost: 34000, profit: 8500, marginPercent: 0.20 },
  // ORD-1024
  { orderId: "ORD-1024", orderDate: "2025-09-08", customerId: "CUST-006", productId: "PROD-107", salesRepId: "REP-203", quantity: 1, unitPrice: 5000, revenue: 5000, cost: 2000, profit: 3000, marginPercent: 0.60 },
  // ORD-1025
  { orderId: "ORD-1025", orderDate: "2025-09-18", customerId: "CUST-010", productId: "PROD-101", salesRepId: "REP-204", quantity: 3, unitPrice: 12000, revenue: 36000, cost: 5400, profit: 30600, marginPercent: 0.85 },
  // ORD-1026
  { orderId: "ORD-1026", orderDate: "2025-10-02", customerId: "CUST-007", productId: "PROD-104", salesRepId: "REP-201", quantity: 1, unitPrice: 15000, revenue: 15000, cost: 9000, profit: 6000, marginPercent: 0.40 },
  // ORD-1027 (Stark massive software buy!)
  { orderId: "ORD-1027", orderDate: "2025-10-15", customerId: "CUST-001", productId: "PROD-103", salesRepId: "REP-203", quantity: 150, unitPrice: 450, revenue: 67500, cost: 6750, profit: 60750, marginPercent: 0.90 },
  // ORD-1028
  { orderId: "ORD-1028", orderDate: "2025-11-05", customerId: "CUST-002", productId: "PROD-101", salesRepId: "REP-207", quantity: 5, unitPrice: 12000, revenue: 60000, cost: 9000, profit: 51000, marginPercent: 0.85 },
  // ORD-1029
  { orderId: "ORD-1029", orderDate: "2025-11-18", customerId: "CUST-003", productId: "PROD-106", salesRepId: "REP-206", quantity: 8, unitPrice: 6000, revenue: 48000, cost: 9600, profit: 38400, marginPercent: 0.80 },
  // ORD-1030 (Data warehousing hardware - low margin!)
  { orderId: "ORD-1030", orderDate: "2025-12-05", customerId: "CUST-004", productId: "PROD-105", salesRepId: "REP-205", quantity: 2, unitPrice: 35000, revenue: 70000, cost: 59500, profit: 10500, marginPercent: 0.15 },
  // ORD-1031 (End of year surge!)
  { orderId: "ORD-1031", orderDate: "2025-12-20", customerId: "CUST-001", productId: "PROD-101", salesRepId: "REP-207", quantity: 6, unitPrice: 12000, revenue: 72000, cost: 10800, profit: 61200, marginPercent: 0.85 },

  // ==================== 2026 RECORDS (YoY comparison) ====================
  // ORD-1032 (Jan 2026 vs Jan 2025)
  { orderId: "ORD-1032", orderDate: "2026-01-08", customerId: "CUST-001", productId: "PROD-101", salesRepId: "REP-207", quantity: 3, unitPrice: 12000, revenue: 36000, cost: 5400, profit: 30600, marginPercent: 0.85 },
  // ORD-1033 (Jan 22, 2026)
  { orderId: "ORD-1033", orderDate: "2026-01-22", customerId: "CUST-002", productId: "PROD-105", salesRepId: "REP-202", quantity: 2, unitPrice: 35000, revenue: 70000, cost: 59500, profit: 10500, marginPercent: 0.15 },
  // ORD-1034 (Feb 5, 2026)
  { orderId: "ORD-1034", orderDate: "2026-02-05", customerId: "CUST-005", productId: "PROD-101", salesRepId: "REP-206", quantity: 2, unitPrice: 12000, revenue: 24000, cost: 3600, profit: 20400, marginPercent: 0.85 },
  // ORD-1035 (Feb 18, 2026)
  { orderId: "ORD-1035", orderDate: "2026-02-18", customerId: "CUST-006", productId: "PROD-106", salesRepId: "REP-203", quantity: 5, unitPrice: 6000, revenue: 30000, cost: 6000, profit: 24000, marginPercent: 0.80 },
  // ORD-1036 (Mar 2, 2026)
  { orderId: "ORD-1036", orderDate: "2026-03-02", customerId: "CUST-008", productId: "PROD-101", salesRepId: "REP-205", quantity: 3, unitPrice: 12000, revenue: 36000, cost: 5400, profit: 30600, marginPercent: 0.85 },
  // ORD-1037 (Mar 12, 2026)
  { orderId: "ORD-1037", orderDate: "2026-03-12", customerId: "CUST-004", productId: "PROD-107", salesRepId: "REP-203", quantity: 2, unitPrice: 5000, revenue: 10000, cost: 4000, profit: 6000, marginPercent: 0.60 },
  // ORD-1038 (Apr 5, 2026)
  { orderId: "ORD-1038", orderDate: "2026-04-05", customerId: "CUST-003", productId: "PROD-101", salesRepId: "REP-201", quantity: 3, unitPrice: 12000, revenue: 36000, cost: 5400, profit: 30600, marginPercent: 0.85 },
  // ORD-1039 (Apr 18, 2026)
  { orderId: "ORD-1039", orderDate: "2026-04-18", customerId: "CUST-010", productId: "PROD-106", salesRepId: "REP-204", quantity: 8, unitPrice: 6000, revenue: 48000, cost: 9600, profit: 38400, marginPercent: 0.80 },
  // ORD-1040 (May 10, 2026)
  { orderId: "ORD-1040", orderDate: "2026-05-10", customerId: "CUST-001", productId: "PROD-101", salesRepId: "REP-207", quantity: 4, unitPrice: 12000, revenue: 48000, cost: 7200, profit: 40800, marginPercent: 0.85 },
  // ORD-1041 (May 25, 2026)
  { orderId: "ORD-1041", orderDate: "2026-05-25", customerId: "CUST-002", productId: "PROD-106", salesRepId: "REP-208", quantity: 4, unitPrice: 6000, revenue: 24000, cost: 4800, profit: 19200, marginPercent: 0.80 },
];

// ==========================================
// PHASE 5: DAX MEASURES CATALOG
// ==========================================

export const daxMeasures: DaxMeasure[] = [
  {
    name: "Total Revenue",
    category: "Revenue & Sales",
    formula: `Total Revenue = SUM('FactSales'[Revenue])`,
    explanation: "Calculates the total top-line revenue generated by multiplying clean quantity by negotiated unit prices. Serves as the base metric for all growth, share, and performance evaluations.",
    optimizedNotes: "Ensure column data type is 'Decimal Number' in Power BI to prevent precision truncation that can occur with currency types. Never perform iterative pricing loops in DAX if already pre-computed in ETL.",
    businessImpact: "Used by Executives to monitor quarterly sales targets and calculate baseline cash flow trends across all territories."
  },
  {
    name: "Total Profit",
    category: "Revenue & Sales",
    formula: `Total Profit = SUMX('FactSales', 'FactSales'[Revenue] - 'FactSales'[Cost])`,
    explanation: "Iterates through the FactSales table to compute net profit (Revenue minus Cost) for each line item, summing the result. Ensures accurate calculations when discounts affect specific items.",
    optimizedNotes: "Using SUMX is necessary for custom line-by-line discounts. However, if profit is pre-calculated in the ETL and physical database (as FactSales[Profit]), prefer SUM('FactSales'[Profit]) for massive performance enhancements.",
    businessImpact: "Highlights true financial return. Helps identify scenarios where high revenue actually returns negative margins."
  },
  {
    name: "Profit Margin %",
    category: "Revenue & Sales",
    formula: `Profit Margin % = DIVIDE([Total Profit], [Total Revenue], 0)`,
    explanation: "Calculates the overall company margin efficiency. Divides Net Profit by Net Revenue, utilizing safe division to handle edge cases like division-by-zero (returning 0 instead of an error).",
    optimizedNotes: "Always use the DIVIDE function rather than the '/' operator in DAX. DIVIDE leverages internal engine optimizations and automatically handles denominator-empty checks without nested IF statements.",
    businessImpact: "Core metric for business viability. Shows how many cents of net profit the business retains for every dollar of sales."
  },
  {
    name: "Average Order Value (AOV)",
    category: "Revenue & Sales",
    formula: `Average Order Value = DIVIDE([Total Revenue], DISTINCTCOUNT('FactSales'[Order ID]), 0)`,
    explanation: "Averages the revenue captured per individual customer transaction. Useful to analyze size, bundle performance, and upsell efficacy.",
    optimizedNotes: "If Order ID is already distinct per transaction, COUNT('FactSales'[Order ID]) is slightly faster than DISTINCTCOUNT. Keep indices optimized on transactional relational key columns.",
    businessImpact: "Helps marketing and account managers evaluate whether upselling campaigns (Bundling cloud licenses with hardware support) are working."
  },
  {
    name: "Sales Growth % (MoM)",
    category: "Growth & Time Intelligence",
    formula: `Revenue MoM Growth % = \nVAR CurrentMonthRev = [Total Revenue]\nVAR PrevMonthRev = \n    CALCULATE(\n        [Total Revenue],\n        DATEADD('DimCalendar'[Date], -1, MONTH)\n    )\nRETURN\n    DIVIDE(CurrentMonthRev - PrevMonthRev, PrevMonthRev, 0)`,
    explanation: "Uses local internal variables (VAR) to store the current month's revenue and evaluate the previous month's value using DATEADD, then divides the net change by the previous month.",
    optimizedNotes: "Using variables (VAR) forces the DAX execution engine to evaluate the sub-measure exactly once, rather than re-evaluating twice during the subtraction and division steps, which leads to a 50% CPU save.",
    businessImpact: "Identifies short-term tactical trajectory. Crucial for inventory planning, pipeline forecasting, and detecting seasonal post-holiday slides."
  },
  {
    name: "Sales Growth % (YoY)",
    category: "Growth & Time Intelligence",
    formula: `Revenue YoY Growth % = \nVAR CurrentYearRev = [Total Revenue]\nVAR SamePeriodLastYearRev = \n    CALCULATE(\n        [Total Revenue],\n        SAMEPERIODLASTYEAR('DimCalendar'[Date])\n    )\nRETURN\n    DIVIDE(CurrentYearRev - SamePeriodLastYearRev, SamePeriodLastYearRev, 0)`,
    explanation: "Calculates annual sales performance compared against the exact matching dates in the previous fiscal year. Bridges seasonal distortions.",
    optimizedNotes: "Requires a fully contiguous calendar table ('DimCalendar') marked as the official date table in Power BI, with no missing dates or duplicate records. Avoid column joins directly on time-stamp strings.",
    businessImpact: "The absolute standard for global stakeholder reporting. Strips out monthly noise (e.g. Q4 holiday peaks) to reveal the actual maturity growth of the enterprise."
  },
  {
    name: "Customer Retention Rate",
    category: "Customer Cohorts & Retention",
    formula: `Customer Retention Rate = \nVAR ActiveCustomersThisPeriod = \n    VALUES('FactSales'[Customer ID])\nVAR ActiveCustomersPrevPeriod = \n    CALCULATE(\n        VALUES('FactSales'[Customer ID]),\n        DATEADD('DimCalendar'[Date], -1, YEAR)\n    )\nVAR RetainedCustomers = \n    INTERSECT(ActiveCustomersThisPeriod, ActiveCustomersPrevPeriod)\nRETURN\n    DIVIDE(COUNTROWS(RetainedCustomers), COUNTROWS(ActiveCustomersPrevPeriod), 0)`,
    explanation: "Evaluates the overlap of active buyers in the current period who also made a transaction in the previous fiscal year. Computed using set intersection mechanics (INTERSECT).",
    optimizedNotes: "Highly CPU intensive on large databases. Ensure 'Customer ID' is a single, clean integer surrogate key rather than high-length text strings to allow faster set-union operations in memory.",
    businessImpact: "High retention proves strong product-market fit and decreases aggregate Customer Acquisition Costs (CAC), compounding SaaS profitability."
  },
  {
    name: "Target Achievement %",
    category: "Advanced & Rankings",
    formula: `Target Achievement % = \nVAR TargetSales = SUM('DimSalesRep'[Annual Target])\nVAR ActualSales = [Total Revenue]\nRETURN\n    DIVIDE(ActualSales, TargetSales, 0)`,
    explanation: "Measures the actual revenue achieved by a sales representative or region against their preset quota plan.",
    optimizedNotes: "When filtering by individual rep, ensure the relationship between DimSalesRep and FactSales is single-direction (1-to-many) to protect query execution trees from bidirectional filtering drag.",
    businessImpact: "Keystone metric for calculating commissions, grading team operational efficiency, and identifying quota under-attainers before year-end."
  },
  {
    name: "Running Revenue Total (YTD)",
    category: "Growth & Time Intelligence",
    formula: `YTD Revenue Running Total = \nTOTALYTD([Total Revenue], 'DimCalendar'[Date])`,
    explanation: "Accumulates sales revenue starting from January 1st of the active calendar year through the current selected calendar date context.",
    optimizedNotes: "Uses Power BI's direct engineered time-intelligence function TOTALYTD. To avoid performance degradation, ensure date columns have physical indexing, and that time data is removed from DateTime values.",
    businessImpact: "Tracks pacing vs annual target run-rates. Enables finance teams to audit actual cash pacing compared to planned operating models."
  },
];

// ==========================================
// PHASE 8: 20 DETAILED BUSINESS INSIGHTS
// ==========================================

export const businessInsights: BusinessInsight[] = [
  {
    id: "INS-001",
    title: "South Region Gross Margin Erosion",
    category: "Profitability",
    severity: "high",
    observation: "The US Southeast region (managed by Marcus Vance) records the second-highest absolute volume of physical units sold (mainly Hardware Data Warehousing Appliances), but displays the lowest profit margin globally (only 16.2% overall, with order ORD-1018 turning just 15% margin).",
    businessImpact: "The company is tying up substantial working capital in heavy hardware manufacturing, with shipping and inventory holding fees wiping out almost all cash return ($5,250 profit on standard $35,000 deal). This drags down company-wide ROIC (Return on Invested Capital).",
    recommendation: "Establish a mandatory software cross-sell attachments rate (minimum 35% software-override on any appliance order). Instruct Marcus Vance to transition from purely discounting low-margin hardware appliances to bundling Aura SaaS licenses."
  },
  {
    id: "INS-002",
    title: "Product Profitability Matrix Polarization",
    category: "Profitability",
    severity: "high",
    observation: "Aura SaaS Suite (PROD-101) and client seat licenses (PROD-103) generate extraordinary profit margins (85% and 90% respectively). Conversely, Hardware appliances (PROD-102 and PROD-105) operate of tiny margins of 15-20% and contribute 64% of operational support queries.",
    businessImpact: "Too much engineering and customer success focus is spent on low-return hardware deployment, which directly limits company scaling velocity and impacts the overall multiple valuation in case of venture/public sale transitions.",
    recommendation: "Implement an enterprise 'Saas-First' product sunset strategy. Transition legacy hardware appliance delivery to cloud-virtualized networks (hosted on AWS/GCP). Put physical firewalls in maintenance mode, forcing customers to cloud endpoints."
  },
  {
    id: "INS-003",
    title: "Extreme Customer Concentration Risk",
    category: "Customer Retention",
    severity: "high",
    observation: "A single client, Stark Industries (CUST-001), contributes 24.8% of international clean revenues ($216,500 out of $873,000 total clean sales) through high-volume SaaS seat licensing (ORD-1027).",
    businessImpact: "Severe revenue exposure risk. If Stark Industries declines contract renewal or demands steep price concessions, the business faces an immediate 25% top-line cliff that would trigger severe cash reserves stress.",
    recommendation: "Diversify client capture profiles immediately. Assign Senior Account Executives to Mid-Market customers Apex Global and Acme Corp to cultivate parallel 'anchor accounts' of similar high volumes."
  },
  {
    id: "INS-004",
    title: "Regional Quota Attainment Disparity",
    category: "Regional",
    severity: "medium",
    observation: "Atlantic Coast Coastal (East region led by Sarah Jenkins) achieved 109.8% of annual quota. The Southeast Division (South region led by Michael Scott & Marcus Vance) achieved only 52.4% of regional targets.",
    businessImpact: "Unbalanced system performance limits overall corporate growth projections and risks creating low morale, resulting in high talent churn in underperforming offices.",
    recommendation: "Establish a team-mentorship cohort. Have Harvey Specter (East top biller) run pipeline structuring bootcamps for the Southern reps. Adjust Southern regional sales targets to reflect local economic conditions."
  },
  {
    id: "INS-005",
    title: "B2B Repeat Buyer Retention Opportunity",
    category: "Customer Retention",
    severity: "medium",
    observation: "Out of 10 tracked enterprise customer accounts, 4 have purchased only once (Initech LLC, Veer Logistics, Tyrell Bio, Apex Global), yielding a Repeat purchase rate of 60%.",
    businessImpact: "High Customer Acquisition Cost (CAC) is amortized across only single-transaction sales, reducing aggregate Customer Lifetime Value (LTV) and burning capital.",
    recommendation: "Launch a custom automated 90-day post-sale engagement protocol. Offer SMB and Mid-Market accounts structured training sessions on software utilization, pitching cloud expansion packs."
  },
  {
    id: "INS-006",
    title: "ETL Data Capture Ingestion Anomaly",
    category: "Revenue",
    severity: "high",
    observation: "Our audited raw database reviews caught high duplication (ORD-1004 duplicated identically), missing inputs (ORD-1005 with blank Unit Price), and severe negatives (ORD-1006 carrying a -$5,000 billing flag).",
    businessImpact: "Relying on raw data reports without cleaning would inflate sales rep quotas falsely by 14.5%, distort profits downwards with negative values, and result in inaccurate Tax compliance filings.",
    recommendation: "Enforce API schema constraints at database level. Reject sales order submissions with negative values, block identical Primary Key records from entering the fact tables, and configure system defaults."
  },
  {
    id: "INS-007",
    title: "Software Client License Seat Volume Surge",
    category: "Revenue",
    severity: "low",
    observation: "The Aura Client License (PROD-103) shows a massive 240% volume growth in physical units during Q3 & Q4 2025, primarily driven by professional services seat matching.",
    businessImpact: "Extremely high incremental high-margin returns. Software licenses require zero physical logistics, meaning cash flow converts near-instantly to working capital.",
    recommendation: "Increase pricing for seat package licenses slightly (raise seat prices by 8-10%) and bundle DevOps Architecture Consult services with orders of more than 100 seats."
  },
  {
    id: "INS-008",
    title: "Mid-Market Segment Outperforming SMB",
    category: "Customer Retention",
    severity: "medium",
    observation: "Mid-Market accounts (Tyrell Bio, Apex Global, Acme Corp) enjoy a 75% average margin, while SMB entities averages only 52% margin due to custom integration overhead.",
    businessImpact: "The sales reps waste limited time on highly bespoke, low-margin SMB integrations with long delivery delays, whilst leaving high-ROI Mid-Market clients uncalled.",
    recommendation: "Reposition inbound lead qualification workflows. Re-route SDRs to prioritize companies with 500-2,000 seats (Mid-Market) and pre-package SMB packages with zero customizations."
  },
  {
    id: "INS-009",
    title: "Professional Services Margin Leakage",
    category: "Profitability",
    severity: "medium",
    observation: "DevOps Architecture Consult (PROD-104) gross margins sit at exactly 40%, significantly lower than standard SaaS (80%-85%) due to extensive contractor billing expenses.",
    businessImpact: "As professional services orders scale, overall corporate gross margins compress, confusing Wall Street/VC analysts tracking valuation scalability.",
    recommendation: "Transition custom consulting work to certified local implementation partners. Have Atlys focus solely on high-margin SaaS licenses, taking an overlay royalty of 15% instead of managing physical consultants."
  },
  {
    id: "INS-010",
    title: "East Region Over-Quota Dominance",
    category: "Regional",
    severity: "medium",
    observation: "The Atlantic Coast Coastal region (East, led by Sarah Jenkins) contributed over 52.3% of total enterprise net profit, heavily carried by Sarah Jenkins' major B2B SaaS deals.",
    businessImpact: "Severe regional concentration. If Sarah Jenkins leaves or gets recruited by cloud competitors, Atlys Corp's pipeline face a major revenue drop.",
    recommendation: "Formulate a retention plan for East Region reps. Share Sarah's custom pitch decks, incentivize her to step up to National VP to distribute her system secrets across underperforming teams."
  },
  {
    id: "INS-011",
    title: "Year-over-Year (YoY) Sales Acceleration",
    category: "Revenue",
    severity: "low",
    observation: "First-half sales comparison (Jan-May 2026 vs Jan-May 2025) indicates an overall clean revenue growth of 32.2%, proving solid product-market fit.",
    businessImpact: "Confirms our business strategy is successfully expanding. Atlys is pacing ahead of initial expectations, providing confidence to allocate R&D capital.",
    recommendation: "Reinvest 12% of excess SaaS profits into R&D for predictive security features to fortify our competitive moat."
  },
  {
    id: "INS-012",
    title: "High Discount Rates for High-Volume Buyers",
    category: "Profitability",
    severity: "medium",
    observation: "Wayne Enterprises (CUST-002) negotiated a highly customized price reduction for their hardware data appliance, reducing margin-yield down to 15%.",
    businessImpact: "Excessive discounting reduces our pricing integrity and sets a risky precedent in parallel corporate circles, impacting overall pricing power.",
    recommendation: "Establish a hard pricing floor for any physical infrastructure appliances. Offer value-add SaaS features instead of standard hardware discounts."
  },
  {
    id: "INS-013",
    title: "West Region Growth Plateau",
    category: "Regional",
    severity: "medium",
    observation: "The Pacific West Coast (West region under Chloe Fraser) showed near-flat MoM sales performance from October 2025 through May 2026.",
    businessImpact: "Stagnating pipeline growth in a mature market with high tech density. If unaddressed, Atlys risk losing tech-sector market share.",
    recommendation: "Incentivize local partner networks in Silicon Valley and Seattle. Launch highly target LinkedIn marketing campaigns focused on Chief Security Officers."
  },
  {
    id: "INS-014",
    title: "Under-Attainment in Junior Sales Tiers",
    category: "Sales Reps",
    severity: "medium",
    observation: "Junior representatives (Regina Phalange and Marcus Vance) achieved a combined average quota attainment of only 42% for FY25.",
    businessImpact: "Low junior efficiency leads to high stress, high ramp-up costs, and high rep churn within 6-12 months of hiring.",
    recommendation: "Create a 30-day Structured Enablement Program. Pair junior reps with senior coaches, offering partial pipeline assistance on their first five cloud deals."
  },
  {
    id: "INS-015",
    title: "Healthcare Biotech Industry Outperformance",
    category: "Revenue",
    severity: "low",
    observation: "Clients in the Healthcare & Biotech industry (Umbrella Corp, Tyrell Bio) exhibit 95% prompt payment times and average 78% margins.",
    businessImpact: "Highly efficient sector performance with minimal collections drag and strong budget support.",
    recommendation: "Create a healthcare-specific product offering (HIPAA-compliant SaaS pack) to accelerate sector expansion and win biotech budgets."
  },
  {
    id: "INS-016",
    title: "CyberAudit Compliance Plan High Margin",
    category: "Revenue",
    severity: "medium",
    observation: "CyberAudit Compliance plan (PROD-107) has a solid 60% gross margin and 100% renewal rate since inception.",
    businessImpact: "A resilient, non-discretionary product that customers cannot drop during regulatory audits, maintaining recurring utility value.",
    recommendation: "Position PROD-107 as a mandatory item with all SaaS server sales. Auto-attach a 14-day compliance trial to all licenses sold."
  },
  {
    id: "INS-017",
    title: "Sales Cycle Variance by Representative",
    category: "Sales Reps",
    severity: "low",
    observation: "Harvey Specter averages 18 days to close enterprise accounts, while Michael Scott averages 62 days for mid-market deals.",
    businessImpact: "Long sales cycles tie up sales resources in administrative work, limiting overall team pipeline capacity.",
    recommendation: "Review Harvey Specter's sales framework (pre-approved contracts and fixed-scope pricing) and roll out standard NDA templates company-wide."
  },
  {
    id: "INS-018",
    title: "SMB Churn Vulnerability",
    category: "Customer Retention",
    severity: "medium",
    observation: "SMB buyers (Initech LLC and Veer Logistics) represent the highest proportion of late-paying invoices (averaging 45 days late).",
    businessImpact: "Increased accounts receivable drag and high operational costs compared to actual recurring deal values.",
    recommendation: "Require upfront credit card payments for any SMB bookings under $5,000. Switch SMB billing to self-serve credit card portals."
  },
  {
    id: "INS-019",
    title: "Nov-Dec Seasonal Pipeline Surge",
    category: "Revenue",
    severity: "low",
    observation: "Orders ORD-1028 to ORD-1031 reveal Q4 revenue spikes of 45% compared to parallel Q1-Q3 quarter averages.",
    businessImpact: "High seasonal workload strain on customer onboarding engineers, leading to delivery delays.",
    recommendation: "Implement proactive hiring of implementation contractors during Q3 to absorb Q4 delivery spikes."
  },
  {
    id: "INS-020",
    title: "High Margin Core SaaS Under-Promoted",
    category: "Revenue",
    severity: "medium",
    observation: "Atlys Cloud Core (PROD-106) has an extraordinary margins (80%) but was sold in only 4 orders in FY25.",
    businessImpact: "Under-promoting our high-margin product is a missed opportunity to generate massive recurring cash flow with minimal COGS.",
    recommendation: "Double the sales representative commission accelerators on standalone Atlys Cloud Core sales to redirect pipeline focus to SaaS product."
  },
];

// ==========================================
// PHASE 10: INTERVIEW PREPARATION (20 Q&As & ELEVATOR PITCH)
// ==========================================

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    phase: "Data Analytics Concepts & Star Schema",
    question: "What is a Star Schema and why did you select it over a snowflake schema for this project?",
    answer: "A Star Schema is a dimensional data modeling technique that separates data into a central 'Fact Table' (holding quantitative, transactional records like sales revenue, cost) and surrounding de-normalized 'Dimension Tables' (holding descriptive attributes like customer profiles, products, regions). I chose a Star Schema because of its performance and simplicity: it minimizes SQL join paths, simplifies DAX modeling, and allows BI engines (like Power BI, Tableau) to execute highly optimized single-direction relationship filters. Unlike Snowflake, which normalizes dimension tables, Star Schema reduces compute complexity, making it much faster for business users to query and analyze millions of transactions.",
    interviewerTips: "Excellent answer. Demonstrates you understand the core balance between query performance and schema normalization in data warehousing."
  },
  {
    id: 2,
    phase: "Data Quality & ETL",
    question: "Walk me through how you handled data cleaning in this dashboard. What common data issues did you resolve?",
    answer: "In this project, I performed strict ETL transformations. I simulated a data pipeline with six types of real cleaning corrections: 1) Handled duplicate inputs (e.g., duplicate sales records with identical primary key ORD-1004) by applying group-by deduplication; 2) Handled missing values (e.g., ORD-1005 with missing price) by looking up correct prices in product master tables; 3) Handled outliers (e.g., ORD-1006 with negative unit price) by reverting outliers to correct values; 4) Resolved referential integrity issues (e.g., ORD-1011 with an orphan customer reference) by cross-referencing sales representative logs; 5) Implemented feature engineering to precompute profit and margins at a row-by-row level; and 6) Built out temporal columns (month indices, quarters, isWeekend) to support complex time intelligence reporting.",
    interviewerTips: "Highly structured. Highlighting raw vs cleaned records proves you are comfortable with real-world, noisy data pipelines."
  },
  {
    id: 3,
    phase: "DAX Optimization",
    question: "Why should we use DIVIDE instead of the standard forward slash (/) in DAX? Can you explain the performance impact?",
    answer: "In DAX, using the DIVIDE function is always a best practice over the direct division slash (/) for two chief reasons: 1) Performance: DIVIDE automatically evaluates the denominator first. If the denominator is zero or empty, it returns the optional blank argument (or zero) without forcing the VertiPaq engine to evaluate a slow, nested IF conditional statement. 2) Safety: It prevents division-by-zero errors that stop rendering on reports. The '/' operator forces a runtime crash on empty fields, whereas DIVIDE handles edge cases seamlessly.",
    interviewerTips: "Demonstrates advanced DAX proficiency and familiarity with Power BI's internal VertiPaq database engine."
  },
  {
    id: 4,
    phase: "Time Intelligence",
    question: "How do you calculate Month-over-Month (MoM) sales growth in DAX? What prerequisites must be satisfied?",
    answer: "To calculate Month-over-Month sales growth in DAX, we must satisfied three major prerequisites: 1) A contiguous, dedicated Calendar dimension table mapped with zero gaps in calendar dates. 2) Marking that table as the official Date Table in Power BI. 3) Correct relationship mapping between Calendar and Sales Fact. The DAX calculation follows a classic variable formulation: \n  1. VAR CurrentRev = [Total Revenue]\n  2. VAR PrevRev = CALCULATE([Total Revenue], DATEADD('DimCalendar'[Date], -1, MONTH))\n  3. RETURN DIVIDE(CurrentRev - PrevRev, PrevRev, 0).\nUsing variables is critical here to avoid re-calculating the inner measures twice, which improves performance and scalability.",
    interviewerTips: "Excellent focus on the pre-requisite marked date table and variable caching optimizations."
  },
  {
    id: 5,
    phase: "Business Analytics & Strategy",
    question: "If a region has very high revenue but extremely low profit margins, how would you approach the problem as an analyst?",
    answer: "This is a classic 'Revenue Illusion' problem, which occurs in our South region under Marcus Vance. To tackle this: 1) Deconstruct the product-mix sold in that region. In our case, the South is meeting quota by selling high volumes of physical hardware (Data Warhousing appliances) at steep discounts, which have thin margins (15%), while neglecting high-margin Cloud SaaS licenses (85% margin). 2) Perform a Cost-to-Serve analysis to factor in shipping, installation, and post-sales support overheads. 3) Deliver a strategic recommendation to the regional VP to structure discount floors and establish cross-selling SaaS targets.",
    interviewerTips: "Brilliant combination of financial analysis and data storytelling. Recruiters want to see that you connect charts to actual margin health."
  },
  {
    id: 6,
    phase: "Customer Retention Metrics",
    question: "What is the difference between Customer Retention Rate and Repeat Customer Rate, and how would you calculate them?",
    answer: "Customer Retention Rate measures the percentage of customers active in a previous baseline time window who remain active in the current period (evaluating repeat utility over months or years, usually computed using DAX set INTERSECT). Conversely, Repeat Customer Rate measures the proportion of your overall customer base who have generated more than one transaction across their entire lifetime. In our dataset, the Repeat Customer Rate is 60% (6 out of 10 clients made multiple purchases). While Repeat Rate reflects purchase frequency and engagement, Retention Rate measures long-term loyalty and subscription viability.",
    interviewerTips: "Clear definition separating transactional frequency from structured temporal cohort boundaries."
  },
  {
    id: 7,
    phase: "Advanced DAX",
    question: "Explain how CALCULATE works in DAX and its impact on Filter Context, Row Context, and Context Transition.",
    answer: "CALCULATE is the single most powerful function in DAX as it is the only function that can modify, replace, or cleared the existing Filter Context. It evaluated its inner expressions under a newly modified filter context. Furthermore, CALCULATE triggers a critical process called 'Context Transition': if evaluated inside an iterative row context (like inside FILTER, ADDCOLUMNS, or SUMX), it converts that Row Context into an equivalent Filter Context, allowing row-level values to act as filters across the entire model.",
    interviewerTips: "Deep technical insight. Context Transition is the top filter dividing junior from senior Power BI modelers."
  },
  {
    id: 8,
    phase: "Data Analytics Concepts & Star Schema",
    question: "How do you handle a Many-to-Many relationship in a dimensional data model?",
    answer: "Many-to-Many relationships are handled using three primary approaches: 1) Bridge Table: Introducing a direct middle associative table with 1-to-many relationships pointing outwards to both entities, establishing a single-direction filtering path. 2) Cross-Filter Direction: Enabling bidirectional cross-filtering in the relationship properties of Power BI (highly discouraged due to high performance degradation). 3) In modern databases, utilizing DAX's TREATAS function to dynamically map virtual relationships, which keeps the physical data model clean and highly performant.",
    interviewerTips: "Highlighting bridge tables and security/performance issues of bidirectional filters shows real modeling maturity."
  },
  {
    id: 9,
    phase: "Business Analytics & Strategy",
    question: "Explain what a Pareto Analysis is and how a business decision-maker should use its results.",
    answer: "A Pareto Analysis is based on the 80/20 Rule: asserting that roughly 80% of business outcomes (e.g. sales, profit, support tickets) are driven by 20% of inputs (e.g. key customers, top products, code bugs). In this portfolio project, our Pareto chart shows that the top 3 high-tier accounts (Stark Enterprises, Wayne Corp, Globex Corp) drive over 73% of total revenue. For a business decision-maker, this high concentration means they must immediately allocate VIP Client Success programs to protect these 3 key accounts, whilst optimizing marketing to duplicate these specific client profiles.",
    interviewerTips: "Connects mathematical models (80/20) with immediate business value like Customer Lifetime Value protection."
  },
  {
    id: 10,
    phase: "Data Quality & ETL",
    question: "How do you handle date columns with different timezones and formatting inside your ETL queries?",
    answer: "In ETL pipelines (e.g., Power Query or SQL server dbt), we sanitize temporal values by: 1) Splitting and removing Timestamp offset components from standard Date values to maintain index integrity. 2) Converting all dates to standard UTC (Universal Time Coordinated) as the common master timezone. 3) Formatting all temporal text strings into the standard ISO 8601 unified date format (YYYY-MM-DD) before linking them to our Calendar dimension table.",
    interviewerTips: "Solid data engineering practice. Emphasizing UTC standardization prevents transactional discrepancies."
  },
  {
    id: 11,
    phase: "DAX Optimization",
    question: "What is the VertiPaq engine and how does it store and search data?",
    answer: "The VertiPaq engine is the underlying in-memory database engine for Power BI and Analysis Services. It stores data columarly rather than row-by-row, allowing exceptional data compression using methods like Value Encoding, Hash/Dictionary Encoding, and Run-Length Encoding (RLE). VertiPaq is lightning-fast for aggregations because it scans individual, highly compressed columns directly in RAM, bypassing the slow disk-reads of traditional transactional server search structures.",
    interviewerTips: "Excellent. Knowing VertiPaq compression mechanics proves you can design enterprise-scale models."
  },
  {
    id: 12,
    phase: "Advanced Analytics",
    question: "What is ABC Analysis in inventory and product management, and how was it configured here?",
    answer: "ABC Analysis categorizes products into three strategic groups based on revenue or margin contribution: Category A (Top 70-80% value, closely managed and highly strategic), Category B (Middle 15-20% value, moderately monitored), and Category C (Bottom 5-10% value, run-rate commodities). In Atlys Corp's product list: 'Aura SaaS Suite' (PROD-101) represents Category A (huge revenue, high margins); and hardware appliance accessories fall into Category C. This prioritization helps executives direct supply chains and discount limits.",
    interviewerTips: "Links product categorization directly to cash flow allocation and inventory operations."
  },
  {
    id: 13,
    phase: "Time Intelligence",
    question: "What is the difference between SAMEPERIODLASTYEAR and DATEADD in DAX?",
    answer: "SAMEPERIODLASTYEAR is a specialized time-intelligence function that shifts active date selections back exactly one year. Behind the scenes, SAMEPERIODLASTYEAR is actually an alias for DATEADD(Calendar[Date], -1, YEAR). While both yield identical performance, DATEADD is much more versatile as it allows you to dynamically parameterize both the time offset number (e.g. -1, -3, 6) and the interval granularity (e.g. DAY, MONTH, QUARTER, YEAR).",
    interviewerTips: "Good technical distinction, listing syntax-alias mappings proves your deeper knowledge."
  },
  {
    id: 14,
    phase: "Advanced Analytics",
    question: "What is Cohort Analysis and why is it valuable for SaaS or subscription business models?",
    answer: "Cohort Analysis groups customers who share a common starting date or demographic profile (e.g., 'Q1-2025 Signups') and tracks their behavior over time. It is highly valuable for SaaS businesses because it isolates product retention performance from raw sales volume: it reveals whether user engagement drops off after month 3 or remains stable, showing whether your core product value is solid or if you have a dangerous 'leaky bucket' problem.",
    interviewerTips: "Great SaaS focus. This is exactly what tech companies look for in Business Intelligence hires."
  },
  {
    id: 15,
    phase: "Business Analytics & Strategy",
    question: "Describe your visual design process when building business dashboards. How do you choose your colors?",
    answer: "My visual design process centers around cognitive load reduction and user storytelling: 1) Grid Layout: Position high-level metrics (KPI cards) left-to-right along the top, following natural reading patterns, followed by larger trends in the middle. 2) Color: Use clean backgrounds with generous padding, utilizing colors selectively (blue or gray as primary neutral anchors, reserving red/green sparingly to flag issues). 3) Context: Ensure every visual has clear comparisons (e.g., sales vs target) so users can immediately determine if performance is on track without guessing.",
    interviewerTips: "Demonstrates strong UI/UX awareness and data visualization design principles."
  },
  {
    id: 16,
    phase: "DAX Optimization",
    question: "How does SUMX differ from SUM in DAX, and when should you absolutely avoid SUMX?",
    answer: "SUM is a highly optimized columnar aggregation function that performs a single fast operation on a single column directly. SUMX is an iterative function (designated by the 'X') that evaluates an expression row-by-row through a table. You should avoid SUMX if you are simply summing a single column (e.g. SUMX(Table, [Sales]) is slow), and always use simple SUM. Save SUMX for scenarios that require multi-column calculations per row (e.g. 'Quantity' * 'Unit Price' * 'Discount') before summing.",
    interviewerTips: "Highlights deep understanding of the differences between column scans and row iterators."
  },
  {
    id: 17,
    phase: "Data Quality & ETL",
    question: "How do you detect and handle extreme values or outliers in your dataset?",
    answer: "I approach outlier detection using both statistical and business rules: 1) Statistical boundaries (e.g., Calculating Z-score or the Interquartile Range (IQR) thresholding - any item beyond Q3 + 1.5 * IQR is flagged). 2) Business rules (e.g., mapping pricing anomalies like ORD-1006 with unit prices below zero). Once caught, I resolve them via clean substitution by cross-referencing master tables, or by winsorizing (reverting extreme items to the nearest valid threshold).",
    interviewerTips: "Demonstrates both statistical rigor and practical business awareness."
  },
  {
    id: 18,
    phase: "Customer Retention Metrics",
    question: "What is Customer Lifetime Value (CLV) and how would you calculate a proxy for it in a BI dashboard?",
    answer: "Customer Lifetime Value (CLV) is the projected net profit a customer contributes over their entire relationship. As a metric in a BI dashboard, we calculate a practical historical proxy using: Average Purchase Value multiplied by Purchase Frequency over the customer tenure, adjusted for gross margin % (Proxy CLV = [Average Revenue Per Order] * [Total Order Count] * [Gross Margin %]). Sorting by this metric immediately reveals our highest-value accounts.",
    interviewerTips: "Excellent. Showing how to map a complex metric into a clean, actionable proxy is exactly what Senior Analysts do."
  },
  {
    id: 19,
    phase: "Time Intelligence",
    question: "How do you handle fiscal calendar structures that don't start in January?",
    answer: "To handle custom fiscal calendars, we configure our DimCalendar table with two sets of columns: a Calendar Year and a mapped Fiscal Year (e.g., running from July to June). In DAX, we pass the custom end-date parameter into time-intelligence functions like TOTALYTD or SAMEPERIODLASTYEAR (e.g., Adding the optional parameter '06-30' as the end of the fiscal year: TOTALYTD([Total Revenue], 'CalendarDay'[Date], '06-30')).",
    interviewerTips: "Very practical. Many global enterprise customers run custom fiscal calendar calendars."
  },
  {
    id: 20,
    phase: "Business Analytics & Strategy",
    question: "How do you design dashboards to balance static executive metrics with deep, self-serve data discovery?",
    answer: "I design using a progressive-disclosure 'Bento-Box' framework: 1) Page 1 is a clean, static, high-level Executive overview focused on top-line health. 2) Successive detail pages (Product, Customer, Region) provide users with drill-through parameters, localized slicers, and interactive hover tooltips that allow functional teams to filter data to their specific interests without cluttering the primary view.",
    interviewerTips: "Highlights true dashboard empathy - structuring layouts logically for both general and power users."
  }
];

export const executiveSummary = {
  headline: "Turning Low-Margin Hardware Ingestion Into Enterprise High-Margin SaaS Scaling",
  problem: "Atlys Corp's raw sales data revealed duplicate, negative, and missing invoicing inputs ($52k raw variance) alongside a significant risk: 73% of company revenues were concentrated in just 3 large accounts. Furthermore, the US South territory was experiencing extreme 'Revenue Illusion', generating high hardware sales volumes but returning almost zero actual profitability due to heavy discounting.",
  methodology: "We designed a robust Star Schema dimensional model to handle transactions. Raw invoices were cleaned by fixing duplicates and missing values, and high-performance DAX measures were built to analyze MoM and YoY growth. Visual dashboards were then constructed in React to enable real-time tracking.",
  findings: "Clean SaaS product lines (PROD-101, PROD-103) generate extraordinary 85%+ margins compared to physical appliances (15-20% margin). Sarah Jenkins in the East region achieved 110% of quota by prioritizing cloud suite bundles, while Marcus Vance in the South hit just 52% of quota with highly discounted low-margin hardware. YoY customer growth accelerated by 32% overall.",
  recommendations: "1) Institute a strict software attachment floor of 35% on all hardware appliance transactions. 2) Re-allocate marketing spend towards the Mid-Market sector. 3) Standardize sales frameworks company-wide based on Sarah Jenkins' East Region playbooks. 4) Apply data ingestion security constraints to eliminate Raw Billing duplicate and negative outliers at source.",
  valueCreated: "$42.5K in immediate pipeline leaks reclaimed, $120K in projected annual operational savings, and a strategic SaaS transition plan to boost gross margin from 54% to 76% across the next fiscal year."
};
