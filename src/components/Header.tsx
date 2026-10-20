import React from 'react';
import {
  Globe,
  Database,
  Terminal,
  Layers,
  Key,
  Clock,
  Download,
  Settings,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { MOODLE_FUNCTIONS } from '../data/moodleFunctions';
import { generatePostmanCollection } from '../utils/codeGenerators';
import { BrasaoPmpe } from './BrasaoPmpe';

interface HeaderProps {
  activeTab: 'tutor' | 'explorer' | 'lms' | 'setup' | 'history';
  setActiveTab: (tab: 'tutor' | 'explorer' | 'lms' | 'setup' | 'history') => void;
  mode: 'sandbox' | 'live';
  setMode: (mode: 'sandbox' | 'live') => void;
  moodleUrl: string;
  token: string;
  onOpenConnectionModal: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  mode,
  setMode,
  moodleUrl,
  token,
  onOpenConnectionModal,
  historyCount,
}) => {
  const handleExportPostman = () => {
    const json = generatePostmanCollection(MOODLE_FUNCTIONS, moodleUrl, token);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Moodle_WS_Collection_${new Date().toISOString().slice(0, 10)}.postman_collection.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand com o Brasão da PMPE EAD */}
          <div className="flex items-center space-x-3">
            <BrasaoPmpe size="md" className="p-0.5 rounded-lg bg-white/10 border border-white/20 shadow-md" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">PMPE • DEIP</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold">
                  EAD / CEaD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Tutor PVI & Ambiente de Instrução Policial Militar
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tutor'
                  ? 'bg-orange-500 text-white shadow-sm ring-1 ring-orange-400/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Tutor PVI</span>
              <span className="ml-1 px-1.5 py-0.2 text-[9px] rounded bg-blue-500/30 text-blue-200 border border-blue-400/40 font-mono uppercase">
                400x1000
              </span>
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'explorer'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>API Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('lms')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'lms'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>LMS Visualizer</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded bg-white/20 text-white font-mono">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('setup')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'setup'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Setup & Tokens</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                activeTab === 'history'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Logs</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-700 text-slate-300 font-mono">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>

          {/* Environment Mode Switch & Config */}
          <div className="flex items-center space-x-2">
            {/* Mode Indicator Button */}
            <button
              onClick={onOpenConnectionModal}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                mode === 'sandbox'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
              }`}
              title="Click to configure environment & connection"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    mode === 'sandbox' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    mode === 'sandbox' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="font-medium">
                {mode === 'sandbox' ? 'Apex Sandbox' : 'Live Host'}
              </span>
              <Settings className="w-3 h-3 text-slate-400 ml-1" />
            </button>

            {/* Export Postman Collection */}
            <button
              onClick={handleExportPostman}
              title="Download Postman v2.1 Collection JSON"
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Postman</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-2 py-1 rounded ${activeTab === 'tutor' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
          >
            Tutor PVI
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-2 py-1 rounded ${activeTab === 'explorer' ? 'text-orange-400 font-bold' : 'text-slate-400'}`}
          >
            Explorer
          </button>
          <button
            onClick={() => setActiveTab('lms')}
            className={`px-3 py-1 rounded ${activeTab === 'lms' ? 'text-orange-400 font-bold' : 'text-slate-400'}`}
          >
            LMS Visualizer
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1 rounded ${activeTab === 'setup' ? 'text-orange-400 font-bold' : 'text-slate-400'}`}
          >
            Setup
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded ${activeTab === 'history' ? 'text-orange-400 font-bold' : 'text-slate-400'}`}
          >
            Logs ({historyCount})
          </button>
        </div>
      </div>
    </header>
  );
};
