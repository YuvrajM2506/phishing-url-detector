# PhishGuard — Phishing URL Threat Detector

A cybersecurity web application for analyzing, scoring, and explaining suspicious URLs in real time.

Built with **React 19**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## Features

### 1. Three-Tier Threat Classification

PhishGuard classifies URLs into three threat levels based on their threat score:

- **Safe** — Threat Score: 0–25
- **Suspicious** — Threat Score: 26–65
- **High Risk / Phishing** — Threat Score: 66–100

### 2. Threat Breakdown

The application provides an explanation of why a URL was flagged.

#### Lexical and Host Inspection

Analyzes URL characteristics such as:

- Raw IP addresses used as hostnames
- `@` symbols used for potential authentication spoofing
- Double slashes in URL paths
- Excessive hyphens

#### Brand Impersonation and Typosquatting

Identifies potentially suspicious look-alike domains targeting services and brands such as:

- PayPal
- Amazon
- Google
- Microsoft
- Apple
- Netflix
- Banks
- Cryptocurrency wallets

#### High-Risk TLD Detection

Checks for potentially suspicious or disposable top-level domains, including:

- `.xyz`
- `.top`
- `.tk`
- `.zip`
- `.cfd`

#### Shannon Entropy Analysis

Uses Shannon entropy to measure character randomness in domains and identify potentially generated or unusual domain names.

#### Security Protocol Analysis

Identifies unencrypted HTTP URLs, particularly when they appear to involve sensitive authentication-related actions.

---

## 3. Test Scenarios

The application provides preset URLs for quickly demonstrating different threat categories:

- Safe
- Suspicious
- Phishing

These allow users to test the application without manually entering URLs.

---

## 4. Batch URL Scanner

Analyze multiple URLs in a single operation.

The batch scanner provides:

- Multiple URL analysis
- Parallel scanning
- Live progress indication
- Individual results for each URL

---

## 5. Activity History and Export

The application maintains a history of previously analyzed URLs.

Supported functionality includes:

- Viewing previous scans
- Reviewing scan results
- Exporting scan data as JSON
- Exporting scan data as CSV

---

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── UrlScanner.jsx
│   │   ├── RiskGauge.jsx
│   │   ├── ScanResults.jsx
│   │   ├── ThreatBreakdown.jsx
│   │   ├── SampleUrls.jsx
│   │   ├── ScanHistory.jsx
│   │   ├── BatchScanner.jsx
│   │   └── BackendApiDocsModal.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── heuristicEngine.js
│   │
│   ├── utils/
│   │   └── urlParser.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── tailwind.config.js
└── package.json
