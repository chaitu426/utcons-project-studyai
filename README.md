# AI Learning Assistant

A fast, production-ready web application that generates structured learning materials based on a topic and grade level. It uses Google Gemini to generate a deep overview, structured key concepts, curated learning resources, and a multiple-choice quiz, presented in a clean, distraction-free interface.

## Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Environment Variables**
Create a `.env.local` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open the application**
Visit `http://localhost:3000` in your web browser.

---

## Detailed Architectural Approach

The application is built as a single **Next.js (App Router)** project to keep the frontend and backend tightly integrated. While a separate Node.js/Express backend coupled with a React frontend could be used, an external Node.js server would be overkill for this project since we do not require complex database schemas, user authentication, or heavy agentic orchestrations. 

### 1. Context Retrieval (Grounding)
For the backend, the core logic lives in a single API route (`/api/generate`). When a request comes in, the server first makes a quick, non-blocking call to the Wikipedia REST API to fetch factual context. 
*Note: This could easily be replaced with an advanced Web Search API (like Tavily or SerpApi) as a tool for the LLM. However, to keep the system simple, fast, and free of third-party search quotas, the native Wikipedia API is utilized.*

### 2. LLM Orchestration & Streaming
The retrieved context is injected into a strict system prompt sent to the Gemini API (`gemini-1.5-flash`). The AI response is streamed back to the client progressively using **Server-Sent Events (SSE)**. 
*Note: This SSE streaming approach makes the app feel highly responsive. For future scaling into a real-time, high-performance enterprise application, this streaming layer could be upgraded to use WebSockets or gRPC.*

### 3. Real-Time UI Parsing
Instead of waiting for the full structured JSON to finish generating, the frontend utilizes a custom partial-JSON parser. This parser uses Regex to extract the "Overview" and "Key Concepts" chunks from the raw text stream in real-time, providing a smooth, typing-effect UI exactly like ChatGPT or Claude, without exposing raw JSON to the user.

### 4. Strict Validation & Auto-Repair Layer
Once the full AI response is received, it is strictly validated using **Zod schemas** to ensure the JSON structure is exactly what the frontend expects (e.g., exactly five quiz questions, exactly four options each). If the structure is slightly off, a custom validation repair layer makes a best-effort attempt to fix missing fields or incorrect lengths before throwing a fatal error.

### 5. Asynchronous Resource Curation
While the main content is being validated, a parallel asynchronous LLM call generates a curated list of learning resources (Videos, Articles, Books) so the user can continue their deep-learning journey.

### 6. Frontend Design
The frontend is built with React and **Tailwind CSS**. The design intentionally avoids heavy styling, relying instead on clean typography, responsive flex/grid layouts, subtle borders, and a dark theme. State management gracefully handles the streaming text updates, loading skeletons, error states, and `localStorage` caching for recent searches.

## Assumptions Made
- **Google Gemini (gemini-1.5-flash)** is the primary model used for its fast streaming and reliable structured JSON adherence.
- The Wikipedia API is used strictly for lightweight context gathering with a strict 2-second timeout. If the fetch fails, times out, or returns no exact match, the application gracefully falls back to using the AI's internal knowledge base to prevent blocking the user.
- The user is running a Node.js environment compatible with Next.js 14 App Router.
