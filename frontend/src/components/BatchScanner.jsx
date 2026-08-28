import React, { useState } from 'react';
import { Layers, Play, CheckCircle2, AlertTriangle, ShieldAlert, X, Loader2 } from 'lucide-react';
import { scanUrl } from '../services/api';

export default function BatchScanner({ isOpen, onClose, onSelectUrl }) {
  const [inputUrls, setInputUrls] = useState(
    "https://www.google.com\nhttp://paypa1-security-verification.com/login.php\nhttps://bit.ly/secure-banking-update\nhttp://192.168.1.1/admin-login\nhttps://github.com/facebook/react"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleRunBatch = async () => {
    const lines = inputUrls
      .split('\n')
      .map(u => u.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    setIsRunning(true);
    setResults([]);
    setProgress(0);

    const batchResults = [];
    for (let i = 0; i < lines.length; i++) {
      const targetUrl = lines[i];
      try {
        const res = await scanUrl(targetUrl);
        batchResults.push(res);
      } catch (err) {
        batchResults.push({
          url: targetUrl,
          score: 50,
          verdict: 'SUSPICIOUS',
          category: 'Error / Suspicious',
          statusBadge: '⚠️ Unreachable',
          summary: 'Failed to inspect link: ' + err.message,
          flags: []
        });
      }
      setProgress(Math.round(((i + 1) / lines.length) * 100));
      setResults([...batchResults]);
    }

    setIsRunning(false);
  };

  const getVerdictTag = (verdict, score) => {
    if (score >= 66 || verdict === 'HIGH_RISK') {
      return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">🚨 High Risk ({score})</span>;
    }
    if (score >= 26 || verdict === 'SUSPICIOUS') {
      return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">⚠️ Suspicious ({score})</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">✅ Safe ({score})</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0c101c] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0f1424]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Batch URL Scanner</h3>
              <p className="text-xs text-slate-400 font-mono">Scan multiple web links simultaneously</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Enter URLs (one per line):
            </label>
            <textarea
              rows={4}
              value={inputUrls}
              onChange={(e) => setInputUrls(e.target.value)}
              disabled={isRunning}
              placeholder="https://example.com&#10;http://phishing-site.xyz"
              className="w-full p-3 rounded-xl bg-[#111726] border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={isRunning}
              onClick={handleRunBatch}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 disabled:opacity-60 transition-all shadow-md"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Batch Scan</span>
                </>
              )}
            </button>

            {isRunning && (
              <span className="text-xs font-mono text-cyan-400">{progress}% Completed</span>
            )}
          </div>

          {/* Results Table */}
          {results.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-2">
                Batch Scan Results ({results.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {results.map((res, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#111726] border border-slate-800 text-xs"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-mono text-slate-200 truncate" title={res.url}>
                        {res.url}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {res.summary}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      {getVerdictTag(res.verdict, res.score)}
                      <button
                        onClick={() => {
                          onSelectUrl(res.url);
                          onClose();
                        }}
                        className="text-[11px] font-mono text-cyan-400 hover:underline"
                      >
                        Inspect Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
