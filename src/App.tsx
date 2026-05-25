import React, { useState } from "react";
import { BrandHeader } from "./components/BrandHeader";
import { ConversationalWorkspace } from "./components/ConversationalWorkspace";
import { IdeaViabilityAssessment } from "./components/IdeaViabilityAssessment";
import { ImplementationRoadmap } from "./components/ImplementationRoadmap";
import { IssueTracker } from "./components/IssueTracker";
import { DashboardOverview } from "./components/DashboardOverview";
import { FooterCredits } from "./components/FooterCredits";
import { BusinessReport, Message, BusinessIssue, Milestone } from "./types";
import { LayoutDashboard, BrainCircuit, Calendar, ShieldAlert, Sparkles, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Pre-seeded high fidelity "Automated Urban Gardening" report
const initialReport: BusinessReport = {
  businessName: "UrbanFlora IoT Systems",
  category: "Cyber-Agtech / Smart Urban Farming",
  summary: "A connected consumer IoT hardware-plus-SaaS platform automating soil moisture telemetry and self-irrigation for urban residential gardeners.",
  overallScore: 84,
  viabilityDetails: {
    marketFit: {
      score: 86,
      analysis: "Strong demand among millennial and Gen-Z urban residency cohorts seeking botanical self-sustainability but lacking botanical experience. Addressable market volumes are expanding rapidly."
    },
    executionContext: {
      score: 78,
      analysis: "Supply chain pipeline and hardware manufacturing of modular cellular transceivers are the primary obstacles. Mitigated by outsourcing to experienced assembly vendors."
    },
    scalability: {
      score: 88,
      analysis: "High-margin repeat purchases on custom fertilizer capsule inserts, modular probes, and a premium analysis platform establish high client lifetime value (CLV)."
    }
  },
  roadmap: [
    {
      phaseName: "Phase 1: Lab Prototyping & Bench Testing",
      timeline: "Months 1-2",
      description: "Engineer mechanical sensor probes and test water-transceivers inside closed-loop indoor hydroponic basins.",
      tasks: [
        "Design cellular controller schematic layout and select power chipsets",
        "Assemble enclosure chassis prototype utilizing local 3D SLA printers",
        "Upload MQTT firmware establishing secure cellular handshakes"
      ]
    },
    {
      phaseName: "Phase 2: Pilot Group Sandbox Rollout",
      timeline: "Months 3-5",
      description: "Deploy 50 closed-beta sensors to residential greenhouses to collect real-time data & validate soil-moisture algorithms.",
      tasks: [
        "Build mobile companion user app with custom push notifications",
        "Manufacture low-volume beta batch of cellular controllers",
        "Integrate weather signals database mapping local scheduling algorithms"
      ]
    },
    {
      phaseName: "Phase 3: Supply Chain Validation & Capital Run",
      timeline: "Months 6-8",
      description: "Optimize unit production costs for volume assembly and secure institutional angel/seed funding rounds.",
      tasks: [
        "Consolidate tooling agreements with certified manufacturing vendors",
        "Launch crowdfunding customer validation campaign on Kickstarter",
        "Obtain radio emissions FCC/CE certifications for cellular chips"
      ]
    },
    {
      phaseName: "Phase 4: Commercial Expansion",
      timeline: "Months 9-12",
      description: "Go-to-market with specialized retail chains and nursery partnerships alongside automated soil nutrient subscription tiers.",
      tasks: [
        "Establish commercial supply lines to suburban nursery chains",
        "Introduce premium subscription tier providing plant disease diagnosing services",
        "Automate high-capacity assembly lines aiming for 10k units monthly"
      ]
    }
  ],
  issues: [
    {
      id: "risk_hardware_latency",
      title: "Supply-Chain Cellular Chipset Latency",
      category: "Operations",
      priority: "High",
      status: "Open",
      description: "Custom LTE transceiver chipsets are displaying volatile manufacture lead times. Solution: secure secondary source component layouts."
    },
    {
      id: "risk_corrosion",
      title: "Soil Electro-Corrosion on Brass Probes",
      category: "Technical",
      priority: "Medium",
      status: "In Progress",
      description: "Soil salinity quickly corrodes simple brass sensor contacts inside a month. Solution: transition specs to nickel or gold-plated contacts."
    },
    {
      id: "risk_power_decay",
      title: "Continuous Telemetry Battery Depletion",
      category: "Technical",
      priority: "Medium",
      status: "Open",
      description: "Continuous cellular broadcasting depletes battery life inside 35 days. Solution: code deep-sleep cycles sending metrics hourly."
    }
  ],
  milestones: [
    { id: "m1", title: "Micro-sensor Controller Schematics", status: "completed", targetDate: "Week 2" },
    { id: "m2", title: "Firmware MQTT Handshake Launch", status: "completed", targetDate: "Week 6" },
    { id: "m3", title: "Sandbox Mobile Device User Build", status: "in-progress", targetDate: "Week 12" },
    { id: "m4", title: "Obtain FCC/CE Compliance Clearances", status: "upcoming", targetDate: "Week 24" },
    { id: "m5", title: "Kickstarter Funding Campaign Launch", status: "upcoming", targetDate: "Week 36" }
  ]
};

// Initial Conversation Seed
const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: `සිරිල් online. 

I am **සිරිල්** (Cyril), your elite corporate consultant and business architect developed by Imagine Software. I specialize in the Veridian Synth methodology: combining organic development with digital precision.

Let's brainstorm your business concept and compile it into a market-ready structure. What raw business idea are we cooking up today?`,
    timestamp: "11:38 PM",
  },
  {
    id: "user-seed",
    role: "user",
    content: "I'm thinking of building a SaaS for automated urban gardening. It would use IoT sensors to monitor soil moisture, nutrients, and sunlight, then automatically trigger irrigation or provide specific care instructions via an app. Thoughts?",
    timestamp: "11:39 PM",
  },
  {
    id: "cyril-seed",
    role: "assistant",
    content: "That's a strong concept with clear market potential. The intersection of AgTech and smart home/urban living is growing rapidly. Here is a high-level breakdown of viability: Market Need, Operational Challenges...",
    timestamp: "11:39 PM",
  }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [report, setReport] = useState<BusinessReport>(initialReport);
  const [activeTab, setActiveTab] = useState<'viability' | 'roadmap' | 'issues'>('viability');
  const [isLoading, setIsLoading] = useState(false);
  const [showFloatingDashboard, setShowFloatingDashboard] = useState(false);
  
  // Custom interactive notifications and error bounds
  const [notice, setNotice] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);

  const triggerNotification = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 5500);
  };

  // State Updates from nested views
  const handleUpdateMilestone = (milestoneId: string, status: 'completed' | 'in-progress' | 'upcoming') => {
    const updatedMilestones = report.milestones.map((m) =>
      m.id === milestoneId ? { ...m, status } : m
    );
    setReport({ ...report, milestones: updatedMilestones });
    triggerNotification(`Milestone updated to ${status}.`, "success");
  };

  const handleUpdateReportScore = (newScores: { marketFit: number; executionContext: number; scalability: number }) => {
    const overall = Math.round((newScores.marketFit + newScores.executionContext + newScores.scalability) / 3);
    setReport({
      ...report,
      overallScore: overall,
      viabilityDetails: {
        marketFit: { ...report.viabilityDetails.marketFit, score: newScores.marketFit },
        executionContext: { ...report.viabilityDetails.executionContext, score: newScores.executionContext },
        scalability: { ...report.viabilityDetails.scalability, score: newScores.scalability },
      }
    });
  };

  const handleUpdateIssueStatus = (issueId: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    const updatedIssues = report.issues.map((i) =>
      i.id === issueId ? { ...i, status } : i
    );
    setReport({ ...report, issues: updatedIssues });
    triggerNotification(`Risk state transitioned to "${status}".`, "success");
  };

  const handleAddCustomIssue = (newIssue: Omit<BusinessIssue, 'id'>) => {
    const id = `idx_${Date.now()}`;
    const issue: BusinessIssue = { ...newIssue, id };
    setReport({ ...report, issues: [issue, ...report.issues] });
    triggerNotification(`Custom risk "${newIssue.title}" logged to tracker successfully.`, "success");
  };

  // Chat Submission Handler (Express API)
  const handleSendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive feedback from Cyril API.");
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn("Express server unconfigured or unavailable. Pivoting to Local Cyril Simulation Engine:", err);
      simulateCyrilResponse(text);
    } finally {
      setIsLoading(false);
    }
  };

  // High Fidelity Offline Simulation (Robust fallback)
  const simulateCyrilResponse = (text: string) => {
    setTimeout(() => {
      let reply = "";
      const lower = text.toLowerCase();
      
      if (lower.includes("garden") || lower.includes("plant") || lower.includes("agtech")) {
        reply = `Excellent continuation of our **UrbanFlora AgTech** concept. 

To take this from a raw idea to market-ready, we should examine the **sensor modular payload**. In typical residential environments, clients struggle with sensor distance nodes from the primary wifi router. 

I recommend offering a **hybrid LoRa/Bluetooth gateway** that relays metrics back to their home hub. This boosts our Market Fit score and resolves a critical technical bottleneck. 

Click **Compile Full Report** on the top right to regenerate these diagnostics in real-time!`;
      } else if (lower.includes("drone") || lower.includes("delivery")) {
        reply = `Intriguing logistics vision! **Drone delivery networks** contain highly promising unit economics, especially in localized organic medicines or rural distribution channels.

Key structural gates:
1. **Regulatory Clearances (FAA/CAA)**: Operating beyond visual line of sight (BVLOS) is heavily governed.
2. **Operational Battery Sinking**: Heavy payloads drain lithium-polymer cells quickly.

Let's compile this mandate. Click **Compile Full Report** above to watch me rebuild the full custom roadmap, viability dashboard, and operational issues log for this Drone initiative!`;
      } else {
        reply = `I have logged your concept: **"${text}"**. 

This is a fertile vision with high development potential. The market requires clean digital solutions in this space. 

Let's immediately compile your detailed comprehensive report! Click the **Compile Full Report** button on the top right of the Brainstorm workspace to watch my neural engine configure your Viability scores, Implementation roadmap, and Issue Logs!`;
      }

      const assistantMsg: Message = {
        id: `sim_${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      triggerNotification("Running on local Cyril Simulation engine (Offline fallback).", "info");
    }, 1200);
  };

  // Full Consulting Report Compilation (Express Report API)
  const handleGenerateReport = async () => {
    setIsLoading(true);
    triggerNotification("Cyril neural engine assembling custom business architecture. Formulating scores...", "info");

    const activeUserIdeas = messages.filter((m) => m.role === "user").map((m) => m.content);
    const lastUserIdea = activeUserIdeas[activeUserIdeas.length - 1] || "SaaS for automated urban gardening with IoT sensors";
    const contextSummary = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: lastUserIdea, contextSummary }),
      });

      if (!response.ok) {
        throw new Error("Report compilation failed.");
      }

      const data = await response.json();
      setReport(data);
      triggerNotification(`New report successfully compiled for ${data.businessName || "your concept"}!`, "success");
      // Smoothly focus user on newly built credentials
      setActiveTab('viability');
    } catch (err: any) {
      console.warn("Express report compiler failed. Launching Local high-fidelity simulation engine...", err);
      simulateReportCompilation(lastUserIdea);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulation of full report data generation (when offline or missing API Key)
  const simulateReportCompilation = (idea: string) => {
    setTimeout(() => {
      // Determine theme based on input keyword
      const isDrone = idea.toLowerCase().includes("drone");
      const title = isDrone ? "AeroMed Drone Networks" : "BioGrow Cyber-AgTech Systems";
      const category = isDrone ? "Autonomous Logistical Aviation" : "Cyber-AgTech / Intelligent BioComputing";
      const summary = isDrone 
        ? "Specialized BVLOS heavy-payload drone hubs delivering organic medications and localized health sensors within 30 minutes."
        : "A connected consumer IoT hardware-plus-SaaS platform automating soil moisture telemetry and self-irrigation for urban residential gardeners.";

      const simulatedReport: BusinessReport = {
        businessName: title,
        category,
        summary,
        overallScore: isDrone ? 79 : 85,
        viabilityDetails: {
          marketFit: {
            score: isDrone ? 80 : 88,
            analysis: isDrone
              ? "Extremely high need in remote, rural regional centers lacking critical medicine structures, but subject to volatile public airspace laws."
              : "Rapidly expanding cohort of urban millennial gardeners desirous of fresh microgreens but lacking general plant care awareness."
          },
          executionContext: {
            score: isDrone ? 68 : 80,
            analysis: isDrone
              ? "High capital overhead and severe aviation risk matrices. Requires licensing autonomous pilots and drone docking bay logistics."
              : "Moderate hardware assemblies and cellular network costs. Mitigated by designing standard modular circuit boards in Phase 1."
          },
          scalability: {
            score: isDrone ? 89 : 87,
            analysis: isDrone
              ? "Exemplary margin profiles once flight paths are stabilized. Repeat service subscription fees charged per local clinic node."
              : "High recurring revenue through custom mineral soil re-fills, software diagnostic charts, and cellular telemetry packages."
          }
        },
        roadmap: [
          {
            phaseName: "Phase 1: Lab Engineering & Regulatory Licensing",
            timeline: "Months 1-3",
            description: "Secure prototype test clearances and assemble standard component structures.",
            tasks: [
              isDrone ? "Submit flight airworthiness files to regional aviation boards" : "Design cellular controller PCB layouts and water valves",
              isDrone ? "Fabricate carbon-fiber fuselage and heavy motor enclosures" : "Assemble initial chassis enclosures via SLA 3D printers",
              isDrone ? "Calibrate autonomous GPS stabilization flight controllers" : "Upload lightweight MQTT cellular firmware"
            ]
          },
          {
            phaseName: "Phase 2: Beta Sandbox Trials",
            timeline: "Months 4-6",
            description: "Deploy pilot devices to local test participants to compile data logs.",
            tasks: [
              isDrone ? "Launch 5 closed delivery trails supplying local partner clinics" : "Deploy 50 closed sensor probes to volunteer greenhouses",
              isDrone ? "Deliver clinic dispatcher software companion packages" : "Build complete iOS/Android companion mobile application",
              isDrone ? "Validate automated safe landing algorithm parameters" : "Integrate intelligent Gemini forecast signals model"
            ]
          },
          {
            phaseName: "Phase 3: Production Supply Lines & Angel Rounds",
            timeline: "Months 7-9",
            description: "Secure volume logistics and trigger seed funding allocations.",
            tasks: [
              isDrone ? "Sign component supply agreements with aviation parts manufacturers" : "Sign bulk supply and assembly agreements with factory partners",
              isDrone ? "Launch crowdfunding program and target venture angel groups" : "Launch pre-orders Kickstarter program targeting 2,000 units",
              isDrone ? "Compile collision mitigation sensor safety logs for validation" : "Obtain complete CE and FCC radio certifications"
            ]
          },
          {
            phaseName: "Phase 4: Commercial Scaling",
            timeline: "Months 10-12",
            description: "Establish mass direct sales and wholesale expansion pipelines.",
            tasks: [
              isDrone ? "Trigger flight operations inside 3 regional county hubs" : "Integrate distribution lines inside home improvement retail centers",
              isDrone ? "Implement subscription medical transport dispatch schemas" : "Launch subscription nutrient refill plans for consumers",
              isDrone ? "Leverage telemetry routing to insurance partner frameworks" : "Adopt platform upgrades providing disease detection insights"
            ]
          }
        ],
        issues: [
          {
            id: "risk_hw_lead",
            title: isDrone ? "Avionics Airframe Vibration Fracture" : "Telemetry Cellular Controller Latency",
            category: "Technical",
            priority: "High",
            status: "Open",
            description: isDrone
              ? "Heavy structural vibrations trigger micro-fractures in carbon composite bodies. Solution: incorporate shock-absorbing brackets."
              : "Global LTE telemetry components are facing volatile supply chain durations. Solution: prepare dynamic dual alternative PCB frames."
          },
          {
            id: "risk_regulatory",
            title: isDrone ? "BVLOS Airspace Permit Approvals" : "Soil Probe Contact Corrosion",
            category: "Regulatory",
            priority: "High",
            status: "Open",
            description: isDrone
              ? "Aviation approvals for Beyond Flight Lines are notoriously slow. Solution: recruit certified aviation compliance lawyers to align logs."
              : "Standard copper sensor contacts rust when exposed to nutrient bases. Solution: transition specs to nickel or gold contacts."
          }
        ],
        milestones: [
          { id: "m1", title: isDrone ? "Airframe Structural Validation" : "PCB Controller Schematics Design", status: "completed", targetDate: "Month 1" },
          { id: "m2", title: isDrone ? "Autonomous GPS Calibration" : "Lightweight MQTT Handshake Launch", status: "completed", targetDate: "Month 3" },
          { id: "m3", title: isDrone ? "Clinic dispatch server link" : "Mobile App Testflight Rollout", status: "in-progress", targetDate: "Month 6" },
          { id: "m4", title: isDrone ? "Acquire FAA Part 135 Waivers" : "FCC/CE Regulatory Clearances", status: "upcoming", targetDate: "Month 9" }
        ]
      };

      setReport(simulatedReport);
      triggerNotification(`Offline simulator: compiled high-fidelity stats for ${simulatedReport.businessName}!`, "success");
      setIsLoading(false);
      setActiveTab('viability');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col justify-between selection:bg-cyber-primary selection:text-black">
      
      {/* Brand Header */}
      <BrandHeader onOpenDashboard={() => setShowFloatingDashboard(true)} isLoading={isLoading} />

      {/* Floating Alerts Container */}
      <div className="fixed top-20 right-6 z-50 pointer-events-none max-w-sm w-full space-y-2">
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-4 rounded-xl border pointer-events-auto flex gap-3 shadow-lg backdrop-blur-md ${
                notice.type === "success"
                  ? "bg-cyber-primary/10 border-cyber-primary/40 text-cyber-primary"
                  : notice.type === "error"
                  ? "bg-red-500/10 border-red-500/45 text-red-400"
                  : "bg-cyber-tertiary/10 border-cyber-tertiary/45 text-cyber-tertiary"
              }`}
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium leading-relaxed">{notice.message}</p>
                <p className="text-[10px] opacity-75 font-mono mt-1 font-semibold">Cyril System Event</p>
              </div>
              <button onClick={() => setNotice(null)} className="text-white hover:text-cyber-primary p-0.5 self-start cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Workspace Layout (Bento Grid) */}
      <main className="max-w-[1400px] w-full mx-auto p-4 md:p-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Conversational Brainstorming */}
        <section className="lg:col-span-6 xl:col-span-7 h-[760px] flex flex-col" id="brainstorm-workspace">
          <ConversationalWorkspace
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onGenerateReport={handleGenerateReport}
            hasReport={true}
          />
        </section>

        {/* Right Side: Interactive Reports & Diagnostics (Bento Grid Panels) */}
        <section className="lg:col-span-6 xl:col-span-5 flex flex-col gap-5 h-[760px] overflow-y-auto pb-6 scrollbar-thin pr-1" id="report-workspace">
          
          {/* Bento Card 1: Viability Assessment */}
          <div className="bg-[#0f1116] rounded-2xl border border-white/5 shadow-2xl overflow-hidden transition-all duration-300 hover:border-cyber-primary/25">
            <IdeaViabilityAssessment
              report={report}
              onUpdateReportScore={handleUpdateReportScore}
            />
          </div>

          {/* Bento Card 2: Implementation Roadmap */}
          <div className="bg-[#0f1116] rounded-2xl border border-white/5 shadow-2xl overflow-hidden transition-all duration-300 hover:border-cyber-tertiary/25">
            <ImplementationRoadmap report={report} />
          </div>

          {/* Bento Card 3: Strategic Bottlenecks / Issue Tracker */}
          <div className="bg-[#0f1116] rounded-2xl border border-white/5 shadow-2xl overflow-hidden transition-all duration-300 hover:border-red-500/25">
            <IssueTracker
              report={report}
              onUpdateIssueStatus={handleUpdateIssueStatus}
              onAddCustomIssue={handleAddCustomIssue}
            />
          </div>
        </section>
      </main>

      {/* Floating Quick Action Button (Dashboard Overlay open) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowFloatingDashboard(true)}
          className="w-14 h-14 rounded-full bg-cyber-primary hover:bg-cyber-primary text-black flex items-center justify-center hover:shadow-[0_0_25px_#00ff9d] shadow-lg animate-bounce hover:scale-110 active:scale-95 transition-all outline-none border-4 border-[#0a0b0d] cursor-pointer"
          title="Open Dashboard Overview"
        >
          <LayoutDashboard className="w-5.5 h-5.5" />
        </button>
      </div>

      {/* Floating Dashboard Overlay Overlay (Glassmorphism backdrop) */}
      <AnimatePresence>
        {showFloatingDashboard && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-lg w-full"
            >
              <DashboardOverview
                report={report}
                onUpdateMilestone={handleUpdateMilestone}
                isFloatingView={true}
                onCloseFloating={() => setShowFloatingDashboard(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Center Integrated Footer */}
      <FooterCredits />
    </div>
  );
}
