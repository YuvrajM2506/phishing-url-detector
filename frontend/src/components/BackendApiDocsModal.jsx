import React, { useState } from 'react';
import { FileCode2, Copy, Check, X, Server, Terminal, Layers } from 'lucide-react';

export default function BackendApiDocsModal({ isOpen, onClose }) {
  const [activeLang, setActiveLang] = useState('flask');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const flaskSnippet = `# app.py - Flask API for Phishing URL Detection
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for the React frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "message": "Phishing Detection Backend Online (Flask)"
    }), 200

@app.route('/api/scan', methods=['POST'])
def scan_url():
    data = request.get_json() or {}
    url = data.get('url', '')
    
    if not url:
        return jsonify({"error": "Missing URL parameter"}), 400

    # TODO: Connect your trained ML Model or Feature Extractor here!
    # Example feature extraction / model prediction:
    # is_phishing = model.predict(extract_features(url))
    # risk_score = calculate_score(url)

    # Return standardized JSON response
    return jsonify({
        "url": url,
        "score": 85,                        # 0 to 100
        "verdict": "HIGH_RISK",             # "SAFE" | "SUSPICIOUS" | "HIGH_RISK"
        "category": "High Risk",
        "summary": "Flagged by Random Forest model due to suspicious TLD and brand spoofing.",
        "model_name": "Random Forest URL Classifier v1.0",
        "flags": [
            {
                "id": "ml_anomaly",
                "severity": "high",
                "title": "Model Prediction: High Phishing Probability",
                "description": "The ML model classified this URL structural pattern as high risk.",
                "scoreImpact": 85
            }
        ]
    }), 200

if __name__ == '__main__':
    print("Starting Phishing Detector API on http://localhost:5000")
    app.run(port=5000, debug=True)
`;

  const fastApiSnippet = `# main.py - FastAPI for Phishing URL Detection
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="Phishing URL Detector API")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    url: str

class FlagItem(BaseModel):
    id: str
    severity: str  # "high" | "medium" | "low" | "info"
    title: str
    description: str
    scoreImpact: Optional[int] = None

class ScanResponse(BaseModel):
    url: str
    score: int                            # 0 to 100
    verdict: str                          # "SAFE" | "SUSPICIOUS" | "HIGH_RISK"
    category: str                         # "Safe" | "Suspicious" | "High Risk"
    summary: str
    model_name: Optional[str] = "FastAPI ML Classifier"
    flags: Optional[List[FlagItem]] = []

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "FastAPI Backend Live"}

@app.post("/api/scan", response_model=ScanResponse)
def scan_endpoint(req: ScanRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="URL is required")

    # Run ML prediction or rule analysis
    return ScanResponse(
        url=req.url,
        score=90,
        verdict="HIGH_RISK",
        category="High Risk",
        summary="High risk detected by neural classifier.",
        flags=[
            FlagItem(
                id="ml_prediction",
                severity="high",
                title="Neural Net Phishing Flag",
                description="Classified as phishing with 96.4% confidence.",
                scoreImpact=90
            )
        ]
    )

# Run with: uvicorn main:app --reload --port 8000
`;

  const currentCode = activeLang === 'flask' ? flaskSnippet : fastApiSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0c101c] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0f1424]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Backend Integration Contract</h3>
              <p className="text-xs text-slate-400 font-mono">Give this to your teammate building Python/Flask/FastAPI</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Quick instructions */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed">
            <p className="font-semibold text-cyan-300 mb-1">💡 How to connect Frontend with Backend:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Your teammate creates a Python server (Flask or FastAPI) using the template below.</li>
              <li>Ensure CORS is enabled so the React frontend can call it.</li>
              <li>Set <code className="text-cyan-300 font-mono bg-slate-900 px-1 py-0.5 rounded">VITE_API_BASE_URL=http://localhost:5000</code> in your <code className="text-cyan-300 font-mono bg-slate-900 px-1 py-0.5 rounded">.env</code> file.</li>
              <li>The frontend automatically routes requests to <code className="text-cyan-300 font-mono bg-slate-900 px-1 py-0.5 rounded">POST /api/scan</code>!</li>
            </ol>
          </div>

          {/* Lang Selector & Copy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveLang('flask')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeLang === 'flask' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python (Flask)
              </button>
              <button
                onClick={() => setActiveLang('fastapi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeLang === 'fastapi' 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python (FastAPI)
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code display */}
          <div className="relative">
            <pre className="p-4 rounded-xl bg-[#080b12] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-80">
              {currentCode}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
