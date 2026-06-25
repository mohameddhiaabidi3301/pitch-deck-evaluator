// ============================================================
// VentureAI — AI Pitch Deck Evaluator
// Built by Mohamed Dhia Al Islem Abidi
// ============================================================

// ─── Animated Background Canvas ────────────────────────────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dots, mouse = { x: -9999, y: -9999 };
  const DOT_COUNT   = 90;
  const MAX_DIST    = 150;
  const DOT_COLOR   = 'rgba(96,165,250,';
  const LINE_COLOR  = 'rgba(96,165,250,';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createDots() {
    dots = Array.from({ length: DOT_COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r:  Math.random() * 1.2 + 0.6
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });

    // Lines between nearby dots
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = LINE_COLOR + alpha + ')';
          ctx.lineWidth   = 0.6;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
      // React to mouse
      const mx = dots[i].x - mouse.x;
      const my = dots[i].y - mouse.y;
      const md = Math.sqrt(mx*mx + my*my);
      if (md < 140) {
        const alpha = (1 - md / 140) * 0.35;
        ctx.beginPath();
        ctx.strokeStyle = LINE_COLOR + alpha + ')';
        ctx.lineWidth   = 0.8;
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // Dots
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = DOT_COLOR + '0.45)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createDots(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  createDots();
  draw();
})();

// ─── PDF.js setup ───────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ─── State ──────────────────────────────────────────────────
let state = {
  apiKey:      localStorage.getItem('ventureai_key') || '',
  groqKey:     localStorage.getItem('ventureai_groq_key') || '',
  provider:    localStorage.getItem('ventureai_provider') || 'gemini',
  activeTab:   'upload',
  pdfText:     '',
  pastedText:  '',
  activeSample:'',
  isAnalyzing: false,
  isDemoMode:  false,
  lastResult:  null
};

// ─── Sample Pitch Deck Texts ─────────────────────────────────
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

// ─── Demo Mode Mock Response ─────────────────────────────────
const DEMO_RESPONSE = {
  startupName: "Airbnb (Demo Mode)",
  overallScore: 8.2,
  verdict: "Strong Investment Candidate",
  verdictDescription: "Airbnb's 2009 seed deck demonstrates a clear market insight and a differentiated solution to a genuine problem. The team's execution ability is evident from early traction, making this a compelling opportunity at the seed stage.",
  clarityScore: 8,
  narrativeScore: 9,
  psfitScore: 8,
  clarity: {
    strengths: [
      "Clean problem-solution framework that is immediately understandable to investors",
      "Concise business model with transparent transaction mechanics (10% commission)",
      "Market sizing is anchored in concrete data rather than top-down assumptions"
    ],
    weaknesses: [
      "Financial projections section lacks granularity — no monthly burn or runway figures",
      "Competitive landscape slide is absent; only briefly references three unnamed competitors"
    ]
  },
  narrative: {
    strengths: [
      "The deck follows a textbook investor narrative: problem, solution, market, traction, ask",
      "Emotional hook around cultural connection elevates it beyond a purely transactional framing",
      "The go-to-market strategy is phased and credible, moving from events to cities to international"
    ],
    weaknesses: [
      "Team slide lacks advisor network or institutional credibility signals",
      "Transition from product to market opportunity could be tighter"
    ],
    insights: [
      "The 'waste reduction' framing of unused private space is a unique angle that resonates with institutional ESG sensibilities",
      "Anchoring launch strategy around high-profile events (SXSW, DNC) was a masterclass in demand capture"
    ]
  },
  problemSolutionFit: {
    problemStatement: "Hotel accommodation is expensive, impersonal, and fails to serve budget-conscious travelers seeking authentic local experiences.",
    solutionStatement: "A trusted peer-to-peer marketplace enabling homeowners to monetize unused space while providing travelers with affordable, locally-curated alternatives.",
    strengths: [
      "The solution directly addresses all three stated pain points: cost, connection, and waste",
      "Two-sided network effect built into the model creates a natural competitive moat over time",
      "Early price point ($25/night) creates a defensible value proposition against hotel alternatives"
    ],
    risks: [
      "Trust and safety risk — the deck does not address how disputes between hosts and guests are handled",
      "Regulatory exposure in key urban markets is not acknowledged",
      "Revenue at $200/week at pitch time is very early; burn rate versus funding ask needs more justification"
    ],
    insights: [
      "The marketplace model with 10% take rate is capital-efficient and highly scalable",
      "Host supply acquisition cost of $6 via Craigslist suggests excellent early unit economics"
    ]
  },
  investorSummary: {
    topStrength: "Proven early traction through creative distribution (event-based demand capture) combined with a large, underserved market — a rare combination at the seed stage.",
    biggestRisk: "Trust and safety infrastructure is entirely absent from the deck. Without this, the platform cannot scale; one incident can destroy brand credibility.",
    criticalGap: "No financial model showing path to profitability or unit economics beyond commission rate and booking value.",
    vcRecommendation: "This is a fundable deck. The founding team demonstrates resourcefulness and the business model is sound. We would proceed to due diligence with a focus on the trust/safety framework and a more detailed financial model before committing."
  },
  narrativeSections: {
    cover: "present",
    problem: "present",
    solution: "present",
    product: "present",
    marketOpportunity: "present",
    businessModel: "present",
    traction: "present",
    goToMarket: "present",
    team: "present",
    ask: "present"
  }
};

// ─── Initialize ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Restore provider tab
  if (state.provider === 'groq') {
    setProvider('groq', false);
  }
  // Restore connected state
  if (state.provider === 'groq' && state.groqKey) {
    showConnected();
  } else if (state.provider === 'gemini' && state.apiKey) {
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

// ─── Provider Switching ──────────────────────────────────────
function setProvider(name, save = true) {
  state.provider = name;
  if (save) localStorage.setItem('ventureai_provider', name);

  ['gemini','groq'].forEach(p => {
    document.getElementById(`ptab-${p}`).classList.toggle('active', p === name);
    document.getElementById(`panel-${p}`).classList.toggle('hidden', p !== name);
  });
}

// ─── API Keys ─────────────────────────────────────────────────
function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key || (!key.startsWith('AIza') && !key.startsWith('AQ'))) {
    shakeElement('api-key-input');
    return;
  }
  state.apiKey = key;
  state.provider = 'gemini';
  localStorage.setItem('ventureai_key', key);
  localStorage.setItem('ventureai_provider', 'gemini');
  showConnected();
}

function saveGroqKey() {
  const key = document.getElementById('groq-key-input').value.trim();
  if (!key || !key.startsWith('gsk_')) {
    shakeElement('groq-key-input');
    return;
  }
  state.groqKey = key;
  state.provider = 'groq';
  localStorage.setItem('ventureai_groq_key', key);
  localStorage.setItem('ventureai_provider', 'groq');
  showConnected();
}

function showConnected() {
  document.getElementById('api-setup').classList.add('hidden');
  document.getElementById('demo-connected').classList.add('hidden');
  const badge = document.getElementById('api-connected');
  badge.classList.remove('hidden');
  // Update badge label to show which provider is active
  const label = badge.querySelector('.connected-badge');
  if (label) {
    label.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      ${state.provider === 'groq' ? 'Groq Connected' : 'Gemini Connected'}`;
  }
}

function disconnectApi() {
  state.apiKey = '';
  state.groqKey = '';
  state.isDemoMode = false;
  localStorage.removeItem('ventureai_key');
  localStorage.removeItem('ventureai_groq_key');
  document.getElementById('api-connected').classList.add('hidden');
  document.getElementById('demo-connected').classList.add('hidden');
  document.getElementById('api-setup').classList.remove('hidden');
  document.getElementById('api-key-input').value = '';
  document.getElementById('groq-key-input').value = '';
}

// ─── Demo Mode ────────────────────────────────────────────────
function activateDemoMode() {
  state.isDemoMode = true;
  document.getElementById('api-setup').classList.add('hidden');
  document.getElementById('api-connected').classList.add('hidden');
  document.getElementById('demo-connected').classList.remove('hidden');
  // Auto-select Airbnb sample for demo
  switchTab('sample');
  loadSample('airbnb');
}

function deactivateDemoMode() {
  state.isDemoMode = false;
  document.getElementById('demo-connected').classList.add('hidden');
  document.getElementById('api-setup').classList.remove('hidden');
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
        const page    = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += `\n\nSLIDE ${i}\n${pageText}`;
      }
      state.pdfText = text;
      document.getElementById('file-info').classList.remove('hidden');
      document.getElementById('file-name').textContent  = file.name;
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
  if (state.activeTab === 'upload')  return state.pdfText;
  if (state.activeTab === 'text')    return state.pastedText;
  if (state.activeTab === 'sample')  return state.activeSample ? SAMPLES[state.activeSample] : '';
  return '';
}

// ─── Main Analysis ───────────────────────────────────────────
async function startAnalysis() {
  // Check we have a key for the active provider
  const hasKey = state.isDemoMode ||
    (state.provider === 'groq' && state.groqKey) ||
    (state.provider === 'gemini' && state.apiKey);

  if (!hasKey) {
    const inputId = state.provider === 'groq' ? 'groq-key-input' : 'api-key-input';
    shakeElement(inputId);
    document.getElementById('hero-section').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const pitchContent = getPitchContent();
  if (!pitchContent || pitchContent.trim().length < 80) {
    alert('Please provide pitch deck content — upload a PDF, paste text, or select a sample deck.');
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
  }, state.isDemoMode ? 500 : 900);

  try {
    let result;
    if (state.isDemoMode) {
      await delay(3200);
      result = DEMO_RESPONSE;
    } else if (state.provider === 'groq') {
      result = await callGroqAPI(pitchContent);
    } else {
      result = await callGeminiAPI(pitchContent);
    }

    clearInterval(stepInterval);
    steps.forEach(s => {
      document.getElementById(s).classList.remove('active');
      document.getElementById(s).classList.add('done');
    });
    await delay(500);
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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${state.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 4096 }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('No response from Gemini API');

  const cleaned = rawText.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
  return JSON.parse(cleaned);
}

// ─── Groq API Call ───────────────────────────────────────────
async function callGroqAPI(pitchContent) {
  const prompt = buildPrompt(pitchContent);
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.groqKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are an elite venture capital analyst. Always respond with valid JSON only — no markdown fences, no extra text, no explanation. Just the raw JSON object.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) throw new Error('No response from Groq API');

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
  const nameDisplay = data.startupName || 'Analyzed Startup';
  document.getElementById('startup-name-display').textContent =
    state.isDemoMode ? `${nameDisplay} — Demo Preview` : nameDisplay;

  // Overall score ring
  const score = data.overallScore || 0;
  const circumference = 326.7;
  const offset = circumference - (score / 10) * circumference;

  // Inject gradient defs
  const svg = document.querySelector('.score-ring');
  if (!svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `<linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   style="stop-color:#60a5fa"/>
      <stop offset="100%" style="stop-color:#818cf8"/>
    </linearGradient>`;
    svg.insertBefore(defs, svg.firstChild);
  }

  setTimeout(() => {
    document.getElementById('ring-fill').style.strokeDashoffset = offset;
    animateNumber('overall-score', 0, score, 1500, 1);
  }, 100);

  document.getElementById('score-verdict').textContent = data.verdict || '—';
  document.getElementById('score-desc').textContent    = data.verdictDescription || '';

  setBar('clarity',   data.clarityScore,   'num-clarity');
  setBar('narrative', data.narrativeScore, 'num-narrative');
  setBar('psfit',     data.psfitScore,     'num-psfit');

  document.getElementById('badge-clarity').textContent   = `${data.clarityScore}/10`;
  document.getElementById('badge-narrative').textContent = `${data.narrativeScore}/10`;
  document.getElementById('badge-psfit').textContent     = `${data.psfitScore}/10`;

  renderDimBody('body-clarity', [
    { type: 'strengths',  title: 'Strengths',  points: data.clarity?.strengths },
    { type: 'weaknesses', title: 'Weaknesses', points: data.clarity?.weaknesses }
  ]);

  renderDimBody('body-narrative', [
    { type: 'strengths',  title: 'Strengths',  points: data.narrative?.strengths },
    { type: 'weaknesses', title: 'Weaknesses', points: data.narrative?.weaknesses },
    { type: 'insights',   title: 'Insights',   points: data.narrative?.insights }
  ]);

  renderDimBody('body-psfit', [
    { type: 'strengths',  title: 'Strengths',  points: data.problemSolutionFit?.strengths },
    { type: 'risks',      title: 'Risks',      points: data.problemSolutionFit?.risks },
    { type: 'insights',   title: 'Insights',   points: data.problemSolutionFit?.insights }
  ]);

  document.getElementById('is-top-strength').textContent   = data.investorSummary?.topStrength    || '—';
  document.getElementById('is-top-risk').textContent       = data.investorSummary?.biggestRisk     || '—';
  document.getElementById('is-missing').textContent        = data.investorSummary?.criticalGap     || '—';
  document.getElementById('is-recommendation').textContent = data.investorSummary?.vcRecommendation || '—';

  renderNarrativeFlow(data.narrativeSections);

  // Cache data for clean export
  state.lastResult = data;

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
      <div class="dim-section-title ${sec.type}">${sec.title}</div>
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
  const statusLabels = { present: 'Strong', weak: 'Weak', missing: 'Missing' };
  container.innerHTML = Object.keys(labels).map(key => `
    <div class="nf-section ${sections[key] || 'missing'}">
      <div class="nf-label">${labels[key]}</div>
      <div class="nf-status">${statusLabels[sections[key] || 'missing']}</div>
    </div>
  `).join('');
}

// ─── Export ──────────────────────────────────────────────────
function exportReport() {
  const d = state.lastResult;
  if (!d) { alert('No analysis data to export yet.'); return; }

  function listItems(arr, color) {
    if (!arr || !arr.length) return '<li style="color:#999">No data</li>';
    return arr.map(p => `<li style="margin:7px 0;line-height:1.6;color:${color || '#374151'}">${p}</li>`).join('');
  }

  function sectionBlock(title, arr, color, border) {
    if (!arr || !arr.length) return '';
    return `
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${color};border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin-bottom:10px">${title}</div>
        <ul style="padding-left:18px;margin:0">${listItems(arr, '#374151')}</ul>
      </div>`;
  }

  function scoreBar(label, score, color) {
    const pct = Math.round((score / 10) * 100);
    return `
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:13px;color:#374151;font-weight:500">${label}</span>
          <span style="font-size:13px;font-weight:700;color:${color}">${score}/10</span>
        </div>
        <div style="background:#e5e7eb;border-radius:999px;height:6px;overflow:hidden">
          <div style="background:${color};height:6px;width:${pct}%;border-radius:999px"></div>
        </div>
      </div>`;
  }

  const narrativeLabels = {
    cover:'Cover', problem:'Problem', solution:'Solution', product:'Product',
    marketOpportunity:'Market', businessModel:'Biz Model',
    traction:'Traction', goToMarket:'GTM', team:'Team', ask:'Ask'
  };
  const nsColors = { present:'#059669', weak:'#d97706', missing:'#9ca3af' };
  const nsSections = d.narrativeSections ? Object.keys(narrativeLabels).map(k => {
    const st = d.narrativeSections[k] || 'missing';
    return `<div style="display:inline-flex;flex-direction:column;align-items:center;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;min-width:72px;text-align:center;margin:4px">
      <span style="font-size:12px;font-weight:600;color:#374151;margin-bottom:4px">${narrativeLabels[k]}</span>
      <span style="font-size:10px;font-weight:700;color:${nsColors[st]};letter-spacing:.05em">${st.toUpperCase()}</span>
    </div>`;
  }).join('') : '';

  const reportHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VentureAI — Investor Evaluation Report: ${d.startupName || 'Startup'}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="font-family:'Inter',Arial,sans-serif;max-width:860px;margin:0 auto;padding:48px 40px 80px;background:#fff;color:#111;-webkit-font-smoothing:antialiased">

  <!-- Header -->
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #111">
    <div style="background:#60a5fa;color:#000;width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px">V</div>
    <span style="font-size:15px;font-weight:700">VentureAI</span>
    <span style="margin-left:auto;font-size:12px;color:#6b7280">Generated on ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</span>
  </div>

  <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa;margin-bottom:12px">Investor Evaluation Report</p>
  <h1 style="font-size:32px;font-weight:800;letter-spacing:-.04em;margin:0 0 6px">${d.startupName || 'Startup'}</h1>
  <p style="font-size:14px;color:#6b7280;margin:0 0 40px">AI-generated analysis — powered by Google Gemini</p>

  <!-- Overall Score -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:32px;margin-bottom:28px">
    <p style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748b;margin:0 0 16px">Overall Score</p>
    <div style="display:flex;align-items:center;gap:32px;flex-wrap:wrap">
      <div>
        <span style="font-size:64px;font-weight:800;color:#60a5fa;line-height:1;letter-spacing:-.04em">${d.overallScore}</span>
        <span style="font-size:20px;color:#94a3b8;font-weight:500">&thinsp;/ 10</span>
      </div>
      <div style="flex:1;min-width:200px">
        <div style="font-size:20px;font-weight:700;color:#111;margin-bottom:6px">${d.verdict || ''}</div>
        <div style="font-size:13px;color:#4b5563;line-height:1.6">${d.verdictDescription || ''}</div>
      </div>
    </div>
    <div style="margin-top:28px">
      ${scoreBar('Communication Clarity', d.clarityScore, '#60a5fa')}
      ${scoreBar('Narrative &amp; Storytelling', d.narrativeScore, '#818cf8')}
      ${scoreBar('Problem-Solution Fit', d.psfitScore, '#34d399')}
    </div>
  </div>

  <!-- Dimension 1: Clarity -->
  <div style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;margin-bottom:20px">
    <div style="background:#f8fafc;padding:20px 24px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:4px">01</div>
        <div style="font-size:16px;font-weight:700;color:#111">Investor Communication &amp; Deck Clarity</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px">How well the deck communicates ideas in an investor-ready format</div>
      </div>
      <div style="font-size:15px;font-weight:700;color:#60a5fa;background:#eff6ff;padding:6px 12px;border-radius:6px;border:1px solid #bfdbfe">${d.clarityScore}/10</div>
    </div>
    <div style="padding:20px 24px">
      ${sectionBlock('Strengths', d.clarity?.strengths, '#059669')}
      ${sectionBlock('Weaknesses', d.clarity?.weaknesses, '#d97706')}
    </div>
  </div>

  <!-- Dimension 2: Narrative -->
  <div style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;margin-bottom:20px">
    <div style="background:#f8fafc;padding:20px 24px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:4px">02</div>
        <div style="font-size:16px;font-weight:700;color:#111">Narrative &amp; Founder Storytelling</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px">Whether the deck follows a logical, compelling investment narrative</div>
      </div>
      <div style="font-size:15px;font-weight:700;color:#818cf8;background:#f5f3ff;padding:6px 12px;border-radius:6px;border:1px solid #c4b5fd">${d.narrativeScore}/10</div>
    </div>
    <div style="padding:20px 24px">
      ${sectionBlock('Strengths', d.narrative?.strengths, '#059669')}
      ${sectionBlock('Weaknesses', d.narrative?.weaknesses, '#d97706')}
      ${sectionBlock('Insights', d.narrative?.insights, '#3b82f6')}
    </div>
  </div>

  <!-- Dimension 3: PS Fit -->
  <div style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;margin-bottom:20px">
    <div style="background:#f8fafc;padding:20px 24px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:4px">03</div>
        <div style="font-size:16px;font-weight:700;color:#111">Problem-Solution Fit (Investment Lens)</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px">Core validation: does the startup solve a real, scalable problem with a coherent solution?</div>
      </div>
      <div style="font-size:15px;font-weight:700;color:#059669;background:#f0fdf4;padding:6px 12px;border-radius:6px;border:1px solid #86efac">${d.psfitScore}/10</div>
    </div>
    <div style="padding:20px 24px">
      ${d.problemSolutionFit?.problemStatement ? `<div style="background:#f1f5f9;border-left:3px solid #60a5fa;padding:12px 16px;border-radius:4px;margin-bottom:16px;font-size:13px;color:#374151;line-height:1.6"><strong>Problem:</strong> ${d.problemSolutionFit.problemStatement}<br><strong>Solution:</strong> ${d.problemSolutionFit.solutionStatement}</div>` : ''}
      ${sectionBlock('Strengths', d.problemSolutionFit?.strengths, '#059669')}
      ${sectionBlock('Risks', d.problemSolutionFit?.risks, '#dc2626')}
      ${sectionBlock('Insights', d.problemSolutionFit?.insights, '#3b82f6')}
    </div>
  </div>

  <!-- Investor Intelligence Summary -->
  <div style="border:1px solid #e2e8f0;border-radius:16px;padding:28px;margin-bottom:20px">
    <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:20px">Investor Intelligence Summary</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#059669;margin-bottom:8px">Top Strength</div>
        <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">${d.investorSummary?.topStrength || '—'}</p>
      </div>
      <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#dc2626;margin-bottom:8px">Biggest Risk</div>
        <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">${d.investorSummary?.biggestRisk || '—'}</p>
      </div>
      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#d97706;margin-bottom:8px">Critical Gap</div>
        <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">${d.investorSummary?.criticalGap || '—'}</p>
      </div>
      <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;padding:16px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#2563eb;margin-bottom:8px">VC Recommendation</div>
        <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">${d.investorSummary?.vcRecommendation || '—'}</p>
      </div>
    </div>
  </div>

  <!-- Narrative Flow -->
  ${nsSections ? `<div style="border:1px solid #e2e8f0;border-radius:16px;padding:28px;margin-bottom:40px">
    <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:6px">Narrative Flow Analysis</div>
    <p style="font-size:12px;color:#6b7280;margin:0 0 18px">Coverage of expected pitch deck sections</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px">${nsSections}</div>
  </div>` : ''}

  <!-- Footer -->
  <div style="border-top:1px solid #e5e7eb;padding-top:20px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:12px;color:#9ca3af">
    <span><strong style="color:#374151">VentureAI</strong> — Built by Mohamed Dhia Al Islem Abidi</span>
    <span>Powered by Google Gemini AI</span>
  </div>

</body>
</html>`;

  const blob = new Blob([reportHTML], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `VentureAI_Report_${(d.startupName || 'startup').replace(/[^a-z0-9]/gi,'_')}.html`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─── Reset ───────────────────────────────────────────────────
function resetApp() {
  state.pdfText      = '';
  state.pastedText   = '';
  state.activeSample = '';
  state.isAnalyzing  = false;

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

  ['clarity','narrative','psfit'].forEach(d => {
    document.getElementById(`bar-${d}`).style.width = '0%';
  });

  clearFile();
  document.getElementById('sample-loaded').classList.add('hidden');
  ['airbnb','uber','buffer'].forEach(s =>
    document.getElementById(`sample-${s}`).classList.remove('selected')
  );

  document.getElementById('hero-section').scrollIntoView({ behavior: 'smooth' });
}

// ─── Helpers ─────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function animateNumber(id, from, to, duration, decimals = 0) {
  const el    = document.getElementById(id);
  const start = performance.now();
  function update(now) {
    const t    = Math.min((now - start) / duration, 1);
    const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    el.textContent = (from + (to - from) * ease).toFixed(decimals);
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function shakeElement(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 400);
}
