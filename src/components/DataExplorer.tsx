/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Database, Filter, ArrowRight, CheckCircle, AlertTriangle, FileText, BarChart, Server, Layers, HelpCircle } from "lucide-react";
import { rawOrders, cleanOrders, customers, products, salesReps, regions } from "../data";

export default function DataExplorer() {
  const [activeTab, setActiveTab] = useState<"business" | "cleaning" | "modeling">("business");
  const [cleaningFilter, setCleaningFilter] = useState<"all" | "duplicate" | "missing" | "outlier" | "orphan" | "valid">("all");

  const rawWithAnomalies = rawOrders;
  const filteredRaw = cleaningFilter === "all" 
    ? rawWithAnomalies 
    : rawWithAnomalies.filter(o => o.status === cleaningFilter);

  // Data Schema columns description
  const columnsDescription = [
    { name: "Order ID", desc: "Unique transaction identifier (Primary Key in Fact Table).", type: "VARCHAR", key: "PK" },
    { name: "Order Date", desc: "Date transaction was placed. Joins to Calendar dimension.", type: "DATE", key: "FK" },
    { name: "Customer ID", desc: "Customer referencing surrogate key. Joins to Customers dimension.", type: "VARCHAR", key: "FK" },
    { name: "Product ID", desc: "Product catalog sku key. Joins to Products dimension.", type: "VARCHAR", key: "FK" },
    { name: "Sales Rep ID", desc: "Sales representative who closed the transaction. Joins to SalesRep dimension.", type: "VARCHAR", key: "FK" },
    { name: "Quantity", desc: "Number of units purchased (Integer).", type: "INTEGER", key: "" },
    { name: "Unit Price", desc: "Negotiated gross price billed per unit.", type: "DECIMAL", key: "" },
    { name: "Revenue", desc: "Calculated gross revenue (Quantity * Unit Price). Billed value.", type: "DECIMAL", key: "" },
    { name: "Cost", desc: "Unit Cost multiplied by Quantity. Represent COGS expense.", type: "DECIMAL", key: "" },
  ];

  return (
    <div className="space-y-8" id="data-explorer-root">
      {/* Tab Selector */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("business")}
          className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "business"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
          }`}
          id="tab-business-understanding"
        >
          <Layers className="w-4 h-4" />
          1 & 2. Business & Data Understanding
        </button>
        <button
          onClick={() => setActiveTab("cleaning")}
          className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "cleaning"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
          }`}
          id="tab-data-cleaning"
        >
          <Filter className="w-4 h-4" />
          3. ETL Data Cleaning Pipeline
        </button>
        <button
          onClick={() => setActiveTab("modeling")}
          className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "modeling"
              ? "border-emerald-600 text-emerald-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
          }`}
          id="tab-data-modeling"
        >
          <Database className="w-4 h-4" />
          4. Star Schema Modeling Map
        </button>
      </div>

      {/* PHASE 1 & 2: BUSINESS & DATA UNDERSTANDING */}
      {activeTab === "business" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="business-understanding-panel">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-emerald-600 w-5 h-5" />
                Phase 1: Business Problem & Objectives
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                In B2B tech enterprises, leadership faces heavy blind spots regarding top-line trends and true margin health. Sales teams frequently meet initial quotas via high-volume physical appliance sales containing steep legacy discounting, hiding an operational drag on operating profit margins.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                  <h4 className="font-semibold text-emerald-900 text-xs uppercase tracking-wider mb-2">Core Business Objectives</h4>
                  <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
                    <li>Transition core operations towards higher margin (80%+) cloud-based SaaS packages.</li>
                    <li>Audit regional margin erosion (extreme discounting in South territory).</li>
                    <li>Establish data-driven quota tracking, pipeline predictability, and CRM billing integrity.</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100/50">
                  <h4 className="font-semibold text-blue-900 text-xs uppercase tracking-wider mb-2">Key Corporate Stakeholders</h4>
                  <ul className="text-xs text-blue-800 space-y-1.5 list-disc list-inside">
                    <li><strong>Chief Financial Officer (CFO):</strong> Monitors gross margins, ARR, and capital allocations.</li>
                    <li><strong>VP of Global Sales:</strong> Evaluates regional quota attainment and rep commissions.</li>
                    <li><strong>Chief Operations Officer (COO):</strong> Audits B2B customer retention cycles and support load.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-800">Key Business Questions Answered</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {[
                  { q: "Which product categories generate the highest absolute margins versus volume?", a: "Cloud SaaS leads margins at 85%, while Hardware is high volume but drags margin down to 15%." },
                  { q: "Which regions are underperforming and what is the root cause?", a: "The Southeast (South Division) averages just 16% Margin due to excessive appliance discounting." },
                  { q: "What is the company's true customer brand loyalty and repeat-buyer rate?", a: "We display a 60% Lifetime Repeat Customer Rate, with heavy client volume concentration." },
                  { q: "How can Sales Rep productivity be optimized fairly across tiers?", a: "By establishing peer mentoring and adding Software commissions accelerators to replace legacy physical product deals." }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="font-bold text-gray-700 mb-1">Q: {item.q}</p>
                    <p className="text-gray-500"><strong>Insight:</strong> {item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-950 text-white p-6 rounded-xl shadow space-y-4">
              <h4 className="font-bold text-emerald-400 text-sm uppercase tracking-wider">Phase 2: Master Data Dictionary</h4>
              <p className="text-xs text-emerald-200">
                A granular description of our structured relational FactSales data variables.
              </p>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {columnsDescription.map((col, idx) => (
                  <div key={idx} className="border-b border-emerald-900 pb-2 last:border-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-emerald-300 font-semibold">{col.name}</span>
                      <span className="text-[10px] bg-emerald-900 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 rounded uppercase">{col.type}</span>
                    </div>
                    <p className="text-[11px] text-emerald-300 mt-1">{col.desc}</p>
                    {col.key && (
                      <span className="inline-block text-[9px] bg-emerald-500 text-emerald-950 font-bold px-1.5 rounded mt-1">{col.key}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: DATA CLEANING PIPELINE */}
      {activeTab === "cleaning" && (
        <div className="space-y-6" id="data-cleaning-panel">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">ETL Data Cleaning & Transformation Auditor</h3>
                <p className="text-xs text-gray-500 mt-0.5">Understand how raw sales ingestion anomalies (duplicates, omissions, outliers) are sanitized before reporting.</p>
              </div>
              <div className="flex flex-wrap gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100 text-xs">
                {[
                  { value: "all", label: "All Logs" },
                  { value: "duplicate", label: "Duplicates Only" },
                  { value: "missing", label: "Missing Fields" },
                  { value: "outlier", label: "Outliers" },
                  { value: "orphan", label: "Orphan Keys" },
                  { value: "valid", label: "Standard Clean" }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setCleaningFilter(tab.value as any)}
                    className={`px-3 py-1.5 rounded font-medium transition-all ${
                      cleaningFilter === tab.value
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline Step cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">Duplicate Removal</span>
                <p className="text-xs font-semibold text-rose-950 mt-1">Primary Key integrity</p>
                <p className="text-[11px] text-rose-800 mt-1">Identified identical records (ORD-1004) duplicated via concurrent Web API calls. Applied SQL ROW_NUMBER() grouping to retain first entry.</p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">Price Standardization</span>
                <p className="text-xs font-semibold text-orange-950 mt-1">Lookup & Correction</p>
                <p className="text-[11px] text-orange-850 mt-1">Bypassed blank pricing (ORD-1005) or negative outliers (ORD-1006) by performing master table product joining, maintaining revenue precision.</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">Foreign Key Matching</span>
                <p className="text-xs font-semibold text-purple-950 mt-1">Orphan Resolutions</p>
                <p className="text-[11px] text-purple-855 mt-1">Resolved non-existent customer reference CUST-999 (ORD-1011) by cross-matching logs, preventing join failure during modeling.</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Feature Engineering</span>
                <p className="text-xs font-semibold text-emerald-950 mt-1">Row-Level Metrics</p>
                <p className="text-[11px] text-emerald-850 mt-1">Calculated line-item margins, Net Profits, and generated rich calendar slices (quarter indexes, isWeekend) to support complex analytics.</p>
              </div>
            </div>

            {/* Simulated Live Table Audit */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mt-4">
              <div className="bg-gray-50 border-b border-gray-150 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-gray-700 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-gray-500" />
                  DATABASE AUDIT: RAW TRANSCRIPT LOG ({filteredRaw.length} Records Shown)
                </span>
                <span className="text-[11px] text-gray-400 italic">Simulating CRM ETL Extraction</span>
              </div>
              <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-gray-100 text-gray-600 font-semibold sticky top-0 uppercase text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Invoiced Date</th>
                      <th className="p-3">Customer ID</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Raw Price</th>
                      <th className="p-3">Reported Rev</th>
                      <th className="p-3">Audit Stat</th>
                      <th className="p-3">ETL Resolution Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRaw.map((o, idx) => {
                      let statusBadge = "bg-emerald-100 text-emerald-800";
                      let bgRow = "hover:bg-gray-50";
                      if (o.status === "duplicate") { statusBadge = "bg-rose-100 text-rose-850"; bgRow = "bg-rose-50/50 hover:bg-rose-50"; }
                      else if (o.status === "missing") { statusBadge = "bg-orange-100 text-orange-850"; bgRow = "bg-orange-50/50 hover:bg-orange-50"; }
                      else if (o.status === "outlier") { statusBadge = "bg-yellow-105 text-yellow-850 border border-yellow-250"; bgRow = "bg-yellow-50/50 hover:bg-yellow-50"; }
                      else if (o.status === "orphan") { statusBadge = "bg-purple-100 text-purple-850"; bgRow = "bg-purple-50/50 hover:bg-purple-50"; }

                      return (
                        <tr key={idx} className={`${bgRow} transition-colors border-b border-gray-100 font-mono text-[11px]`}>
                          <td className="p-3 font-semibold text-gray-800">{o.orderId}</td>
                          <td className="p-3 text-gray-500">{o.orderDate}</td>
                          <td className="p-3 text-gray-700">{o.customerId}</td>
                          <td className="p-3 text-gray-500">{o.productId}</td>
                          <td className="p-3 font-semibold text-gray-800">{o.quantity ?? <span className="text-rose-600">NULL</span>}</td>
                          <td className="p-3 font-semibold text-gray-800">
                            {o.unitPrice === null ? <span className="text-rose-600">NULL</span> : o.unitPrice < 0 ? <span className="text-rose-600">-${Math.abs(o.unitPrice).toLocaleString()}</span> : `$${o.unitPrice.toLocaleString()}`}
                          </td>
                          <td className="p-3">
                            {o.revenue === null ? <span className="text-rose-600">NULL</span> : o.revenue === 0 ? <span className="text-orange-500">$0</span> : o.revenue < 0 ? <span className="text-rose-600">-${Math.abs(o.revenue).toLocaleString()}</span> : `$${o.revenue.toLocaleString()}`}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${statusBadge}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 text-[11px] text-gray-600">
                            {o.status === "duplicate" && <span className="text-rose-600">❌ De-duped: Dropped redundant row</span>}
                            {o.status === "missing" && o.quantity === null && <span className="text-orange-600">🛠️ Imputed Qty: Defaulted key median (2)</span>}
                            {o.status === "missing" && o.unitPrice === null && <span className="text-orange-600">🛠️ Price Lookup: Inserted master sku standard ($12,000)</span>}
                            {o.status === "outlier" && <span className="text-orange-600">🛠️ Outlier Fixed: Corrected negative floor ($15,000)</span>}
                            {o.status === "orphan" && <span className="text-purple-600">🛠️ Remapped: Resolved ID link to active customer ID</span>}
                            {o.status === "valid" && <span className="text-emerald-600">✅ Kept: Passed standard validation</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: STAR SCHEMA DATA MODEL */}
      {activeTab === "modeling" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="data-modeling-panel">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-800">Logical Star Schema Diagram Architecture</h3>
              <p className="text-xs text-gray-500">The industry-standard relational structure configured to prevent report query drag and circular join dependencies.</p>
            </div>

            {/* SVG Star Schema Diagram */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-150 flex items-center justify-center overflow-x-auto min-h-[380px]">
              <svg width="680" height="340" viewBox="0 0 680 340" className="max-w-full">
                {/* Arrow Marker Definitions */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* CENTRAL FACT TABLE */}
                <g transform="translate(250, 110)">
                  <rect x="0" y="0" width="180" height="130" rx="8" fill="#065f46" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
                  <text x="90" y="24" fill="#ffffff" fontWeight="bold" fontSize="12" textAnchor="middle">FactSales (Sales Fact)</text>
                  <line x1="0" y1="34" x2="180" y2="34" stroke="#047857" strokeWidth="1.5" />
                  <text x="15" y="52" fill="#34d399" fontFamily="monospace" fontSize="10">orderId (PK)</text>
                  <text x="15" y="68" fill="#a7f3d0" fontFamily="monospace" fontSize="10">orderDate (FK)</text>
                  <text x="15" y="84" fill="#a7f3d0" fontFamily="monospace" fontSize="10">customerId (FK)</text>
                  <text x="15" y="100" fill="#a7f3d0" fontFamily="monospace" fontSize="10">productId (FK)</text>
                  <text x="15" y="116" fill="#a7f3d0" fontFamily="monospace" fontSize="10">salesRepId (FK)</text>
                  {/* Cardinality Indicators (star is inside matching lines) */}
                </g>

                {/* DIMENSION 1: Customers (Top Left) */}
                <g transform="translate(20, 20)">
                  <rect x="0" y="0" width="160" height="90" rx="6" fill="#1e293b" />
                  <text x="80" y="20" fill="#ffffff" fontWeight="bold" fontSize="11" textAnchor="middle">DimCustomers</text>
                  <line x1="0" y1="28" x2="160" y2="28" stroke="#334155" />
                  <text x="12" y="44" fill="#38bdf8" fontFamily="monospace" fontSize="9">customerId (PK)</text>
                  <text x="12" y="58" fill="#94a3b8" fontSize="9">name, email</text>
                  <text x="12" y="72" fill="#94a3b8" fontSize="9">segment, industry</text>
                </g>

                {/* DIMENSION 2: Products (Bottom Left) */}
                <g transform="translate(20, 210)">
                  <rect x="0" y="0" width="160" height="90" rx="6" fill="#1e293b" />
                  <text x="80" y="20" fill="#ffffff" fontWeight="bold" fontSize="11" textAnchor="middle">DimProducts</text>
                  <line x1="0" y1="28" x2="160" y2="28" stroke="#334155" />
                  <text x="12" y="44" fill="#38bdf8" fontFamily="monospace" fontSize="9">productId (PK)</text>
                  <text x="12" y="58" fill="#94a3b8" fontSize="9">name, category</text>
                  <text x="12" y="72" fill="#94a3b8" fontSize="9">unitPrice, cost</text>
                </g>

                {/* DIMENSION 3: Sales Reps (Top Right) */}
                <g transform="translate(500, 20)">
                  <rect x="0" y="0" width="160" height="100" rx="6" fill="#1e293b" />
                  <text x="80" y="20" fill="#ffffff" fontWeight="bold" fontSize="11" textAnchor="middle">DimSalesReps</text>
                  <line x1="0" y1="28" x2="160" y2="28" stroke="#334155" />
                  <text x="12" y="44" fill="#38bdf8" fontFamily="monospace" fontSize="9">salesRepId (PK)</text>
                  <text x="12" y="58" fill="#94a3b8" fontSize="9">name, seniority</text>
                  <text x="12" y="72" fill="#94a3b8" fontSize="9">regionId (FK)</text>
                  <text x="12" y="86" fill="#94a3b8" fontSize="9">annualTarget</text>
                </g>

                {/* DIMENSION 4: Calendar (Bottom Right) */}
                <g transform="translate(500, 210)">
                  <rect x="0" y="0" width="160" height="90" rx="6" fill="#1e293b" />
                  <text x="80" y="20" fill="#ffffff" fontWeight="bold" fontSize="11" textAnchor="middle">DimCalendar</text>
                  <line x1="0" y1="28" x2="160" y2="28" stroke="#334155" />
                  <text x="12" y="44" fill="#38bdf8" fontFamily="monospace" fontSize="9">dateKey (PK)</text>
                  <text x="12" y="58" fill="#94a3b8" fontSize="9">year, indexMonth</text>
                  <text x="12" y="72" fill="#94a3b8" fontSize="9">quarter, dayOfWeek</text>
                </g>

                {/* RELATIONSHIP CONNECTIONS (Lines with primary-foreign indicators) */}
                
                {/* Customers to Fact (1 to *) */}
                <path d="M 180 65 L 250 140" stroke="#94a3b8" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" strokeDasharray="3,3" />
                <text x="190" y="62" fill="#0284c7" fontSize="10" fontWeight="bold">1</text>
                <text x="240" y="132" fill="#059669" fontSize="12" fontWeight="bold">*</text>

                {/* Products to Fact (1 to *) */}
                <path d="M 180 255 L 250 200" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="190" y="250" fill="#0284c7" fontSize="10" fontWeight="bold">1</text>
                <text x="240" y="210" fill="#059669" fontSize="12" fontWeight="bold">*</text>

                {/* SalesReps to Fact (1 to *) */}
                <path d="M 500 70 L 430 140" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="490" y="68" fill="#0284c7" fontSize="10" fontWeight="bold">1</text>
                <text x="440" y="132" fill="#059669" fontSize="12" fontWeight="bold">*</text>

                {/* Calendar to Fact (1 to *) */}
                <path d="M 500 255 L 430 200" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="491" y="250" fill="#0284c7" fontSize="10" fontWeight="bold">1</text>
                <text x="440" y="210" fill="#059669" fontSize="12" fontWeight="bold">*</text>
              </svg>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Why B2B Models Require Star Schema Modeling</h4>
            <div className="space-y-4 text-xs text-gray-600">
              <div className="space-y-1">
                <p className="font-bold text-gray-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  1. VertiPaq Columnar Compression Efficacy
                </p>
                <p className="text-[11px] leading-relaxed">
                  BI engines (like Power BI, Excel's data models) utilize in-memory columnar database structures. De-normalizing dimensions into single master tables maps similar attributes together, maximizing Hash and Run-Length Encoding (RLE) saving up to 90% space.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  2. Minimizing Join Paths & CPU Cost
                </p>
                <p className="text-[11px] leading-relaxed">
                  Every level of Snowflaking adds another logical table to join. In a high-traffic dashboard, multi-table traversal degrades rendering performance. Star schema ensures any visual requires deep search depth of exactly one junction hop.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  3. Clean Single-Direction Filters (No Bidirectional Loops)
                </p>
                <p className="text-[11px] leading-relaxed">
                  A perfect 1-to-many single-direction relationship ensures descriptive filters cascade downward smoothly without creating logic cycles, preventing duplicate counts and DAX context leaks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
