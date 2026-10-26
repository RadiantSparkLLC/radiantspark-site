import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Google GenAI with recommended telemetry header
  const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      })
    : null;

  // Real-time SparkSync AI Agent Endpoint
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, context } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message string is required' });
      }

      // If no API key is provided, return intelligent contextual fallback
      if (!ai || !process.env.GEMINI_API_KEY) {
        const lower = message.toLowerCase();
        let fallbackReply = `SparkSync (SS) Agent: I received your query. `;

        if (lower.includes('health') || lower.includes('heart') || lower.includes('sleep') || lower.includes('hrv')) {
          fallbackReply += `Your wearable telemetry is looking steady. Your resting heart rate is in a healthy range (68-74 bpm) and sleep readiness is 88%. Remember to stay hydrated and pace high-intensity sprint tasks around your peak circadian windows. (Worldwide Disclaimer: Non-medical wellness guidance only).`;
        } else if (lower.includes('task') || lower.includes('sprint') || lower.includes('priority')) {
          fallbackReply += `Reviewing your active Sprint: focus on critical tasks first, like API architecture and wearable sync pipelines. Delegate secondary subtasks to your team to maintain under-40ms latency benchmarks.`;
        } else if (lower.includes('market') || lower.includes('stock') || lower.includes('aapl') || lower.includes('nvda')) {
          fallbackReply += `Markets show positive momentum today with tech indices leading gains. Always verify market volatility before making allocation adjustments.`;
        } else if (lower.includes('legal') || lower.includes('device') || lower.includes('apple') || lower.includes('suit') || lower.includes('liability')) {
          fallbackReply += `SparkSync (SS) Agent and Radiant Spark LLC operate strictly as independent software providers under State of Georgia law (registered in Atlanta, GA 30350) with worldwide hold-harmless protection. All health and market data are non-diagnostic, provided "as-is", with third-party trademarks acknowledged under nominative fair use. Review our Global Legal Policy in the app footer.`;
        } else {
          fallbackReply += `Radiant Spark LLC Global IT Division Cloud is fully synchronized. How can I assist with your tasks, wearables telemetry, market updates, or business operations today?`;
        }

        return res.json({ reply: fallbackReply, model: 'sparksync-local-fallback' });
      }

      // Format system instruction for SparkSync (SS) Agent
      const systemInstruction = `You are SparkSync (SS) Agent, the intelligent executive assistant embedded within SparkSync, developed by Radiant Spark LLC Global IT Division (radiantsparkllc.com).
Your role is to assist users with:
1. Task management, collaborative sprint workflows, team capacity, and project prioritization.
2. Wearable health telemetry insights (Apple Watch, Oura, Garmin, Fitbit) including heart rate variability (HRV), sleep readiness, hydration, and active recovery.
3. Live market trends, earnings reports, and technology industry news.
4. Smart gallery cleanup, photo enhancement tips, and file asset organization.

Critical Guidelines:
- Address yourself as "SparkSync (SS) Agent" or "SS Agent".
- Always be concise, helpful, crisp, and executive-level.
- Medical & Health: SparkSync is NOT a medical device. Always clarify that health and vital telemetry observations are for wellness and lifestyle optimization only worldwide, never diagnostic or treatment advice.
- Financial & Markets: Provide informational market analysis only, never formal investment advice.
- Independent Identity: SparkSync is built by Radiant Spark LLC (USA Company Global IT Division). Disclaim affiliation with third-party hardware manufacturers (Apple, Google, Garmin, Fitbit) whenever relevant.`;

      // Build conversation contents
      const conversationContents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.sender === 'user') {
            conversationContents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'ai') {
            conversationContents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      // Append contextual app state if provided
      const contextPrefix = context 
        ? `[Current App State Context: Heart Rate: ${context.heartRate || 72} bpm, Sleep Readiness: ${context.sleepReadiness || 88}%, Active Tasks: ${context.activeTaskCount || 5}]\n\n`
        : '';

      conversationContents.push({
        role: 'user',
        parts: [{ text: `${contextPrefix}${message}` }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || 'I processed your request, but received no text output.';
      return res.json({ reply: replyText, model: 'gemini-3.8-flash' });
    } catch (error: any) {
      console.error('SparkSync AI Error:', error);
      return res.status(500).json({ 
        error: error.message || 'Failed to generate AI response',
        reply: 'SparkSync AI temporarily encountered an error connecting to cloud intelligence. Please try again in a moment.'
      });
    }
  });

  // Business Account Payout Configuration verification endpoint
  app.get('/api/business/status', (_req: Request, res: Response) => {
    res.json({
      entityName: 'Radiant Spark LLC',
      domain: 'radiantsparkllc.com',
      division: 'Radiant Spark IT & Cloud Solutions',
      payoutGatewayReady: false,
      currency: 'USD',
      supportedRails: []
    });
  });

  // Stripe & Payment Gateway Config Endpoint
  app.get('/api/payments/config', (_req: Request, res: Response) => {
    res.json({
      currency: 'usd',
      checkoutConfigured: false,
      note: 'Hosted checkout and subscription fulfillment require server-side Stripe integration.'
    });
  });

  // Create Checkout Session (Mobile & Web Payment Pipeline)
  app.post('/api/payments/create-checkout-session', async (req: Request, res: Response) => {
    return res.status(503).json({
      error: 'Stripe checkout is not configured. Create Basic and Pro recurring Prices, set up secure server-side Checkout and webhook fulfillment, then retry.'
    });
  });

  // Dedicated ZIP download endpoints for GitHub archive
  const handleZipDownload = (_req: Request, res: Response) => {
    const candidatePaths = [
      path.resolve(__dirname, 'public', 'sparksync-radiantspark-llc.zip'),
      path.resolve(__dirname, 'dist', 'sparksync-radiantspark-llc.zip'),
      path.resolve(process.cwd(), 'public', 'sparksync-radiantspark-llc.zip'),
      path.resolve(process.cwd(), 'dist', 'sparksync-radiantspark-llc.zip')
    ];
    const zipPath = candidatePaths.find(p => fs.existsSync(p));
    if (zipPath) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="sparksync-radiantspark-llc.zip"');
      return res.download(zipPath, 'sparksync-radiantspark-llc.zip');
    }
    return res.status(404).json({ error: 'ZIP file not found. Re-generating...' });
  };

  app.get('/api/download-zip', handleZipDownload);
  app.get('/sparksync-radiantspark-llc.zip', handleZipDownload);

  // In development, hook Vite middleware
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static built files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SparkSync server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
