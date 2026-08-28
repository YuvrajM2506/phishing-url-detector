# 🔐 PhishGuard — Phishing URL Threat Detector (React Frontend)

A cybersecurity web application for analyzing, scoring, and explaining suspicious URLs in real-time. Built with **React 19**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🌟 Features & Capabilities

1. **Three-Tier Threat Classification**:
   - 🟢 **Safe** (Threat Score: 0 – 25)
   - 🟡 **Suspicious** (Threat Score: 26 – 65)
   - 🔴 **High Risk / Phishing** (Threat Score: 66 – 100)

2. **In-Depth Threat Breakdown ("Why Was It Flagged?")**:
   - **Lexical & Host Inspection**: Detects raw IP addresses used as hostnames, `@` basic auth spoofs, double slashes `//` in paths, and excessive hyphens.
   - **Brand Impersonation & Typosquatting**: Identifies look-alike domains targeting PayPal, Amazon, Google, Microsoft, Apple, Netflix, banks, crypto wallets, and more.
   - **High-Risk TLDs**: Flags dangerous or disposable top-level domains (`.xyz`, `.top`, `.tk`, `.zip`, `.cfd`, etc.).
   - **Shannon Entropy**: Measures domain character randomness to detect Domain Generation Algorithms (DGAs).
   - **Security Protocol**: Identifies unencrypted HTTP links targeting sensitive authentication actions.

3. **1-Click Test Scenarios**:
   - Built-in Safe, Suspicious, and Phishing preset buttons for rapid demonstrations.

4. **Batch URL Scanner**:
   - Inspect multiple URLs simultaneously with a live progress bar.

5. **Activity History & Export├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Header with live backend connection status
│   │   ├── UrlScanner.jsx           # Main input bar with paste & format validation
│   │   ├── RiskGauge.jsx            # SVG Semicircular HUD risk meter (0-100)
│   │   ├── ScanResults.jsx          # Top-level verdict & recommendations
│   │   ├── ThreatBreakdown.jsx      # Diagnostic tabs (Flags, DNA, AI summary, JSON)
│   │   ├── SampleUrls.jsx           # 1-click test scenarios
│   │   ├── ScanHistory.jsx          # History drawer with JSON/CSV export
│   │   ├── BatchScanner.jsx         # Multi-URL parallel scanner
│   │   └── BackendApiDocsModal.jsx  # Flask / FastAPI documentation modal
│   ├── services/
│   │   ├── api.js                   # Dual-mode API service with automatic fallback
│   │   └── heuristicEngine.js       # Client-side rule & feature analysis engine
│   ├── utils/
│   │   └── urlParser.js             # Safe URL parsing & Shannon entropy calculation
│   ├── App.jsx                      # Master layout & state management
│   ├── index.css                    # Tailwind cyber styling & glow animations
│   └── main.jsx
├── .env.example
├── tailwind.config.js
└── package.json

6. 
