# VentureAI — AI Pitch Deck Evaluator

> Institutional-grade pitch deck analysis powered by Google Gemini.

VentureAI evaluates startup pitch decks across three critical investor dimensions — **Communication Clarity**, **Narrative & Storytelling**, and **Problem-Solution Fit** — and generates a structured report with actionable insights, scores, and a VC recommendation.

---

## Live Demo

**[Try VentureAI Live](https://mohameddhiaabidi3301.github.io/pitch-deck-evaluator/)**

No installation. No backend. Runs entirely in the browser.

---

## Features

- **PDF Upload** — Drag and drop or browse to upload a pitch deck PDF
- **Text Paste** — Paste slide content directly as text
- **Sample Decks** — Built-in Airbnb, Uber, and Buffer pitch decks for instant testing
- **Demo Mode** — Full analysis preview without an API key
- **AI Analysis via Gemini** — Real-time evaluation using Google Gemini 1.5 Flash
- **3-Dimensional Scoring** — Clarity, Narrative, and Problem-Solution Fit each scored /10
- **Investor Intelligence Summary** — Top Strength, Biggest Risk, Critical Gap, VC Recommendation
- **Narrative Flow Tracker** — Visual section coverage map (Cover, Problem, Solution, Market, etc.)
- **Export Report** — Download a full HTML report
- **Animated Enterprise UI** — Professional dark mode with interactive background

---

## How to Use

### Option A — Try Demo Mode (No Setup Required)

1. Open `index.html` in your browser (or use the live link above)
2. Click **"Try Demo Mode — No API Key Needed"**
3. Click **"Run Analysis"** to see a full sample evaluation

### Option B — Connect Your Gemini API Key

1. Get a free API key at [aistudio.google.com](https://aistudio.google.com) → **Get API Key**
2. Open `index.html` in your browser
3. Paste your key and click **Connect**
4. Upload a PDF, paste text, or select a sample deck
5. Click **Run Analysis**

---

## Running Locally

No build step required. This is a pure HTML/CSS/JS application.

```bash
# Clone the repository
git clone https://github.com/mohameddhiaabidi3301/pitch-deck-evaluator.git
cd pitch-deck-evaluator

# Open in browser
# Option 1: Double-click index.html
# Option 2: Use a local server (recommended to avoid PDF.js CORS)
npx serve .
# Then open http://localhost:3000
```

---

## Project Structure

```
pitch-deck-evaluator/
├── index.html     # Application shell and UI layout
├── style.css      # Enterprise dark UI design system
├── app.js         # All logic: PDF extraction, Gemini API, canvas animation, demo mode
└── README.md
```

---

## Technology Stack

| Layer        | Technology                     |
|--------------|-------------------------------|
| Frontend     | Vanilla HTML, CSS, JavaScript  |
| AI           | Google Gemini 1.5 Flash API   |
| PDF Parsing  | PDF.js (client-side)          |
| Fonts        | Inter, JetBrains Mono         |
| Hosting      | GitHub Pages (static)         |

---

## Evaluation Dimensions

### 1. Investor Communication & Deck Clarity
How clearly does the deck communicate ideas in an investor-ready format? Evaluates structure, slide hierarchy, visual language, and message efficiency.

### 2. Narrative & Founder Storytelling
Does the deck follow a logical, compelling investment narrative? Evaluates flow, emotional hook, and whether the story moves from problem to conviction.

### 3. Problem-Solution Fit (Investment Lens)
Core validation: does the startup solve a real, scalable problem with a coherent solution? Evaluates the problem statement, solution defensibility, and market-timing.

---

## Built By

**Mohamed Dhia Al Islem Abidi**
Submission for V3 Factory AI & Automation Internship — June 2026

---

*AI analysis is for educational and evaluation purposes. Always complement with human expert review.*
