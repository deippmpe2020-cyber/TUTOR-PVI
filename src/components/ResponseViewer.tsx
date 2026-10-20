import React, { useState, useMemo } from 'react';
import {
  Check,
  Copy,
  Download,
  Search,
  Code2,
  Table as TableIcon,
  AlertTriangle,
  Clock,
  HardDrive,
  FileJson,
  Layers,
} from 'lucide-react';
import { MoodleFunctionDoc } from '../types/moodle';
import {
  generateCurl,
  generateJavaScript,
  generateTypeScript,
  generatePython,
  generatePhp,
} from '../utils/codeGenerators';

interface ResponseViewerProps {
  response: any;
  status?: number;
  durationMs?: number;
  isException?: boolean;
  endpoint?: string;
  selectedFunction: MoodleFunctionDoc;
  requestParams: Record<string, any>;
  moodleUrl: string;
  token: string;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  status = 200,
  durationMs = 0,
  isException = false,
  endpoint,
  selectedFunction,
  requestParams,
  moodleUrl,
  token,
}) => {
  const [activeTab, setActiveTab] = useState<'pretty' | 'table' | 'code' | 'raw'>('pretty');
  const [activeCodeLang, setActiveCodeLang] = useState<'curl' | 'js' | 'ts' | 'python' | 'php'>('curl');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const jsonString = useMemo(() => {
    return JSON.stringify(response, null, 2);
  }, [response]);

  const payloadSizeKb = useMemo(() => {
    const bytes = new Blob([jsonString]).size;
    return (bytes / 1024).toFixed(1);
  }, [jsonString]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFunction.name}_response.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const codeSnippet = useMemo(() => {
    const opts = {
      functionDoc: selectedFunction,
      params: requestParams,
      moodleUrl,
      token,
      method: selectedFunction.method,
    };
    switch (activeCodeLang) {
      case 'curl':
        return generateCurl(opts);
      case 'js':
        return generateJavaScript(opts);
      case 'ts':
        return generateTypeScript(opts);
      case 'python':
        return generatePython(opts);
      case 'php':
        return generatePhp(opts);
      default:
        return '';
    }
  }, [activeCodeLang, selectedFunction, requestParams, moodleUrl, token]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Helper to extract tabular array from response if applicable
  const tableData = useMemo(() => {
    if (!response) return null;
    if (Array.isArray(response) && response.length > 0 && typeof response[0] === 'object') {
      return response;
    }
    if (Array.isArray(response.courses) && response.courses.length > 0) return response.courses;
    if (Array.isArray(response.users) && response.users.length > 0) return response.users;
    if (Array.isArray(response.assignments) && response.assignments.length > 0) return response.assignments;
    if (Array.isArray(response.quizzes) && response.quizzes.length > 0) return response.quizzes;
    if (Array.isArray(response.discussions) && response.discussions.length > 0) return response.discussions;
    if (Array.isArray(response.events) && response.events.length > 0) return response.events;
    if (Array.isArray(response.grades) && response.grades.length > 0) return response.grades;
    if (Array.isArray(response.usergrades) && response.usergrades.length > 0) {
      return response.usergrades[0].gradeitems || response.usergrades;
    }
    return null;
  }, [response]);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Response Header & Meta Bar */}
      <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold flex items-center space-x-1.5 ${
              isException || (status && status >= 400)
                ? 'bg-red-950/60 text-red-400 border border-red-800/60'
                : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isException || (status && status >= 400) ? 'bg-red-400' : 'bg-emerald-400'
              }`}
            />
            <span>{isException ? 'EXCEPTION' : `${status} OK`}</span>
          </span>

          {/* Latency */}
          <span className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{durationMs} ms</span>
          </span>

          {/* Size */}
          <span className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span>{payloadSizeKb} KB</span>
          </span>
        </div>

        {/* View Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('pretty')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-medium transition ${
              activeTab === 'pretty'
                ? 'bg-slate-800 text-orange-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          {tableData && (
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-medium transition ${
                activeTab === 'table'
                  ? 'bg-slate-800 text-orange-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table ({tableData.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-medium transition ${
              activeTab === 'code'
                ? 'bg-slate-800 text-orange-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Gen</span>
          </button>
        </div>
      </div>

      {/* Exception Warning banner */}
      {isException && (
        <div className="bg-red-950/40 border-b border-red-900/50 px-4 py-2.5 text-xs text-red-300 flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-red-200">Moodle Web Service Exception:</span>{' '}
            <code className="text-red-300 font-mono">
              {response?.errorcode || response?.exception || 'Unknown Error'}
            </code>
            <p className="mt-0.5 text-slate-300">{response?.message || 'Check parameter types, token validity, and user capabilities in Moodle.'}</p>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {/* PRETTY JSON VIEW */}
        {activeTab === 'pretty' && (
          <div className="flex flex-col h-full">
            {/* Action Subbar */}
            <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter JSON output..."
                  className="bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyJson}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Copy JSON"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Download JSON"
                >
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Syntax Highlighted JSON Container */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-slate-950/90 text-slate-200">
              <pre className="whitespace-pre-wrap break-all font-mono">
                {jsonString}
              </pre>
            </div>
          </div>
        )}

        {/* TABLE VIEW */}
        {activeTab === 'table' && tableData && (
          <div className="flex-1 overflow-auto p-4">
            <div className="border border-slate-800 rounded-lg overflow-x-auto bg-slate-950/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800/60 text-slate-300 border-b border-slate-800">
                    {Object.keys(tableData[0] || {})
                      .slice(0, 7)
                      .map((key) => (
                        <th key={key} className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px] text-slate-400">
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {tableData.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      {Object.keys(tableData[0] || {})
                        .slice(0, 7)
                        .map((key) => {
                          const val = row[key];
                          return (
                            <td key={key} className="py-2.5 px-3 font-mono text-[11px] max-w-[200px] truncate">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '-')}
                            </td>
                          );
                        })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CODE GENERATOR VIEW */}
        {activeTab === 'code' && (
          <div className="flex flex-col h-full bg-slate-950/90">
            {/* Language Selector Bar */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                {(['curl', 'js', 'ts', 'python', 'php'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeLang(lang)}
                    className={`px-3 py-1 rounded text-xs font-mono font-medium transition ${
                      activeCodeLang === lang
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Output */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="font-mono text-xs text-orange-200/90 leading-relaxed whitespace-pre">
                {codeSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
