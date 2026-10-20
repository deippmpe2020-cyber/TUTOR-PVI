import React, { useState, useEffect } from 'react';
import {
  Code,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  HelpCircle,
  ShieldCheck,
  Layers,
  Settings,
  Sparkles,
  ChevronRight,
  BookOpen,
  Eye,
  MessageSquare,
  X,
  Maximize2,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { TutorPviChat } from './TutorPviChat';
import { generateEmbedScript } from '../data/embedScript';

export const MoodleDeploymentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'guide' | 'customize'>('simulator');
  const [method, setMethod] = useState<'additional_html' | 'html_block' | 'iframe'>('additional_html');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [serverUrl, setServerUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Floating widget state inside the simulator
  const [isSimChatOpen, setIsSimChatOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setServerUrl(window.location.origin);
    }
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const currentHost = serverUrl || 'https://seu-servidor-tutor.pm.pe.gov.br';

  // Snippets
  const scriptTagCode = `<script src="${currentHost}/embed/tutor-pvi.js" data-position="${position}" defer></script>`;

  const inlineScriptCode = `<script>
  window.TutorPviConfig = {
    serverUrl: "${currentHost}",
    position: "${position}"
  };
</script>
<script src="${currentHost}/embed/tutor-pvi.js" defer></script>`;

  const blockHtmlCode = `<!-- Bloco Tutor PVI - PMPE (Plataforma Virtual de Instrução) -->
<div class="tutor-pvi-block" style="text-align: center; padding: 12px; background: #F8FAFC; border: 1.5px solid #0B3C74; border-radius: 10px;">
  <div style="font-weight: bold; color: #0B3C74; font-size: 14px; margin-bottom: 4px;">Tutor PVI - CEaD / PMPE</div>
  <p style="font-size: 12px; color: #475569; margin-bottom: 10px;">Assistente virtual com base no curso e na legislação ALEPE.</p>
  <button onclick="if(window.__tutorPviToggle){window.__tutorPviToggle();}else{alert('O tutor flutuante está disponível no canto inferior da tela.');}" 
          style="background: #0B3C74; color: #FFF; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">
    💬 Abrir Tutor PVI
  </button>
</div>
<script src="${currentHost}/embed/tutor-pvi.js" data-position="${position}" defer></script>`;

  const iframeCode = `<!-- Iframe Flutuante do Tutor PVI -->
<div style="position: fixed; ${position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'} bottom: 20px; z-index: 999999;">
  <iframe 
    src="${currentHost}/?widget=true" 
    title="Tutor PVI - PMPE"
    style="width: 400px; height: 680px; max-width: 90vw; max-height: 85vh; border: 2px solid #0B3C74; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); background: #fff;"
    allow="clipboard-write">
  </iframe>
</div>`;

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Top Bar da Central de Implantação */}
      <div className="bg-[#0B3C74] text-white px-4 py-3 shrink-0 flex flex-wrap items-center justify-between shadow-md border-b-2 border-blue-900 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-800 border border-blue-400/30 flex items-center justify-center font-bold text-white shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Implantação Flutuante no Moodle (PVI / PMPE)</h1>
            <p className="text-[11px] text-blue-200 leading-tight">
              Disponibilize o Tutor PVI de forma flutuante em <span className="font-mono text-white underline">pvi.pm.pe.gov.br</span>
            </p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex items-center bg-blue-950/70 p-1 rounded-lg border border-blue-800/80 text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'simulator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-200 hover:text-white hover:bg-blue-900/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Simulador no Moodle</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-200 hover:text-white hover:bg-blue-900/50'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Códigos & Passo a Passo</span>
          </button>
          <button
            onClick={() => setActiveTab('customize')}
            className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'customize'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-200 hover:text-white hover:bg-blue-900/50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Personalizar Widget</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-y-auto">
        {/* ABA 1: SIMULADOR INTERATIVO NO MOODLE */}
        {activeTab === 'simulator' && (
          <div className="h-full flex flex-col relative bg-slate-200">
            {/* Aviso informativo */}
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold bg-amber-200 px-1.5 py-0.5 rounded text-[10px] text-amber-800 uppercase tracking-wider">
                  Ambiente Simulado
                </span>
                <span>
                  Esta tela reproduz o visual do <strong>Moodle PVI PMPE</strong>. Teste o{' '}
                  <span className="font-semibold text-blue-900 underline">botão flutuante</span> no{' '}
                  {position === 'bottom-right' ? 'canto inferior direito' : 'canto inferior esquerdo'}!
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <span>Posição:</span>
                <button
                  onClick={() => setPosition(position === 'bottom-right' ? 'bottom-left' : 'bottom-right')}
                  className="px-2 py-0.5 bg-white border border-amber-300 rounded hover:bg-amber-100 font-medium text-blue-900 cursor-pointer"
                >
                  {position === 'bottom-right' ? 'Direita ➔ Mudar p/ Esquerda' : 'Esquerda ➔ Mudar p/ Direita'}
                </button>
              </div>
            </div>

            {/* Simulação de Navegador e Moodle PVI */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col">
              {/* Barra do Navegador */}
              <div className="max-w-6xl mx-auto w-full bg-white rounded-t-xl border border-slate-300 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center space-x-3 text-xs text-slate-600">
                  <div className="flex space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <div className="flex-1 bg-white border border-slate-300 rounded px-3 py-1 font-mono text-[11px] text-slate-700 flex items-center space-x-1.5 shadow-inner">
                    <span className="text-emerald-600 font-bold">🔒</span>
                    <span>http://pvi.pm.pe.gov.br/course/view.php?id=105</span>
                  </div>
                </div>

                {/* Cabeçalho do Moodle PVI */}
                <header className="bg-[#0B3C74] text-white px-5 py-3 flex items-center justify-between border-b-4 border-[#C59B27]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded bg-white p-1 flex items-center justify-center shadow">
                      <span className="text-[#0B3C74] font-black text-sm tracking-tighter">PMPE</span>
                    </div>
                    <div>
                      <div className="text-base font-extrabold tracking-wide">PVI • PMPE</div>
                      <div className="text-[10px] text-blue-200">Plataforma Virtual de Instrução - DEIP / CEaD</div>
                    </div>
                  </div>

                  <nav className="hidden md:flex items-center space-x-4 text-xs font-semibold text-blue-100">
                    <span className="hover:text-white cursor-pointer">Painel</span>
                    <span className="hover:text-white cursor-pointer text-white underline decoration-2 underline-offset-4">
                      Meus Cursos
                    </span>
                    <span className="hover:text-white cursor-pointer">Legislação ALEPE</span>
                    <span className="hover:text-white cursor-pointer">Ajuda</span>
                  </nav>

                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-7 h-7 rounded-full bg-blue-900 border border-blue-300 text-white flex items-center justify-center font-bold text-[10px]">
                      SD
                    </div>
                    <span className="hidden sm:inline font-medium">Sd. 12345/PM</span>
                  </div>
                </header>

                {/* Conteúdo do Curso Moodle */}
                <div className="p-6 bg-slate-50 flex-1 min-h-[500px]">
                  {/* Migalhas (Breadcrumbs) */}
                  <div className="text-xs text-slate-500 mb-3 flex items-center space-x-1">
                    <span>Página inicial</span>
                    <span>/</span>
                    <span>Cursos</span>
                    <span>/</span>
                    <span className="text-[#0B3C74] font-medium">
                      Procedimentos Operacionais Padrão e Legislação Aplicada (ID: 105)
                    </span>
                  </div>

                  {/* Banner do Curso */}
                  <div className="bg-gradient-to-r from-[#0B3C74] to-[#082952] rounded-xl p-5 text-white mb-6 shadow-md border-l-8 border-[#C59B27]">
                    <span className="bg-[#C59B27] text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      Instrução Continuada DEIP 2024
                    </span>
                    <h2 className="text-xl font-bold mt-2 mb-1">
                      Procedimentos Operacionais Padrão e Legislação Aplicada
                    </h2>
                    <p className="text-xs text-blue-200 max-w-2xl">
                      Coordenação de Ensino a Distância (CEaD - PMPE) • Fundamentação em doutrina operacional, normas
                      institucionais e leis da Assembleia Legislativa do Estado de Pernambuco (ALEPE).
                    </p>
                  </div>

                  {/* Módulos do Curso */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
                      <div className="flex items-center space-x-2 text-[#0B3C74] font-bold text-sm mb-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>Módulo 1: Abordagem e Busca</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        Fundada suspeita (Art. 240/244 CPP), parâmetros operacionais da PMPE e precedentes jurídicos.
                      </p>
                      <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Concluído (100%)</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
                      <div className="flex items-center space-x-2 text-[#0B3C74] font-bold text-sm mb-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Módulo 2: Uso da Força & Algemas</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        Lei nº 13.060/2014, Súmula Vinculante 11 do STF e emprego legítimo de instrumentos de menor potencial ofensivo.
                      </p>
                      <div className="text-[11px] text-blue-600 font-semibold flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Em andamento (75%)</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
                      <div className="flex items-center space-x-2 text-[#0B3C74] font-bold text-sm mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Módulo 3: Lavratura de TCO</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        Lei Federal 9.099/95, jurisprudência do STF (ADIs 5.637 e 6.245) e registro pelo policiamento ostensivo.
                      </p>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
                        <span>Acessar questionário final</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÃO FLUTUANTE SIMULADO NO CANTO DA TELA DO MOODLE */}
            <div
              className={`fixed z-50 flex flex-col items-${
                position === 'bottom-right' ? 'end' : 'start'
              }`}
              style={{
                bottom: '24px',
                [position === 'bottom-right' ? 'right' : 'left']: '24px',
              }}
            >
              {/* Balão/Tooltip Flutuante quando fechado */}
              {!isSimChatOpen && (
                <div
                  onClick={() => setIsSimChatOpen(true)}
                  className="mb-2 bg-[#0B3C74] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border border-[#C59B27] flex items-center space-x-1.5 cursor-pointer hover:bg-blue-900 transition animate-bounce"
                >
                  <span className="text-amber-400">✦</span>
                  <span>Dúvidas no PVI? Clique aqui</span>
                </div>
              )}

              {/* Botão circular Flutuante com Brasão */}
              <button
                onClick={() => setIsSimChatOpen(!isSimChatOpen)}
                title={isSimChatOpen ? 'Minimizar Tutor PVI' : 'Abrir Tutor PVI - CEaD / PMPE'}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0B3C74] to-[#082952] border-2 border-[#C59B27] shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-all relative group"
              >
                {isSimChatOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black tracking-tighter text-amber-300">PVI</span>
                    <span className="text-[8px] font-bold text-white uppercase">Tutor</span>
                  </div>
                )}

                {/* Ponto indicador de status online */}
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-md animate-pulse" />
              </button>

              {/* Janela Flutuante Interativa Aberta no Moodle Simulado */}
              {isSimChatOpen && (
                <div
                  className="absolute bottom-16 w-[390px] h-[620px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl border-2 border-[#0B3C74] overflow-hidden flex flex-col z-50 animate-in fade-in zoom-in-95 duration-200"
                  style={{
                    [position === 'bottom-right' ? 'right' : 'left']: '0',
                  }}
                >
                  <TutorPviChat fullHeight onClose={() => setIsSimChatOpen(false)} isFloating />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 2: CÓDIGOS E PASSO A PASSO */}
        {activeTab === 'guide' && (
          <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Escolha do Método */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                Selecione o Método de Implantação no Moodle
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setMethod('additional_html')}
                  className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                    method === 'additional_html'
                      ? 'border-[#0B3C74] bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#0B3C74]">1. HTML Adicional</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Disponível em <strong>todas as páginas</strong> do Moodle para todos os usuários.
                  </p>
                </button>

                <button
                  onClick={() => setMethod('html_block')}
                  className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                    method === 'html_block'
                      ? 'border-[#0B3C74] bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#0B3C74]">2. Bloco HTML</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Por Curso
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Configurado pelo instrutor dentro de um <strong>curso específico</strong> (ex: Curso 105).
                  </p>
                </button>

                <button
                  onClick={() => setMethod('iframe')}
                  className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                    method === 'iframe'
                      ? 'border-[#0B3C74] bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#0B3C74]">3. Iframe Direto</span>
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Universal
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Embed seguro via tag &lt;iframe&gt; caso haja restrição a scripts JS externos.
                  </p>
                </button>
              </div>
            </div>

            {/* DETALHAMENTO DO MÉTODO 1: HTML ADICIONAL */}
            {method === 'additional_html' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#0B3C74] text-white px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                    <span className="font-bold text-sm">Método 1: Administração do Moodle ➔ HTML Adicional</span>
                  </div>
                  <span className="text-xs bg-blue-800 px-2 py-0.5 rounded text-blue-200">
                    Acesso de Administrador
                  </span>
                </div>

                <div className="p-5 space-y-5">
                  {/* Passo a passo ilustrado */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-[#0B3C74] text-white font-bold flex items-center justify-center text-xs mb-2">
                        1
                      </div>
                      <div className="font-bold text-slate-800 mb-1">Acessar Admin</div>
                      <p className="text-slate-600 text-[11px]">
                        Faça login no Moodle com perfil de administrador em{' '}
                        <code className="text-blue-700">pvi.pm.pe.gov.br/admin</code>
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-[#0B3C74] text-white font-bold flex items-center justify-center text-xs mb-2">
                        2
                      </div>
                      <div className="font-bold text-slate-800 mb-1">Aparência</div>
                      <p className="text-slate-600 text-[11px]">
                        Navegue até a aba <strong>Aparência</strong> ➔ clique em <strong>HTML adicional</strong>.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-[#0B3C74] text-white font-bold flex items-center justify-center text-xs mb-2">
                        3
                      </div>
                      <div className="font-bold text-slate-800 mb-1">Colar Código</div>
                      <p className="text-slate-600 text-[11px]">
                        Cole o código no campo <strong>Antes do fechamento do BODY</strong> (ou "When BODY is closed").
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-[#0B3C74] text-white font-bold flex items-center justify-center text-xs mb-2">
                        4
                      </div>
                      <div className="font-bold text-slate-800 mb-1">Salvar Mudanças</div>
                      <p className="text-slate-600 text-[11px]">
                        Clique em <strong>Salvar mudanças</strong>. O botão flutuante aparecerá em todo o PVI!
                      </p>
                    </div>
                  </div>

                  {/* Bloco de Código Principal */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">
                        Código JavaScript Oficial para Colar no Moodle (1 linha):
                      </span>
                      <button
                        onClick={() => handleCopy(scriptTagCode, 'scriptTag')}
                        className="px-3 py-1 bg-[#0B3C74] hover:bg-blue-900 text-white rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition shadow-sm"
                      >
                        {copiedCode === 'scriptTag' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Código Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Código</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-slate-900 text-emerald-300 p-3.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800 shadow-inner">
                      {scriptTagCode}
                    </pre>
                  </div>

                  {/* Opção Avançada com Configuração Explícita */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">
                        Ou Código com Parâmetros Avançados (Posição, Servidor):
                      </span>
                      <button
                        onClick={() => handleCopy(inlineScriptCode, 'inlineScript')}
                        className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition"
                      >
                        {copiedCode === 'inlineScript' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Snippet Completo</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-slate-900 text-blue-200 p-3.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800 shadow-inner">
                      {inlineScriptCode}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* DETALHAMENTO DO MÉTODO 2: BLOCO HTML POR CURSO */}
            {method === 'html_block' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#0B3C74] text-white px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-amber-300" />
                    <span className="font-bold text-sm">Método 2: Inserir em Curso Específico via Bloco HTML</span>
                  </div>
                  <span className="text-xs bg-blue-800 px-2 py-0.5 rounded text-blue-200">
                    Acesso de Professor / Instrutor
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-3 text-xs text-blue-900">
                    <strong>Como fazer no Moodle:</strong>
                    <ol className="list-decimal ml-4 mt-1.5 space-y-1 text-slate-700">
                      <li>Acesse o curso desejado no PVI (ex: <code>pvi.pm.pe.gov.br/course/view.php?id=105</code>).</li>
                      <li>No topo à direita, ative o botão <strong>Modo de Edição</strong>.</li>
                      <li>No menu lateral de blocos, clique em <strong>Adicionar um bloco</strong> e selecione <strong>HTML</strong>.</li>
                      <li>Clique na engrenagem de configuração do novo bloco ➔ <strong>Configurar bloco (novo bloco HTML)</strong>.</li>
                      <li>No campo de texto do conteúdo, clique no ícone <strong>&lt;&gt; (Código HTML)</strong> na barra do editor de texto.</li>
                      <li>Cole o código abaixo e clique em <strong>Salvar mudanças</strong>.</li>
                    </ol>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">
                        Código para colar dentro do Bloco HTML:
                      </span>
                      <button
                        onClick={() => handleCopy(blockHtmlCode, 'blockHtml')}
                        className="px-3 py-1 bg-[#0B3C74] hover:bg-blue-900 text-white rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition shadow-sm"
                      >
                        {copiedCode === 'blockHtml' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Código Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Código do Bloco</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-slate-900 text-amber-200 p-3.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800 shadow-inner">
                      {blockHtmlCode}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* DETALHAMENTO DO MÉTODO 3: IFRAME FLUTUANTE */}
            {method === 'iframe' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#0B3C74] text-white px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-amber-300" />
                    <span className="font-bold text-sm">Método 3: Iframe Flutuante Direto</span>
                  </div>
                  <span className="text-xs bg-blue-800 px-2 py-0.5 rounded text-blue-200">
                    Compatibilidade Universal
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-600">
                    Se as diretrizes de segurança da PMPE impedirem a execução de scripts JavaScript de terceiros, você pode
                    embutir a janela flutuante utilizando uma tag <code>&lt;iframe&gt;</code> padrão com posição fixa:
                  </p>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">Código do Iframe Flutuante:</span>
                      <button
                        onClick={() => handleCopy(iframeCode, 'iframeCode')}
                        className="px-3 py-1 bg-[#0B3C74] hover:bg-blue-900 text-white rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer transition shadow-sm"
                      >
                        {copiedCode === 'iframeCode' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Código Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Iframe</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-slate-900 text-purple-200 p-3.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800 shadow-inner">
                      {iframeCode}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABA 3: PERSONALIZAR WIDGET */}
        {activeTab === 'customize' && (
          <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Configurações do Botão e Janela Flutuante
                </h2>
                <p className="text-xs text-slate-500">
                  Ajuste o comportamento do widget para atender às preferências da coordenação da PVI PMPE.
                </p>
              </div>

              {/* URL do Servidor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Base do Servidor do Tutor PVI:
                </label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="https://seu-servidor-tutor.pm.pe.gov.br"
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3C74]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Insira o endereço oficial onde esta aplicação está hospedada. Em produção, use o domínio oficial do governo ou DEIP.
                </p>
              </div>

              {/* Posição na Tela */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Posição do Botão Flutuante no Moodle:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPosition('bottom-right')}
                    className={`p-3 rounded-lg border text-left text-xs font-semibold cursor-pointer transition ${
                      position === 'bottom-right'
                        ? 'border-[#0B3C74] bg-blue-50 text-[#0B3C74] ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>↘ Canto Inferior Direito</span>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">Padrão institucional (Recomendado)</p>
                  </button>

                  <button
                    onClick={() => setPosition('bottom-left')}
                    className={`p-3 rounded-lg border text-left text-xs font-semibold cursor-pointer transition ${
                      position === 'bottom-left'
                        ? 'border-[#0B3C74] bg-blue-50 text-[#0B3C74] ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>↙ Canto Inferior Esquerdo</span>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">Útil se houver outros botões à direita</p>
                  </button>
                </div>
              </div>

              {/* Identidade Visual */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800">Identidade Visual Padronizada PMPE:</div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#0B3C74] border border-slate-300 inline-block" />
                    <span className="text-[11px] text-slate-700 font-mono">#0B3C74 (Azul PMPE)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#C59B27] border border-slate-300 inline-block" />
                    <span className="text-[11px] text-slate-700 font-mono">#C59B27 (Dourado Oficial)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#10B981] border border-slate-300 inline-block" />
                    <span className="text-[11px] text-slate-700 font-mono">Status Online</span>
                  </div>
                </div>
              </div>

              {/* Botão de Ir para o Simulador */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('simulator')}
                  className="px-4 py-2 bg-[#0B3C74] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>Visualizar no Simulador Moodle</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
