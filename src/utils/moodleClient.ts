import { mockDb } from '../data/mockMoodle';
import { MoodleApiExecutionLog } from '../types/moodle';

export interface ExecuteRequestOptions {
  mode: 'sandbox' | 'live';
  moodleUrl: string;
  token: string;
  wsfunction: string;
  params: Record<string, any>;
  method?: 'GET' | 'POST';
}

export interface ExecuteResult {
  success: boolean;
  status: number;
  durationMs: number;
  data: any;
  isException: boolean;
  errorMessage?: string;
  endpoint: string;
}

export async function executeMoodleRequest(opts: ExecuteRequestOptions): Promise<ExecuteResult> {
  const { mode, moodleUrl, token, wsfunction, params, method = 'POST' } = opts;
  const startTime = performance.now();

  if (mode === 'sandbox') {
    // Artificial realistic delay (120 - 280ms)
    const simulatedDelay = Math.floor(Math.random() * 160) + 120;
    await new Promise((resolve) => setTimeout(resolve, simulatedDelay));

    try {
      const mockResult = mockDb.execute(wsfunction, params);
      const durationMs = Math.round(performance.now() - startTime);

      return {
        success: true,
        status: 200,
        durationMs,
        data: mockResult,
        isException: false,
        endpoint: 'https://sandbox.moodle.local/webservice/rest/server.php',
      };
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      return {
        success: false,
        status: 400,
        durationMs,
        data: {
          exception: 'moodle_exception',
          errorcode: 'invalidparameter',
          message: err.message || 'Invalid simulated parameter',
        },
        isException: true,
        errorMessage: err.message,
        endpoint: 'https://sandbox.moodle.local/webservice/rest/server.php',
      };
    }
  }

  // Live Mode: call our backend proxy
  try {
    const proxyResponse = await fetch('/api/moodle-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        moodleUrl,
        token,
        wsfunction,
        params,
        method,
      }),
    });

    const result = await proxyResponse.json();
    const durationMs = Math.round(performance.now() - startTime);

    if (proxyResponse.ok) {
      return {
        success: result.success,
        status: result.status || 200,
        durationMs: result.durationMs || durationMs,
        data: result.data,
        isException: result.isException,
        errorMessage: result.errorMessage,
        endpoint: result.endpoint || `${moodleUrl}/webservice/rest/server.php`,
      };
    } else {
      return {
        success: false,
        status: proxyResponse.status,
        durationMs,
        data: result,
        isException: true,
        errorMessage: result.error || 'Server proxy failed',
        endpoint: `${moodleUrl}/webservice/rest/server.php`,
      };
    }
  } catch (netErr: any) {
    // Fallback: direct browser fetch (if proxy endpoint isn't mounted or network glitch)
    try {
      let baseUrl = moodleUrl.trim().replace(/\/+$/, '');
      if (!baseUrl.startsWith('http')) baseUrl = `https://${baseUrl}`;
      const directUrl = `${baseUrl}/webservice/rest/server.php`;

      const searchParams = new URLSearchParams();
      searchParams.append('wstoken', token.trim());
      searchParams.append('wsfunction', wsfunction.trim());
      searchParams.append('moodlewsrestformat', 'json');

      Object.entries(params).forEach(([k, v]) => {
        if (typeof v === 'object') {
          searchParams.append(k, JSON.stringify(v));
        } else {
          searchParams.append(k, String(v));
        }
      });

      const directRes = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: searchParams.toString(),
      });

      const data = await directRes.json();
      const durationMs = Math.round(performance.now() - startTime);

      return {
        success: directRes.ok && !data.exception && !data.errorcode,
        status: directRes.status,
        durationMs,
        data,
        isException: !!(data.exception || data.errorcode),
        errorMessage: data.message || data.errorcode,
        endpoint: directUrl,
      };
    } catch (fallbackErr: any) {
      const durationMs = Math.round(performance.now() - startTime);
      return {
        success: false,
        status: 0,
        durationMs,
        data: {
          exception: 'network_exception',
          errorcode: 'cannotconnect',
          message: `Network error: ${netErr.message}. Ensure the Moodle instance has CORS enabled or check proxy status.`,
        },
        isException: true,
        errorMessage: netErr.message,
        endpoint: `${moodleUrl}/webservice/rest/server.php`,
      };
    }
  }
}

export async function fetchMoodleToken(moodleUrl: string, user: string, pass: string, service = 'moodle_mobile_app'): Promise<any> {
  try {
    const res = await fetch('/api/moodle-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moodleUrl, username: user, password: pass, service }),
    });
    return await res.json();
  } catch (err: any) {
    return { error: err.message || 'Failed to connect to token endpoint' };
  }
}
