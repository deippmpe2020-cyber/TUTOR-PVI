import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Code2,
  Sliders,
  Send,
  Loader2,
  Lock,
  Globe,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { MOODLE_FUNCTIONS } from '../data/moodleFunctions';
import { MoodleFunctionDoc, MoodleParameter, MoodleApiExecutionLog } from '../types/moodle';
import { executeMoodleRequest, ExecuteResult } from '../utils/moodleClient';
import { ResponseViewer } from './ResponseViewer';

interface ApiExplorerProps {
  mode: 'sandbox' | 'live';
  moodleUrl: string;
  token: string;
  onOpenSettings: () => void;
  onLogExecution: (log: MoodleApiExecutionLog) => void;
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({
  mode,
  moodleUrl,
  token,
  onOpenSettings,
  onLogExecution,
}) => {
  const [selectedFunction, setSelectedFunction] = useState<MoodleFunctionDoc>(MOODLE_FUNCTIONS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<ExecuteResult | null>(null);

  // Custom function mode
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customFunctionName, setCustomFunctionName] = useState<string>('');
  const [customParamsJson, setCustomParamsJson] = useState<string>('{}');

  // Categories
  const categories = ['All', 'Core & Site', 'Courses', 'Users & Enrolment', 'Assignments', 'Grades', 'Quizzes', 'Forums & Messages', 'Calendar'];

  // Initialize parameters when selected function changes
  useEffect(() => {
    const initial: Record<string, any> = {};
    selectedFunction.parameters.forEach((param) => {
      if (param.default !== undefined) {
        initial[param.name] = param.default;
      } else if (param.example !== undefined) {
        initial[param.name] = param.example;
      }
    });
    setParamValues(initial);
  }, [selectedFunction]);

  // Filtered function list
  const filteredFunctions = MOODLE_FUNCTIONS.filter((func) => {
    const matchesCat = categoryFilter === 'All' || func.category === categoryFilter;
    const matchesSearch =
      func.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      func.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleParamChange = (paramName: string, value: any, type: string) => {
    let parsedValue = value;
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    } else if (type === 'boolean') {
      parsedValue = value ? 1 : 0;
    }
    setParamValues((prev) => ({
      ...prev,
      [paramName]: parsedValue,
    }));
  };

  const handleJsonParamChange = (paramName: string, text: string) => {
    try {
      const parsed = JSON.parse(text);
      setParamValues((prev) => ({ ...prev, [paramName]: parsed }));
    } catch {
      // Keep raw string for editing
      setParamValues((prev) => ({ ...prev, [paramName]: text }));
    }
  };

  const handleLoadSampleData = () => {
    const samples: Record<string, any> = {};
    selectedFunction.parameters.forEach((param) => {
      if (param.example !== undefined) {
        samples[param.name] = param.example;
      } else if (param.default !== undefined) {
        samples[param.name] = param.default;
      }
    });
    setParamValues(samples);
  };

  const handleExecute = async () => {
    setLoading(true);
    const funcName = isCustomMode ? customFunctionName.trim() : selectedFunction.name;
    let finalParams = paramValues;

    if (isCustomMode) {
      try {
        finalParams = JSON.parse(customParamsJson);
      } catch {
        finalParams = {};
      }
    }

    try {
      const res = await executeMoodleRequest({
        mode,
        moodleUrl,
        token,
        wsfunction: funcName,
        params: finalParams,
        method: selectedFunction.method,
      });

      setLastResult(res);

      onLogExecution({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        functionName: funcName,
        method: selectedFunction.method,
        status: res.status,
        durationMs: res.durationMs,
        mode,
        isException: res.isException,
        params: finalParams,
        response: res.data,
      });
    } catch (err: any) {
      setLastResult({
        success: false,
        status: 500,
        durationMs: 0,
        data: { error: err.message },
        isException: true,
        errorMessage: err.message,
        endpoint: `${moodleUrl}/webservice/rest/server.php`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to execute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleExecute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFunction, paramValues, isCustomMode, customFunctionName, customParamsJson, mode, moodleUrl, token]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-slate-100">
      {/* LEFT SIDEBAR: Function Catalog */}
      <div className="w-full lg:w-80 shrink-0 border-r border-slate-800 bg-slate-900/90 flex flex-col h-auto lg:h-full">
        {/* Catalog Search & Filter */}
        <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-950/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search functions (e.g. course, assign)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-thin">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap font-medium transition ${
                  categoryFilter === cat
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Function List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2 space-y-1">
          {filteredFunctions.map((func) => {
            const isSelected = !isCustomMode && selectedFunction.name === func.name;
            return (
              <button
                key={func.name}
                onClick={() => {
                  setIsCustomMode(false);
                  setSelectedFunction(func);
                }}
                className={`w-full text-left p-2.5 rounded-lg transition-all group ${
                  isSelected
                    ? 'bg-orange-600/15 border border-orange-500/40 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-semibold truncate ${
                      isSelected ? 'text-orange-400' : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {func.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1 rounded bg-slate-800 text-slate-400">
                    {func.method}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span className="truncate max-w-[180px]">{func.category}</span>
                  <span className="text-[10px] text-slate-500">{func.parameters.length} params</span>
                </div>
              </button>
            );
          })}

          {/* Custom Function Mode Item */}
          <button
            onClick={() => setIsCustomMode(true)}
            className={`w-full text-left p-2.5 rounded-lg transition border border-dashed mt-2 ${
              isCustomMode
                ? 'bg-purple-950/40 border-purple-500/60 text-purple-200'
                : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold">Custom WS Function</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Execute any custom plugin or unlisted endpoint
            </p>
          </button>
        </div>
      </div>

      {/* CENTER & RIGHT: Request Parameters and Response Inspector */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* CENTER COLUMN: Request Form */}
        <div className="w-full lg:w-1/2 border-r border-slate-800 flex flex-col bg-slate-900/50 overflow-hidden">
          {/* Target Info Bar */}
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                POST
              </span>
              <span className="font-mono text-xs font-bold text-slate-100 truncate">
                {isCustomMode ? customFunctionName || 'custom_ws_function' : selectedFunction.name}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleLoadSampleData}
                disabled={isCustomMode}
                className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 transition"
                title="Fill with valid mock test parameters"
              >
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>Fill Sample</span>
              </button>
            </div>
          </div>

          {/* Description & Docs */}
          {!isCustomMode && (
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/80 text-xs text-slate-300">
              <p className="leading-relaxed">{selectedFunction.description}</p>
              {selectedFunction.capability && (
                <div className="mt-2 flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Required Capability: <strong className="text-amber-300">{selectedFunction.capability}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Parameter Fields */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isCustomMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Function Name (<code className="text-orange-400">wsfunction</code>)
                  </label>
                  <input
                    type="text"
                    value={customFunctionName}
                    onChange={(e) => setCustomFunctionName(e.target.value)}
                    placeholder="e.g. core_course_get_courses_by_field"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 font-mono text-xs text-slate-200 outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Parameters JSON Payload
                  </label>
                  <textarea
                    rows={8}
                    value={customParamsJson}
                    onChange={(e) => setCustomParamsJson(e.target.value)}
                    placeholder='{ "courseids": [101] }'
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-xs text-slate-200 outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Request Parameters ({selectedFunction.parameters.length})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Format: <code className="text-orange-400">moodlewsrestformat=json</code>
                  </span>
                </div>

                {selectedFunction.parameters.length === 0 ? (
                  <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800/80 text-xs text-slate-400 text-center">
                    This function does not require any additional parameters.
                  </div>
                ) : (
                  selectedFunction.parameters.map((param) => {
                    const val = paramValues[param.name];
                    const isComplex = param.type === 'array' || param.type === 'object';

                    return (
                      <div key={param.name} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="font-mono text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                            <span>{param.name}</span>
                            {param.required && (
                              <span className="text-red-400 text-xs" title="Required parameter">
                                *
                              </span>
                            )}
                          </label>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {param.type}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-tight">
                          {param.description}
                        </p>

                        {/* Input controls based on type */}
                        {param.type === 'boolean' ? (
                          <div className="flex items-center space-x-3 pt-1">
                            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                              <input
                                type="radio"
                                name={param.name}
                                checked={val === 1 || val === true}
                                onChange={() => handleParamChange(param.name, 1, 'boolean')}
                                className="text-orange-500 focus:ring-orange-500"
                              />
                              <span>1 (True / Enabled)</span>
                            </label>
                            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                              <input
                                type="radio"
                                name={param.name}
                                checked={val === 0 || val === false || val === undefined}
                                onChange={() => handleParamChange(param.name, 0, 'boolean')}
                                className="text-orange-500 focus:ring-orange-500"
                              />
                              <span>0 (False / Disabled)</span>
                            </label>
                          </div>
                        ) : isComplex ? (
                          <textarea
                            rows={3}
                            value={typeof val === 'object' ? JSON.stringify(val, null, 2) : val || ''}
                            onChange={(e) => handleJsonParamChange(param.name, e.target.value)}
                            placeholder={param.placeholder || JSON.stringify(param.example || [])}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-xs text-slate-100 outline-none focus:border-orange-500"
                          />
                        ) : (
                          <input
                            type={param.type === 'number' ? 'number' : 'text'}
                            value={val !== undefined ? val : ''}
                            onChange={(e) => handleParamChange(param.name, e.target.value, param.type)}
                            placeholder={param.placeholder || String(param.example || '')}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-100 outline-none focus:border-orange-500"
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>

          {/* Execute Bottom Bar */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 hidden sm:block">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">Ctrl+Enter</kbd> to execute
            </div>

            <button
              onClick={handleExecute}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing Web Service...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Response Inspector */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-950 p-3 overflow-hidden">
          {lastResult ? (
            <ResponseViewer
              response={lastResult.data}
              status={lastResult.status}
              durationMs={lastResult.durationMs}
              isException={lastResult.isException}
              endpoint={lastResult.endpoint}
              selectedFunction={selectedFunction}
              requestParams={paramValues}
              moodleUrl={moodleUrl}
              token={token}
            />
          ) : (
            <div className="flex-1 border border-slate-800/80 rounded-xl bg-slate-900/30 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-3">
                <Send className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Ready to execute</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Click <strong>"Send Request"</strong> to execute{' '}
                <code className="text-orange-400 font-mono">{selectedFunction.name}</code> against the{' '}
                {mode === 'sandbox' ? 'Apex Sandbox' : 'Live Moodle Host'}.
              </p>
              <div className="mt-4 flex items-center space-x-2 text-xs">
                <button
                  onClick={handleExecute}
                  className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition"
                >
                  Execute Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
