/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AlertCircle, ArrowDownRight, ArrowUpRight, TrendingUp, Sparkles, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { businessInsights } from "../data";
import { BusinessInsight } from "../types";

export default function InsightsPortal() {
  const [selectedSeverity, setSelectedSeverity] = useState<"all" | "high" | "medium" | "low">("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "Revenue" | "Profitability" | "Customer Retention" | "Regional" | "Sales Reps">("all");
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const filteredInsights = businessInsights.filter(ins => {
    const matchesSev = selectedSeverity === "all" || ins.severity === selectedSeverity;
    const matchesCat = selectedCategory === "all" || ins.category === selectedCategory;
    return matchesSev && matchesCat;
  });

  const toggleExpand = (id: string) => {
    if (expandedInsight === id) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(id);
    }
  };

  return (
    <div className="space-y-6" id="insights-portal-root">
      {/* FILTER CONTROLS */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-emerald-600 w-4 h-4" />
              Strategic Business Insights Engine
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Filter 20 corporate discoveries auditing margin leakages, revenue retention, and operational quotas.</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full">
            {filteredInsights.length} Insights Loaded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Severity filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Action Severity Level</label>
            <div className="flex gap-1">
              {[
                { id: "all", label: "All Levels" },
                { id: "high", label: "🔴 High Priority" },
                { id: "medium", label: "🟡 Medium Priority" },
                { id: "low", label: "🟢 Low Cost" }
              ].map(sev => (
                <button
                  key={sev.id}
                  onClick={() => setSelectedSeverity(sev.id as any)}
                  className={`flex-1 text-center py-2 text-xs rounded-lg transition-all border font-medium ${
                    selectedSeverity === sev.id
                      ? "bg-slate-900 text-white border-slate-900 font-bold"
                      : "bg-white text-gray-500 border-gray-150 hover:bg-gray-50"
                  }`}
                >
                  {sev.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Focus Domain</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full bg-white border border-gray-150 rounded-lg py-2 px-3 text-xs font-semibold text-gray-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">🔍 Search All Business Areas</option>
              <option value="Revenue">Sales Revenue & Pipelines</option>
              <option value="Profitability">Net Profits & Cost Margins</option>
              <option value="Customer Retention">Client Retention & Loyaltys</option>
              <option value="Regional">Territory & Regional Growth</option>
              <option value="Sales Reps">Representative Performance</option>
            </select>
          </div>
        </div>
      </div>

      {/* FEED LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((ins) => {
          const isExpanded = expandedInsight === ins.id;
          
          let severityBadge = "bg-green-105 text-green-700 border-green-200";
          if (ins.severity === "high") severityBadge = "bg-rose-50 text-rose-700 border-rose-200 font-bold";
          else if (ins.severity === "medium") severityBadge = "bg-amber-50 text-amber-700 border-amber-200 font-semibold";

          return (
            <div
              key={ins.id}
              onClick={() => toggleExpand(ins.id)}
              className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                isExpanded ? "ring-2 ring-emerald-500 border-transparent shadow-md" : "border-gray-100 shadow-sm"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase border ${severityBadge}`}>
                    {ins.severity}
                  </span>
                  <span className="text-[10px] text-gray-450 uppercase font-mono tracking-wider">{ins.category}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-emerald-600 pr-4">
                    {ins.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-normal line-clamp-2">
                    {ins.observation}
                  </p>
                </div>
              </div>

              {/* Collapsed/Expanded Meta Drawer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                  Read Case Details 
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </span>
                <span className="text-[10px] text-gray-410 font-mono font-medium">{ins.id}</span>
              </div>

              {/* EXPANDABLE SECTION */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div className="p-3 bg-red-50 text-rose-950 rounded-lg border border-red-100 space-y-1">
                    <h5 className="font-bold text-[10px] uppercase tracking-wide flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Audited Financial Impact
                    </h5>
                    <p className="text-xs leading-relaxed">{ins.businessImpact}</p>
                  </div>

                  <div className="p-3 bg-emerald-50 text-emerald-950 rounded-lg border border-emerald-150 space-y-1">
                    <h5 className="font-bold text-[10px] uppercase tracking-wide flex items-center gap-1 text-emerald-800">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Executive Recommendation Actions
                    </h5>
                    <p className="text-xs leading-relaxed">{ins.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredInsights.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No discoveries matching active filters. Try resetting search parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
