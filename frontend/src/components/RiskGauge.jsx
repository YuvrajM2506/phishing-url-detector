import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame } from 'lucide-react';

export default function RiskGauge({ score = 0, verdict = 'SAFE' }) {
  // Clamp score
  const clampedScore = Math.min(Math.max(score, 0), 100);

  // SVG Gauge calculations (Semi-circle radius 80)
  const radius = 75;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Colors based on risk levels
  let theme = {
    gradient: 'url(#safe-gradient)',
    glow: 'shadow-neon-safe',
    textColor: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-950/30',
    label: 'SAFE',
    badge: '✅ Safe',
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    icon: ShieldCheck,
    subtext: 'Low to Zero Phishing Risk'
  };

  if (clampedScore >= 66 || verdict === 'HIGH_RISK') {
    theme = {
      gradient: 'url(#danger-gradient)',
      glow: 'shadow-neon-danger',
      textColor: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/30',
      label: 'HIGH RISK',
      badge: '🚨 High Risk',
      badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-500/40 animate-pulse',
      icon: Flame,
      subtext: 'Critical Threat / Likely Phishing'
    };
  } else if (clampedScore >= 26 || verdict === 'SUSPICIOUS') {
    theme = {
      gradient: 'url(#warn-gradient)',
      glow: 'shadow-neon-warn',
      textColor: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/30',
      label: 'SUSPICIOUS',
      badge: '⚠️ Suspicious',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      icon: AlertTriangle,
      subtext: 'Caution Advised / Unverified'
    };
  }

  const IconComponent = theme.icon;

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0e1320] border ${theme.border} ${theme.glow} transition-all duration-500`}>
      
      {/* Risk Badge Header */}
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center space-x-2">
          <IconComponent className={`w-5 h-5 ${theme.textColor}`} />
          <span className="text-xs font-mono tracking-wider uppercase text-slate-400">Risk Assessment</span>
        </div>
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${theme.badgeClass}`}>
          {theme.badge}
        </span>
      </div>

      {/* SVG Semicircular Gauge */}
      <div className="relative w-56 h-32 flex items-center justify-center overflow-hidden mt-2">
        <svg viewBox="0 0 200 120" className="w-full h-full transform -rotate-180 origin-center">
          <defs>
            <linearGradient id="safe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="warn-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="danger-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 25,110 A 75,75 0 0,1 175,110"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 25,110 A 75,75 0 0,1 175,110"
            fill="none"
            stroke={theme.gradient}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 top-7 flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold font-mono tracking-tight ${theme.textColor}`}>
            {clampedScore}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Threat Score / 100
          </span>
        </div>
      </div>

      {/* Subtext and Scale Bar */}
      <div className="w-full mt-1 pt-3 border-t border-slate-800/80 flex flex-col items-center">
        <p className="text-xs text-slate-300 font-medium text-center">{theme.subtext}</p>
        
        {/* Visual 3-step range bar */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
          <span className="flex items-center text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1"></span>0-25 Safe</span>
          <span className="flex items-center text-amber-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1"></span>26-65 Suspicious</span>
          <span className="flex items-center text-rose-400"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1"></span>66-100 High Risk</span>
        </div>
      </div>

    </div>
  );
}
