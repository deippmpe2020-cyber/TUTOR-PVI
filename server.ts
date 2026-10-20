import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { serverKnowledgeStore } from './src/data/serverKnowledgeStore';
import { generateEmbedScript } from './src/data/embedScript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for embedding Tutor PVI on Moodle domains
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Dedicated route to serve the embeddable floating widget JavaScript for Moodle
app.get('/embed/tutor-pvi.js', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || `localhost:${PORT}`;
  const serverUrl = `${protocol}://${host}`;
  const position = req.query.position === 'bottom-left' ? 'bottom-left' : 'bottom-right';

  const script = generateEmbedScript(serverUrl, position);
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60');
  return res.send(script);
});

// Helper to convert nested parameters into Moodle-compatible URL-encoded format
function flattenParams(prefix: string, obj: any, out: URLSearchParams) {
  if (obj === null || obj === undefined) return;
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = `${prefix}[${index}]`;
      if (typeof item === 'object' && item !== null) {
        flattenParams(key, item, out);
      } else {
        out.append(key, String(item));
      }
    });
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      const propPrefix = prefix ? `${prefix}[${key}]` : key;
      const val = obj[key];
      if (typeof val === 'object' && val !== null) {
        flattenParams(propPrefix, val, out);
      } else if (val !== undefined && val !== null) {
        out.append(propPrefix, String(val));
      }
    });
  } else {
    out.append(prefix, String(obj));
  }
}

// Proxy endpoint to execute Moodle Web Services without CORS restrictions
app.post('/api/moodle-proxy', async (req, res) => {
  const startTime = Date.now();
  try {
    const { moodleUrl, token, wsfunction, params = {}, method = 'POST' } = req.body;

    if (!moodleUrl || !token || !wsfunction) {
      return res.status(400).json({
        error: 'Missing required fields: moodleUrl, token, and wsfunction are required',
      });
    }

    // Clean URL
    let baseUrl = moodleUrl.trim().replace(/\/+$/, '');
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }

    const endpoint = `${baseUrl}/webservice/rest/server.php`;

    // Build URLSearchParams
    const searchParams = new URLSearchParams();
    searchParams.append('wstoken', token.trim());
    searchParams.append('wsfunction', wsfunction.trim());
    searchParams.append('moodlewsrestformat', 'json');

    // Flatten parameters
    flattenParams('', params, searchParams);

    let fetchUrl = endpoint;
    const fetchOptions: RequestInit = {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MoodleAPIStudio/1.0',
      },
    };

    if (method.toUpperCase() === 'GET') {
      fetchUrl = `${endpoint}?${searchParams.toString()}`;
    } else {
      fetchOptions.method = 'POST';
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      fetchOptions.body = searchParams.toString();
    }

    const moodleResponse = await fetch(fetchUrl, fetchOptions);
    const durationMs = Date.now() - startTime;
    const contentType = moodleResponse.headers.get('content-type') || '';

    let responseData: any;
    if (contentType.includes('application/json')) {
      responseData = await moodleResponse.json();
    } else {
      const text = await moodleResponse.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { rawText: text, htmlNotice: 'Moodle returned non-JSON content. Check URL or endpoint path.' };
      }
    }

    return res.json({
      success: moodleResponse.ok && !responseData?.exception && !responseData?.errorcode,
      status: moodleResponse.status,
      durationMs,
      endpoint: fetchUrl.split('?')[0],
      queryFunction: wsfunction,
      data: responseData,
      isException: !!(responseData?.exception || responseData?.errorcode),
      errorMessage: responseData?.message || responseData?.error || null,
    });
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    return res.status(502).json({
      success: false,
      status: 502,
      durationMs,
      error: `Proxy failed to connect to Moodle host: ${err.message || 'Unknown network error'}`,
    });
  }
});

// Endpoint to obtain Moodle token using username and password
app.post('/api/moodle-token', async (req, res) => {
  try {
    const { moodleUrl, username, password, service = 'moodle_mobile_app' } = req.body;

    if (!moodleUrl || !username || !password) {
      return res.status(400).json({ error: 'moodleUrl, username, and password are required' });
    }

    let baseUrl = moodleUrl.trim().replace(/\/+$/, '');
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }

    const tokenUrl = `${baseUrl}/login/token.php`;
    const searchParams = new URLSearchParams({
      username: username.trim(),
      password: password,
      service: (service || 'moodle_mobile_app').trim(),
    });

    const response = await fetch(`${tokenUrl}?${searchParams.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MoodleAPIStudio/1.0',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    let data: any;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        return res.status(500).json({ error: 'Server did not return JSON token response. Please verify URL.' });
      }
    }

    return res.json(data);
  } catch (err: any) {
    return res.status(502).json({ error: `Could not reach token service: ${err.message}` });
  }
});

// Endpoints for Managing the Knowledge Base (Fornecer Base de Informações)
app.get('/api/knowledge-base', (_req, res) => {
  try {
    const data = serverKnowledgeStore.getAll();
    const stats = serverKnowledgeStore.getStats();
    return res.json({ ...data, stats });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar base de conhecimento' });
  }
});

app.post('/api/knowledge-base', (req, res) => {
  try {
    const { id, title, category, sourceUrl, content, summary, active } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Título do documento é obrigatório' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Conteúdo do documento é obrigatório' });
    }

    const saved = serverKnowledgeStore.addOrUpdate({
      id,
      title,
      category,
      sourceUrl,
      content,
      summary,
      active,
    });

    const stats = serverKnowledgeStore.getStats();
    return res.json({ success: true, document: saved, stats });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao salvar documento' });
  }
});

app.delete('/api/knowledge-base/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = serverKnowledgeStore.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Documento não encontrado ou não pode ser excluído' });
    }
    const stats = serverKnowledgeStore.getStats();
    return res.json({ success: true, stats });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao excluir documento' });
  }
});

app.patch('/api/knowledge-base/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const toggled = serverKnowledgeStore.toggleActive(id);
    if (!toggled) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }
    const stats = serverKnowledgeStore.getStats();
    return res.json({ success: true, document: toggled, stats });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao alternar status do documento' });
  }
});

app.post('/api/knowledge-base/seed-example', (_req, res) => {
  try {
    const example = serverKnowledgeStore.addOrUpdate({
      title: 'Instrução Normativa DEIP nº 04/2024 - Diretrizes de Avaliação Continuada',
      category: 'diretriz_pmpe',
      sourceUrl: 'http://pvi.pm.pe.gov.br/mod/resource/view.php?id=88',
      summary: 'Regulamenta prazos de envio de atividades, segunda chamada e cálculo da nota final nos cursos da PVI.',
      content: `Instrução Normativa DEIP nº 04/2024 - Regulamentação do Ensino a Distância na PVI:
1. Prazos e Submissões:
- O prazo para entrega das atividades avaliativas de cada módulo encerra-se às 23h59 do último domingo previsto no calendário do curso.
- Solicitações de segunda chamada devem ser justificadas documentalmente (atestado médico do CMH ou ordem de serviço operacional) no prazo de até 48 horas após o término do prazo regular.
2. Composição da Nota Final:
- A média final é calculada pela média ponderada dos questionários (peso 6) e do fórum temático obrigatório (peso 4).
- A nota mínima para aprovação é 7,0 (sete inteiros). O discente com média entre 5,0 e 6,9 terá direito a uma avaliação final de recuperação.
3. Certificação:
- A emissão dos certificados digitais pela CEaD/DEIP ocorre automaticamente no prazo de até 5 dias úteis após a homologação final das notas.`,
      active: true,
    });
    const stats = serverKnowledgeStore.getStats();
    return res.json({ success: true, document: example, stats });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao carregar exemplo' });
  }
});

// Endpoint for Tutor PVI - Plataforma Virtual de Instrução PMPE
app.post('/api/tutor-chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem obrigatória' });
    }

    const customKnowledgePrompt = serverKnowledgeStore.buildCustomKnowledgePrompt();

    const systemInstruction = `PERFIL E IDENTIDADE:
Você é o Tutor PVI, o assistente virtual de capacitação e instrução da Plataforma Virtual de Instrução (PVI) da Polícia Militar de Pernambuco (disponível em https://pvi.pm.pe.gov.br/). Seu papel é atuar como um instrutor dedicado, acessível e prático, focado em apoiar policiais militares em sua jornada de aprendizagem, aperfeiçoamento contínuo e navegação no ambiente virtual.

FONTES DE CONHECIMENTO E ANCORAGEM OBRIGATÓRIA:
Todo o seu suporte, orientações e fundamentações baseiam-se estritamente nas seguintes fontes oficiais:
1. Plataforma Virtual de Instrução (PVI): https://pvi.pm.pe.gov.br/ (estrutura de cursos, trilhas, atividades, questionários, envio de tarefas, notas e certificações).
2. Portal Institucional da PMPE: https://www.pm.pe.gov.br/ (diretrizes institucionais, avisos de ensino e estrutura corporativa).
3. Legislação Estadual (ALEPE Legis): https://legis.alepe.pe.gov.br/ (Estatuto dos Policiais Militares de PE - Lei Estadual nº 6.783/1974, Código Disciplinar - Lei Estadual nº 11.817/2000, leis complementares, regulamentos e legislações aplicáveis à carreira e atuação policial).
4. Materiais, apostilas e documentos cadastrados na Base de Informações:
${customKnowledgePrompt}

ESCOPO DE ATUAÇÃO:
- Navegação e Uso do Moodle/PVI: Auxiliar no acesso a disciplinas, recuperação de tarefas, envio de trabalhos, realização de avaliações, visualização de notas e emissão de certificados na PVI.
- Orientação Didática e Estudos: Ajudar o discente a organizar cronogramas de estudo, entender enunciados de atividades e revisar tópicos curriculares ministrados nos cursos de formação e continuados.
- Fundamentação Normativa: Esclarecer dúvidas sobre dispositivos legais, regulamentos e normas internas pertinentes ao conteúdo dos cursos, remetendo aos textos do ALEPE Legis e aos atos normativos da PMPE.
- Suporte a Dificuldades Técnicas no Ambiente: Guiar a resolução de problemas comuns na interface do Moodle (falhas de envio, compatibilidade de arquivos, prazos e visualização de mídias).

ADAPTAÇÃO DE TOM E LINGUAGEM:
- Tratamento Institucional e Respeitoso: Mantenha um tom profissional, cordial, motivador e alinhado aos valores militares (disciplina, clareza e pontualidade), tratando o usuário com a urbanidade devida (ex.: "Camarada", "Policial Militar", ou formalmente por "Senhor(a)").
- Comunicação Direta e Objetiva: Vá direto ao ponto, priorizando instruções operacionais passo a passo, evitando burocracia desnecessária.
- Nível Operacional (Iniciante no EAD): Para o policial com pouca familiaridade com o Moodle, utilize instruções detalhadas passo a passo com referências claras de botões e abas ("Acesse o menu lateral esquerdo", "Clique em 'Minhas disciplinas'").
- Nível Avançado / Gestão de Curso: Caso o contato seja de um instrutor ou administrador, forneça orientações precisas sobre configuração de blocos, restrição de acesso, importação de conteúdos e relatórios de conclusão.

REGRAS DE CONDUTA DIDÁTICA:
1. Um passo por vez: Não apresente longos manuais de uma só vez; oriente por blocos de ações para facilitar a execução na tela da PVI.
2. Checagem de Aprendizagem: Ao final de cada explicação técnica ou jurídica/doutrinária, confirme se a dúvida foi sanada antes de avançar (ex.: "Consegui esclarecer sua dúvida, Policial Militar? Ficou claro esse procedimento?").
3. Resolução Prática de Erros: Sempre que o militar relatar um problema de acesso ou envio, analise as causas mais prováveis (prazos de entrega, formato do arquivo, sessão expirada) e apresente a solução imediata.

BASE DE DADOS FACTUAL CONSOLIDADA DAS FONTES:
- PVI (https://pvi.pm.pe.gov.br/): Diretoria de Ensino, Instrução e Pesquisa (DEIP), Coordenadoria de Ensino (CE), Coordenadoria de Ensino a Distância (CEaD - PMPE), Academia de Polícia Militar do Paudalho (APMP), Centro de Educação Física e Desportos (CEFD - TAF), Memorial da Educação Corporativa e Biblioteca Virtual.
- Cursos no PVI (https://pvi.pm.pe.gov.br/course/view.php?id=105): Módulo 1 (Abordagem e Busca Pessoal - Arts. 240/244 CPP, POP 101, Art. 249 CPP); Módulo 2 (Uso Diferenciado da Força e Algemas - Lei 13.060/2014, Súmula Vinculante 11 STF - PRF: Perigo, Resistência, Fuga); Módulo 3 (Flagrante e Inviolabilidade Domiciliar - Art. 5º XI CF/88, Tema 280 STF); Módulo 4 (TCO pela PMPE - Lei 9.099/95, ADIs 5.637 e 6.245); Módulo 5 (Aprovação com 70% e Certificação).
- Portal PMPE (https://www.pm.pe.gov.br/): Comando Geral, avisos de seleção da DEIP, editais e estrutura corporativa.
- Legislação ALEPE (https://legis.alepe.pe.gov.br/): Estatuto dos Policiais Militares (Lei 6.783/74), Código Disciplinar (Lei 11.817/2000), LC 320/2015 (promoções), LC 294/2015 (subsídios), Sindicância (30 dias + 20) e IPM (20 dias preso, 40 dias solto).

REGRAS RIGOROSAS:
1. Respostas baseadas APENAS na PVI (https://pvi.pm.pe.gov.br/), no Portal da PMPE (https://www.pm.pe.gov.br/), na legislação da ALEPE (https://legis.alepe.pe.gov.br/) e na Base de Informações.
2. Limite de Escopo: Se a pergunta não puder ser respondida com base nas fontes oficiais, responda com cordialidade e urbanidade: "Desculpe, Policial Militar, mas não encontrei essa informação no conteúdo da PVI, no portal da PMPE nem na legislação da ALEPE. Por favor, consulte o instrutor do módulo ou a coordenação do PVI/CEaD."
3. Citação de Fontes: Sempre cite a fonte correspondente (PVI, Portal da PMPE, Módulo do Curso, Artigo de Lei ALEPE ou documento da Base de Informações).`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        // Gemini contents array must start with role 'user' and alternate roles
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history)) {
          for (const item of history) {
            if (!item || typeof item.text !== 'string' || !item.text.trim()) continue;
            const role: 'user' | 'model' = item.role === 'assistant' ? 'model' : 'user';

            // Ensure first message is role 'user'
            if (contents.length === 0 && role !== 'user') {
              continue;
            }

            // Merge if consecutive same role
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
              contents[contents.length - 1].parts[0].text += `\n${item.text.trim()}`;
            } else {
              contents.push({
                role,
                parts: [{ text: item.text.trim() }],
              });
            }
          }
        }

        // Add current user message
        if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
          contents[contents.length - 1].parts[0].text += `\n${message.trim()}`;
        } else {
          contents.push({
            role: 'user',
            parts: [{ text: message.trim() }],
          });
        }

        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.2, // Baixa temperatura para precisão factual estrita
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout Gemini')), 10000)
        );

        const response: any = await Promise.race([aiPromise, timeoutPromise]);

        const replyText = response.text?.trim();
        if (replyText) {
          return res.json({ reply: replyText });
        }
      } catch (geminiErr: any) {
        console.error('Gemini call error in /api/tutor-chat:', geminiErr?.message || geminiErr);
      }
    }

    // Resposta fundamentada nas fontes obrigatórias (PVI http://pvi.pm.pe.gov.br/, cursos e ALEPE)
    const lower = message.toLowerCase();

    // Verificar prioritariamente se há correspondência na Base de Informações fornecida pelo usuário
    const customMatch = serverKnowledgeStore.findMatchingCustomAnswer(message);
    if (customMatch) {
      return res.json({ reply: customMatch });
    }

    // 0. Conteúdo do Portal PVI (http://pvi.pm.pe.gov.br/) - DEIP, CE, CEaD, APMP, CEFD, Memorial, Biblioteca
    if (lower.includes('apmp') || lower.includes('paudalho') || lower.includes('academia de polícia') || lower.includes('academia de policia')) {
      return res.json({
        reply: `Conforme as informações institucionais disponíveis no portal da PVI (http://pvi.pm.pe.gov.br/):

1. **Academia de Polícia Militar do Paudalho (APMP)**:
   - **Localização e Estrutura**: Instalada no antigo Colégio Vocacional dos Padres do Sagrado Coração de Jesus, na cidade de Paudalho/PE. Abrange uma área de 232 hectares, com aproximadamente 11.000 metros quadrados de área construída.
   - **Missão e Natureza**: Estabelecimento de Ensino Superior destinado a formar, aperfeiçoar, habilitar, especializar e atualizar Oficiais e Graduados da Polícia Militar de Pernambuco, por meio dos diversos Cursos e Estágios previstos na Legislação Pertinente.`,
      });
    }

    if (lower.includes('cefd') || lower.includes('educação física') || lower.includes('educacao fisica') || lower.includes('desportos') || lower.includes('taf') || lower.includes('aptidão física') || lower.includes('aptidao fisica')) {
      return res.json({
        reply: `Conforme o conteúdo do portal da PVI (http://pvi.pm.pe.gov.br/):

1. **Centro de Educação Física e Desportos (CEFD)**:
   - **Subordinação**: Organização Militar diretamente subordinada à Diretoria de Ensino, Instrução e Pesquisa (DEIP).
   - **Atribuições**: Direcionado para a prestação de serviços e incumbências que envolvam atividades físicas em todas as suas diferentes áreas. É composto por profissionais formados e técnicos na área de Educação Física.
   - **Missões Principais**: Aplicação dos Testes de Aptidão Física (TAF) do efetivo policial militar da PMPE e para candidatos em processos seletivos e cursos institucionais.`,
      });
    }

    if (lower.includes('deip') || lower.includes('diretoria de ensino') || lower.includes('coordenadoria de ensino') || lower.includes('cead') || (lower.includes('estrutura') && lower.includes('pvi'))) {
      return res.json({
        reply: `Conforme o portal oficial da PVI (http://pvi.pm.pe.gov.br/) e a legislação correlata:

1. **Diretoria de Ensino, Instrução e Pesquisa (DEIP)**:
   - Órgão de Direção Setorial, subordinada à Diretoria Geral de Administração (DGA).
   - Atribuição: Planejamento, coordenação, fiscalização e controle dos sistemas organizados para as atividades de Ensino, Instrução e Pesquisa da Corporação.
   - Marco Legal: Criada pelo Decreto Estadual nº 365, de 29 de dezembro de 1934; remonta à Lei de Organização Básica (LOB) da PMPE (Lei nº 6.783/1974).

2. **Coordenadorias da DEIP**:
   - **Coordenadoria de Ensino (CE)**: Abrange os cursos de formação básica de ingresso (CFO, CFHP, CFC, CFS) e de aperfeiçoamento (CAS e cursos especiais), assessorando o Diretor de Ensino no planejamento e operacionalização nos Campi.
   - **Coordenadoria de Ensino a Distância (CEaD - PMPE)**: Gestão pedagógica e operacional da Plataforma Virtual de Instrução (PVI), acompanhamento dos discentes e emissão das certificações digitais.`,
      });
    }

    if (lower.includes('memorial') || lower.includes('educação corporativa') || lower.includes('educacao corporativa')) {
      return res.json({
        reply: `Conforme publicado no portal da PVI (http://pvi.pm.pe.gov.br/):

O **Memorial da Educação Corporativa da PMPE** é um acervo digital fascinante mantido pela Diretoria de Ensino, Instrução e Pesquisa (DEIP). Seu objetivo é preservar e celebrar a trajetória histórica de décadas de dedicação, adaptação e compromisso da corporação com o treinamento, permitindo compreender como a PMPE forjou sua sólida doutrina de ensino.`,
      });
    }

    if (lower.includes('biblioteca') || lower.includes('acervo virtual') || lower.includes('links úteis') || lower.includes('links uteis')) {
      return res.json({
        reply: `Conforme a seção "Biblioteca e Acervo Virtual" do portal da PVI (http://pvi.pm.pe.gov.br/), estão disponibilizados os seguintes links oficiais para consulta e pesquisa técnico-policial:

1. **Repositório Histórico da Marinha do Brasil**: repositoriodphdm.marinha.mil.br
2. **Biblioteca do Exército (BDEx)**: bdex.eb.mil.br
3. **Catálogo Rede BIA da Força Aérea Brasileira**: catalogo.redebia.fab.mil.br
4. **Biblioteca Nacional Digital (BNDigital)**: bndigital.bn.gov.br
5. **Diário Oficial do Estado de Pernambuco (CEPE)**: diariooficial.cepe.com.br
6. **Portal de Legislação da ALEPE**: legis.alepe.pe.gov.br`,
      });
    }

    if (lower.includes('login') || lower.includes('acesso') || lower.includes('como entrar') || lower.includes('senha') || lower.includes('visitante')) {
      return res.json({
        reply: `Conforme as instruções de acesso do portal da PVI (http://pvi.pm.pe.gov.br/):

1. **Acesso ao Site**:
   - O acesso é realizado pela página oficial: http://pvi.pm.pe.gov.br/login/index.php.
   - O militar deve inserir sua identificação funcional institucional e senha cadastrada.
   - Alguns cursos ou instruções institucionais abertas podem admitir acesso na modalidade de visitante.
   - Na página inicial há também o recurso "BEM VINDO À PVI! Vídeo Interativo" (/mod/interactivevideo/view.php?id=53) com orientações para os alunos.`,
      });
    }

    // 1. Sindicância e Inquérito Policial Militar (IPM)
    if (lower.includes('sindicância') || lower.includes('sindicancia') || lower.includes('ipm') || lower.includes('inquérito') || lower.includes('inquerito')) {
      return res.json({
        reply: `Segundo as normas da PMPE e o Código de Processo Penal Militar (Art. 20 do CPPM), os prazos para conclusão de procedimentos investigatórios são:

1. **Sindicância Militar**:
   - **Prazo Regular**: 30 (trinta) dias.
   - **Prorrogação**: Prorrogável por até 20 (vinte) dias mediante solicitação justificada do encarregado e deferimento da autoridade instauradora.

2. **Inquérito Policial Militar (IPM - Art. 20 do CPPM)**:
   - **Indiciado Preso**: 20 (vinte) dias contados a partir da execução da prisão, de prazo improrrogável.
   - **Indiciado Solto**: 40 (quarenta) dias contados a partir da data de instauração da portaria, prorrogável por mais 20 (vinte) dias pela autoridade delegante.

Para mais orientações processuais, consulte a Coord. de Ensino a Distância (CEaD - PMPE) ou o instrutor do módulo.`,
      });
    }

    // 2. Código Disciplinar (Lei 11.817/2000) e Transgressões
    if (lower.includes('código disciplinar') || lower.includes('codigo disciplinar') || lower.includes('11.817') || lower.includes('transgress') || lower.includes('punição') || lower.includes('punicao') || lower.includes('comportamento')) {
      return res.json({
        reply: `Segundo a Lei Estadual nº 11.817, de 24 de julho de 2000 (Código Disciplinar dos Militares do Estado de Pernambuco - CDMEPE) e o Decreto Estadual nº 50.014/2020:

1. **Classificação das Transgressões (Art. 13)**:
   - São classificadas segundo sua gravidade em **Leves**, **Médias** e **Graves**.

2. **Penas Disciplinares Militares (Art. 14)**:
   - Advertência;
   - Repreensão;
   - Detenção (até 30 dias);
   - Prisão Disciplinar (até 30 dias);
   - Licenciamento ou Exclusão a bem da disciplina.

3. **Classificação do Comportamento das Praças**:
   - Excepcional, Ótimo, Bom, Insuficiente e Mau, conforme o histórico disciplinar e tempo de serviço sem punições.

4. **Competência (Art. 10)**:
   - Governador do Estado, Secretário de Defesa Social, Comandante-Geral da PMPE e Comandantes de OPM nos limites de suas atribuições regulamentares.`,
      });
    }

    // 3. Estatuto dos Policiais Militares (Lei 6.783/1974)
    if (lower.includes('estatuto') || lower.includes('6.783') || lower.includes('deveres') || lower.includes('hierarquia') || lower.includes('posto') || lower.includes('graduação') || lower.includes('graduacao')) {
      return res.json({
        reply: `Segundo a Lei Estadual nº 6.783, de 16 de outubro de 1974 (Estatuto dos Policiais Militares de Pernambuco, portal ALEPE):

1. **Estrutura Institucional**:
   - A PMPE é uma instituição permanente, força auxiliar e reserva do Exército, organizada com base na hierarquia e na disciplina, sob autoridade do Governador do Estado.

2. **Círculos Hierárquicos**:
   - **Oficiais**: Postos de Coronel PM, Tenente-Coronel PM, Major PM, Capitão PM, 1º Tenente PM e 2º Tenente PM.
   - **Praças**: Graduações de Subtenente PM, 1º Sargento PM, 2º Sargento PM, 3º Sargento PM, Cabo PM e Soldado PM.

3. **Deveres e Prerrogativas**:
   - Dedicação integral ao serviço policial-militar, cumprimento rigoroso das leis, porte de arma e uso privativo dos uniformes, distintivos e insígnias da corporação.`,
      });
    }

    // 4. Promoções e Carreira (LC 320/2015 e Dec. 45.713/2018)
    if (lower.includes('promoção') || lower.includes('promocao') || lower.includes('320') || lower.includes('45.713') || lower.includes('antiguidade') || lower.includes('merecimento') || lower.includes('bravura')) {
      return res.json({
        reply: `Segundo a Lei Complementar Estadual nº 320, de 23 de dezembro de 2015 e o Decreto Estadual nº 45.713, de 28 de fevereiro de 2018 (portal ALEPE):

1. **Critérios de Promoção dos Militares de Pernambuco**:
   - **Antiguidade**: Baseada no tempo de efetivo serviço na graduação ou posto.
   - **Merecimento**: Avaliação de desempenho funcional, títulos, cursos de aperfeiçoamento e pontuação na ficha individual.
   - **Bravura**: Reconhecimento por ato ou atos não comuns de coragem, audácia e desprendimento no cumprimento do dever.
   - **Post-Mortem**: Em homenagem ao militar falecido em serviço ou em consequência dele.

2. **Requisitos Obrigatórios**:
   - Interstício mínimo de permanência no posto ou graduação, aptidão física comprovada em TAF (aplicado pelo CEFD) e comportamento disciplinar compatível.`,
      });
    }

    // 5. Módulo 1 do PVI: Busca Pessoal e Fundada Suspeita
    if (lower.includes('busca pessoal') || lower.includes('fundada suspeita') || lower.includes('244') || lower.includes('revista')) {
      return res.json({
        reply: `Conforme o Módulo 1 do curso no PVI (https://pvi.pm.pe.gov.br/course/view.php?id=105) e os Arts. 240, § 2º e 244 do Código de Processo Penal:

1. **Requisito Legal da Fundada Suspeita**:
   - A busca pessoal independe de mandado judicial exclusivamente em flagrante delito ou quando houver fundada suspeita de ocultação de armas ou objetos de crime.
   - Conforme fixado pelo STJ no RHC 158.580/BA, a fundada suspeita exige dados objetivos, concretos e verificáveis no momento da abordagem. Não se admite abordagem baseada em impressões meramente subjetivas.

2. **Doutrina Operacional (POP PMPE)**:
   - Verbalização imperativa e clara;
   - Guarnição em cobertura tática (ângulo de 45° a 90°);
   - Início da busca pela linha da cintura (zona de risco letal imediato);
   - Revista em pessoas do sexo feminino realizada obrigatoriamente por policial feminina (Art. 249 do CPP), ressalvada situação emergencial que ponha em risco a integridade da guarnição.`,
      });
    }

    // 6. Módulo 2 do PVI: Uso da Força e Algemas (Súmula Vinculante 11)
    if (lower.includes('algema') || lower.includes('força') || lower.includes('forca') || lower.includes('súmula vinculante 11') || lower.includes('sumula 11')) {
      return res.json({
        reply: `Conforme o Módulo 2 do curso no PVI e a Súmula Vinculante nº 11 do STF:

1. **Uso de Algemas (Mnemônico P-R-F)**:
   - Só é lícito o emprego de algemas nos casos de:
     - **P**erigo à integridade física própria ou alheia;
     - **R**esistência à prisão;
     - **F**undado receio de fuga.

2. **Dever Legal de Justificativa**:
   - A excepcionalidade do uso deve ser fundamentada por escrito no Boletim de Ocorrência (BOPM/MOP), sob pena de responsabilidade administrativa, civil e penal (Art. 21 da Lei nº 13.869/2019 - Abuso de Autoridade).

3. **Uso Diferenciado da Força (Lei nº 13.060/2014)**:
   - Observância obrigatória dos princípios de Legalidade, Necessidade, Proporcionalidade, Moderação e Conveniência.`,
      });
    }

    // 7. Módulo 3 do PVI: Domicílio e Flagrante (Tema 280 STF)
    if (lower.includes('domicílio') || lower.includes('domicilio') || lower.includes('casa') || lower.includes('tema 280') || lower.includes('residência') || lower.includes('residencia')) {
      return res.json({
        reply: `Conforme o Módulo 3 do curso no PVI e o Art. 5º, inciso XI da CF/88:

1. **Inviolabilidade do Domicílio**:
   - A casa é asilo inviolável, admitindo ingresso sem consentimento apenas em desastre, para prestar socorro ou durante flagrante delito.

2. **Tema 280 do STF (RE 603.616)**:
   - A entrada forçada sem mandado judicial, inclusive à noite, exige prévias fundadas razões (justa causa) que indiquem a ocorrência de delito em seu interior.
   - A fuga descontextualizada ou mero nervosismo não constituem justa causa idônea.

3. **Consentimento do Morador (HC 598.051 STJ)**:
   - Exige registro escrito assinado ou registro audiovisual da autorização para garantir segurança jurídica à guarnição.`,
      });
    }

    // 8. Módulo 4 do PVI: Termo Circunstanciado de Ocorrência (TCO)
    if (lower.includes('tco') || lower.includes('termo circunstanciado') || lower.includes('9.099')) {
      return res.json({
        reply: `Conforme o Módulo 4 do curso no PVI e a Lei Federal nº 9.099/1995:

1. **Competência Policial Militar (STF - ADIs 5.637 e 6.245)**:
   - O Supremo Tribunal Federal fixou a plena legalidade e constitucionalidade da lavratura de TCO por policiais militares em infrações de menor potencial ofensivo (crimes e contravenções com pena máxima de até 2 anos).

2. **Compromisso de Comparecimento**:
   - Havendo compromisso formal do autor dos fatos de comparecer ao Juizado Especial Criminal, não se imporá prisão em flagrante nem se exigirá fiança.
   - O procedimento é lançado diretamente no BOPM/MOP eletrônico da PMPE.`,
      });
    }

    // 9. Envio de Tarefas e Trabalhos no Moodle/PVI
    if (lower.includes('tarefa') || lower.includes('trabalho') || lower.includes('enviar atividade') || lower.includes('adicionar envio') || (lower.includes('enviar') && lower.includes('arquivo'))) {
      return res.json({
        reply: `Olá, Policial Militar! Conforme o padrão operacional da Plataforma Virtual de Instrução (PVI / PMPE - https://pvi.pm.pe.gov.br/), siga este passo a passo para enviar sua tarefa:

1. **Acesse a Disciplina**: No menu superior ou painel lateral esquerdo, clique em "Meus cursos" e selecione o curso desejado.
2. **Localize a Atividade**: Role até a semana ou módulo correspondente e clique sobre o título da tarefa.
3. **Inicie o Envio**: Clique no botão **"Adicionar envio"** (ou "Editar envio").
4. **Anexe o Arquivo**: Arraste seu arquivo (preferencialmente em formato PDF) para o campo demarcado com a seta azul, ou clique no ícone de pasta para selecionar o arquivo do seu computador/celular.
5. **Confirme**: Clique no botão **"Salvar mudanças"**. 
6. **Verificação de Sucesso**: Certifique-se de que o campo *Status do envio* passou a exibir a mensagem em verde: **"Enviado para avaliação"**.

Consegui esclarecer sua dúvida, Policial Militar? Ficou claro esse procedimento de envio?`,
      });
    }

    // 10. Emissão de Certificados Digitais na PVI
    if (lower.includes('certificado') || lower.includes('certificação') || lower.includes('certificacao') || lower.includes('emitir certificado')) {
      return res.json({
        reply: `Olá, Policial Militar! Conforme as diretrizes pedagógicas da Coordenação de Ensino a Distância (CEaD - PMPE / DEIP) na PVI (https://pvi.pm.pe.gov.br/):

1. **Requisitos Obrigatórios para Certificação**:
   - Obter média final igual ou superior a **70% (setenta por cento)** nas avaliações e questionários do curso;
   - Ter concluído 100% das etapas e atividades programadas na trilha de aprendizagem.
2. **Como Emitir o Certificado**:
   - Acesse a página principal do seu curso na PVI.
   - Navegue até a seção final intitulada **"Certificação"** ou **"Conclusão do Curso"**.
   - Clique sobre o recurso **"Certificado Digital"**.
   - Clique no botão **"Obter certificado"** para fazer o download do documento em PDF autenticado institucionalmente.

Consegui esclarecer sua dúvida, Policial Militar? Ficou claro como emitir sua certificação?`,
      });
    }

    // 11. Consulta a Notas, Prazos e Avaliações no Moodle
    if (lower.includes('nota') || lower.includes('notas') || lower.includes('livro de notas') || lower.includes('cronograma') || lower.includes('prazo') || lower.includes('avaliação') || lower.includes('avaliacao') || lower.includes('questionário') || lower.includes('questionario')) {
      return res.json({
        reply: `Olá, Policial Militar! Conforme a navegação da Plataforma Virtual de Instrução (PVI / PMPE - https://pvi.pm.pe.gov.br/):

1. **Como Visualizar suas Notas**:
   - Dentro da página do curso, localize a barra superior ou o menu lateral e clique em **"Notas"** (Livro de Notas).
   - Você visualizará a pontuação obtida em cada tarefa, questionário ou fórum avaliativo, além do percentual de aproveitamento global (média mínima de aprovação: 70%).
2. **Acompanhamento de Prazos e Cronograma**:
   - Na página inicial do curso, consulte o bloco lateral **"Linha do tempo"** ou **"Calendário"** para verificar as datas limites de entrega de tarefas e fechamento de questionários.
   - Organize seus estudos com antecedência para evitar bloqueios por expiração de prazo.

Consegui esclarecer sua dúvida, Policial Militar? Ficou claro como acompanhar suas notas e prazos?`,
      });
    }

    // 12. Resolução Prática de Erros Técnicos no Moodle
    if (lower.includes('erro') || lower.includes('falha') || lower.includes('não consigo') || lower.includes('nao consigo') || lower.includes('expirou') || lower.includes('expirada') || lower.includes('tamanho') || lower.includes('compatibilidade')) {
      return res.json({
        reply: `Olá, Policial Militar! Quando ocorre uma falha técnica de acesso ou envio na PVI (https://pvi.pm.pe.gov.br/), as três causas mais comuns e suas soluções são:

1. **Prazo de Envio Expirado**: Se o botão "Adicionar envio" não aparece na atividade, a data limite foi atingida. Solução: Entre em contato imediato com o instrutor do módulo ou com a CEaD para solicitar abertura de prazo excepcional fundamentado.
2. **Tamanho ou Formato do Arquivo**: O Moodle da PVI possui limite de upload por arquivo (geralmente até 20MB/50MB) e pode restringir formatos. Solução: Salve seu trabalho em formato **PDF** e reduza o tamanho das imagens antes de enviar.
3. **Sessão Expirada / Erro de Login**: A inatividade no Moodle pode desconectar seu usuário sem aviso prévio, gerando erro ao tentar salvar. Solução: Atualize a página (F5), abra uma aba anônima e faça login novamente em http://pvi.pm.pe.gov.br/login/index.php.

Consegui identificar a causa do seu problema, Policial Militar? Precisa de apoio com mais alguma etapa técnica?`,
      });
    }

    // 13. Portal Institucional da PMPE (https://www.pm.pe.gov.br/)
    if (lower.includes('portal da pmpe') || lower.includes('pm.pe.gov.br') || lower.includes('site da pmpe') || lower.includes('comando geral') || lower.includes('aviso de ensino') || lower.includes('diretrizes institucionais')) {
      return res.json({
        reply: `Conforme o Portal Institucional da Polícia Militar de Pernambuco (https://www.pm.pe.gov.br/):

1. **Diretrizes e Avisos de Ensino**:
   - O portal da PMPE é o canal oficial de publicação das diretrizes do Comando Geral, editais de seleção da Diretoria de Ensino, Instrução e Pesquisa (DEIP), convocações para testes de aptidão física (TAF) e normas corporativas.
2. **Integração com a PVI**:
   - Os cursos de capacitação continuada e aperfeiçoamento anunciados no portal institucional são operacionalizados e ministrados no ambiente virtual da PVI (https://pvi.pm.pe.gov.br/).

Consegui esclarecer sua dúvida institucional, Policial Militar?`,
      });
    }

    // 14. Nível Avançado / Gestão de Cursos (Para Instrutores e Administradores)
    if (lower.includes('instrutor') || lower.includes('administrador') || lower.includes('bloco') || lower.includes('restrição') || lower.includes('restricao') || lower.includes('relatório de conclusão') || lower.includes('relatorio de conclusao')) {
      return res.json({
        reply: `Prezado(a) Instrutor(a) / Administrador(a)! Conforme os recursos de gestão pedagógica da PVI (https://pvi.pm.pe.gov.br/):

1. **Configuração de Blocos**:
   - No topo superior direito da página do curso, ative o **"Modo de edição"**.
   - No painel lateral, clique em **"Adicionar um bloco"** e selecione os recursos pedagógicos necessários (Bloco HTML institucional, Calendário, Barra de Progresso).
2. **Restrição de Acesso às Atividades**:
   - Ao editar uma atividade, acesse a guia **"Restringir acesso"** para vincular o desbloqueio ao cumprimento de pré-requisitos (como nota mínima no questionário anterior ou conclusão de módulo prévio).
3. **Relatórios de Conclusão**:
   - Acesse as configurações do curso -> "Mais..." -> **"Relatórios"** -> **"Conclusão de atividades"** para acompanhar em tempo real o avanço e aproveitamento da turma.

Ficou clara essa orientação de gestão pedagógica, Senhor(a) Instrutor(a)?`,
      });
    }

    // 15. Estrutura Geral dos Cursos no PVI / CEaD PMPE
    if (lower.includes('curso') || lower.includes('pvi') || lower.includes('módulo') || lower.includes('modulo')) {
      return res.json({
        reply: `Olá, Policial Militar! Conforme as diretrizes da Plataforma Virtual de Instrução (PVI PMPE - https://pvi.pm.pe.gov.br/), coordenada pela Diretoria de Ensino, Instrução e Pesquisa (DEIP) e Coord. de Ensino a Distância (CEaD - PMPE):

1. **Cursos e Instruções no PVI**:
   - A plataforma oferece instruções continuadas e cursos temáticos, incluindo o Curso ID 105 (Procedimentos Operacionais Padrão e Legislação Aplicada) e cursos de formação e capacitação setorial.
   - Os módulos doutrinários abordam Abordagem e Busca Pessoal, Uso Diferenciado da Força, Flagrante e Domicílio, e Lavratura de TCO, integrados aos POPs PMPE e à legislação da ALEPE.
2. **Requisitos de Aproveitamento e Certificação**:
   - Para certificação oficial, o militar discente deve obter rendimento mínimo de 70% nas avaliações e completar todas as etapas e questionários do curso na plataforma.

Consegui esclarecer sua dúvida sobre os cursos da PVI, Policial Militar?`,
      });
    }

    // Limite de Escopo estrito para perguntas que não constam nas fontes fornecidas
    return res.json({
      reply: 'Desculpe, Policial Militar, mas não encontrei essa informação no conteúdo da PVI, no portal da PMPE nem na legislação da ALEPE. Por favor, consulte o instrutor do módulo ou a coordenação da PVI/CEaD.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao processar consulta' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Moodle API Studio running at http://localhost:${PORT}`);
  });
}

startServer();
