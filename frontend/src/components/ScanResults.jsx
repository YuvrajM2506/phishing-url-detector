import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, 
  Share2, Check, ExternalLink, ShieldX, RefreshCw 
} from 'lucide-react';
import RiskGauge from './RiskGauge';
import ThreatBreakdown from './ThreatBreakdown';

export default function ScanResults({ result, onRescan }) {
  const [copiedReport, setCopiedReport] = useState(false);

  useEffect(() => {
    // If URL is safe, celebrate with a micro confetti blast!
    if (result && result.verdict === 'SAFE') {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#34d399', '#06b6d4']
        });
      } catch (e) {
        // Safe fail
      }
    }
  }, [result?.url, result?.verdict]);

  if (!result) return null;

  const { score, verdict, category, cleanUrl, statusBadge, summary, source } = result;

  const handleCopyReport = () => {
    const reportText = `🛡️ PhishGuard Security Report:
URL: ${cleanUrl}
Risk Score: ${score}/100
Verdict: ${statusBadge}
Analysis: ${summary}
Scan Timestamp: ${new Date().toLocaleString()}`;
    
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Verdict theme variables
  let verdictStyle = {
    bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
    titleColor: 'text-emerald-400',
    icon: ShieldCheck,
    adviceTitle: 'Recommended Action: Safe to Visit',
    adviceDesc: 'This URL passed our structural, SSL, lexical, and brand impersonation heuristic checks with a low threat score.'
  };

  if (verdict === 'HIGH_RISK') {
    verdictStyle = {
      bg: 'bg-rose-950/40 border-rose-500/40 text-rose-300',
      titleColor: 'text-rose-400',
      icon: ShieldX,
      adviceTitle: 'CRITICAL: Block & Avoid Navigation',
      adviceDesc: 'High risk of phishing, credential harvesting, or deceptive hosting. Do NOT enter credentials or submit any personal information.'
    };
  } else if (verdict === 'SUSPICIOUS') {
    verdictStyle = {
      bg: 'bg-amber-950/40 border-amber-500/40 text-amber-300',
      titleColor: 'text-amber-400',
      icon: AlertTriangle,
      adviceTitle: 'Caution: Exercise Extreme Vigilance',
      adviceDesc: 'This link contains unusual parameters, an obscured domain, or unverified hosting. Verify the true sender before proceeding.'
    };
  }

  const VerdictIcon = verdictStyle.icon;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fadeIn">
      
      {/* Top Banner & URL Readout */}
      <div className="flex flex-col md:flex-row items-stretch gap-4">
        
        {/* Left: Main Verdict Summary Card */}
        <div className={`flex-1 p-6 rounded-2xl border ${verdictStyle.bg} backdrop-blur-sm flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2">
                <VerdictIcon className={`w-6 h-6 ${verdictStyle.titleColor}`} />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                  Scan Completed
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase border ${
                verdict === 'HIGH_RISK' ? 'bg-rose-900/60 text-rose-200 border-rose-600' :
                verdict === 'SUSPICIOUS' ? 'bg-amber-900/60 text-amber-200 border-amber-600' :
                'bg-emerald-900/60 text-emerald-200 border-emerald-600'
              }`}>
                {statusBadge}
              </span>
            </div>

            <h2 className={`text-2xl sm:text-3xl font-extrabold ${verdictStyle.titleColor} mb-2`}>
              {category} Verdict
            </h2>

            <div className="p-3 rounded-xl bg-[#080b12]/80 border border-slate-800 font-mono text-xs text-slate-300 break-all mb-4">
              <span className="text-slate-500 select-none mr-1.5">Target:</span>
              <span className="text-cyan-300">{cleanUrl}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-4">
              <h4 className="text-xs font-semibold text-slate-200 mb-1">{verdictStyle.adviceTitle}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{verdictStyle.adviceDesc}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
            <button
              onClick={handleCopyReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedReport ? 'Report Copied!' : 'Share / Copy Report'}</span>
            </button>

            <button
              onClick={() => onRescan(cleanUrl)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Re-Scan</span>
            </button>
          </div>
        </div>

        {/* Right: Semi-circular Risk Gauge */}
        <div className="w-full md:w-80 shrink-0">
          <RiskGauge score={score} verdict={verdict} />
        </div>

      </div>

      {/* Deep Threat Breakdown with Diagnostic Tabs */}
      <ThreatBreakdown result={result} />

    </div>
  );
}
