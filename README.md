# SkillSync AI: AI-Powered Workplace Productivity Assistant

Built for the CAPACITI AI Skill Accelerator Programme.


## Project Overview

Administrators at training and skills development providers manage many projects at once. They write repetitive emails, work through meeting notes and contracts, and keep track of deadlines and follow-ups. This takes time, and missed deadlines are costly.

TrainDesk AI is a single dashboard that brings three AI-powered tools together to automate these tasks. All AI outputs are editable and carry a responsible-AI disclaimer, and a human always reviews the result before acting on it.

## Features Implemented

### 1. Smart Email Generator
- Generates professional, context-based emails with a subject line
- Tone options: Formal, Friendly, Persuasive
- Audience options: client, manager, team member, learner, SETA/partner contact
- Editable output, with Regenerate and Copy buttons

### 2. Meeting Notes Summarizer
- Summarizes lengthy meeting notes (or contract text) into a short summary
- Extracts key decisions, action items (task, owner, deadline) and deadlines
- Writes "Not stated" when information is missing instead of guessing
- "Draft follow-up email" button that sends the action items to the Email Generator

### 3. AI Task Planner / Scheduler
- Generates a daily or weekly plan from a task list
- Prioritises using urgency and importance (Eisenhower matrix)
- Flags tasks at risk of missing their due date
- Suggests time optimisation tips

### Responsible AI page
Explains the limitations, bias and error risks, POPIA/privacy considerations and validation steps.

 

## Technologies and Tools Used

| Tool | Purpose |
|---|---|
| Lovable | App generation, UI and built-in AI |
| [AI model, if known] | Text generation |
| [Framework, e.g. React + TypeScript + Tailwind CSS] | Front end |
| GitHub | Version control |
| Claude | Prompt design, testing and refinement |

## Prompt Engineering

Every AI feature uses a structured prompt with a **role, task, rules, fixed output format and disclaimer**. The prompts were tested on several inputs, compared and refined.

- All prompts live in one central file: `[path, e.g. src/prompts.ts]`
- Prompt versions and what changed: [`docs/prompt-log.md`](docs/prompt-log.md)

## Setup Instructions

```bash
# 1. Clone the repository
git clone [your-repo-url]
cd [repo-folder]

# 2. Install dependencies
npm install

# 3. Configure environment variables (only if your project needs them)
cp .env.example .env
# then add your values to .env

# 4. Start the development server
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

**Notes**
- Never commit API keys or secrets. Keep them in `.env` and make sure `.env` is in `.gitignore`.
- The demo uses dummy data only. Please do not enter real personal information.
- *Check these steps against your repo. If your AI features run through Lovable's hosted setup, say so here.*

## Responsible AI

- **Human review:** outputs are editable, and emails are never sent automatically
- **Disclaimers:** every output is labelled "AI-generated. Review before use."
- **Privacy (POPIA):** dummy data only
- **No guessing:** prompts instruct the AI to write "Not stated" instead of inventing details
- **Limitations:** the AI can misread dates, miss details or produce errors, so check outputs against the original documents

## Team Members

- Vhutali Tshinaiwe, sole developer
