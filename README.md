# Attention Scalper

An AI Agent Skill built for the **SagaPad Colosseum Hackathon Track**.

The Attention Scalper is an execution bot designed to generate deterministic, 4-week X (Twitter) growth playbooks for early-stage crypto and hackathon projects. It operates by treating social media attention as a quantifiable market, producing highly-engineered content strategies.

## Overview
This repository contains the backend Express API wrapper that powers the Attention Scalper Skill. It takes in project parameters (Tech Stack, One-Liner, Target Audience) and interfaces with OpenRouter to output a structured, multi-phase growth playbook.

**Topic Addressed:** Topic 1 — Hackathon Project Social Playbook Skill

## Features
- **Algorithmic Routing:** Automatically determines the correct narrative tone based on a project's tech stack.
- **Structured JSON Output:** Returns clean, parseable JSON instantly consumable by any frontend.
- **Docker Ready:** Includes a `Dockerfile` for instant, one-click deployment to Railway, Render, or AWS.
- **4-Week Scalping Calendar:** Generates a daily content schedule for the first month.
- **The Genesis Thread:** Writes the exact, word-for-word copy for a project's initial 5 launch posts.

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/belalangeth/attention-scalper.git
   cd attention-scalper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy the example file and add your OpenRouter API Key.
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Docker Deployment
To deploy using Docker, simply build and run the image:
```bash
docker build -t attention-scalper .
docker run -p 3000:3000 --env-file .env attention-scalper
```

## API Usage
The skill exposes a single POST endpoint to generate the playbook.

**Endpoint:** \`/api/generate-playbook\`
**Method:** \`POST\`
**Payload:**
```json
{
  "project_name": "Theta Scalper",
  "one_liner": "An automated high-frequency trading bot analyzing the first 120 seconds of a market window.",
  "tech_stack": "Python, Linux, Smart Contracts",
  "target_audience": "Algorithmic bot operators, high-frequency traders"
}
```

## Example Output (JSON)
*The Engine outputs strict, frontend-ready JSON without AI slop:*
```json
{
  "success": true,
  "data": {
    "story_angle": "Prediction markets are bleeding money to sentiment traders...",
    "four_week_calendar": [
      {
        "week": 1,
        "focus": "Deploy raw backtest data and architecture flexing."
      }
    ],
    "engagement_protocol": "Camp out in core MEV searcher replies. Quote tweet...",
    "genesis_posts": [
      "The market stops being deterministic exactly 120 seconds into a micro-trend...",
      "Standard RPC latency kills alpha before you even see the chart move..."
    ]
  }
}
```

## Built With
- Node.js & Express
- TypeScript
- `openai` (OpenRouter Integration)

## SagaPad Skill Link
[Insert your published SagaPad Skill link here]
