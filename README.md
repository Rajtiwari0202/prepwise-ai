# AI Interview Simulator Platform

Open-source AI interview practice platform for students and job seekers. The product is built as a serious interview lab / career cockpit with DSA, HR, resume-based, and mixed interview modes.

## Features

- AI interviewer with provider abstraction
- Free default mock AI provider, no paid API required
- Optional Gemini provider through environment variables
- Browser voice input with `SpeechRecognition`
- Browser voice output with `SpeechSynthesis`
- DSA, HR, resume-based, and mixed interview modes
- Resume/profile context for question generation
- Structured answer evaluation
- Feedback report with weakness analysis
- Interview history dashboard
- Custom JWT authentication with HTTP-only cookies
- MongoDB data model with Mongoose

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MongoDB and Mongoose
- Custom JWT auth
- Zod validation
- Browser speech APIs
- Optional Google Gemini free-tier provider

OpenAI is intentionally not included.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update the values.

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/interview_ai
JWT_SECRET=replace-with-a-long-random-secret
AI_PROVIDER=mock
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

For a completely free local run, keep:

```bash
AI_PROVIDER=mock
```

To use Gemini, set:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your-free-tier-key
```

If `AI_PROVIDER=gemini` is set but no key is present, the app falls back to the mock provider.

### 3. Start MongoDB

Use a local MongoDB instance or a free hosted MongoDB database. Do not commit real credentials.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Architecture

See [docs/technical-plan.md](docs/technical-plan.md) for product scope, system flow, database schema, folder structure, milestones, and commit plan.

## Project Structure

```text
app/
  api/
  auth/
  dashboard/
  history/
  interview/
  profile/
  reports/
components/
  auth/
  dashboard/
  interview/
  layout/
  profile/
  reports/
  ui/
data/
docs/
hooks/
lib/
  ai/
  auth/
  db/
  validators/
models/
types/
```

## AI Provider Design

The app calls `lib/ai/interviewService.ts`, which selects a provider behind the `AIProvider` interface.

- `lib/ai/providers/mock.ts`: deterministic local provider for free development and demos.
- `lib/ai/providers/gemini.ts`: optional Gemini provider.
- `lib/ai/prompts.ts`: prompt builders kept away from route handlers.

This keeps the product open-source friendly and avoids hard coupling to paid APIs.

## Voice Design

Voice is intentionally browser-first:

- `hooks/use-speech-recognition.ts`
- `hooks/use-speech-synthesis.ts`

These hooks isolate the browser APIs so a future WebRTC service can be added without rewriting the interview room.

## Security Notes

- `.env` is ignored by git.
- JWT is stored in an HTTP-only cookie.
- Passwords are hashed with bcrypt.
- Route handlers validate input with Zod.
- Real API keys and database credentials should never be committed.

## Current Audit Note

`npm audit` reports a moderate advisory through Next's internal PostCSS dependency and suggests a breaking downgrade. Do not apply `npm audit fix --force` for that case; update Next normally when a safe upstream patch is available.

## License

MIT
