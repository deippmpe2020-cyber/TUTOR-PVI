import React, { useState } from 'react';
import {
  X,
  Server,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Lock,
  Cpu,
  Layers,
} from 'lucide-react';
import { fetchMoodleToken, executeMoodleRequest } from '../utils/moodleClient';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'sandbox' | 'live';
  setMode: (mode: 'sandbox' | 'live') => void;
  moodleUrl: string;
  setMoodleUrl: (url: string) => void;
  token: string;
  setToken: (token: string) => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  mode,
  setMode,
  moodleUrl,
  setMoodleUrl,
  token,
  setToken,
}) => {
  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
    siteInfo?: any;
  }>({ loading: false });

  // Token generator state
  const [showTokenGen, setShowTokenGen] = useState(false);
  const [genUsername, setGenUsername] = useState('');
  const [genPassword, setGenPassword] = useState('');
  const [genService, setGenService] = useState('moodle_mobile_app');
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus({ loading: true });
    try {
      const res = await executeMoodleRequest({
        mode,
        moodleUrl,
        token,
        wsfunction: 'core_webservice_get_site_info',
        params: {},
      });

      if (res.success && res.data && !res.data.exception && !res.data.errorcode) {
        setTestStatus({
          loading: false,
          success: true,
          message: `Connected successfully to "${res.data.sitename || 'Moodle'}" (v${res.data.release || '4.x'})!`,
          siteInfo: res.data,
        });
      } else {
        setTestStatus({
          loading: false,
          success: false,
          message: res.errorMessage || res.data?.message || 'Failed to authenticate. Verify URL and Web Service Token.',
        });
      }
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: err.message || 'Network connection failed.',
      });
    }
  };

  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genUsername || !genPassword) return;
    setGenLoading(true);
    setGenError(null);

    const res = await fetchMoodleToken(moodleUrl, genUsername, genPassword, genService);
    setGenLoading(false);

    if (res.token) {
      setToken(res.token);
      setShowTokenGen(false);
      setGenPassword('');
      setTestStatus({
        loading: false,
        success: true,
        message: `Token generated successfully!`,
      });
    } else {
      setGenError(res.error || res.message || 'Invalid username or password, or Web Services login is disabled.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-2.5">
            <Server className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-semibold text-slate-100">
              Moodle Connection & Environment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Environment Mode Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Operational Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode('sandbox');
                  setTestStatus({ loading: false });
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  mode === 'sandbox'
                    ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Cpu className={`w-4 h-4 ${mode === 'sandbox' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-100">Apex Sandbox</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant mock Moodle instance pre-loaded with CS101, assignments, gradebook & 30+ students.
                </p>
                {mode === 'sandbox' && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('live');
                  setTestStatus({ loading: false });
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  mode === 'live'
                    ? 'border-orange-500 bg-orange-950/30 ring-1 ring-orange-500/50'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Server className={`w-4 h-4 ${mode === 'live' ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-100">Live Moodle Host</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct or proxy integration with your university or self-hosted Moodle 3.x / 4.x instance.
                </p>
                {mode === 'live' && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Live Host Settings */}
          {mode === 'live' && (
            <div className="space-y-4 pt-2 border-t border-slate-800 animate-fade-in">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Moodle Base URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={moodleUrl}
                    onChange={(e) => setMoodleUrl(e.target.value)}
                    placeholder="https://moodle.your-institution.edu"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Target endpoint will be: <code className="text-slate-400">{moodleUrl || 'https://...'}/webservice/rest/server.php</code>
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Web Service Token (<code className="text-orange-400">wstoken</code>)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTokenGen(!showTokenGen)}
                    className="text-xs text-orange-400 hover:text-orange-300 underline font-medium"
                  >
                    {showTokenGen ? 'Hide token generator' : 'Generate token via login?'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="e.g. 9b88937f26190ec541f87aa8c9..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Token Generator Subform */}
              {showTokenGen && (
                <form
                  onSubmit={handleGenerateToken}
                  className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3 animate-fade-in"
                >
                  <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400">
                    <Key className="w-3.5 h-3.5" />
                    <span>Auto-Fetch Token via /login/token.php</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Username</label>
                      <input
                        type="text"
                        value={genUsername}
                        onChange={(e) => setGenUsername(e.target.value)}
                        placeholder="admin or username"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Password</label>
                      <input
                        type="password"
                        value={genPassword}
                        onChange={(e) => setGenPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Service Shortname</label>
                    <input
                      type="text"
                      value={genService}
                      onChange={(e) => setGenService(e.target.value)}
                      placeholder="moodle_mobile_app"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  {genError && (
                    <p className="text-xs text-red-400 bg-red-950/40 p-2 rounded border border-red-800/50">
                      {genError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={genLoading || !genUsername || !genPassword}
                    className="w-full py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition"
                  >
                    {genLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>Request Token from Moodle</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Test Status Feedback */}
          {testStatus.loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
              <span>Verifying Moodle connection and core_webservice_get_site_info...</span>
            </div>
          )}

          {!testStatus.loading && testStatus.success && (
            <div className="text-xs text-emerald-300 bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/50 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{testStatus.message}</p>
                {testStatus.siteInfo && (
                  <p className="text-emerald-400/80 text-[11px] mt-1 font-mono">
                    User: {testStatus.siteInfo.fullname} ({testStatus.siteInfo.username}) | Functions: {testStatus.siteInfo.functions?.length || 0}
                  </p>
                )}
              </div>
            </div>
          )}

          {!testStatus.loading && testStatus.success === false && (
            <div className="text-xs text-red-300 bg-red-950/40 p-3 rounded-lg border border-red-800/50 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Connection Error:</p>
                <p className="text-[11px] mt-0.5">{testStatus.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus.loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>Test Connection</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
