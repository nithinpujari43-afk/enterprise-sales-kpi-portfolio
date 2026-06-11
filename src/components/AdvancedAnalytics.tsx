/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sparkles, Percent, Award, ChevronRight, HelpCircle } from "lucide-react";
import { cleanOrders, customers, products } from "../data";

// Type definitions for math structures
interface CustomerRevSummary {
  name: string;
  revenue: number;
}

export default function AdvancedAnalytics() {
  const [analyticsView, setAnalyticsView] = useState<"pareto" | "cohort" | "abc">("pareto");

  // ==========================================
  // DYNAMIC MATH: PARETO 80/20 CONCENTRATION RUN
  // ==========================================
  const paretoData = useMemo(() => {
    // 1. Group revenue by customer ID
    const customerRevs: Record<string, number> = {};
    cleanOrders.forEach(o => {
      customerRevs[o.customerId] = (customerRevs[o.customerId] || 0) + o.revenue;
    });

    // 2. Map customer names and details
    let sortedSummary: { name: string; revenue: number }[] = Object.keys(customerRevs).map(id => {
      const custObj = customers.find(c => c.id === id);
      return {
        name: custObj ? custObj.name : id,
        revenue: customerRevs[id]
      };
    });

    // 3. Sort customer revenue descending
    sortedSummary.sort((a, b) => b.revenue - a.revenue);

    // 4. Calculate cumulative percentage
    const totalRev = sortedSummary.reduce((acc, curr) => acc + curr.revenue, 0);
    let runningSum = 0;

    return sortedSummary.map(item => {
      runningSum += item.revenue;
      const cumPct = parseFloat(((runningSum / totalRev) * 100).toFixed(1));
      return {
        name: item.name,
        revenue: item.revenue,
        "Cumulative %": cumPct
      };
    });
  }, []);

  // Total B2B pipeline revenue
  const netCleanPipelineTotal = useMemo(() => {
    return cleanOrders.reduce((acc, o) => acc + o.revenue, 0);
  }, []);

  // ==========================================
  // COHORT ANALYSIS (ONBOARDING loyalty retention heat matrix)
  // ==========================================
  const cohortsHeatmap = [
    { cohortName: "Q1-2025 Cohort", size: 4, r0: 100, r3m: 75, r6m: 50, r12m: 50, clv: "$42.5K" },
    { cohortName: "Q2-2025 Cohort", size: 3, r0: 100, r3m: 100, r6m: 66, r12m: 66, clv: "$32.0K" },
    { cohortName: "Q3-2025 Cohort", size: 2, r0: 100, r3m: 50, r6m: 50, r12m: 0, clv: "$24.0K" },
    { cohortName: "Q4-2025 Cohort", size: 1, r0: 100, r3m: 100, r6m: 100, r12m: 100, clv: "$67.5K" },
    { cohortName: "Q1-2026 Cohort", size: 2, r0: 100, r3m: 50, r6m: 0, r12m: 0, clv: "$12.0K" },
  ];

  // Helper function to color code heatmap block cell
  const getHeatmapColor = (val: number) => {
    if (val === 100) return "bg-emerald-600 text-white";
    if (val >= 75) return "bg-emerald-500 text-emerald-50";
    if (val >= 50) return "bg-emerald-300 text-emerald-950 text-emerald-900";
    if (val >= 25) return "bg-emerald-100 text-emerald-900";
    return "bg-slate-100 text-slate-400";
  };

  // ==========================================
  // ABC PRODUCT STRATEGIZATION
  // ==========================================
  const abcProducts = useMemo(() => {
    const productRevs: Record<string, number> = {};
    cleanOrders.forEach(o => {
      productRevs[o.productId] = (productRevs[o.productId] || 0) + o.revenue;
    });

    const list = products.map(p => {
      const rev = productRevs[p.id] || 0;
      return {
        ...p,
        revenue: rev,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const grandProductRev = list.reduce((sum, item) => sum + item.revenue, 0);
    let cumulativeAmount = 0;

    return list.map((item) => {
      cumulativeAmount += item.revenue;
      const share = (item.revenue / grandProductRev) * 100;
      const cumPct = (cumulativeAmount / grandProductRev) * 100;
      
      // ABC category classification
      let categoryLetter: "A" | "B" | "C" = "C";
      let badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
      if (cumPct <= 75) {
        categoryLetter = "A";
        badgeColor = "bg-rose-100 text-rose-850 border-rose-200";
      } else if (cumPct <= 95) {
        categoryLetter = "B";
        badgeColor = "bg-blue-100 text-blue-800 border-blue-200 font-semibold";
      }

      return {
        ...item,
        sharePct: share.toFixed(1),
        cumulativePct: cumPct.toFixed(1),
        abcCategory: categoryLetter,
        badgeColor
      };
    });
  }, []);

  return (
    <div className="space-y-6" id="advanced-analytics-root">
      {/* Sub menu selector */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-205 max-w-sm">
        {[
          { id: "pareto", label: "Pareto 80/20 Rule" },
          { id: "cohort", label: "Cohort Loyalty" },
          { id: "abc", label: "ABC Classification" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAnalyticsView(tab.id as any)}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${
              analyticsView === tab.id
                ? "bg-white text-slate-800 shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PARETO VIEW */}
      {analyticsView === "pareto" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="paret-section">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#059669]">Business Concentration</span>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-emerald-600" />
                Customer Pareto Chart (80/20 Core Revenue Engine)
              </h3>
              <p className="text-xs text-gray-400">Bar marks individual client clean billing; Line charts cumulative percentage. Over 73% of company revenue stems from our top three anchors.</p>
            </div>

            {/* Pareto Chart rendering */}
            <div className="h-[320px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#059669" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v / 1000)}k`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#e11d48" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px" }}
                    formatter={(value: any, name: string) => {
                      if (name === "revenue") return [`$${value.toLocaleString()}`, "Billed Customer Rev"];
                      return [`${value}%`, "Cumulative Share %"];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar yAxisId="left" dataKey="revenue" name="revenue" fill="#34d399" radius={[4, 4, 0, 0]} barSize={25} />
                  <Line yAxisId="right" type="monotone" dataKey="Cumulative %" name="Cumulative %" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">Executive Vulnerability warning</span>
              <p className="text-xs font-semibold text-rose-900">Highest Category Concentration Risk</p>
              <p className="text-xs text-rose-800 leading-relaxed">
                Stark Industries, Wayne Enterprise, and Globex Corp represent $641,500 of our $873,000 total validated pipeline (representing <b>73.4% of consolidated cashflow</b>).
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Strategic Recommendation</h4>
              <div className="space-y-3.5 text-xs text-gray-600">
                <div className="flex gap-2">
                  <span className="font-bold text-emerald-600 select-none">1.</span>
                  <p><b>Establish Key accounts client coverage:</b> Appoint a dedicated Customer Success Architect to each of the top three anchors to guarantee high-touch license retention.</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-emerald-600 select-none">2.</span>
                  <p><b>Target similar accounts attributes:</b> Map current prospecting lists to favor defense contracting and manufacturing giants with over $10B market valuation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COHORT Retention VIEW */}
      {analyticsView === "cohort" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="cohort-section">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">Loyalty Analytics</span>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Customer Cohort Retention Matrix
              </h3>
              <p className="text-xs text-gray-400">Reflects buyer health over sequential fiscal periods. Tracks when user churn occurs starting from initial signup.</p>
            </div>

            {/* Loyalty grid layout */}
            <div className="overflow-x-auto pt-3">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b text-[10px] uppercase">
                    <th className="p-3 text-left">Cohort</th>
                    <th className="p-3">Accounts</th>
                    <th className="p-3">Month 0</th>
                    <th className="p-3">Month 3</th>
                    <th className="p-3">Month 6</th>
                    <th className="p-3">Month 12</th>
                    <th className="p-3 text-right">Avg LTV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {cohortsHeatmap.map((ch, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-left font-sans font-bold text-slate-700">{ch.cohortName}</td>
                      <td className="p-3 text-slate-500">{ch.size} clients</td>
                      <td className={`p-3 font-semibold ${getHeatmapColor(ch.r0)}`}>{ch.r0}%</td>
                      <td className={`p-3 font-semibold ${getHeatmapColor(ch.r3m)}`}>{ch.r3m}%</td>
                      <td className={`p-3 font-semibold ${getHeatmapColor(ch.r6m)}`}>{ch.r6m}%</td>
                      <td className={`p-3 font-semibold ${getHeatmapColor(ch.r12m)}`}>{ch.r12m}%</td>
                      <td className="p-3 text-right font-sans font-bold text-slate-800">{ch.clv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 items-center pt-2 text-[10px] text-gray-400">
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-600 inline-block rounded"></span> 100% Retained</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-300 inline-block rounded"></span> 50-66% Retained</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-100 inline-block rounded"></span> 0% Active</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-800 text-sm">Strategic Cohort Interpretation</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our <b>Q3-2025 cohort</b> highlights a critical friction hurdle, crashing down to 0% retention within Month 12. 
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex gap-2 text-xs">
                <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-gray-600"><strong>The Defect Period (Month 6):</strong> Support requests double post month-6 deployment. Many SMBs churn out of frustration with custom hardware appliances (PROD-102).</p>
              </div>
              <div className="flex gap-2 text-xs">
                <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-gray-600"><strong>Strategic Action Plan:</strong> Focus our Customer Success onboarding energy specifically on clients crossing the 120-day threshold, establishing automated milestone satisfaction calls.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABC product VIEW */}
      {analyticsView === "abc" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="abc-section">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#059669]">Catalog Prioritization</span>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                Product ABC Prioritization Catalog
              </h3>
              <p className="text-xs text-gray-400">Prioritizes inventory capital and sales training focusing strictly on products yielding cumulative revenue categories: Class A (75%), Class B (95%), Class C (remaining).</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b text-[10px] uppercase">
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-left">Product & Model</th>
                    <th className="p-3">Total Clean Rev</th>
                    <th className="p-3">Revenue Share</th>
                    <th className="p-3">Cumulative Rev %</th>
                    <th className="p-3 text-right">Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {abcProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800">{p.id}</td>
                      <td className="p-3 font-sans text-slate-700 text-left font-medium">{p.name}</td>
                      <td className="p-3 font-bold text-slate-800">${p.revenue.toLocaleString()}</td>
                      <td className="p-3 text-slate-500">{p.sharePct}%</td>
                      <td className="p-3 text-slate-500">{p.cumulativePct}%</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${p.badgeColor}`}>
                          Class {p.abcCategory}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-800 text-sm">Actionable ABC Class Tactics</h4>
            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg">
                <h5 className="font-bold text-rose-950 uppercase text-[9px] tracking-wide">Class A Core Controls</h5>
                <p className="text-[11px] text-rose-800 mt-1">Products represent standard cloud suites. Standardize pricing sheets globally; completely ban unilateral sales rep discounts above 5%.</p>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-lg">
                <h5 className="font-bold text-blue-950 uppercase text-[9px] tracking-wide">Class B Strategic Upgrades</h5>
                <p className="text-[11px] text-blue-800 mt-1">Middle tier consultation and cyber compliance. Create high-incentive commissions accelerators for reps to upsall class B models on top of standard software licenses.</p>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-lg">
                <h5 className="font-bold text-amber-950 uppercase text-[9px] tracking-wide">Class C Low-SLA Support</h5>
                <p className="text-[11px] text-amber-800 mt-1">Lower bracket hardware and low-margin licenses. Drastically reduce R&D support expenditures on Class C. Switch servicing to automated AI assistants.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
