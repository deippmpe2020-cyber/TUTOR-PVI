import { MoodleFunctionDoc } from '../types/moodle';

export interface CodeGenOptions {
  functionDoc: MoodleFunctionDoc;
  params: Record<string, any>;
  moodleUrl: string;
  token: string;
  method?: 'GET' | 'POST';
}

function cleanUrl(url: string): string {
  let u = (url || 'https://your-moodle-instance.edu').trim().replace(/\/+$/, '');
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    u = `https://${u}`;
  }
  return u;
}

function flattenForQuery(prefix: string, obj: any, list: [string, string][]) {
  if (obj === null || obj === undefined) return;
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = `${prefix}[${index}]`;
      if (typeof item === 'object' && item !== null) {
        flattenForQuery(key, item, list);
      } else {
        list.push([key, String(item)]);
      }
    });
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      const propPrefix = prefix ? `${prefix}[${key}]` : key;
      const val = obj[key];
      if (typeof val === 'object' && val !== null) {
        flattenForQuery(propPrefix, val, list);
      } else if (val !== undefined && val !== null) {
        list.push([propPrefix, String(val)]);
      }
    });
  } else {
    list.push([prefix, String(obj)]);
  }
}

export function generateCurl(opts: CodeGenOptions): string {
  const url = cleanUrl(opts.moodleUrl);
  const endpoint = `${url}/webservice/rest/server.php`;
  const token = opts.token || 'YOUR_MOODLE_TOKEN';
  const method = opts.method || 'POST';

  const pairs: [string, string][] = [
    ['wstoken', token],
    ['wsfunction', opts.functionDoc.name],
    ['moodlewsrestformat', 'json'],
  ];

  flattenForQuery('', opts.params, pairs);

  if (method === 'GET') {
    const qs = pairs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    return `curl -X GET "${endpoint}?${qs}" \\
  -H "Accept: application/json"`;
  }

  const dataFlags = pairs
    .map(([k, v]) => `  --data-urlencode "${k}=${v}" \\`)
    .join('\n');

  return `curl -X POST "${endpoint}" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -H "Accept: application/json" \\
${dataFlags.slice(0, -2)}`;
}

export function generateJavaScript(opts: CodeGenOptions): string {
  const url = cleanUrl(opts.moodleUrl);
  const endpoint = `${url}/webservice/rest/server.php`;
  const token = opts.token || 'YOUR_MOODLE_TOKEN';
  const method = opts.method || 'POST';

  return `// Execute Moodle Web Service via native fetch
const MOODLE_URL = '${endpoint}';
const TOKEN = '${token}';

async function callMoodle_${opts.functionDoc.name}() {
  const params = new URLSearchParams();
  params.append('wstoken', TOKEN);
  params.append('wsfunction', '${opts.functionDoc.name}');
  params.append('moodlewsrestformat', 'json');

  // Payload parameters
  const payload = ${JSON.stringify(opts.params, null, 2)};

  function appendNested(prefix, data) {
    if (data === null || data === undefined) return;
    if (Array.isArray(data)) {
      data.forEach((val, i) => appendNested(\`\${prefix}[\${i}]\`, val));
    } else if (typeof data === 'object') {
      Object.entries(data).forEach(([key, val]) => {
        appendNested(prefix ? \`\${prefix}[\${key}]\` : key, val);
      });
    } else {
      params.append(prefix, String(data));
    }
  }

  appendNested('', payload);

  const response = await fetch(${method === 'GET' ? '`${MOODLE_URL}?${params.toString()}`' : 'MOODLE_URL'}, {
    method: '${method}',
    ${method === 'POST' ? `headers: { 'Content-Type': 'application/x-www-form-urlencoded' },\n    body: params.toString(),` : ''}
  });

  if (!response.ok) {
    throw new Error(\`HTTP error \${response.status}\`);
  }

  const data = await response.json();
  if (data.exception || data.errorcode) {
    console.error('Moodle Exception:', data.message || data.errorcode);
    return;
  }

  console.log('Success:', data);
  return data;
}

callMoodle_${opts.functionDoc.name}();`;
}

export function generateTypeScript(opts: CodeGenOptions): string {
  const url = cleanUrl(opts.moodleUrl);
  const endpoint = `${url}/webservice/rest/server.php`;
  const token = opts.token || 'YOUR_MOODLE_TOKEN';

  return `import axios from 'axios';
import qs from 'qs';

interface MoodleResponse<T = any> {
  exception?: string;
  errorcode?: string;
  message?: string;
  [key: string]: any;
}

const client = axios.create({
  baseURL: '${endpoint}',
  timeout: 10000,
});

export async function execute${opts.functionDoc.name.replace(/_([a-z])/g, (_, c) => c.toUpperCase())}() {
  const payload = {
    wstoken: '${token}',
    wsfunction: '${opts.functionDoc.name}',
    moodlewsrestformat: 'json',
    ...${JSON.stringify(opts.params, null, 2)}
  };

  try {
    const { data } = await client.post<MoodleResponse>('', qs.stringify(payload, { arrayFormat: 'indices' }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    });

    if (data.exception) {
      throw new Error(\`Moodle [\${data.errorcode}]: \${data.message}\`);
    }

    return data;
  } catch (error: any) {
    console.error('Failed to call Moodle WS API:', error.message);
    throw error;
  }
}`;
}

export function generatePython(opts: CodeGenOptions): string {
  const url = cleanUrl(opts.moodleUrl);
  const endpoint = `${url}/webservice/rest/server.php`;
  const token = opts.token || 'YOUR_MOODLE_TOKEN';

  return `import requests

MOODLE_URL = "${endpoint}"
WSTOKEN = "${token}"
FUNCTION_NAME = "${opts.functionDoc.name}"

# Parameter dictionary
data = {
    "wstoken": WSTOKEN,
    "wsfunction": FUNCTION_NAME,
    "moodlewsrestformat": "json",
}

# Add function payload
payload_params = ${JSON.stringify(opts.params, null, 4)}

def flatten_dict(prefix, obj, out):
    if isinstance(obj, list):
        for idx, item in enumerate(obj):
            key = f"{prefix}[{idx}]"
            flatten_dict(key, item, out)
    elif isinstance(obj, dict):
        for k, v in obj.items():
            key = f"{prefix}[{k}]" if prefix else k
            flatten_dict(key, v, out)
    elif obj is not None:
        out[prefix] = obj

flatten_dict("", payload_params, data)

response = requests.post(MOODLE_URL, data=data)
result = response.json()

if isinstance(result, dict) and ("exception" in result or "errorcode" in result):
    print(f"Error ({result.get('errorcode')}): {result.get('message')}")
else:
    print("Moodle API Result:", result)`;
}

export function generatePhp(opts: CodeGenOptions): string {
  const url = cleanUrl(opts.moodleUrl);
  const endpoint = `${url}/webservice/rest/server.php`;
  const token = opts.token || 'YOUR_MOODLE_TOKEN';

  return `<?php
/**
 * Moodle Web Service Call in PHP
 */

$serverUrl = '${endpoint}';
$token = '${token}';
$functionName = '${opts.functionDoc.name}';

$params = [
    'wstoken' => $token,
    'wsfunction' => $functionName,
    'moodlewsrestformat' => 'json',
];

$functionParams = ${JSON.stringify(opts.params, null, 4).replace(/\{/g, '[').replace(/\}/g, ']').replace(/:/g, ' =>')};
$params = array_merge($params, $functionParams);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $serverUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
if (isset($data['exception'])) {
    echo "Moodle Error: " . $data['message'];
} else {
    print_r($data);
}
?>`;
}

export function generatePostmanCollection(
  functions: MoodleFunctionDoc[],
  moodleUrl: string,
  token: string
): string {
  const url = cleanUrl(moodleUrl);
  const endpoint = `${url}/webservice/rest/server.php`;

  const item = functions.map((f) => {
    const formParams: any[] = [
      { key: 'wstoken', value: token || '{{moodle_token}}', type: 'text' },
      { key: 'wsfunction', value: f.name, type: 'text' },
      { key: 'moodlewsrestformat', value: 'json', type: 'text' },
    ];

    const pairs: [string, string][] = [];
    const sampleArgs: Record<string, any> = {};
    f.parameters.forEach((p) => {
      if (p.example !== undefined) sampleArgs[p.name] = p.example;
      else if (p.default !== undefined) sampleArgs[p.name] = p.default;
    });

    flattenForQuery('', sampleArgs, pairs);
    pairs.forEach(([k, v]) => {
      formParams.push({ key: k, value: v, type: 'text' });
    });

    return {
      name: `${f.category}: ${f.name}`,
      request: {
        method: 'POST',
        header: [{ key: 'Accept', value: 'application/json' }],
        body: {
          mode: 'urlencoded',
          urlencoded: formParams,
        },
        url: {
          raw: endpoint,
          protocol: endpoint.startsWith('https') ? 'https' : 'http',
          host: endpoint.replace(/https?:\/\//, '').split('/')[0].split('.'),
          path: ['webservice', 'rest', 'server.php'],
        },
        description: f.description,
      },
      response: [],
    };
  });

  const collection = {
    info: {
      name: 'Moodle Web Services REST API Collection',
      description: 'Exported from Moodle API Studio. Contains standard Moodle REST endpoints.',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    variable: [
      { key: 'moodle_url', value: url },
      { key: 'moodle_token', value: token },
    ],
    item,
  };

  return JSON.stringify(collection, null, 2);
}
