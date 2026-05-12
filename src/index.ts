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

Read the user's project details.

You MUST respond with ONLY a valid JSON object. Do not include any markdown formatting, backticks, or conversational text outside the JSON.
Follow this exact JSON schema:
{
  "story_angle": "Your analysis of the core story angle here.",
  "four_week_calendar": [
    { "week": 1, "focus": "..." },
    { "week": 2, "focus": "..." },
    { "week": 3, "focus": "..." },
    { "week": 4, "focus": "..." }
  ],
  "engagement_protocol": "Your timeline interaction rules here.",
  "genesis_posts": [
    "Tweet 1 text",
    "Tweet 2 text",
    "Tweet 3 text",
    "Tweet 4 text",
    "Tweet 5 text"
  ]
}
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
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ]
        });

        const rawContent = response.choices[0].message.content || '{}';
        
        let generatedPlaybook;
        try {
            // Remove markdown code blocks if the model accidentally included them
            const cleanJson = rawContent.replace(/^\`\`\`json\\n/, '').replace(/\\n\`\`\`$/, '');
            generatedPlaybook = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse JSON from LLM:", rawContent);
            generatedPlaybook = { error: "Failed to parse JSON from LLM", raw: rawContent };
        }

        // Return the playbook to the client
        res.json({
            success: true,
            data: generatedPlaybook
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
