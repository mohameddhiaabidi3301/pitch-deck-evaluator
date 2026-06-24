// ============================================================
// VentureAI — AI Pitch Deck Evaluator
// Built by Mohamed Dhia Al Islem Abidi
// ============================================================

// ─── PDF.js setup ───────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ─── State ──────────────────────────────────────────────────
let state = {
  apiKey: localStorage.getItem('ventureai_key') || '',
  activeTab: 'upload',
  pdfText: '',
  pastedText: '',
  activeSample: '',
  isAnalyzing: false
};

// ─── Sample pitch deck texts ────────────────────────────────
const SAMPLES = {
  airbnb: `SLIDE 1 — COVER
Airbnb
Book rooms with locals, rather than hotels.
Founded 2008 | Seed Round

SLIDE 2 — PROBLEM
Price: hotels are expensive (avg $180/night)
Connection: travelers want to experience a city like a local, not as a tourist
Wasteful: more than 99% of private space is wasted sitting empty

SLIDE 3 — SOLUTION
A web platform where users can rent out their space to host travelers:
- Save money with a more affordable option than hotels
- Make money by renting out their space
- Share culture, build connections

SLIDE 4 — PRODUCT
Online network for social room rentals
- List rooms starting at $25/night
- View guest/host profiles, ratings, reviews, travel history
- Pay online via credit card (3% fee)
Booking confirmation and host verification included

SLIDE 5 — MARKET OPPORTUNITY
Total Addressable Market: $1.9 billion
- 630K hotels globally with avg 149 rooms = 93.7M hotel rooms
- Plus vacation rentals: $44B hotel market in US alone
Target: budget and boutique travelers

SLIDE 6 — BUSINESS MODEL
Transaction fee: 10% from host per booking
- Host lists space for free
- Guest pays online
- Airbnb takes 10% of each transaction
Average booking value: $185
Commission per booking: $18.50

SLIDE 7 — TRACTION
- Launch: August 2008 — Demo Day
- SXSW 2009: 80 nights booked over 2 days
- DNC 2008: 800 nights booked total
- Currently: $200/week revenue
- 3 direct competitors with no network effects

SLIDE 8 — GO-TO-MARKET STRATEGY
Phase 1: Target events where hotels are overpriced/booked (SXSW, DNC)
Phase 2: Expand to top 10 US cities via targeted SEO and city ambassadors
Phase 3: International expansion to top 10 European destinations
Acquisition cost: estimated $6 per host via Google/Craigslist

SLIDE 9 — TEAM
Brian Chesky — CEO, Industrial Design background, former designer
Joe Gebbia — CPO, RISD graduate, designer and entrepreneur
Nathan Blecharczyk — CTO, CS Harvard graduate, serial entrepreneur
All three are co-founders and technical/design leads

SLIDE 10 — THE ASK
Raising $500,000 seed round
Use of funds:
- 40% Engineering & Product (3 engineers)
- 20% Growth (city launches)
- 20% Marketing & PR
- 20% Operations & Legal
Goal: reach $200M bookings within 18 months`,

  uber: `SLIDE 1 — COVER
UberCab
The Urban Transportation Network
San Francisco, 2010 | Seed Round Presentation

SLIDE 2 — THE PROBLEM
Transportation in cities is broken:
- Taxis are unreliable, dirty, and hard to find
- No accountability — drivers can refuse rides
- Surge periods mean no cabs available
- Payment is cash-only and unpredictable
- 88% of car trips in SF involve just 1 passenger

SLIDE 3 — THE SOLUTION
UberCab connects riders to professional, licensed drivers via smartphone
- Request a ride from your phone in seconds
- Track your driver in real time on the map
- Automatic payment via credit card on file
- Drivers are rated — accountability built in

SLIDE 4 — PRODUCT
Mobile app for iPhone and BlackBerry
- One tap to request a town car/black car
- GPS tracking of incoming vehicle
- Automatic billing — no cash, no tips needed
- Star rating system for drivers
- Receipts emailed automatically

SLIDE 5 — MARKET SIZE
Taxi & limo market in the US: $40 billion per year
- US Taxi industry: $11B annual revenue
- US Limo/Sedan market: $29B annual revenue
Global transportation: $1.4 trillion annually
San Francisco taxi market alone: $160M/year

SLIDE 6 — BUSINESS MODEL
UberCab takes 20% of each ride fare
- No vehicle ownership
- No driver employment
- Pure marketplace model
Average ride in SF: $20
Uber cut: $4 per ride
Monthly rides target: 50,000 → Monthly revenue: $200K

SLIDE 7 — TRACTION & VALIDATION
- Beta launched in May 2010, San Francisco
- 3,000 users in first 6 weeks — zero paid marketing
- NPS score: 90 (exceptional customer loyalty)
- $15,000 in revenue in first week of operations
- Media coverage: TechCrunch, VentureBeat
- Repeat usage rate: 80% of users ride again within 30 days

SLIDE 8 — GO-TO-MARKET
City-by-city expansion model:
Phase 1: Dominate San Francisco (Q4 2010)
Phase 2: New York, Chicago, LA (2011)
Phase 3: 25 US cities + 5 international (2012)
Channels: Word of mouth, social media, events
Key partnership: existing licensed black car companies

SLIDE 9 — TEAM
Travis Kalanick — CEO, serial entrepreneur (sold Scour.com, RedSwoosh acquired by Akamai for $19M)
Garrett Camp — Co-founder, founder of StumbleUpon (acquired by eBay for $75M)
Ryan Graves — GM, Stanford MBA, hired as first employee via Twitter

SLIDE 10 — FINANCIAL PROJECTIONS
Year 1: $500K revenue (SF only)
Year 2: $5M revenue (8 US cities)
Year 3: $20M revenue (25 cities)
Gross margin: 80%+ (no COGS beyond payment processing)

SLIDE 11 — THE ASK
Raising $1.25 million seed round
Current investors: First Round Capital, Lowercase Capital
Use of funds:
- 50% Engineering (mobile + backend)
- 25% Market expansion (2 new cities)
- 15% Operations
- 10% Legal & compliance`,

  buffer: `SLIDE 1 — COVER
Buffer
The Simplest Way to Schedule Posts for Twitter & Facebook
Joel Gascoigne, Leo Widrich | 2011 | $500K Seed Round

SLIDE 2 — THE PROBLEM
Social media managers and professionals have two key pains:
1. Consistency: Hard to post regularly without spending hours online each day
2. Timing: Posting at random times misses peak engagement windows
Existing tools require logging in, composing, and posting manually every time

SLIDE 3 — THE SOLUTION
Buffer lets users schedule social media posts in advance across multiple platforms
- Queue content to go out at optimal times automatically
- Works across Twitter, Facebook, LinkedIn
- Browser extension for one-click buffering while browsing
"Set it once, post forever" — your content goes out even when you're offline

SLIDE 4 — PRODUCT
Simple web app + browser extension
- Add posts to your queue from anywhere
- Smart scheduling: Buffer automatically spaces posts throughout the day
- Analytics: see which posts performed best
- Team features: multiple users per account
Available on desktop, iOS, and Android

SLIDE 5 — MARKET
Social media management market: growing rapidly
- 700M+ Twitter users globally (2011)
- 800M+ Facebook users
- 83% of US companies use social media for marketing
Target customers: small businesses, bloggers, marketers, social media managers
TAM: $500M+

SLIDE 6 — BUSINESS MODEL
Freemium SaaS subscription
- Free: 1 account, 10 queued posts
- Awesome: $10/month — 25 accounts, unlimited posts
- Business: $99/month — teams, advanced analytics
Current MRR: $15,000 (growing 10% month-over-month)
Annual revenue run rate: $180,000

SLIDE 7 — TRACTION
- Launched November 2010 as side project
- First paying customer: 7 days after launch
- 100 paying customers by month 2 — zero marketing spend
- Currently: 15,000 registered users, 1,200 paying customers
- Growth: 10% month-over-month consistently
- NPS score: 72 (extremely high for SaaS)
- Churn: under 3% monthly

SLIDE 8 — GO-TO-MARKET STRATEGY
Content marketing: Joel and Leo blog transparently about building the company
- "Open startup" philosophy — share revenue, metrics publicly
- Guest posting on TechCrunch, Mashable, Social Media Examiner
Virality: every post sent via Buffer includes "via @buffer" attribution
Referral: users get extra features for referring friends
Target: word-of-mouth driven growth

SLIDE 9 — TEAM
Joel Gascoigne — CEO/Co-founder, developer and designer
- Built the MVP in 7 weeks solo
- Previously built 3 other web apps
Leo Widrich — COO/Co-founder
- Growth and marketing lead
- Wrote 150+ guest posts to drive traffic

SLIDE 10 — FINANCIALS
Current MRR: $15,000
MoM growth: 10%
Projected MRR in 12 months: $52,000
CAC: $3 (content marketing driven)
LTV: $180 (estimated 18-month average customer life)
LTV:CAC ratio: 60:1 — extremely healthy

SLIDE 11 — THE ASK
Raising $500,000 seed round
Target investors: AngelList, seed-stage VCs
Use of funds:
- 60% Team (hire 3 engineers, 1 marketer)
- 20% Product development
- 15% Marketing & growth experiments
- 5% Operations
Goal: reach $100K MRR in 18 months and raise Series A`
};

// ─── Initialize ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (state.apiKey) {
    showConnected();
  }

  // Char counter
  const ta = document.getElementById('pitch-text');
  if (ta) {
    ta.addEventListener('input', () => {
      const n = ta.value.length;
      document.getElementById('char-count').textContent = `${n.toLocaleString()} characters`;
      state.pastedText = ta.value;
    });
  }
});

// ─── API Key ─────────────────────────────────────────────────
function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key || !key.startsWith('AIza')) {
    shakeElement('api-key-input');
    return;
  }
  state.apiKey = key;
  localStorage.setItem('ventureai_key', key);
  showConnected();
}

function showConnected() {
  document.getElementById('api-setup').classList.add('hidden');
  document.getElementById('api-connected').classList.remove('hidden');
}

function disconnectApi() {
  state.apiKey = '';
  localStorage.removeItem('ventureai_key');
  document.getElementById('api-connected').classList.add('hidden');
  document.getElementById('api-setup').classList.remove('hidden');
  document.getElementById('api-key-input').value = '';
}

// ─── Tab Switching ───────────────────────────────────────────
function switchTab(tab) {
  state.activeTab = tab;
  ['upload','text','sample'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle('active', t === tab);
    document.getElementById(`content-${t}`).classList.toggle('hidden', t !== tab);
  });
}

// ─── File Handling ───────────────────────────────────────────
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('drop-zone').classList.add('drag-over');
}
function handleDragLeave(e) {
  document.getElementById('drop-zone').classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('drop-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') processFile(file);
}
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

async function processFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const typedArray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += `\n\nSLIDE ${i}\n${pageText}`;
      }
      state.pdfText = text;
      document.getElementById('file-info').classList.remove('hidden');
      document.getElementById('file-name').textContent = file.name;
      document.getElementById('file-pages').textContent = `· ${pdf.numPages} pages extracted`;
    } catch(err) {
      alert('Could not extract text from this PDF. Please try the Paste Text tab instead.');
    }
  };
  reader.readAsArrayBuffer(file);
}

function clearFile() {
  state.pdfText = '';
  document.getElementById('file-info').classList.add('hidden');
  document.getElementById('file-input').value = '';
}

function clearText() {
  document.getElementById('pitch-text').value = '';
  state.pastedText = '';
  document.getElementById('char-count').textContent = '0 characters';
}

// ─── Sample Loading ──────────────────────────────────────────
function loadSample(name) {
  ['airbnb','uber','buffer'].forEach(s => {
    document.getElementById(`sample-${s}`).classList.remove('selected');
  });
  document.getElementById(`sample-${name}`).classList.add('selected');
  state.activeSample = name;
  const names = { airbnb:'Airbnb', uber:'Uber', buffer:'Buffer' };
  document.getElementById('sample-loaded').classList.remove('hidden');
  document.getElementById('sample-loaded-name').textContent = names[name];
}

// ─── Get Current Pitch Content ───────────────────────────────
function getPitchContent() {
  if (state.activeTab === 'upload') return state.pdfText;
  if (state.activeTab === 'text') return state.pastedText;
  if (state.activeTab === 'sample') return state.activeSample ? SAMPLES[state.activeSample] : '';
  return '';
}

// ─── Main Analysis ───────────────────────────────────────────
async function startAnalysis() {
  if (!state.apiKey) {
    alert('Please connect your Gemini API key first.');
    document.getElementById('api-key-input')?.focus();
    return;
  }

  const pitchContent = getPitchContent();
  if (!pitchContent || pitchContent.trim().length < 80) {
    alert('Please provide more pitch deck content (upload a PDF, paste text, or select a sample deck).');
    return;
  }

  if (state.isAnalyzing) return;
  state.isAnalyzing = true;

  // Show loading
  document.getElementById('upload-section').classList.add('hidden');
  document.getElementById('hero-section').classList.add('hidden');
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('loading-section').classList.remove('hidden');

  // Animate steps
  const steps = ['step-1','step-2','step-3','step-4','step-5','step-6'];
  let stepIndex = 0;
  const stepInterval = setInterval(() => {
    if (stepIndex > 0) {
      document.getElementById(steps[stepIndex-1]).classList.remove('active');
      document.getElementById(steps[stepIndex-1]).classList.add('done');
    }
    if (stepIndex < steps.length) {
      document.getElementById(steps[stepIndex]).classList.add('active');
      stepIndex++;
    } else {
      clearInterval(stepInterval);
    }
  }, 900);

  try {
    const result = await callGeminiAPI(pitchContent);
    clearInterval(stepInterval);
    steps.forEach(s => {
      document.getElementById(s).classList.remove('active');
      document.getElementById(s).classList.add('done');
    });
    await delay(600);
    renderResults(result);
  } catch (err) {
    clearInterval(stepInterval);
    console.error(err);
    alert(`Analysis failed: ${err.message}\n\nPlease check your API key and try again.`);
    resetApp();
  }

  state.isAnalyzing = false;
}

// ─── Gemini API Call ─────────────────────────────────────────
async function callGeminiAPI(pitchContent) {
  const prompt = buildPrompt(pitchContent);
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-8b:generateContent?key=${state.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('No response from Gemini API');

  // Parse JSON
  const cleaned = rawText.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
  return JSON.parse(cleaned);
}

// ─── Prompt Engineering ──────────────────────────────────────
function buildPrompt(pitchContent) {
  return `You are an elite venture capital analyst at a top-tier global fund. You have evaluated thousands of pitch decks from companies like Airbnb, Uber, Stripe, OpenAI, and Buffer. Your evaluation methodology is inspired by the frameworks used at Sequoia Capital, a16z, and Y Combinator.

Analyze the following pitch deck content and return a structured JSON evaluation.

PITCH DECK CONTENT:
---
${pitchContent.substring(0, 12000)}
---

Return ONLY valid JSON with this EXACT structure (no markdown, no extra text):

{
  "startupName": "Name of the startup (infer from content)",
  "overallScore": 7.5,
  "verdict": "Investment Ready",
  "verdictDescription": "2-sentence investor verdict",

  "clarityScore": 7,
  "narrativeScore": 8,
  "psfitScore": 9,

  "clarity": {
    "strengths": [
      "Specific strength about communication clarity",
      "Another strength"
    ],
    "weaknesses": [
      "Specific weakness about clarity or presentation",
      "Another weakness"
    ]
  },

  "narrative": {
    "strengths": [
      "Specific narrative strength",
      "Another strength"
    ],
    "weaknesses": [
      "Specific narrative weakness",
      "Another weakness"
    ],
    "insights": [
      "Investor insight about storytelling",
      "Another insight"
    ]
  },

  "problemSolutionFit": {
    "problemStatement": "Concise 1-sentence description of the problem",
    "solutionStatement": "Concise 1-sentence description of the solution",
    "strengths": [
      "Specific PS fit strength",
      "Another strength"
    ],
    "risks": [
      "Specific investment risk",
      "Another risk"
    ],
    "insights": [
      "Investor lens insight",
      "Another insight"
    ]
  },

  "investorSummary": {
    "topStrength": "The single most compelling thing about this startup",
    "biggestRisk": "The single most concerning risk for investors",
    "criticalGap": "The most important missing element",
    "vcRecommendation": "Your honest 2-sentence recommendation as a VC"
  },

  "narrativeSections": {
    "cover": "present",
    "problem": "present",
    "solution": "present",
    "product": "present",
    "marketOpportunity": "weak",
    "businessModel": "missing",
    "traction": "present",
    "goToMarket": "weak",
    "team": "present",
    "ask": "missing"
  }
}

Status values for narrativeSections: "present" (strong), "weak" (present but insufficient), "missing" (absent)
Scores are 0-10. Be honest and calibrated like a real investor — average decks get 5-6, exceptional ones get 8-9.`;
}

// ─── Render Results ───────────────────────────────────────────
function renderResults(data) {
  document.getElementById('loading-section').classList.add('hidden');
  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('results-section').classList.add('fade-in');

  // Startup name
  document.getElementById('startup-name-display').textContent = data.startupName || 'Analyzed Startup';

  // Overall score ring
  const score = data.overallScore || 0;
  const circumference = 326.7;
  const offset = circumference - (score / 10) * circumference;
  setTimeout(() => {
    document.getElementById('ring-fill').style.strokeDashoffset = offset;
    animateNumber('overall-score', 0, score, 1500, 1);
  }, 100);

  // Add SVG gradient
  const svg = document.querySelector('.score-ring');
  if (!svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f8ef7"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>`;
    svg.insertBefore(defs, svg.firstChild);
  }

  // Verdict
  document.getElementById('score-verdict').textContent = data.verdict || '—';
  document.getElementById('score-desc').textContent = data.verdictDescription || '';

  // Dimension bars
  setBar('clarity', data.clarityScore, 'num-clarity');
  setBar('narrative', data.narrativeScore, 'num-narrative');
  setBar('psfit', data.psfitScore, 'num-psfit');

  // Dimension badges
  document.getElementById('badge-clarity').textContent = `${data.clarityScore}/10`;
  document.getElementById('badge-narrative').textContent = `${data.narrativeScore}/10`;
  document.getElementById('badge-psfit').textContent = `${data.psfitScore}/10`;

  // Render dimension bodies
  renderDimBody('body-clarity', [
    { type: 'strengths', title: '✦ Strengths', points: data.clarity?.strengths },
    { type: 'weaknesses', title: '⚠ Weaknesses', points: data.clarity?.weaknesses }
  ]);

  renderDimBody('body-narrative', [
    { type: 'strengths', title: '✦ Strengths', points: data.narrative?.strengths },
    { type: 'weaknesses', title: '⚠ Weaknesses', points: data.narrative?.weaknesses },
    { type: 'insights', title: '◆ Insights', points: data.narrative?.insights }
  ]);

  renderDimBody('body-psfit', [
    { type: 'strengths', title: '✦ Strengths', points: data.problemSolutionFit?.strengths },
    { type: 'risks', title: '⚡ Risks', points: data.problemSolutionFit?.risks },
    { type: 'insights', title: '◆ Insights', points: data.problemSolutionFit?.insights }
  ]);

  // Investor summary
  document.getElementById('is-top-strength').textContent = data.investorSummary?.topStrength || '—';
  document.getElementById('is-top-risk').textContent = data.investorSummary?.biggestRisk || '—';
  document.getElementById('is-missing').textContent = data.investorSummary?.criticalGap || '—';
  document.getElementById('is-recommendation').textContent = data.investorSummary?.vcRecommendation || '—';

  // Narrative flow
  renderNarrativeFlow(data.narrativeSections);

  // Scroll to results
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setBar(dim, score, numId) {
  const pct = Math.min(100, (score / 10) * 100);
  setTimeout(() => {
    document.getElementById(`bar-${dim}`).style.width = `${pct}%`;
    document.getElementById(numId).textContent = `${score}/10`;
  }, 200);
}

function renderDimBody(containerId, sections) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  sections.forEach(sec => {
    if (!sec.points || !sec.points.length) return;
    const div = document.createElement('div');
    div.className = 'dim-section';
    div.innerHTML = `
      <div class="dim-section-title ${sec.type}">
        ${sec.title}
      </div>
      <ul class="dim-points ${sec.type}">
        ${sec.points.map(p => `
          <li class="dim-point">
            <div class="point-dot"></div>
            <span>${p}</span>
          </li>
        `).join('')}
      </ul>
    `;
    container.appendChild(div);
  });
}

function renderNarrativeFlow(sections) {
  if (!sections) return;
  const container = document.getElementById('narrative-flow-grid');
  const labels = {
    cover: 'Cover', problem: 'Problem', solution: 'Solution',
    product: 'Product', marketOpportunity: 'Market', businessModel: 'Biz Model',
    traction: 'Traction', goToMarket: 'GTM', team: 'Team', ask: 'Ask'
  };
  const statusLabels = { present: '✓ Strong', weak: '~ Weak', missing: '✕ Missing' };
  container.innerHTML = Object.keys(labels).map(key => `
    <div class="nf-section ${sections[key] || 'missing'}">
      <div class="nf-label">${labels[key]}</div>
      <div class="nf-status">${statusLabels[sections[key] || 'missing']}</div>
    </div>
  `).join('');
}

// ─── Export ──────────────────────────────────────────────────
function exportReport() {
  const el = document.getElementById('results-section');
  const reportHTML = `<!DOCTYPE html>
<html>
<head>
<title>VentureAI Report</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; background: #fff; color: #111; }
  h1 { font-size: 24px; margin-bottom: 8px; }
  h2 { font-size: 18px; border-bottom: 2px solid #4f8ef7; padding-bottom: 8px; margin-top: 32px; }
  h3 { font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; }
  .score { font-size: 48px; font-weight: 900; color: #4f8ef7; }
  .dim { background: #f7f9ff; border-radius: 12px; padding: 20px; margin: 16px 0; }
  ul { padding-left: 20px; } li { margin: 6px 0; font-size: 14px; }
  .strength { color: #10b981; } .weakness { color: #f59e0b; } .risk { color: #f43f5e; }
  .footer { margin-top: 60px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
</style>
</head>
<body>
<h1>VentureAI — Investor Evaluation Report</h1>
<p style="color:#666">Generated on ${new Date().toLocaleDateString()} by VentureAI</p>
${el.innerHTML}
<div class="footer">Generated by VentureAI · Built by Mohamed Dhia Al Islem Abidi · Powered by Gemini AI</div>
</body>
</html>`;
  const blob = new Blob([reportHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'VentureAI_Report.html';
  a.click();
}

// ─── Reset ───────────────────────────────────────────────────
function resetApp() {
  state.pdfText = '';
  state.pastedText = '';
  state.activeSample = '';
  state.isAnalyzing = false;

  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('loading-section').classList.add('hidden');
  document.getElementById('upload-section').classList.remove('hidden');
  document.getElementById('hero-section').classList.remove('hidden');

  // Reset loading steps
  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById(`step-${i}`);
    el.classList.remove('active', 'done');
    if (i === 1) el.classList.add('active');
  }

  // Reset bars
  ['clarity','narrative','psfit'].forEach(d => {
    document.getElementById(`bar-${d}`).style.width = '0%';
  });

  // Clear file
  clearFile();
  document.getElementById('sample-loaded').classList.add('hidden');
  ['airbnb','uber','buffer'].forEach(s => document.getElementById(`sample-${s}`).classList.remove('selected'));

  document.getElementById('hero-section').scrollIntoView({ behavior: 'smooth' });
}

// ─── Helpers ─────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function animateNumber(id, from, to, duration, decimals = 0) {
  const el = document.getElementById(id);
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    el.textContent = (from + (to - from) * ease).toFixed(decimals);
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function shakeElement(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 400);
}

// Add shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);
