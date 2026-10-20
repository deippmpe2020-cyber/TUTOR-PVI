import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Send,
  Loader2,
  X,
  RotateCcw,
  Scale,
  Car,
  FileCheck,
  Users,
  Compass,
  ChevronRight,
  Maximize2,
  Minimize2,
  MessageSquare,
} from 'lucide-react';
import { BrasaoPmpe } from './BrasaoPmpe';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

const INITIAL_WELCOME = `Olá, Policial Militar! Seja muito bem-vindo(a) à PVI! 🛡️📚
Eu sou o Tutor PVI, o seu assistente virtual na Plataforma Virtual de Instrução da Polícia Militar de Pernambuco. 

Estou aqui para acompanhar e facilitar a sua jornada de capacitação: posso te ajudar a navegar e resolver qualquer dúvida dentro da PVI (https://pvi.pm.pe.gov.br/), localizar atividades, acompanhar notas e prazos, além de orientar consultas à legislação no portal da ALEPE (https://legis.alepe.pe.gov.br/) e às diretrizes no portal da PMPE (https://www.pm.pe.gov.br/).

Qual é a sua missão hoje? Precisa de apoio com navegação/envio no Moodle, dúvidas sobre um curso ou consulta a alguma norma?`;

const QUICK_QUESTIONS = [
  {
    title: 'Busca Pessoal (Art. 240/244 CPP)',
    prompt: 'Qual a fundamentação legal e o procedimento operacional padrão para a busca pessoal com base na fundada suspeita?',
    level: 'nivel_1',
  },
  {
    title: 'Flagrante & Entrada em Domicílio',
    prompt: 'Quais os requisitos do Tema 280 do STF para a entrada em domicílio sem mandado em situação de flagrante?',
    level: 'nivel_1',
  },
  {
    title: 'Uso da Força & Algemas (Súmula 11)',
    prompt: 'Quais as balizas jurídicas da Súmula Vinculante 11 do STF e Lei 13.060/14 para emprego legítimo de algemas?',
    level: 'nivel_1',
  },
  {
    title: 'Lavratura de TCO pela PM',
    prompt: 'Como a guarnição deve instruir a lavratura do Termo Circunstanciado de Ocorrência (Lei 9.099/95) em crimes de menor potencial ofensivo?',
    level: 'nivel_2',
  },
  {
    title: 'Gestão de Efetivo e Escalas',
    prompt: 'Quais as melhores práticas administrativas para otimizar escalas de serviço e cobertura de manchas criminais?',
    level: 'nivel_2',
  },
];

interface TutorPviDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorPviDrawer: React.FC<TutorPviDrawerProps> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState<'nivel_1' | 'nivel_2' | 'nivel_3'>('nivel_1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'pvi-welcome',
      role: 'assistant',
      text: INITIAL_WELCOME,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          level,
          history: messages.slice(-5),
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        text:
          data.reply ||
          'Companheiro(a), analisei sua dúvida. O procedimento deve observar o POP e os preceitos constitucionais vigentes.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          text: `Erro ao consultar instrução: ${err.message || 'Falha de comunicação'}.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        text: INITIAL_WELCOME,
        timestamp: Date.now(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Tutor PVI Chat"
      style={{ width: '400px', height: '700px', maxHeight: 'calc(100vh - 4.5rem)' }}
      className="fixed right-3 top-18 z-50 w-[400px] h-[700px] max-h-[calc(100vh-4.5rem)] bg-white text-slate-800 shadow-2xl rounded-2xl border-2 border-blue-700 flex flex-col font-sans overflow-hidden animate-in slide-in-from-right duration-200"
    >
      {/* HEADER: AZUL E BRANCO COM BRASÃO PMPE EAD */}
      <div className="bg-[#1e3a8a] text-white px-4 py-3 shrink-0 flex items-center justify-between shadow-md border-b border-blue-900">
        <div className="flex items-center space-x-2.5">
          <BrasaoPmpe size="md" className="p-0.5 rounded-lg bg-white/10 border border-white/20 shadow-sm" />
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-bold tracking-tight text-white">Tutor PVI</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Tutor Online" />
            </div>
            <p className="text-[10px] text-blue-200 font-medium">
              Policial Virtual de Instrução • PMPE EAD
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleResetChat}
            title="Reiniciar Diálogo"
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/80 rounded-md transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Fechar Chat"
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/80 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SELETOR DE NÍVEL: AZUL E BRANCO */}
      <div className="bg-blue-50/90 border-b border-blue-200 px-3 py-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-[#1e3a8a]">
          <span>Enquadramento de Instrução:</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
            {level === 'nivel_1' ? 'Nível 1 • Rua/POP' : level === 'nivel_2' ? 'Nível 2 • Gestão' : 'Nível 3 • Comando'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setLevel('nivel_1')}
            className={`py-1 px-1.5 rounded text-[10px] font-semibold transition text-center ${
              level === 'nivel_1'
                ? 'bg-[#1e40af] text-white shadow-sm'
                : 'bg-white text-blue-900 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            Nível 1 (POP)
          </button>
          <button
            type="button"
            onClick={() => setLevel('nivel_2')}
            className={`py-1 px-1.5 rounded text-[10px] font-semibold transition text-center ${
              level === 'nivel_2'
                ? 'bg-[#1e40af] text-white shadow-sm'
                : 'bg-white text-blue-900 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            Nível 2 (Gestão)
          </button>
          <button
            type="button"
            onClick={() => setLevel('nivel_3')}
            className={`py-1 px-1.5 rounded text-[10px] font-semibold transition text-center ${
              level === 'nivel_3'
                ? 'bg-[#1e40af] text-white shadow-sm'
                : 'bg-white text-blue-900 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            Nível 3 (Comando)
          </button>
        </div>
      </div>

      {/* ÁREA DE MENSAGENS */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50">
        {messages.map((msg) => {
          const isTutor = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  isTutor
                    ? 'bg-white text-slate-800 border border-blue-200 rounded-tl-sm'
                    : 'bg-[#1e40af] text-white rounded-tr-sm'
                }`}
              >
                {/* Remetente & Horário */}
                <div
                  className={`flex items-center justify-between mb-1 pb-1 text-[10px] font-semibold border-b ${
                    isTutor ? 'border-slate-100 text-[#1e3a8a]' : 'border-blue-400 text-blue-100'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    {isTutor && <BrasaoPmpe size="sm" className="w-4 h-4 mr-0.5 inline-block" />}
                    <span>{isTutor ? 'Tutor PVI' : 'Aluno PM'}</span>
                  </span>
                  <span className="opacity-75 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="whitespace-pre-wrap font-sans space-y-1.5">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-[#1e40af] bg-blue-50 border border-blue-200 p-2.5 rounded-xl">
            <Loader2 className="w-4 h-4 animate-spin text-[#1e40af]" />
            <span className="font-medium">Tutor PVI está fundamentando a resposta...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* PERGUNTAS RÁPIDAS (CHIPS AZUL E BRANCO) */}
      <div className="px-3 py-2 bg-white border-t border-blue-100 shrink-0">
        <div className="text-[10px] uppercase font-bold text-[#1e3a8a] mb-1.5 flex items-center justify-between">
          <span>Dúvidas Frequentes da Tropa:</span>
          <span className="text-[9px] text-slate-400">Clique para enviar</span>
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setLevel(q.level as any);
                handleSendMessage(q.prompt);
              }}
              className="px-2 py-1 rounded-full text-[10px] bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] border border-blue-200 whitespace-nowrap transition font-medium shrink-0"
            >
              {q.title}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT DO CHAT: AZUL E BRANCO */}
      <div className="p-3 bg-white border-t border-blue-200 shrink-0">
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
            placeholder="Digite sua dúvida sobre o curso/POP..."
            disabled={isLoading}
            className="flex-1 bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af] transition"
          />

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold text-xs flex items-center justify-center space-x-1 disabled:opacity-40 shadow-sm transition shrink-0"
            title="Enviar mensagem para o Tutor PVI"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>

        <div className="mt-1.5 text-[9px] text-slate-500 text-center font-medium">
          Tutor PVI • Dimensões: 400 (largura) × 700 (altura) • Lado Direito
        </div>
      </div>
    </aside>
  );
};
