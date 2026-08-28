import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, FileCode2, History, Layers } from 'lucide-react';

export default function Navbar({ 
  backendStatus, 
  onOpenApiDocs, 
  onOpenBatchScanner, 
  onToggleHistory, 
  historyCount 
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-400 shadow-neon-cyan">
            <ShieldCheck className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-emerald-400 bg-clip-text text-transparent">
                PhishGuard
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-300 bg-cyan-950/40">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">AI & Rule-Based URL Threat Intelligence</p>
          </div>
        </div>

        {/* Action Controls & Backend Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Backend Connection Indicator */}
          <div 
            title={backendStatus?.online ? `Connected to ${backendStatus.url}` : 'Backend offline - Built-in Heuristics Active'}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-mono"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                backendStatus?.online ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                backendStatus?.online ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </span>
            <span className="hidden md:inline text-slate-300">
              {backendStatus?.online ? 'Python API' : 'Heuristic Engine'}
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
              backendStatus?.online ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {backendStatus?.online ? 'ONLINE' : 'CLIENT'}
            </span>
          </div>

          {/* Batch Scanner Button */}
          <button
            onClick={onOpenBatchScanner}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 rounded-lg transition-all"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Batch Scan</span>
          </button>

          {/* History Toggle */}
          <button
            onClick={onToggleHistory}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 rounded-lg transition-all"
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          {/* Backend API Specs Modal Trigger */}
          <button
            onClick={onOpenApiDocs}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-100 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 rounded-lg transition-all shadow-sm"
          >
            <FileCode2 className="w-4 h-4 text-cyan-400" />
            <span className="font-mono">Backend Docs</span>
          </button>
        </div>

      </div>
    </header>
  );
}
