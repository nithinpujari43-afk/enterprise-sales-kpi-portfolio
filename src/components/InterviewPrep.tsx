/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Briefcase, FileText, BookOpen, Linkedin, Github, Play, Pause, RotateCcw, 
  Search, ChevronDown, ChevronUp, Copy, CheckCircle, Award, Target, MessageSquare 
} from "lucide-react";
import { interviewQuestions, executiveSummary } from "../data";

export default function InterviewPrep() {
  const [activePrepTab, setActivePrepTab] = useState<"elevator" | "questions" | "portfolio">("elevator");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Elevator Pitch state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [pitchTimeLeft, setPitchTimeLeft] = useState<number>(120); // 2 minutes (120 seconds)
  const [activePitchSection, setActivePitchSection] = useState<number>(0);

  // Q&A state
  const [searchQuestion, setSearchQuestion] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Copy helper
  const triggerCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Elevator pitch sections pacing
  const pitchSections = [
    {
      title: "The Hook & The Problem (0 - 30s)",
      guide: "Hook them by asserting immediate business scale. Highlight that you solved double billing and margin dilution.",
      script: `"For my latest business intelligence project, I acted as a Senior Data Analyst to resolve a critical 'Revenue Illusion' inside a B2B technology company. The raw CRM invoicing data was plagued with duplicate transactions and negative value anomalies worth fifty-two thousand dollars in billing leaks. Simultaneously, the company faced a severe blind spot: seventy-three percent of global sales were concentrated in just three massive anchor clients."`
    },
    {
      title: "The ETL Pipeline & Star Schema (30 - 60s)",
      guide: "Transition into your technical skills. Explain your database logic, cleaning methods, and data modeling.",
      script: `"To solve this, I designed a robust Star Schema data model separating transactions into a central Fact Sales table, connected to five surrounding dimension tables. I engineered an ETL pipeline that programmatically resolved primary key duplications, imputed missing prices, and standardized UTC temporal indexes. This optimized structure enabled lightning-fast memory-columnar lookups, protecting the model from cyclic dependency issues."`
    },
    {
      title: "DAX Measures & Advanced Analytics (60 - 90s)",
      guide: "Highlight your formulas and strategy. Keep it grounded in mathematical disciplines.",
      script: `"I formulated optimized DAX measures utilizing variable-caching to track month-over-month growth and cohort retention. I then conducted an advanced Pareto Concentration analysis and a Cohort Loyalty matrix. This revealed that while our South Region was hitting high physical unit sales, its net operating margin was eroded to just sixteen percent because sales representatives were giving massive hardware discounts."`
    },
    {
      title: "The Strategic Recommendations & Impact (90 - 120s)",
      guide: "End with maximum impact. Deliver high-level recommendations that saved money.",
      script: `"I delivered four executive recommendations: first, establishing a strict thirty-five percent software attachment floor on appliance deals; second, shifting outbound prospecting resources to the higher-margin Mid-Market sector. My analysis successfully plugged forty-two thousand dollars in pipeline leaks, identified one hundred and twenty thousand dollars in operational overhead savings, and created a roadmap to lift long-term gross margins from fifty-four percent to seventy-six percent."`
    }
  ];

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && pitchTimeLeft > 0) {
      interval = setInterval(() => {
        setPitchTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 120;
          }
          // Shift sections based on elapsed time milestones
          const elapsed = 120 - (prev - 1);
          if (elapsed < 30) setActivePitchSection(0);
          else if (elapsed < 60) setActivePitchSection(1);
          else if (elapsed < 90) setActivePitchSection(2);
          else setActivePitchSection(3);

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, pitchTimeLeft]);

  const handleResetPitch = () => {
    setIsPlaying(false);
    setPitchTimeLeft(120);
    setActivePitchSection(0);
  };

  // Filter Q&As list
  const filteredQuestions = interviewQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuestion.toLowerCase()) || 
                          q.answer.toLowerCase().includes(searchQuestion.toLowerCase());
    const matchesPhase = selectedPhase === "all" || q.phase === selectedPhase;
    return matchesSearch && matchesPhase;
  });

  // Resume Bullet Points template
  const resumeBullets = `• Engineered an enterprise sales data analytics pipeline using a Star Schema model, connecting a central sales table with 5 dimension tables to eliminate query drag for executive dashboards.
• Audited raw billing invoices to programmatically correct primary key duplications, missing price entries, and negative outliers, reclaiming $42.5K in immediate pipeline leaks.
• Formulated highly optimized DAX measures (using VAR-caching and DIVIDE) to analyze YoY revenue acceleration, average order values (AOV), and customer retention cohorts.
• Conducted strategic 80/20 Pareto and Cohort Loyalty evaluations to identify margin erosion in legacy divisions, prompting a software-cross-selling plan to lift corporate margins from 54% to 76%.`;

  // LinkedIn text snippet
  const linkedinPost = `🌟 I acted as a Senior Data Analyst to clean, model, and analyze $870K in B2B transactions.

🔍 Core Discoveries:
1️⃣ High Revenue vs. Low Margin Erosion: Handled a 'Revenue Illusion' in our South territory where excessive hardware discounts dragged margin down to 16.2%.
2️⃣ Customer Concentration Vulnerability: Uncovered that 3 anchor accounts contributed 73.4% of total pipeline.
3️⃣ Data Integrity Leakages: Plugged $42.5K in invoice duplication, missing coordinates, and billing anomalies.

🛠️ Technical Stack & Achievements:
• Data warehousing & Star Schema modeling
• Advanced ETL Data Pipeline Audit
• High-performance optimized DAX measures (MoM growth, running YTD)
• Interactive Pareto & Cohort Retention matrices

🔗 Checkout my complete Sales KPI Portfolio and Interview Prep Center project here! 
#DataAnalytics #BusinessIntelligence #PowerBI #SQL #DataScience`;

  return (
    <div className="space-y-6" id="interview-prep-root">
      {/* Tab Menu Header */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-205 max-w-lg">
        {[
          { id: "elevator", label: "2-Min Practice Trainer", icon: Play },
          { id: "questions", label: "20 Interview Q&As", icon: MessageSquare },
          { id: "portfolio", label: "Resume & Portfolio Kit", icon: FileText }
        ].map(tab => {
          const IconObj = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePrepTab(tab.id as any)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activePrepTab === tab.id
                  ? "bg-white text-slate-800 shadow"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <IconObj className="w-3.5 h-3.5 text-emerald-600" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2-MINUTE ELEVATOR PITCH TRAINER */}
      {activePrepTab === "elevator" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="elevator-pitch-panel">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#34d399] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  recruiter interview simulation play-along
                </span>
                <h3 className="text-lg font-bold mt-1 text-white">The Perfect 2-Minute Elevator Pitch</h3>
              </div>

              {/* Countdown Timer Display */}
              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <p className="text-[9px] text-slate-400 uppercase leading-none">pacing timer</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {Math.floor(pitchTimeLeft / 60)}:{(pitchTimeLeft % 60).toString().padStart(2, "0")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors rounded-lg text-emerald-400"
                    title={isPlaying ? "Pause Trainer" : "Start Speech Trainer"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-emerald-400" />}
                  </button>
                  <button
                    onClick={handleResetPitch}
                    className="p-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors rounded-lg text-slate-400"
                    title="Reset Trainer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* PROGRESS STAGES GRID */}
            <div className="grid grid-cols-4 gap-2">
              {pitchSections.map((sec, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePitchSection(idx);
                    // Set correct timer benchmarks based on selected section
                    if (idx === 0) setPitchTimeLeft(120);
                    else if (idx === 1) setPitchTimeLeft(90);
                    else if (idx === 2) setPitchTimeLeft(60);
                    else if (idx === 3) setPitchTimeLeft(30);
                  }}
                  className={`py-1.5 px-2 text-center rounded text-[10px] uppercase font-bold tracking-wider transition-all border ${
                    activePitchSection === idx 
                      ? "bg-emerald-600 border-emerald-500 text-white" 
                      : "bg-slate-820 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sec {idx + 1}
                </button>
              ))}
            </div>

            {/* THE PRESENTATION SCRIPT CARD */}
            <div className="bg-slate-820 border border-slate-750 p-6 rounded-xl space-y-4 relative min-h-[180px] flex flex-col justify-between">
              <span className="absolute top-2.5 right-3 text-[9px] uppercase font-bold tracking-widest text-slate-400">
                Active Chapter Script
              </span>
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-[#34d399] tracking-wide block uppercase">
                  {pitchSections[activePitchSection].title}
                </span>
                <p className="text-sm text-slate-100 font-sans leading-relaxed tracking-wide italic">
                  {pitchSections[activePitchSection].script}
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-750 text-[11px] text-slate-400 rounded-lg flex items-start gap-2">
                <span className="font-extrabold text-[#34d399] uppercase text-[9px] tracking-wider block mt-0.5 shrink-0">coaching tip:</span>
                <p>{pitchSections[activePitchSection].guide}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-800 text-sm">Recruiter Storytelling Framework</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Use the <b>STAR (Situation, Task, Action, Result)</b> framework. Below is a structured layout of what high-tier consultants (Deloitte, McKinsey, PwC) expect when validating projects.
            </p>

            <div className="space-y-3 pt-2 max-h-[350px] overflow-y-auto pr-1">
              {[
                { title: "Situation / Business Case", desc: executiveSummary.problem },
                { title: "Methodology & Task", desc: executiveSummary.methodology },
                { title: "Key Discoveries & Findings", desc: executiveSummary.findings },
                { title: "Resolutions & Operations", desc: executiveSummary.recommendations },
                { title: "Total Business Value Realized", desc: executiveSummary.valueCreated }
              ].map((step, idx) => (
                <div key={idx} className="border-b pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Target className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                    {step.title}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 20 INTERACTIVE INTERVIEW QUESTIONS & ANSWERS */}
      {activePrepTab === "questions" && (
        <div className="space-y-4" id="questions-and-answers-panel">
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute top-3 left-3" />
              <input
                type="text"
                placeholder="Search Questions and Answers (e.g., Star Schema, DIVIDE)..."
                value={searchQuestion}
                onChange={(e) => setSearchQuestion(e.target.value)}
                className="w-full bg-slate-50 border border-gray-150 py-2 pl-9 pr-4 rounded-lg text-xs placeholder-gray-410 focus:outline-none focus:border-emerald-600 font-semibold"
              />
            </div>
            
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="bg-white border border-gray-150 py-2 px-3 rounded-lg text-xs text-gray-700 font-semibold focus:outline-none focus:border-emerald-600"
            >
              <option value="all">📚 All Concept Topics</option>
              <option value="Data Analytics Concepts & Star Schema">Modeling & Star Schema</option>
              <option value="Data Quality & ETL">Data Quality & ETL Systems</option>
              <option value="DAX Optimization">DAX & Memory Optimizations</option>
              <option value="Time Intelligence">Temporal Time Intelligence</option>
              <option value="Business Analytics & Strategy">Business Strategy & KPIs</option>
              <option value="Advanced Analytics">Complex Advanced Analytics</option>
              <option value="Customer Retention Metrics">Customer Loyalty Metrics</option>
            </select>
          </div>

          {/* QUESTIONS ACCORDION LIST */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => {
              const isOpen = expandedQuestion === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setExpandedQuestion(isOpen ? null : q.id)}
                  className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                    isOpen ? "ring-2 ring-emerald-500 border-transparent shadow shadow-emerald-50" : "border-gray-100 hover:shadow-sm"
                  }`}
                >
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider">Q{q.id.toString().padStart(2, "0")}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {q.phase}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm leading-snug mt-1">
                        {q.question}
                      </h4>
                    </div>
                    <div className="p-1 rounded bg-slate-50 border border-slate-150 text-slate-500 mt-1 shrink-0">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-4 bg-slate-50/50" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-1.5">
                        <span className="block text-[10px] uppercase font-bold text-emerald-700 tracking-wider">The Standard Pitch Answer:</span>
                        <p className="text-xs text-gray-600 leading-relaxed font-sans">{q.answer}</p>
                      </div>

                      <div className="p-3 bg-emerald-50 text-emerald-950 border border-emerald-150 rounded-lg flex items-start gap-2 text-[11px] leading-relaxed">
                        <span className="font-extrabold text-emerald-800 uppercase text-[9px] tracking-wider block shrink-0 mt-0.5">interviewer tip:</span>
                        <p>{q.interviewerTips}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-400">No questions match active keywords or phase filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESUME & PORTFOLIO COPY KIT */}
      {activePrepTab === "portfolio" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="portfolio-kit-panel">
          {/* RESUME BULLETS */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <FileText className="text-emerald-600 w-4.5 h-4.5" />
                  Target Resume Accomplishments Bullets
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Designed to clear applicant tracking filters (ATS) at firms like Deloitte, PwC, KPMG.</p>
              </div>

              <button
                onClick={() => triggerCopy(resumeBullets, "resume")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors rounded text-xs font-semibold shadow-sm"
              >
                {copiedText === "resume" ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Bullets</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs font-mono leading-relaxed text-slate-700 pr-2 max-h-[300px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">{resumeBullets}</pre>
            </div>
          </div>

          {/* LINKEDIN POST COPIER */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <Linkedin className="text-blue-600 w-4.5 h-4.5" />
                  Standard LinkedIn Case Post Copier
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Post this case to draw positive recruiter profile interactions.</p>
              </div>

              <button
                onClick={() => triggerCopy(linkedinPost, "linkedin")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors rounded text-xs font-semibold shadow-sm"
              >
                {copiedText === "linkedin" ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Post</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs font-sans leading-relaxed text-slate-600 pr-2 max-h-[300px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-xs [word-break:break-word]">{linkedinPost}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
