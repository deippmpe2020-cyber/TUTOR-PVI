import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Loader2,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Database,
  PlusCircle,
  X,
  Clock,
  Trash2,
  Download,
  FileDown,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { KnowledgeBaseManager } from './KnowledgeBaseManager';
import { exportChatToPdf, exportChatToText } from '../utils/chatExport';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface TutorPviChatProps {
  compact?: boolean;
  fullHeight?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

const STORAGE_KEY = 'tutor_pvi_chat_session_v1';
const DRAFT_KEY = 'tutor_pvi_chat_draft_v1';

const INITIAL_WELCOME = `Olá, Policial Militar! Seja muito bem-vindo(a) à PVI! 🛡️📚
Eu sou o Tutor PVI, o seu assistente virtual na Plataforma Virtual de Instrução da Polícia Militar de Pernambuco. 

Estou aqui para acompanhar e facilitar a sua jornada de capacitação: posso te ajudar a navegar e resolver qualquer dúvida dentro da PVI (https://pvi.pm.pe.gov.br/), localizar atividades, acompanhar notas e prazos, além de orientar consultas à legislação no portal da ALEPE (https://legis.alepe.pe.gov.br/) e às diretrizes no portal da PMPE (https://www.pm.pe.gov.br/).

Qual é a sua missão hoje? Precisa de apoio com navegação/envio no Moodle, dúvidas sobre um curso ou consulta a alguma norma?`;

const createInitialMessage = (): Message => ({
  id: 'pvi-initial-msg',
  role: 'assistant',
  text: INITIAL_WELCOME,
  timestamp: Date.now(),
});

// Helper to safely load persisted chat session from localStorage
const loadSavedSession = (): { messages: Message[]; isResumed: boolean } => {
  if (typeof window === 'undefined') {
    return { messages: [createInitialMessage()], isResumed: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : parsed.messages;
      if (Array.isArray(list) && list.length > 0) {
        const hasUserInteraction = list.some((m: Message) => m.role === 'user');
        return { messages: list, isResumed: hasUserInteraction };
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar sessão persistida do Tutor PVI:', err);
  }
  return { messages: [createInitialMessage()], isResumed: false };
};

// Helper to safely load draft text
const loadSavedDraft = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(DRAFT_KEY) || '';
  } catch {
    return '';
  }
};

// Tópicos operacionais e institucionais da PVI, Moodle, Portal PMPE e Legislação ALEPE
const QUICK_PROMPTS = [
  'Como enviar tarefas e trabalhos na PVI?',
  'Como consultar minhas notas e prazos no Moodle?',
  'Como emitir meu certificado no curso da PVI?',
  'Erro de envio de arquivo ou prazo expirado',
  'Busca pessoal e fundada suspeita (Módulo 1)',
  'Uso diferenciado da força e Súmula Vinculante 11',
  'Estatuto dos Policiais Militares (Lei 6.783/74)',
  'Prazos de Sindicância e IPM na PMPE',
  'Diretrizes e estrutura no portal da PMPE',
  'Configuração de blocos e restrições (Instrutor)',
];

// Contexto oficial integrado estabelecido pela administração (DEIP / CEaD PMPE)
const COURSE_CONTEXT = {
  portalUrl: 'http://pvi.pm.pe.gov.br/',
  pviUrl: 'https://pvi.pm.pe.gov.br/course/view.php?id=105',
  pmpePortalUrl: 'https://www.pm.pe.gov.br/',
  alepeUrl: 'https://legis.alepe.pe.gov.br/',
  institution: 'Diretoria de Ensino, Instrução e Pesquisa (DEIP) • Coord. de Ensino a Distância (CEaD - PMPE)',
  title: 'Plataforma Virtual de Instrução (PVI / PMPE), Portal PMPE e Legislação da ALEPE',
  summary: 'Capacitação contínua, instrução militar, navegação no Moodle e fundamentação normativa da PMPE.',
};

export const TutorPviChat: React.FC<TutorPviChatProps> = ({
  compact = false,
  fullHeight = false,
  onClose,
  isFloating = false,
}) => {
  // Inicialização com recuperação do localStorage
  const [initialData] = useState(() => loadSavedSession());
  const [messages, setMessages] = useState<Message[]>(initialData.messages);
  const [isSessionResumed, setIsSessionResumed] = useState<boolean>(initialData.isResumed);
  const [inputText, setInputText] = useState<string>(() => loadSavedDraft());
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'knowledge'>('chat');
  const [customSourcesCount, setCustomSourcesCount] = useState<number>(0);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persistir mensagens no localStorage a cada atualização
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Erro ao salvar mensagens no localStorage:', err);
    }
  }, [messages]);

  // Persistir rascunho de texto digitado no localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (inputText.trim()) {
        localStorage.setItem(DRAFT_KEY, inputText);
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch (err) {
      console.warn('Erro ao salvar rascunho no localStorage:', err);
    }
  }, [inputText]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (viewMode === 'chat') {
      scrollToBottom();
    }
  }, [messages, isLoading, viewMode]);

  // Carrega contagem de fontes da base para exibir no badge
  const checkKnowledgeCount = async () => {
    try {
      const res = await fetch('/api/knowledge-base');
      if (res.ok) {
        const data = await res.json();
        setCustomSourcesCount(data.custom?.length || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    checkKnowledgeCount();
  }, [viewMode]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch {}
    setIsLoading(true);

    try {
      // Envia mensagem mantendo estrito alinhamento às fontes obrigatórias
      const response = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          courseContext: COURSE_CONTEXT,
          history: messages.slice(-6),
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        'Desculpe, mas não encontrei essa informação no conteúdo do PVI nem na legislação da ALEPE. Por favor, consulte o instrutor do módulo ou a coordenação do PVI.';

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        text: replyText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          text: `Desculpe, ocorreu uma instabilidade na consulta às fontes (${err.message || 'Erro de rede'}). Por favor, tente novamente.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const freshMessage = createInitialMessage();
    setMessages([freshMessage]);
    setIsSessionResumed(false);
    setInputText('');
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch (err) {
      console.warn('Erro ao limpar localStorage:', err);
    }
  };

  const handleExportPdf = () => {
    try {
      exportChatToPdf(messages, {
        courseTitle: COURSE_CONTEXT.title,
        courseUrl: COURSE_CONTEXT.pviUrl,
      });
      setExportSuccessMessage('Relatório em PDF gerado com sucesso!');
      setTimeout(() => setExportSuccessMessage(null), 3500);
    } catch (err: any) {
      console.error('Erro ao gerar PDF:', err);
      alert('Não foi possível gerar o arquivo PDF: ' + (err.message || 'Erro inesperado'));
    }
  };

  const handleExportText = () => {
    try {
      exportChatToText(messages, {
        courseTitle: COURSE_CONTEXT.title,
        courseUrl: COURSE_CONTEXT.pviUrl,
      });
      setExportSuccessMessage('Arquivo de texto (.txt) exportado com sucesso!');
      setTimeout(() => setExportSuccessMessage(null), 3500);
    } catch (err: any) {
      console.error('Erro ao gerar arquivo de texto:', err);
      alert('Não foi possível exportar o arquivo de texto: ' + (err.message || 'Erro inesperado'));
    }
  };

  return (
    <div
      style={!fullHeight ? { width: '400px', height: '700px' } : undefined}
      className={`bg-white shadow-2xl border-2 border-[#0B3C74] flex flex-col font-sans overflow-hidden ${
        fullHeight ? 'w-full h-full rounded-none sm:rounded-2xl' : 'w-[400px] h-[700px] max-w-[100vw] max-h-[100vh] rounded-2xl'
      }`}
    >
      {/* CABEÇALHO AZUL E BRANCO */}
      <header className="bg-[#0B3C74] text-white px-3.5 py-2.5 shrink-0 flex items-center justify-between shadow-md border-b-2 border-blue-900">
        <div className="flex items-center space-x-2.5">
          <div
            className="w-8 h-8 shrink-0 rounded-full bg-blue-800 border border-blue-300/40 text-white flex items-center justify-center font-bold text-[11px] shadow-sm select-none"
            title="Tutor PVI"
          >
            PVI
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold tracking-tight text-white leading-tight">
                Tutor PVI
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Tutor Ativo" />
            </div>
            <p className="text-[10px] text-blue-100 font-medium leading-tight">
              Coord. de Ensino a Distância (CEaD - PMPE)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* BOTÃO PARA FORNECER / GERENCIAR BASE DE INFORMAÇÕES */}
          <button
            onClick={() => setViewMode(viewMode === 'chat' ? 'knowledge' : 'chat')}
            title={viewMode === 'chat' ? 'Fornecer base de informações para as perguntas' : 'Voltar ao Chat de Atendimento'}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition cursor-pointer ${
              viewMode === 'knowledge'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'bg-blue-800/90 text-blue-100 hover:bg-blue-800 hover:text-white border border-blue-300/30'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{viewMode === 'knowledge' ? 'Chat' : 'Base'}</span>
            {customSourcesCount > 0 && viewMode === 'chat' && (
              <span className="w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {customSourcesCount}
              </span>
            )}
          </button>

          {/* BOTÃO EXPORTAR CONVERSA (PDF / TXT) */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              title="Exportar conversa (PDF ou Texto)"
              className={`p-1.5 rounded-lg transition cursor-pointer flex items-center ${
                isExportMenuOpen
                  ? 'bg-blue-800 text-white shadow-inner'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/80'
              }`}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* MENU SUSPENSO DE EXPORTAÇÃO */}
            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-2xl border-2 border-[#0B3C74] p-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0B3C74] uppercase tracking-wide">
                    Exportar Atendimento
                  </span>
                  <span className="text-[9px] bg-blue-100 text-[#0B3C74] font-bold px-1.5 py-0.5 rounded">
                    {messages.filter((m) => m.role === 'user').length} consultas
                  </span>
                </div>

                <div className="py-1 space-y-1">
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handleExportPdf();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-blue-50 transition flex items-center space-x-2.5 group cursor-pointer text-slate-700 hover:text-[#0B3C74]"
                  >
                    <div className="w-6 h-6 rounded-md bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <FileDown className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs leading-none">Relatório em PDF (.pdf)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Cabeçalho oficial PMPE / DEIP</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handleExportText();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-blue-50 transition flex items-center space-x-2.5 group cursor-pointer text-slate-700 hover:text-[#0B3C74]"
                  >
                    <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs leading-none">Arquivo de Texto (.txt)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Formato leve para notas</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleResetChat}
            title="Nova Conversa (Limpar histórico salvo no navegador)"
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/80 rounded-lg transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* BOTÃO PARA MINIMIZAR / FECHAR QUANDO FLUTUANTE OU EM IFRAME */}
          {(onClose || (typeof window !== 'undefined' && window.self !== window.top)) && (
            <button
              onClick={() => {
                if (onClose) {
                  onClose();
                }
                try {
                  window.parent.postMessage('tutor-pvi-close', '*');
                } catch {
                  // ignore
                }
              }}
              title="Minimizar janela flutuante"
              className="p-1.5 text-blue-200 hover:text-white hover:bg-red-600/80 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* FEEDBACK DE EXPORTAÇÃO REALIZADA */}
      {exportSuccessMessage && (
        <div className="bg-emerald-600 text-white text-[11px] font-semibold px-3 py-1.5 flex items-center justify-between shrink-0 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>{exportSuccessMessage}</span>
          </div>
          <button
            onClick={() => setExportSuccessMessage(null)}
            className="text-emerald-100 hover:text-white cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* VISUALIZAÇÃO: GERENCIADOR DA BASE DE INFORMAÇÕES */}
      {viewMode === 'knowledge' ? (
        <KnowledgeBaseManager
          onBackToChat={() => setViewMode('chat')}
          onAskQuestionAboutDoc={(query) => {
            setViewMode('chat');
            handleSendMessage(query);
          }}
        />
      ) : (
        /* VISUALIZAÇÃO: CHAT DE ATENDIMENTO */
        <>
          {/* FAIXA DE CONTEXTO OFICIAL */}
          <div className="bg-[#1E40AF] text-white px-3 py-1.5 text-[10.5px] flex items-center justify-between border-b border-blue-400/30 shrink-0">
            <div className="flex items-center space-x-1.5 truncate">
              <BookOpen className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span className="font-semibold truncate">Portal PVI • Cursos PMPE • Base ALEPE</span>
            </div>
            <button
              onClick={() => setViewMode('knowledge')}
              title="Fornecer nova apostila, texto ou portaria para a base"
              className="bg-white/20 hover:bg-white/30 text-white font-medium text-[9.5px] px-2 py-0.5 rounded transition shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              <PlusCircle className="w-3 h-3 text-blue-200" />
              <span>+ Fornecer Base</span>
            </button>
          </div>

          {/* ÁREA DE CONVERSAÇÃO / MENSAGENS COM AVATARES */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50">
            {/* AVISO DE SESSÃO RECUPERADA LOCALMENTE */}
            {isSessionResumed && messages.length > 1 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-[11px] text-blue-950 flex items-center justify-between shadow-xs mb-2">
                <div className="flex items-center space-x-2 truncate">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Clock className="w-3 h-3 text-[#0B3C74]" />
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-[#0B3C74]">Sessão anterior recuperada</span>
                    <span className="text-slate-500 ml-1.5 text-[10px]">
                      ({messages.filter((m) => m.role === 'user').length} perguntas salvas)
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                  <button
                    onClick={() => setIsExportMenuOpen(true)}
                    title="Exportar esta sessão (PDF ou Texto)"
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white hover:bg-blue-50 text-[#0B3C74] border border-blue-200 transition cursor-pointer flex items-center space-x-1"
                  >
                    <Download className="w-2.5 h-2.5" />
                    <span>Exportar</span>
                  </button>
                  <button
                    onClick={handleResetChat}
                    title="Limpar histórico e iniciar novo atendimento"
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white hover:bg-red-50 text-red-700 border border-red-200 transition cursor-pointer flex items-center space-x-1"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>Limpar</span>
                  </button>
                  <button
                    onClick={() => setIsSessionResumed(false)}
                    title="Fechar aviso"
                    className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isTutor = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${
                    isTutor ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isTutor && (
                    <div
                      className="w-7 h-7 shrink-0 rounded-full bg-[#0B3C74] text-white flex items-center justify-center font-bold text-[10px] shadow-xs select-none"
                      title="Tutor PVI"
                    >
                      PVI
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      isTutor
                        ? 'bg-white text-slate-800 border border-blue-100 rounded-tl-xs'
                        : 'bg-[#0B3C74] text-white rounded-tr-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1.5 font-medium ${
                        isTutor ? 'text-slate-400' : 'text-blue-200'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {!isTutor && (
                    <div
                      className="w-7 h-7 shrink-0 rounded-full bg-blue-100 text-[#0B3C74] border border-blue-300 flex items-center justify-center font-bold text-[10px] shadow-xs select-none"
                      title="Aluno / Instrutor"
                    >
                      PM
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start space-x-2 justify-start">
                <div className="w-7 h-7 shrink-0 rounded-full bg-[#0B3C74] text-white flex items-center justify-center font-bold text-[10px] shadow-xs select-none">
                  PVI
                </div>
                <div className="bg-white border border-blue-100 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-600 shadow-sm flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B3C74]" />
                  <span>Consultando fontes oficiais e base de informações...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ATALHOS RÁPIDOS DE CONSULTA (SUGESTÕES) */}
          <div className="bg-white px-3 py-2 border-t border-slate-200 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Consultas Rápidas:
              </span>
              <button
                onClick={() => setViewMode('knowledge')}
                className="text-[10px] text-blue-700 hover:underline font-medium"
              >
                Gerenciar Base
              </button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="shrink-0 text-[10.5px] bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition font-medium cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* FORMULÁRIO DE ENVIO DA DÚVIDA DO ALUNO */}
          <footer className="p-3 bg-white border-t-2 border-blue-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Qual é a sua dúvida sobre o curso?"
                disabled={isLoading}
                className="flex-1 bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#0B3C74] focus:ring-2 focus:ring-blue-100 transition"
              />

              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-4 py-2 rounded-xl bg-[#0B3C74] hover:bg-[#07284f] text-white font-bold text-xs flex items-center justify-center space-x-1.5 disabled:opacity-40 shadow-sm transition shrink-0 cursor-pointer"
                title="Enviar dúvida"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </footer>
        </>
      )}
    </div>
  );
};
