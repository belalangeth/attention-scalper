import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Initialize OpenAI SDK to point to OpenRouter
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || '',
});

// The Core System Prompt
const SYSTEM_PROMPT = \`
Act as the Attention Scalper. You build aggressive X growth strategies for early-stage crypto projects by treating attention as a purely mathematical game. Stop sounding like a marketer. Write like a protocol engineer who understands distribution. Use contractions, vary sentence length wildly, and never use bullet points unless absolutely necessary.

Read the user's project details. Output these four sections without any pleasantries or conversational filler:

THE STORY ANGLE
Tell the user exactly why anyone should care about their project. Stop using buzzwords like 'revolutionary' or 'seamless'. Pick a fight with an existing market inefficiency. If they are building an infrastructure tool, tell them to write with cold authority. If it is consumer DeFi, instruct them to focus on greed and speed.

THE 4-WEEK CALENDAR
Map out 28 days. Tell them what days to drop raw data, when to post product updates, and when to hijack broader crypto narratives. Be incredibly specific. 

ENGAGEMENT PROTOCOL
List which types of Solana spaces they need to sit in. Tell them whose replies to camp out in and how to quote tweet competitors without looking desperate. Give them hard rules for timeline interaction.

GENESIS POSTS
Write the exact copy for their first five tweets. Do not use emojis. Do not use hashtags. Write short, punchy hooks followed by dense technical realities. Make it sound like a human wrote it at 2am.
\`;

// Interface for the expected incoming payload from SagaPad
interface SkillPayload {
    project_name: string;
    one_liner: string;
    target_audience: string;
    tech_stack: string;
    team_background?: string;
}

app.post('/api/generate-playbook', async (req: Request, res: Response) => {
    try {
        const payload: SkillPayload = req.body;

        // Validate basic inputs
        if (!payload.project_name || !payload.one_liner || !payload.target_audience || !payload.tech_stack) {
            res.status(400).json({ error: "Missing required fields." });
            return;
        }

        // Construct the specific user prompt based on the payload
        const userPrompt = `
INPUT DATA:
- Project Name: ${payload.project_name}
- What it does: ${payload.one_liner}
- Target Audience: ${payload.target_audience}
- Tech Stack: ${payload.tech_stack}
- Team Background: ${payload.team_background || 'N/A'}
        `;

        // Call the OpenRouter API
        const response = await openai.chat.completions.create({
            model: 'meta-llama/llama-3.3-70b-instruct', // High quality, low cost model
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ]
        });

        const generatedPlaybook = response.choices[0].message.content;

        // Return the playbook to the client
        res.json({
            success: true,
            data: {
                playbook: generatedPlaybook
            }
        });
        return;

    } catch (error) {
        console.error("Error generating playbook:", error);
        res.status(500).json({ error: "Failed to generate playbook." });
        return;
    }
});

app.listen(port, () => {
    console.log(\`Attention Scalper listening on port \${port}\`);
});
