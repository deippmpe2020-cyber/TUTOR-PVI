import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Send,
  Loader2,
  BookOpen,
  Award,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Scale,
  Car,
  FileCheck,
  Users,
  Compass,
  RotateCcw,
  Share2,
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

const QUICK_TOPICS = [
  {
    icon: Car,
    title: 'Busca Pessoal e Fundada Suspeita',
    prompt: 'Qual o procedimento operacional padrão e fundamentação legal (Art. 240 e 244 do CPP) para a busca pessoal e veicular sem mandado judicial com base na fundada suspeita?',
    level: 'nivel_1',
  },
  {
    icon: Scale,
    title: 'Violação de Domicílio e Flagrante',
    prompt: 'Em quais hipóteses operacionais a guarnição pode adentrar em domicílio sem mandado judicial? Como documentar as fundadas razões exigidas pelo Tema 280 do STF?',
    level: 'nivel_1',
  },
  {
    icon: Shield,
    title: 'Uso Diferenciado da Força',
    prompt: 'Como orientar a guarnição sobre os níveis do uso diferenciado da força (Lei 13.060/14) e o emprego legítimo de algemas de acordo com a Súmula Vinculante 11 do STF?',
    level: 'nivel_1',
  },
  {
    icon: FileCheck,
    title: 'Lavratura de TCO pela PM',
    prompt: 'Quais os requisitos e procedimentos para a lavratura do Termo Circunstanciado de Ocorrência (TCO) diretamente pela guarnição da PM com base na Lei 9.099/95 e jurisprudência do STF?',
    level: 'nivel_2',
  },
  {
    icon: Users,
    title: 'Gestão de Efetivo e Escala de Serviço',
    prompt: 'Como otimizar a distribuição do efetivo de um pelotão, equilibrando as escalas operacionais, redução da fadiga da tropa e cobertura das manchas criminais prioritárias?',
    level: 'nivel_2',
  },
  {
    icon: Compass,
    title: 'Diretriz de Emprego e Inteligência',
    prompt: 'Como estruturar uma diretriz de comando para emprego tático orientado por inteligência e manchas criminais georreferenciadas, mantendo a legalidade estrita e salvaguarda da tropa?',
    level: 'nivel_3',
  },
];

export const TutorPm: React.FC = () => {
  const [level, setLevel] = useState<'nivel_1' | 'nivel_2' | 'nivel_3'>('nivel_1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
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
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
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
      const assistantMsg: Message = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        text: data.reply || 'Companheiro(a), não foi possível processar a resposta no momento. Por favor, tente novamente.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          text: `Erro de conexão: ${err.message || 'Verifique sua conexão'}.`,
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

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      {/* SIDEBAR: Níveis e Temas Rápidos */}
      <div className="w-full lg:w-84 shrink-0 border-r border-slate-800 bg-slate-900/80 flex flex-col overflow-y-auto p-4 space-y-5">
        {/* Card Identidade Militar */}
        <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center space-x-2.5">
            <BrasaoPmpe size="md" className="p-0.5 rounded-lg bg-white/10 border border-white/20 shadow-md" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Tutor PVI
              </h2>
              <span className="text-[10px] text-blue-300 font-mono">
                Policial Virtual de Instrução
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Especialista e instrutor focado em apoiar a tropa e gestores na aplicação prática, legalidade estrita e procedimentos de segurança pública.
          </p>
        </div>

        {/* Nível do Policial / Enquadramento */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Enquadramento de Instrução
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setLevel('nivel_1')}
              className={`w-full text-left p-2.5 rounded-lg border transition ${
                level === 'nivel_1'
                  ? 'bg-orange-600/15 border-orange-500/60 text-white shadow-sm'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Nível 1: Operacional / Entrada
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                  Rua / POP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Soldados, Cabos e Alunos. Passo a passo prático e aplicação operacional direta.
              </p>
            </button>

            <button
              onClick={() => setLevel('nivel_2')}
              className={`w-full text-left p-2.5 rounded-lg border transition ${
                level === 'nivel_2'
                  ? 'bg-orange-600/15 border-orange-500/60 text-white shadow-sm'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Nível 2: Gestor / Pelotão
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                  Gestão & Instrução
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Sargentos, Subtenentes e Tenentes. Eficiência, padronização e tomada de decisão.
              </p>
            </button>

            <button
              onClick={() => setLevel('nivel_3')}
              className={`w-full text-left p-2.5 rounded-lg border transition ${
                level === 'nivel_3'
                  ? 'bg-orange-600/15 border-orange-500/60 text-white shadow-sm'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Nível 3: Comando & Estado-Maior
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                  Estratégico
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Capitães, Oficiais Superiores. Cenários, jurisprudência e diretrizes de comando.
              </p>
            </button>
          </div>
        </div>

        {/* Tópicos e Dúvidas Frequentes */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Casos Práticos & Consultas Rápidas
          </label>
          <div className="space-y-1.5">
            {QUICK_TOPICS.map((topic, i) => {
              const IconComp = topic.icon;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setLevel(topic.level as any);
                    handleSendMessage(topic.prompt);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition flex items-start space-x-2.5 group"
                >
                  <IconComp className="w-3.5 h-3.5 text-orange-400 mt-0.5 shrink-0 group-hover:scale-110 transition" />
                  <span className="text-xs text-slate-300 group-hover:text-white leading-tight">
                    {topic.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ação Reset */}
        <button
          onClick={handleResetChat}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 text-xs transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Diálogo do Fórum</span>
        </button>
      </div>

      {/* ÁREA CENTRAL: Fórum de Diálogo e Resoluções com o Tutor */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
        {/* Top Header do Fórum */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-200">
              Fórum de Instrução & Dúvidas Operacionais
            </span>
            <span className="text-xs text-slate-500 font-mono">
              • Nível Ativo: {level === 'nivel_1' ? '1 (Operacional)' : level === 'nivel_2' ? '2 (Gestão)' : '3 (Estratégico)'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Pautado pela estrita legalidade, hierarquia e disciplina consciente.
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((msg) => {
            const isTutor = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isTutor ? 'justify-start' : 'justify-end'}`}
              >
                {isTutor && (
                  <BrasaoPmpe size="sm" className="w-8 h-8 rounded-lg bg-white/10 p-0.5 border border-white/20 shrink-0 mt-0.5" />
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isTutor
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-sm'
                      : 'bg-orange-600 text-white font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/10 text-[10px] opacity-80">
                    <span className="font-bold">
                      {isTutor ? 'TUTOR PVI' : 'POLICIAL MILITAR'}
                    </span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <div className="whitespace-pre-wrap font-sans space-y-2">
                    {msg.text}
                  </div>
                </div>

                {!isTutor && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    PM
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                <span>O Tutor está fundamentando a resposta na legislação e procedimentos...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Barra de Entrada de Dúvida */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite seu tema, dúvida operacional, caso prático ou questão de estudo..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-orange-500 transition"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center space-x-2 disabled:opacity-40 transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Dúvida</span>
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>Dica: Especifique o cenário ou artigo legal para uma análise ainda mais precisa.</span>
            <span>Respostas estruturadas com encerramento de validação.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
