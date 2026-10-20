/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TutorPviChat } from './components/TutorPviChat';
import { KnowledgeBaseManager } from './components/KnowledgeBaseManager';
import { MoodleDeploymentHub } from './components/MoodleDeploymentHub';
import { Database, MessageSquare, Maximize2, Minimize2, ExternalLink, Sparkles, Rocket } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge' | 'moodle'>('chat');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWidgetMode, setIsWidgetMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('widget') === 'true' || window.location.pathname === '/widget') {
        setIsWidgetMode(true);
      }
    }
  }, []);

  // Widget Mode: rendered purely inside iframe for Moodle embedding
  if (isWidgetMode) {
    return (
      <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-transparent">
        <TutorPviChat fullHeight isFloating />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-2 sm:p-4 font-sans select-none">
      {/* BARRA SUPERIOR DE NAVEGAÇÃO E RECURSOS DO TUTOR PVI */}
      <header className="w-full max-w-5xl mb-3 flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl shadow-lg">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-700 border border-blue-400/30 flex items-center justify-center font-bold text-white text-xs shadow-inner">
            PVI
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white text-xs sm:text-sm font-bold tracking-tight">
                Tutor PVI • PMPE
              </span>
              <span className="bg-blue-900/80 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-700/50 hidden sm:inline-block">
                DEIP / CEaD
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">
              http://pvi.pm.pe.gov.br/ • legis.alepe.pe.gov.br
            </p>
          </div>
        </div>

        {/* SELETOR DE MODOS PRINCIPAIS */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-700 text-xs gap-1">
          <button
            onClick={() => {
              setActiveTab('chat');
              setIsExpanded(false);
            }}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'chat' && !isExpanded
                ? 'bg-[#0B3C74] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat (400x700)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('knowledge');
              setIsExpanded(false);
            }}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'knowledge' && !isExpanded
                ? 'bg-[#0B3C74] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Base de Informações</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('moodle');
              setIsExpanded(false);
            }}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'moodle'
                ? 'bg-[#C59B27] text-slate-950 font-bold shadow-sm'
                : 'text-amber-300 hover:text-amber-200 hover:bg-slate-800'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-amber-400" />
            <span>Implantar no Moodle (Flutuante)</span>
          </button>
        </div>

        {/* BOTÃO EXPANDIR / DIVIDIR TELA */}
        {activeTab === 'chat' && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Modo Janela Única 400x700' : 'Modo Expandido: Chat e Base Lado a Lado'}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-300 border border-slate-700 hover:border-blue-500/50 transition flex items-center space-x-1.5 text-[11px] cursor-pointer"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3 h-3" />
                <span className="hidden sm:inline">Janela Única</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">Dividir c/ Base</span>
              </>
            )}
          </button>
        )}
      </header>

      {/* ÁREA DE EXIBIÇÃO DE CONTEÚDO */}
      <main className="w-full flex justify-center items-center flex-1 max-w-5xl">
        {/* ABA: CHAT OU MODO EXPANDIDO */}
        {activeTab === 'chat' && (
          !isExpanded ? (
            /* Janela única exclusiva de atendimento da Tutor PVI (400 x 700 px, Azul e Branco) */
            <div className="flex justify-center items-center w-full py-2">
              <TutorPviChat />
            </div>
          ) : (
            /* Modo Expandido: Chat e Gerenciador de Base de Informações Lado a Lado */
            <div className="w-full h-[720px] max-h-[88vh] bg-slate-800/90 rounded-2xl p-2.5 border border-slate-700 shadow-2xl flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-[380px] h-full shrink-0 flex justify-center">
                <TutorPviChat fullHeight />
              </div>
              <div className="flex-1 h-full rounded-2xl overflow-hidden border-2 border-[#0B3C74] bg-white shadow-xl">
                <KnowledgeBaseManager compact={false} />
              </div>
            </div>
          )
        )}

        {/* ABA: BASE DE INFORMAÇÕES DEDICADA */}
        {activeTab === 'knowledge' && (
          <div className="w-full h-[740px] max-h-[88vh] rounded-2xl overflow-hidden border-2 border-[#0B3C74] bg-white shadow-2xl">
            <KnowledgeBaseManager compact={false} />
          </div>
        )}

        {/* ABA: IMPLANTAÇÃO FLUTUANTE NO MOODLE */}
        {activeTab === 'moodle' && (
          <div className="w-full h-[780px] max-h-[90vh] rounded-2xl overflow-hidden border-2 border-[#0B3C74] bg-white shadow-2xl">
            <MoodleDeploymentHub />
          </div>
        )}
      </main>
    </div>
  );
}
