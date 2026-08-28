import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UrlScanner from './components/UrlScanner';
import SampleUrls from './components/SampleUrls';
import ScanResults from './components/ScanResults';
import ScanHistory from './components/ScanHistory';
import BatchScanner from './components/BatchScanner';
import BackendApiDocsModal from './components/BackendApiDocsModal';
import { scanUrl, checkBackendStatus } from './services/api';
import { ShieldCheck, Lock, Activity, Sparkles, Terminal } from 'lucide-react';

const STORAGE_KEY = 'phishguard_scan_history_v1';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ online: false, url: '', message: 'Checking...' });

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (result) => {
    const newItem = {
      id: Date.now(),
      url: result.cleanUrl || result.url,
      score: result.score,
      verdict: result.verdict,
      category: result.category,
      timestamp: result.scanTimestamp || new Date().toISOString(),
    };

    setHistory((prev) => {
      // Prevent consecutive duplicate URLs
      const filtered = prev.filter((item) => item.url !== newItem.url);
      const updated = [newItem, ...filtered].slice(0, 50); // Keep last 50
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  // Check Backend health on mount
  useEffect(() => {
    checkBackendStatus().then(setBackendStatus);
    const interval = setInterval(() => {
      checkBackendStatus().then(setBackendStatus);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Perform Scan
  const handleScan = async (urlToScan) => {
    if (!urlToScan) return;
    setIsScanning(true);
    setCurrentUrl(urlToScan);

    try {
      const result = await scanUrl(urlToScan);
      setScanResult(result);
      saveToHistory(result);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Navigation Header */}
      <Navbar
        backendStatus={backendStatus}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onOpenBatchScanner={() => setIsBatchOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Scanner Bar */}
        <UrlScanner
          onScan={handleScan}
          isScanning={isScanning}
          initialUrl={currentUrl}
        />

        {/* Scan Results (If scan completed) */}
        {scanResult ? (
          <ScanResults
            result={scanResult}
            onRescan={handleScan}
          />
        ) : (
          /* Default state: Quick sample preset cards */
          <div className="mt-8">
            <SampleUrls
              onSelectSample={handleScan}
              isScanning={isScanning}
            />
          </div>
        )}

        {/* Live Security Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">Lexical & Heuristic DNA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examines IP hostname masking, @ auth characters, high-risk TLDs (.xyz, .top, .zip), and chained subdomains in real-time.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">Typosquatting Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Catches deceptive look-alike domains impersonating PayPal, Amazon, Google, Microsoft, Apple, Netflix, and major financial portals.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">FastAPI / Flask Backend Ready</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plug-and-play architecture. Runs client heuristics automatically and syncs with your team's Python backend when online.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#06080d] py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>PhishGuard URL Threat Intelligence Suite</span>
          </div>
          <div>
            Built with React & Tailwind CSS • Backend Ready for Python / Flask / FastAPI
          </div>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <ScanHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectUrl={handleScan}
        onClearHistory={handleClearHistory}
      />

      <BatchScanner
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        onSelectUrl={handleScan}
      />

      <BackendApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

    </div>
  );
}
