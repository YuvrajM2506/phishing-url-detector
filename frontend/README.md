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

5. **Activity History & Export**:
   - Scans stored locally in browser `localStorage`.
   - Export scan reports to **JSON** or **CSV**.

6. **Dual Mode (Client Heuristics & Python API Ready)**:
   - Works immediately standalone with built-in client heuristics.
   - Automatically connects to your teammate's Python/Flask/FastAPI backend when running!

---

## 🚀 Quick Start

### 1. Install & Run Frontend

```bash
# Clone or navigate to the directory
npm install

# Start the local development server
npm run dev
```

The application will open on `http://localhost:5173`.

---

## 🤝 Connecting to Python Backend (Flask / FastAPI)

When your teammate is ready with the backend, follow these 2 simple steps:

### 1. Create a `.env` file in this directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```
*(Use `http://localhost:8000` if using FastAPI)*

### 2. Backend API Endpoint Specification

Your teammate should expose a `POST /api/scan` endpoint.

#### Request Payload:
```json
{
  "url": "http://paypa1-security-verify.xyz/login"
}
```

#### Expected Response:
```json
{
  "url": "http://paypa1-security-verify.xyz/login",
  "score": 85,
  "verdict": "HIGH_RISK",
  "category": "High Risk",
  "summary": "Flagged by ML classifier due to high typosquatting probability and suspicious TLD.",
  "flags": [
    {
      "id": "brand_spoof",
      "severity": "high",
      "title": "PayPal Impersonation",
      "description": "Domain mimics PayPal brand structure.",
      "scoreImpact": 85
    }
  ]
}
```

> **Note**: Click the **"Backend Docs"** button in the app header to view and copy complete starter templates for Python Flask (`app.py`) and FastAPI (`main.py`).

---

## 🛠️ Project Structure

```
├── src/
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
```
