import React, { useState } from 'react';
import { 
  AlertOctagon, AlertTriangle, Info, CheckCircle, 
  Dna, FileText, Code, Copy, Check, Lock, Unlock, 
  Hash, Server, Globe, ExternalLink 
} from 'lucide-react';

export default function ThreatBreakdown({ result }) {
  const [activeTab, setActiveTab] = useState('flags');
  const [copiedJson, setCopiedJson] = useState(false);

  if (!result) return null;

  const { flags = [], metrics = {}, summary = '', source, engine } = result;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'high':
        return {
          icon: AlertOctagon,
          class: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
          label: 'CRITICAL'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          class: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
          label: 'WARNING'
        };
      case 'low':
        return {
          icon: Info,
          class: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
          label: 'MINOR'
        };
      default:
        return {
          icon: CheckCircle,
          class: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
          label: 'CLEAN'
        };
    }
  };

  return (
    <div className="w-full bg-[#0d121f] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl mt-6">
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center space-x-1 sm:space-x-2">
          
          <button
            onClick={() => setActiveTab('flags')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeTab === 'flags'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Threat Flags ({flags.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeTab === 'metrics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>URL DNA & Attributes</span>
          </button>

          <button
            onClick={() => setActiveTab('explanation')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeTab === 'explanation'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Threat Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeTab === 'json'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Developer Payload</span>
          </button>

        </div>

        <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
          Engine: <span className="text-cyan-400">{engine || 'Heuristics Engine'}</span>
        </div>
      </div>

      {/* TAB 1: Triggered Threat Flags */}
      {activeTab === 'flags' && (
        <div className="space-y-3">
          {flags.length === 0 ? (
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>No malicious or suspicious signatures identified for this URL.</span>
            </div>
          ) : (
            flags.map((flag, idx) => {
              const badge = getSeverityBadge(flag.severity);
              const SevIcon = badge.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start justify-between gap-3 p-4 rounded-xl bg-[#111726] border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg border ${badge.class} shrink-0 mt-0.5`}>
                      <SevIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-semibold text-slate-100">{flag.title}</h4>
                        {flag.category && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {flag.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{flag.description}</p>
                    </div>
                  </div>

                  {flag.scoreImpact !== undefined && (
                    <div className="shrink-0 self-end sm:self-center">
                      <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${
                        flag.scoreImpact > 0 ? 'bg-rose-950/50 text-rose-300 border-rose-800' : 'bg-emerald-950/50 text-emerald-300 border-emerald-800'
                      }`}>
                        {flag.scoreImpact > 0 ? `+${flag.scoreImpact} Risk` : '0 Impact'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: URL DNA & Technical Metrics */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Protocol & Encryption</span>
            <div className="flex items-center space-x-2 mt-1">
              {metrics.hasHttps ? (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-emerald-300 text-sm">HTTPS (SSL Secure)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-rose-400" />
                  <span className="font-semibold text-rose-300 text-sm">HTTP (Insecure)</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Host / Domain Type</span>
            <div className="flex items-center space-x-2 mt-1">
              <Server className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-200 text-sm">
                {metrics.isIp ? 'Raw IP Host (High Risk)' : 'Standard Domain'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Top-Level Domain (TLD)</span>
            <div className="flex items-center space-x-2 mt-1">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold font-mono text-slate-200 text-sm">{metrics.tld || '.com'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Subdomain Depth</span>
            <div className="flex items-center space-x-2 mt-1">
              <Hash className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold font-mono text-slate-200 text-sm">
                {metrics.subdomainCount} {metrics.subdomainCount === 1 ? 'level' : 'levels'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">URL Length</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`font-semibold font-mono text-sm ${metrics.urlLength > 75 ? 'text-amber-400' : 'text-slate-200'}`}>
                {metrics.urlLength} characters
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Shannon Entropy</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`font-semibold font-mono text-sm ${metrics.entropy > 4.0 ? 'text-amber-400' : 'text-slate-200'}`}>
                {metrics.entropy || '0.00'} (Randomness)
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Target Port</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="font-semibold font-mono text-slate-200 text-sm">Port :{metrics.port}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Sensitive Keywords</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`font-semibold font-mono text-sm ${metrics.keywordHits?.length ? 'text-rose-400' : 'text-emerald-400'}`}>
                {metrics.keywordHits?.length ? metrics.keywordHits.join(', ') : 'None'}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: AI Threat Analysis Narrative */}
      {activeTab === 'explanation' && (
        <div className="p-5 rounded-xl bg-[#111726] border border-slate-800 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-cyan-300 font-mono uppercase tracking-wider mb-2">
              Security Verdict & Actionable Advisory
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {summary}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <h5 className="text-xs font-semibold text-slate-300 uppercase font-mono mb-2">
              Why Are Phishing URLs Dangerous?
            </h5>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-300">Credential Theft:</strong> Fake login interfaces mimic banking, email, or social media to steal usernames & passwords.</li>
              <li><strong className="text-slate-300">Drive-By Malware:</strong> Malicious links can initiate background downloads of keyloggers or ransomware.</li>
              <li><strong className="text-slate-300">Brand Impersonation:</strong> Using similar characters (e.g. replacing 'l' with '1') to deceive victims into trust.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: Developer Raw JSON Payload */}
      {activeTab === 'json' && (
        <div className="relative">
          <div className="flex items-center justify-between pb-2 mb-2 text-xs font-mono text-slate-400 border-b border-slate-800">
            <span>JSON Output (REST API Schema Compatible)</span>
            <button
              onClick={handleCopyJson}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#080b12] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}
