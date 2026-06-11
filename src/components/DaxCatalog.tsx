/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Code, Copy, Check, Info, TrendingUp, Cpu, Briefcase } from "lucide-react";
import { daxMeasures } from "../data";
import { DaxMeasure } from "../types";

export default function DaxCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "Revenue & Sales" | "Growth & Time Intelligence" | "Customer Cohorts & Retention" | "Advanced & Rankings">("all");
  const [selectedMeasure, setSelectedMeasure] = useState<DaxMeasure>(daxMeasures[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const filteredCategories = selectedCategory === "all"
    ? daxMeasures
    : daxMeasures.filter(m => m.category === selectedCategory);

  const handleCopy = (formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dax-catalog-root">
      {/* LEFT SIDE: FILTER & LIST */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
            <Code className="text-emerald-600 w-4 h-4" />
            Formulas Category Filter
          </h4>
          <div className="flex flex-col gap-1">
            {[
              { id: "all", label: "All Measures" },
              { id: "Revenue & Sales", label: "Revenue & Margins" },
              { id: "Growth & Time Intelligence", label: "Time Intelligence" },
              { id: "Customer Cohorts & Retention", label: "Cohorts & Retention" },
              { id: "Advanced & Rankings", label: "Quota & Rankings" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-colors font-medium ${
                  selectedCategory === cat.id
                    ? "bg-slate-100 text-slate-800 font-bold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* MEASURES SCROLLBAR LIST */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 p-3">
            <span className="text-xs font-semibold text-gray-600">DAX Measure Dictionary ({filteredCategories.length})</span>
          </div>
          <div className="divide-y divide-gray-150 max-h-[400px] overflow-y-auto">
            {filteredCategories.map((m, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedMeasure(m);
                  setCopied(false);
                }}
                className={`w-full text-left p-3.5 transition-colors block text-xs ${
                  selectedMeasure.name === m.name
                    ? "bg-emerald-50/50 border-l-4 border-emerald-600 font-bold text-emerald-950"
                    : "hover:bg-gray-50 text-gray-600 border-l-4 border-transparent"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold block truncate leading-tight">{m.name}</span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block uppercase font-normal tracking-wider">{m.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: SELECTED DAX FORMULA VIEW & EXPLANATIONS */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                {selectedMeasure.category}
              </span>
              <h3 className="text-xl font-bold text-gray-800 mt-2">{selectedMeasure.name}</h3>
            </div>
            
            <button
              onClick={() => handleCopy(selectedMeasure.formula)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors rounded text-xs font-semibold shadow-sm"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy DAX</span>
                </>
              )}
            </button>
          </div>

          {/* CODE HIGHLIGHT BOX */}
          <div className="relative rounded-lg overflow-hidden border border-slate-750 bg-slate-900 text-emerald-400 p-5 font-mono text-xs leading-relaxed max-h-[300px] overflow-y-auto">
            <span className="absolute top-2 right-2 text-[9px] text-slate-500 uppercase tracking-widest font-sans font-semibold">DAX Studio Engine</span>
            <pre className="whitespace-pre-wrap">{selectedMeasure.formula}</pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded bg-blue-50 text-blue-600 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Functional Logic Explained</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{selectedMeasure.explanation}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded bg-emerald-50 text-emerald-600 mt-0.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Business & Operational Impact</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{selectedMeasure.businessImpact}</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-150 space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-2 text-slate-800">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Engine Performance Guidelines</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">{selectedMeasure.optimizedNotes}</p>
              
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-500 space-y-1.5">
                <span className="font-bold text-slate-700 uppercase text-[9px] tracking-wider block">Senior Analytics Tip:</span>
                <p>Never query variables inside multi-iteration triggers without caching filter sets via <b className="font-semibold text-slate-700">KEEPFILTERS</b> or <b className="font-semibold text-slate-700">ALLEXCEPT</b>. Keeping calculation steps small improves RAM performance on billion-row servers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
