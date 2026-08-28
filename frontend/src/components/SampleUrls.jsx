import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';

const SAMPLES = [
  {
    category: 'safe',
    label: 'Safe URL',
    icon: CheckCircle2,
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/50',
    title: 'Google Official Web Portal',
    url: 'https://www.google.com/search?q=cybersecurity+threat+intel',
    reason: 'Legitimate root domain with valid SSL and standard structure.'
  },
  {
    category: 'safe',
    label: 'Safe URL',
    icon: CheckCircle2,
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/50',
    title: 'GitHub React Repository',
    url: 'https://github.com/facebook/react',
    reason: 'Verified developer organization repository.'
  },
  {
    category: 'suspicious',
    label: 'Suspicious URL',
    icon: AlertTriangle,
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
    hoverBorder: 'hover:border-amber-500/50',
    title: 'URL Shortener with Auth Keyword',
    url: 'https://bit.ly/secure-account-verification-portal',
    reason: 'Masked destination domain via shortener service.'
  },
  {
    category: 'suspicious',
    label: 'Suspicious URL',
    icon: AlertTriangle,
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
    hoverBorder: 'hover:border-amber-500/50',
    title: 'High-Risk TLD & Chained Subdomains',
    url: 'http://auth-client.portal.login-gateway.xyz/session',
    reason: 'Abused .xyz TLD, unencrypted HTTP & excessive subdomains.'
  },
  {
    category: 'phishing',
    label: 'High Risk / Phishing',
    icon: ShieldAlert,
    badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
    hoverBorder: 'hover:border-rose-500/50',
    title: 'PayPal Typosquat + Auth Symbol Spoof',
    url: 'http://192.168.1.100/@paypa1-security-verification.com/login.php',
    reason: 'Raw IP address host, @ delimiter spoof, and paypa1 typosquatting.'
  },
  {
    category: 'phishing',
    label: 'High Risk / Phishing',
    icon: ShieldAlert,
    badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
    hoverBorder: 'hover:border-rose-500/50',
    title: 'Netflix Urgent Billing Phish (.zip TLD)',
    url: 'http://netflix-billing-update-account-recovery.zip/signin',
    reason: 'Dangerous .zip TLD, brand impersonation, and multi-keyword bait.'
  }
];

export default function SampleUrls({ onSelectSample, isScanning }) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="flex items-center space-x-2 mb-3">
        <Zap className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          Instant Test Scenarios (1-Click Presets)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SAMPLES.map((sample, idx) => {
          const Icon = sample.icon;
          return (
            <button
              key={idx}
              type="button"
              disabled={isScanning}
              onClick={() => onSelectSample(sample.url)}
              className={`flex flex-col text-left p-3.5 rounded-xl bg-[#0d121f] border border-slate-800 ${sample.hoverBorder} hover:bg-[#121829] transition-all group disabled:opacity-50`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${sample.badgeColor}`}>
                  <Icon className="w-3 h-3" />
                  <span>{sample.label}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                  Run Test →
                </span>
              </div>
              
              <div className="font-medium text-xs text-slate-200 group-hover:text-white line-clamp-1 mb-1">
                {sample.title}
              </div>
              
              <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 truncate w-full mb-1.5">
                {sample.url}
              </div>

              <div className="text-[10px] text-slate-500 line-clamp-1">
                {sample.reason}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
