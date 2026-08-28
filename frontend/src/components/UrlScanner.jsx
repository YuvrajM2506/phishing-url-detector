import React, { useState } from 'react';
import { Search, Globe, Clipboard, X, Loader2, Sparkles, ArrowRight } from 'lucide-react';

export default function UrlScanner({ onScan, isScanning, initialUrl = '' }) {
  const [url, setUrl] = useState(initialUrl);
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setInputError('Please enter or paste a URL to analyze.');
      return;
    }
    setInputError('');
    onScan(trimmed);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setInputError('');
      }
    } catch (err) {
      // Browser clipboard permission denied or not supported
      console.warn('Clipboard read failed:', err);
    }
  };

  const handleClear = () => {
    setUrl('');
    setInputError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Lexical, Heuristic & Machine Learning Security Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Phishing & Malicious <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-200 bg-clip-text text-transparent">URL Detector</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Inspect suspicious web links before clicking. Detects typosquatting, credential harvesting keywords, IP hosts, anomalous TLDs, and structural redirection threats.
        </p>
      </div>

      {/* Main Search Bar Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex flex-col sm:flex-row items-center gap-2 p-2 bg-[#0f1422] border border-slate-700/70 rounded-2xl shadow-2xl focus-within:border-cyan-500/80 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all duration-300">
          
          {/* Input Area */}
          <div className="flex items-center flex-1 w-full px-3 py-1.5 space-x-3">
            <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (inputError) setInputError('');
              }}
              placeholder="Paste or type URL to analyze (e.g. http://paypa1-security.xyz/login)..."
              disabled={isScanning}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base font-mono focus:outline-none disabled:opacity-50"
            />
            
            {/* Quick Action Icons (Clear / Paste) */}
            {url && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <button
              type="button"
              onClick={handlePaste}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors shrink-0"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paste</span>
            </button>
          </div>

          {/* Scan Submit Button */}
          <button
            type="submit"
            disabled={isScanning}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 transition-all transform active:scale-98 shrink-0"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Scanning DNA...</span>
              </>
            ) : (
              <>
                <span>Inspect URL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </div>

        {/* Input Error Message */}
        {inputError && (
          <div className="mt-2 text-rose-400 text-xs font-mono flex items-center space-x-1 pl-2">
            <span>⚠️ {inputError}</span>
          </div>
        )}

      </form>

    </div>
  );
}
