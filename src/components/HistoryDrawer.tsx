import React, { useState } from 'react';
import {
  Clock,
  Trash2,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { MoodleApiExecutionLog } from '../types/moodle';

interface HistoryDrawerProps {
  logs: MoodleApiExecutionLog[];
  onClearLogs: () => void;
  onSelectLog: (log: MoodleApiExecutionLog) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  logs,
  onClearLogs,
  onSelectLog,
}) => {
  const [filter, setFilter] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.functionName.toLowerCase().includes(filter.toLowerCase()) ||
      l.mode.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <h1 className="text-base font-bold text-white">Execution Logs & Request Audit</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              History of all executed Moodle Web Service requests with status codes and payload latency.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter logs..."
                className="bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:border-orange-500"
              />
            </div>

            {logs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900/40 text-xs font-medium transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
            <Clock className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No requests recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Requests executed in the API Explorer or LMS Workbench will be logged here with complete payload parameters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.isException || log.status >= 400
                          ? 'bg-red-950 text-red-400 border border-red-800/60'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {log.isException ? 'EXCEPTION' : `${log.status} OK`}
                    </span>

                    <span className="font-mono text-xs font-bold text-orange-400">
                      {log.functionName}
                    </span>

                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                      {log.mode}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()} • {log.durationMs}ms • Params:{' '}
                    {Object.keys(log.params).length > 0 ? JSON.stringify(log.params) : 'None'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onSelectLog(log)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                  >
                    <span>View Inspector</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
