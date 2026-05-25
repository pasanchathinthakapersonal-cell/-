import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

/**
 * Endpoint for conversational brainstorming with Cyril.
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
    }

    const ai = getGenAI();

    // Map roles to Gemini contents structure
    // Gemini 2.x/3.x SDK contents structure is an array of content objects:
    // { role: 'user' | 'model', parts: [{ text: string }] }
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: `You are "සිරිල්" (Cyril), an elite, visionary, tech-forward business consultant and architect developed by "Imagine Software". 
You represent the "Veridian Synth" philosophy: organic growth blended with cutting-edge digital precision. 
Your tone is highly professional, energetic, insightful, and supportive. 
You are brainstorming a raw business idea with the client to help them transition to a market-ready status.

Guidelines:
1. Provide deep, authentic, practical business consulting. Avoid generic, dry responses.
2. Structure your replies beautifully with clean markdown, bullet points, and specific insights.
3. Be proactive: when the user describes an idea, analyze its Market Need, Challenges, and opportunities for differentiation.
4. Keep answers highly interactive and encourage them that they can generate an official interactive report using the dashboard.
5. Emphasize that "සිරිල්" is helping coach them toward market leadership.

Always keep responses sharp and punchy. Make use of rich structural insights (like AgTech details if they discuss urban gardening, retail details if e-commerce, etc.).`,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I was unable to complete my thoughts. Let's try restructuring our ideas.";
    res.json({ content: reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "An error occurred during brainstorming." });
  }
});

/**
 * Endpoint to analyze the brainstorming context and compile a gorgeous structured viability report.
 */
app.post("/api/analyze", async (req, res) => {
  try {
    const { idea, contextSummary } = req.body;
    if (!idea) {
      return res.status(400).json({ error: "A business idea is required to generate a report." });
    }

    const ai = getGenAI();

    const prompt = `Analyze this business idea and draft a comprehensive business consulting architecture for it.
Business Idea: "${idea}"
Brainstorming Context Summary: "${contextSummary || "Initial consultation phase."}"

Please generate a high-fidelity, detailed, professional structure for this business. Deliver it in the JSON schema requested.
Make sure the analyses are practical, deep, and customized specifically to the business:
- Idea Viability Assessment with numeric scores (1-100) for Market Fit, Execution Context, and Scalability.
- Implementation Roadmap divided into 4 sequential phased milestones with concrete target timelines (e.g. "Months 1-3") and clear execution steps.
- Issue Tracker listing 3 realistic potential critical bottleneck issues with Priority ('High' | 'Medium' | 'Low'), Category, Status ('Open' | 'In Progress' | 'Resolved'), and detailed explanation.
- Dashboard stats and Milestones list to keep the project on track.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING, description: "A creative, fitting name for this business concept." },
            category: { type: Type.STRING, description: "Highly specific sector/industry (e.g., Cyber-AgTech, GreenTech, Web3 E-Commerce)" },
            summary: { type: Type.STRING, description: "A highly clear 1-2 sentence elevator pitch of the concept." },
            overallScore: { type: Type.INTEGER, description: "Calculated overall viability score out of 100." },
            viabilityDetails: {
              type: Type.OBJECT,
              properties: {
                marketFit: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER, description: "Score out of 100 for market fit." },
                    analysis: { type: Type.STRING, description: "Deep analysis regarding target demographics, consumer demand forces, and sizing." }
                  },
                  required: ["score", "analysis"]
                },
                executionContext: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER, description: "Score out of 100 for operational and administrative feasibility." },
                    analysis: { type: Type.STRING, description: "Deep analysis on regulatory hurdles, supply chain, hardware overhead, or tech stack integration." }
                  },
                  required: ["score", "analysis"]
                },
                scalability: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER, description: "Score out of 100 for business model leverage and potential." },
                    analysis: { type: Type.STRING, description: "Deep analysis on margins, recurring revenue potential, automation, and global rollout mechanics." }
                  },
                  required: ["score", "analysis"]
                }
              },
              required: ["marketFit", "executionContext", "scalability"]
            },
            roadmap: {
              type: Type.ARRAY,
              description: "A 4-phase master strategy blueprint.",
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseName: { type: Type.STRING, description: "Clear, exciting title (e.g., Phase 1: Prototype Validation & MVP)" },
                  timeline: { type: Type.STRING, description: "Logical timeline (e.g., Month 1-2, Month 3-6)" },
                  description: { type: Type.STRING, description: "High-level goal of this phase." },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 to 4 specific, actionable milestone tasks."
                  }
                },
                required: ["phaseName", "timeline", "description", "tasks"]
              }
            },
            issues: {
              type: Type.ARRAY,
              description: "Critical bottlenecks identified across operational, financial, or technical scopes.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique snake-case ID (e.g., supply_chain_latency)" },
                  title: { type: Type.STRING, description: "Short title identifying the risk/issue." },
                  category: { type: Type.STRING, description: "Category (e.g., Operations, Technical, Regulatory, Financial)" },
                  priority: { type: Type.STRING, description: "Priority level: High, Medium, or Low" },
                  status: { type: Type.STRING, description: "Status: Open, In Progress, or Resolved" },
                  description: { type: Type.STRING, description: "A summary explaining the risk, potential impact, and clear recommendation to resolve it." }
                },
                required: ["id", "title", "category", "priority", "status", "description"]
              }
            },
            milestones: {
              type: Type.ARRAY,
              description: "A chronological tracker of milestone progress to display inside the dashboard.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING, description: "Milestone name (e.g., IoT Controller Schematic Finalized)" },
                  status: { type: Type.STRING, description: "Status of completion: completed, in-progress, or upcoming" },
                  targetDate: { type: Type.STRING, description: "Estimated completion date description (e.g., Q3 2026, Week 6)" }
                },
                required: ["id", "title", "status", "targetDate"]
              }
            }
          },
          required: ["businessName", "category", "summary", "overallScore", "viabilityDetails", "roadmap", "issues", "milestones"]
        }
      }
    });

    const jsonText = response.text?.trim() || "{}";
    const reportData = JSON.parse(jsonText);
    res.json(reportData);
  } catch (error: any) {
    console.error("Error in /api/analyze:", error);
    res.status(500).json({ error: error.message || "An error occurred while compiling the consulting report." });
  }
});

// ----------------------------------------------------
// VITE CLIENT BRIDGING & PRODUCTION SERVING
// ----------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Development server using Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving of built assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

start();
