import React from 'react';
import { History, Trash2, Download, ExternalLink, X, RotateCcw } from 'lucide-react';

export default function ScanHistory({ 
  isOpen, 
  onClose, 
  history = [], 
  onSelectUrl, 
  onClearHistory 
}) {
  if (!isOpen) return null;

  const exportAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishguard_scan_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsCsv = () => {
    if (history.length === 0) return;
    const headers = ['URL', 'Verdict', 'Risk Score', 'Timestamp'];
    const rows = history.map(item => [
      `"${item.url.replace(/"/g, '""')}"`,
      item.verdict,
      item.score,
      `"${item.timestamp}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `phishguard_scan_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getVerdictBadge = (verdict, score) => {
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
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0f1424]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Scan Activity History</h3>
              <p className="text-xs text-slate-400 font-mono">Stored in browser local storage ({history.length} scans)</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / History List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <History className="w-12 h-12 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-sm">No URLs scanned yet.</p>
              <p className="text-xs text-slate-600 mt-1">Run a scan or click an instant test scenario to record history.</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div 
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#111726] border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center space-x-2 mb-1">
                    {getVerdictBadge(item.verdict, item.score)}
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-slate-300 truncate" title={item.url}>
                    {item.url}
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onSelectUrl(item.url);
                      onClose();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Scan</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer with Actions */}
        {history.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-t border-slate-800 bg-[#0a0d17]">
            <div className="flex items-center space-x-2">
              <button
                onClick={exportAsJson}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={exportAsCsv}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>

            <button
              onClick={onClearHistory}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
