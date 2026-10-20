import React, { useState } from 'react';
import {
  Key,
  CheckCircle2,
  AlertTriangle,
  Server,
  Shield,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Terminal,
  Lock,
} from 'lucide-react';
import { fetchMoodleToken } from '../utils/moodleClient';

interface SetupGuideProps {
  moodleUrl: string;
  token: string;
  setToken: (t: string) => void;
  setMoodleUrl: (u: string) => void;
}

export const SetupGuide: React.FC<SetupGuideProps> = ({
  moodleUrl,
  token,
  setToken,
  setMoodleUrl,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [service, setService] = useState('moodle_mobile_app');
  const [loading, setLoading] = useState(false);
  const [tokenResult, setTokenResult] = useState<{ token?: string; error?: string } | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setTokenResult(null);

    const res = await fetchMoodleToken(moodleUrl, username, password, service);
    setLoading(false);

    if (res.token) {
      setTokenResult({ token: res.token });
      setToken(res.token);
    } else {
      setTokenResult({ error: res.error || res.message || 'Failed to generate token' });
    }
  };

  const copyGeneratedToken = () => {
    if (tokenResult?.token) {
      navigator.clipboard.writeText(tokenResult.token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const steps = [
    {
      num: 1,
      title: 'Enable Web Services in Site Administration',
      path: 'Site administration > General > Advanced features',
      description: 'Check the box for "Enable web services" and click Save changes at the bottom of the page.',
      badge: 'Core Setting',
    },
    {
      num: 2,
      title: 'Activate the REST Web Service Protocol',
      path: 'Site administration > Server > Web services > Manage protocols',
      description: 'Find "REST protocol" in the table and click the eye icon to enable it. (You can also enable XML-RPC or SOAP if desired, but REST is the modern standard).',
      badge: 'Protocols',
    },
    {
      num: 3,
      title: 'Create an External Service',
      path: 'Site administration > Server > Web services > External services > Add',
      description: 'Name your service (e.g. "My Integration Service"). Check "Enabled" and check "Authorized users only". Click Add service.',
      badge: 'Services',
    },
    {
      num: 4,
      title: 'Add Required Web Service Functions',
      path: 'Click "Functions" next to your newly created service',
      description: 'Click "Add functions" and search for the functions you plan to use: core_webservice_get_site_info, core_course_get_courses, mod_assign_get_submissions, etc.',
      badge: 'Permissions',
    },
    {
      num: 5,
      title: 'Generate a Token for User',
      path: 'Site administration > Server > Web services > Manage tokens > Add',
      description: 'Select your administrative or service user, select the service you created, set an optional expiration date, and click Save changes. Copy the 32-character hexadecimal token into this app!',
      badge: 'Security Token',
    },
  ];

  const errorSolutions = [
    {
      code: 'invalidtoken',
      cause: 'Token not found, expired, or IP address restricted.',
      solution: 'Re-generate token in Manage tokens. Verify that the IP restriction field is empty unless specifically locking to your server IP.',
    },
    {
      code: 'accessexception',
      cause: 'The token user does not have permission/capability to perform the action.',
      solution: 'Assign the role (e.g. Manager or Editing Teacher) to the token user for the targeted course or site context.',
    },
    {
      code: 'invalidparameter',
      cause: 'Parameter structure mismatch (e.g. sending a flat string where Moodle expects an array or object).',
      solution: 'Moodle REST requires bracketed notation for arrays: e.g. courseids[0]=101, not courseids="[101]". Moodle API Studio formats these automatically.',
    },
    {
      code: 'servicenotavailable',
      cause: 'The REST protocol or external service is disabled.',
      solution: 'Check Site administration > Web services > Manage protocols to ensure REST is enabled.',
    },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Intro Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-orange-400" />
              <h1 className="text-lg font-bold text-white">Moodle Web Services Setup & Token Guide</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Complete administrator setup guide, automated token retrieval via <code className="text-orange-400">/login/token.php</code>, and error troubleshooting handbook.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              REST JSON Ready
            </span>
          </div>
        </div>

        {/* Section 1: Interactive Token Generator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center space-x-2.5">
            <Server className="w-5 h-5 text-orange-500" />
            <h2 className="text-sm font-bold text-white">Live Token Generator (<code className="text-orange-400">/login/token.php</code>)</h2>
          </div>
          <p className="text-xs text-slate-400">
            If your Moodle instance allows token generation via user credentials (common for mobile apps or external integrations), fetch a token instantly below:
          </p>

          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Moodle Host URL</label>
              <input
                type="text"
                value={moodleUrl}
                onChange={(e) => setMoodleUrl(e.target.value)}
                placeholder="https://moodle.your-school.edu"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or instructor"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-orange-500"
                required
              />
            </div>

            <div className="sm:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>Service Shortname:</span>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 font-mono"
                  placeholder="moodle_mobile_app"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                {loading ? 'Requesting Token...' : 'Generate Moodle Token'}
              </button>
            </div>
          </form>

          {tokenResult?.token && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-emerald-400">Token Obtained Successfully:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={tokenResult.token}
                  className="flex-1 bg-slate-950 border border-emerald-700/60 rounded px-3 py-1.5 font-mono text-xs text-emerald-200"
                />
                <button
                  onClick={copyGeneratedToken}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-medium flex items-center space-x-1 transition"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {tokenResult?.error && (
            <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300">
              {tokenResult.error}
            </div>
          )}
        </div>

        {/* Section 2: Step-by-Step Administrator Walkthrough */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-orange-400" />
              <span>5-Step Manual Web Services Configuration in Moodle</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Follow these official Moodle administrative procedures to enable and authorize REST Web Services on your server.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {steps.map((st) => (
              <div
                key={st.num}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-400 font-bold text-xs flex items-center justify-center font-mono">
                      {st.num}
                    </span>
                    <h3 className="text-xs font-bold text-slate-100">{st.title}</h3>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {st.badge}
                  </span>
                </div>

                <p className="text-[11px] font-mono text-orange-300/90 pl-8">
                  📍 {st.path}
                </p>
                <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Error Codes & Troubleshooting */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Common Moodle Web Service Error Codes & Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {errorSolutions.map((err) => (
              <div key={err.code} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2">
                  <code className="text-xs font-bold text-red-400 font-mono bg-red-950/40 px-2 py-0.5 rounded border border-red-900/60">
                    {err.code}
                  </code>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-slate-200">Cause:</strong> {err.cause}
                </p>
                <p className="text-xs text-emerald-400/90">
                  <strong className="text-emerald-300">Fix:</strong> {err.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
