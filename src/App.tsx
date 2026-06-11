/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  TrendingUp, BarChart, Database, Code, Lightbulb, GraduationCap, 
  Linkedin, Github, Users, Shield, Clock, BookOpen, User 
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import AdvancedAnalytics from "./components/AdvancedAnalytics";
import DataExplorer from "./components/DataExplorer";
import DaxCatalog from "./components/DaxCatalog";
import InsightsPortal from "./components/InsightsPortal";
import InterviewPrep from "./components/InterviewPrep";

export default function App() {
  const [currentSection, setCurrentSection] = useState<"dashboard" | "advanced" | "explorer" | "dax" | "insights" | "interview">("dashboard");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col antialiased">
      {/* ENTERPRISE BRAND HIGHLIGHT ANCHOR HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg text-white shadow shadow-emerald-500/30 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold font-sans tracking-tight text-white leading-none">AURA CORPLAN BI</h1>
                  <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Senior Analyst Portfolio</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">STAR-SCHEMA SALES KPI ENGINE • DAX STUDIO</p>
              </div>
            </div>

            {/* Senior Candidate Info Badge – Recruiter Target aligned */}
            <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
              <div className="text-right">
                <p className="text-white">Business Intelligence Project</p>
                <p className="text-[10px] text-slate-400 font-normal">Candidate: <span className="font-bold text-emerald-400">Senior Data Analyst</span></p>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <div className="flex gap-2">
                <span className="p-1.5 bg-slate-800 rounded border border-slate-700 text-slate-350" title="Secure Encrypted Pipeline">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </span>
                <span className="p-1.5 bg-slate-800 rounded border border-slate-700 text-slate-350" title="Last Updated In June 2026">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* PORTFOLIO APP SUB-NAV NAVIGATION BAR */}
      <nav className="bg-slate-950 text-white border-b border-slate-800 sticky top-16 z-30 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto whitespace-nowrap gap-1 h-12 items-center text-xs">
            
            {[
              { id: "dashboard", label: "Sales KPI Dashboard", icon: TrendingUp },
              { id: "advanced", label: "Advanced Analytics Engine", icon: BarChart },
              { id: "explorer", label: "Data Quality & Modeling", icon: Database },
              { id: "dax", label: "DAX Studio catalog", icon: Code },
              { id: "insights", label: "Actionable Insights brief", icon: Lightbulb },
              { id: "interview", label: "Portfolio & Interview kit", icon: GraduationCap }
            ].map(tab => {
              const IconObj = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentSection(tab.id as any)}
                  className={`py-2.5 px-4 font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    currentSection === tab.id
                      ? "bg-emerald-600 text-white font-bold shadow shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-820"
                  }`}
                  id={`nav-section-${tab.id}`}
                >
                  <IconObj className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}

          </div>
        </div>
      </nav>

      {/* PRIMARY MASTER HUB MAIN AREA */}
      <main className="flex-1 py-8 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PROGRESSIVE RENDERING CHANNELS */}
        {currentSection === "dashboard" && <Dashboard />}
        {currentSection === "advanced" && <AdvancedAnalytics />}
        {currentSection === "explorer" && <DataExplorer />}
        {currentSection === "dax" && <DaxCatalog />}
        {currentSection === "insights" && <InsightsPortal />}
        {currentSection === "interview" && <InterviewPrep />}

      </main>

      {/* FOOTER COLOFON */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-slate-200">Aura Corporate Sales Performance Dashboard</p>
            <p className="text-[10px] text-slate-450">B2B Financial Pipeline Analysis, ETL Data Deduplication Data Quality, and DAX Engine optimization project.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-slate-450 border border-slate-800 px-3 py-1 bg-slate-950 rounded font-mono text-[10px]">
              Candidate: B2B Business Intelligence Lead Specialist
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
