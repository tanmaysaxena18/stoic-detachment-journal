import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Generate reflection/commentary and tags for a given quote
app.post("/api/generate-post", async (req, res) => {
  try {
    const { quote, category } = req.body;
    if (!quote || !category) {
      return res.status(400).json({ error: "Quote and category are required." });
    }

    const ai = getAi();
    const systemPrompt = `You are a highly observant, analytical, and deeply reflective modern stoic writer and curator of "The Architecture of Detachment". Your voice is clinical, sharp, unsentimental, and profound. Avoid toxic positivity and cliché self-help jargon. Write as a modern stoic philosopher observing human nature. Use words related to systems, architecture, logic, stoicism, and psychology.`;

    const userPrompt = `Under the category "${category}", analyze the following quote:
"${quote}"

Generate:
1. Reflection: A brief 2 to 4 sentence deep, clinical, and analytical philosophical breakdown. Explain the harsh truth or strategic advantage hidden within it. Do not use emojis.
2. Tags: 3 to 5 relevant lowercase hashtags representing core stoic models or psychological principles (e.g., #detachment, #vulnerability-audit, #social-variables).`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reflection: {
              type: Type.STRING,
              description: "A 2 to 4 sentence clinical, analytical, and stoic reflection of the quote. Strictly 2 to 4 sentences."
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 relevant lowercase hashtag tags."
            }
          },
          required: ["reflection", "tags"]
        }
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    return res.json({
      success: true,
      data: {
        quote,
        category,
        reflection: parsed.reflection,
        tags: parsed.tags || []
      }
    });
  } catch (error: any) {
    console.error("Error in generate-post:", error);
    return res.status(500).json({ error: error.message || "Failed to generate post." });
  }
});

// 2. Generate a brand-new stoic quote, reflection, and tags
app.post("/api/generate-quote", async (req, res) => {
  try {
    const { category, topic } = req.body;
    if (!category) {
      return res.status(400).json({ error: "Category is required." });
    }

    const ai = getAi();
    const systemPrompt = `You are a highly observant, analytical, and deeply reflective modern stoic writer and creator of "The Architecture of Detachment". Your voice is clinical, sharp, unsentimental, and profound. Avoid toxic positivity and cliché self-help jargon. You specialize in crafting high-impact, original stoic quotes and dissecting human behavior.`;

    const userPrompt = `Generate a brand new, original quote for the pillar: "${category}"${topic ? ` on the topic: "${topic}"` : ""}.
The quote must perfectly mimic the analytical, clinical, and stoic style of "The Architecture of Detachment". Do not copy existing quotes. It should be punchy and highly objective.

Also generate:
1. Reflection: A brief 2 to 4 sentence deep, clinical commentary explaining the harsh truth or strategic utility hidden in this new quote.
2. Tags: 3 to 5 relevant lowercase hashtags.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: {
              type: Type.STRING,
              description: "A brand new, original, high-impact stoic quote under the specified pillar."
            },
            reflection: {
              type: Type.STRING,
              description: "A 2 to 4 sentence clinical, analytical, and stoic reflection of the quote. Strictly 2 to 4 sentences."
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 relevant lowercase hashtag tags."
            }
          },
          required: ["quote", "reflection", "tags"]
        }
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    return res.json({
      success: true,
      data: {
        quote: parsed.quote,
        category,
        reflection: parsed.reflection,
        tags: parsed.tags || []
      }
    });
  } catch (error: any) {
    console.error("Error in generate-quote:", error);
    return res.status(500).json({ error: error.message || "Failed to generate original quote." });
  }
});

// 3. Dialogue of the Mask: Generate a sharp "Internal Reality" response
app.post("/api/dialogue-mask", async (req, res) => {
  try {
    const { external } = req.body;
    if (!external) {
      return res.status(400).json({ error: "External Perspective text is required." });
    }

    const ai = getAi();
    const systemPrompt = `You are a philosophical content curator and stoic writer managing "The Architecture of Detachment". You excel at creating 'Dialogue of the Mask' entries, illustrating the stark contrast between social interactions and internal stoic rationality.`;

    const userPrompt = `Read the following external statement or question:
"${external}"

Generate a sharp, profound, and clinical "Internal Reality" response. It must expose the transaction, the fragility, or the rational perspective behind the external prompt. Mimic the style of:
- "Why are you so serious?" -> "Me: Wasn't she serious back then when she said, 'You'll regret it'?"
- "Someone asks: Why are you so silent?" -> "When did you ever see a tsunami coming from turbulent waters?"

Respond directly with the text representing the internal reflection. Do not include introductory or concluding remarks. Make it start with "Me: " or a direct philosophical thought. Keep it to 1-2 short sentences.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            internal: {
              type: Type.STRING,
              description: "The clinical and profound 'Internal Reality' response."
            }
          },
          required: ["internal"]
        }
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    return res.json({
      success: true,
      data: {
        external,
        internal: parsed.internal
      }
    });
  } catch (error: any) {
    console.error("Error in dialogue-mask:", error);
    return res.status(500).json({ error: error.message || "Failed to generate Dialogue of the Mask response." });
  }
});

// 4. Stoic Shield Exercise: Evaluate response detachment score and provide critique
app.post("/api/analyze-shield", async (req, res) => {
  try {
    const { scenario, userResponse } = req.body;
    if (!scenario || !userResponse) {
      return res.status(400).json({ error: "Scenario and userResponse are required." });
    }

    const ai = getAi();
    const systemPrompt = `You are a clinical psychologist and stoic philosopher. You specialize in auditing emotional vulnerability and coaching individuals on building an unassailable 'Inner Shield' of absolute detachment and rational self-reliance. Your tone is dry, extremely objective, analytical, and deeply constructive. Avoid coddling.`;

    const userPrompt = `Analyze the user's drafted reaction to an external shock:
Scenario: "${scenario}"
User's Planned Response: "${userResponse}"

Tasks:
1. Calculate a "Detachment Score" (integer from 0 to 100).
   - 100: Absolute stoicism, complete insulation from external opinions, impeccable logical analysis of variables, zero panic.
   - 0: Total emotional surrender, frantic external validation-seeking, self-pity, revenge obsession.
2. Provide a 3-4 sentence clinical critique. Highlight the vulnerability vectors or the logical strengths in their response. Offer clear, actionable advice on how they can upgrade their Inner Shield to insulate their mental focus from such external variables.`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detachmentScore: {
              type: Type.INTEGER,
              description: "An integer detachment score from 0 to 100."
            },
            analysis: {
              type: Type.STRING,
              description: "A clinical and psychological stoic critique of the response with sharp, constructive detachment advice."
            }
          },
          required: ["detachmentScore", "analysis"]
        }
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    return res.json({
      success: true,
      data: {
        detachmentScore: Number(parsed.detachmentScore),
        analysis: parsed.analysis
      }
    });
  } catch (error: any) {
    console.error("Error in analyze-shield:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze response." });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// Configure static hosting or Vite dev server based on environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
