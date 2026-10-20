import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database,
  Info,
  RefreshCw,
  Search,
} from 'lucide-react';
import { KnowledgeDocument, KnowledgeBaseStats, KnowledgeCategory } from '../types/knowledge';

interface KnowledgeBaseManagerProps {
  onBackToChat?: () => void;
  onAskQuestionAboutDoc?: (query: string) => void;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<KnowledgeCategory, { label: string; color: string }> = {
  portal_pvi: { label: 'Portal Oficial PVI', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  curso_pvi: { label: 'Curso PVI', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  legislacao: { label: 'Legislação ALEPE', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  pop: { label: 'Procedimento Operacional (POP)', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  diretriz_pmpe: { label: 'Diretriz / Portaria PMPE', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  faq: { label: 'Perguntas e Respostas (FAQ)', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  outro: { label: 'Documento / Informação Geral', color: 'bg-slate-100 text-slate-800 border-slate-300' },
};

export const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  onBackToChat,
  onAskQuestionAboutDoc,
  compact = true,
}) => {
  const [builtInDocs, setBuiltInDocs] = useState<KnowledgeDocument[]>([]);
  const [customDocs, setCustomDocs] = useState<KnowledgeDocument[]>([]);
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'custom' | 'builtin' | 'new'>('custom');
  const [searchFilter, setSearchFilter] = useState('');

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<KnowledgeCategory>('diretriz_pmpe');
  const [formSourceUrl, setFormSourceUrl] = useState('');
  const [formContent, setFormContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expanded cards state
  const [expandedDocIds, setExpandedDocIds] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchKnowledge = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/knowledge-base');
      if (res.ok) {
        const data = await res.json();
        setBuiltInDocs(data.builtIn || []);
        setCustomDocs(data.custom || []);
        setStats(data.stats || null);
      }
    } catch (err: any) {
      console.error('Erro ao buscar base de informações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const handleToggleActive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/knowledge-base/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        setCustomDocs((prev) =>
          prev.map((doc) => (doc.id === id ? { ...doc, active: data.document.active } : doc))
        );
        if (data.stats) setStats(data.stats);
      }
    } catch (err: any) {
      console.error('Erro ao alternar status do documento:', err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Deseja realmente remover este documento da base de informações?')) return;

    try {
      const res = await fetch(`/api/knowledge-base/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setCustomDocs((prev) => prev.filter((d) => d.id !== id));
        if (data.stats) setStats(data.stats);
        setFeedbackMsg({ type: 'success', text: 'Documento removido da base com sucesso!' });
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'Erro ao remover documento.' });
    }
  };

  const handleEdit = (doc: KnowledgeDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(doc.id);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormSourceUrl(doc.sourceUrl || '');
    setFormContent(doc.content);
    setActiveTab('new');
  };

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Informe o título do material ou norma.' });
      return;
    }
    if (!formContent.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Forneça o conteúdo ou texto da informação.' });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId || undefined,
          title: formTitle.trim(),
          category: formCategory,
          sourceUrl: formSourceUrl.trim() || undefined,
          content: formContent.trim(),
          active: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackMsg({
          type: 'success',
          text: `Base de informações atualizada! O Tutor PVI agora responde com base em "${formTitle}".`,
        });

        // Reset form
        setFormTitle('');
        setFormCategory('diretriz_pmpe');
        setFormSourceUrl('');
        setFormContent('');
        setEditingId(null);
        setActiveTab('custom');

        await fetchKnowledge();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        const err = await res.json();
        setFeedbackMsg({ type: 'error', text: err.error || 'Erro ao salvar na base.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: `Falha na requisição: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setFormContent(text);
        if (!formTitle) {
          const suggestedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setFormTitle(suggestedTitle);
        }
        setFeedbackMsg({
          type: 'success',
          text: `Arquivo "${file.name}" carregado com sucesso (${text.length} caracteres)! Revise e clique em Salvar.`,
        });
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoadExample = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/knowledge-base/seed-example', { method: 'POST' });
      if (res.ok) {
        setFeedbackMsg({
          type: 'success',
          text: 'Exemplo institucional (Instrução Normativa DEIP nº 04/2024) carregado na base!',
        });
        await fetchKnowledge();
        setActiveTab('custom');
        setTimeout(() => setFeedbackMsg(null), 3500);
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: 'Erro ao carregar exemplo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedDocIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCustom = customDocs.filter(
    (d) =>
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.content.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredBuiltIn = builtInDocs.filter(
    (d) =>
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.content.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 text-xs overflow-hidden select-text">
      {/* CABEÇALHO DO GERENCIADOR */}
      <div className="bg-[#0B3C74] text-white px-3.5 py-2.5 shrink-0 border-b border-blue-900 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-800 border border-blue-400/40 flex items-center justify-center text-white">
            <Database className="w-4 h-4 text-blue-200" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">Base de Informações do Tutor</h2>
            <p className="text-[10px] text-blue-200 leading-tight">
              DEIP • Plataforma Virtual de Instrução PMPE
            </p>
          </div>
        </div>

        {onBackToChat && (
          <button
            onClick={onBackToChat}
            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-[11px] font-medium transition shadow-sm border border-blue-500/50"
          >
            Voltar ao Chat
          </button>
        )}
      </div>

      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div
          className={`px-3 py-2 text-[11px] font-medium flex items-center justify-between shrink-0 transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          <div className="flex items-center space-x-1.5 truncate">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="truncate">{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-white/80 hover:text-white font-bold ml-2 text-xs"
          >
            ×
          </button>
        </div>
      )}

      {/* PAINEL DE ESTATÍSTICAS E ABAS */}
      <div className="bg-white border-b border-slate-200 px-3 py-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-[11px] text-slate-600">
            <span className="font-semibold text-blue-900">
              {stats ? `${stats.activeCount} fontes ativas` : 'Carregando...'}
            </span>
            <span>•</span>
            <span>{stats ? `${stats.totalWords.toLocaleString()} palavras indexadas` : ''}</span>
          </div>
          <button
            onClick={fetchKnowledge}
            title="Atualizar lista"
            className="p-1 text-slate-400 hover:text-blue-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 px-2 rounded-md font-semibold text-[11px] transition flex items-center justify-center space-x-1 ${
              activeTab === 'custom'
                ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3 h-3 text-blue-600" />
            <span>Documentos Fornecidos ({customDocs.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setFormTitle('');
              setFormCategory('diretriz_pmpe');
              setFormSourceUrl('');
              setFormContent('');
              setActiveTab('new');
            }}
            className={`py-1.5 px-2.5 rounded-md font-semibold text-[11px] transition flex items-center justify-center space-x-1 ${
              activeTab === 'new'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <Plus className="w-3 h-3" />
            <span>+ Fornecer Base</span>
          </button>

          <button
            onClick={() => setActiveTab('builtin')}
            className={`py-1.5 px-2 rounded-md font-medium text-[11px] transition flex items-center justify-center space-x-1 ${
              activeTab === 'builtin'
                ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3 h-3 text-slate-500" />
            <span>Oficiais ({builtInDocs.length})</span>
          </button>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* ABA: FORMULÁRIO DE CADASTRO DE INFORMAÇÕES */}
        {activeTab === 'new' && (
          <form onSubmit={handleSaveDocument} className="bg-white rounded-xl border border-blue-200 p-3 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-1.5 text-blue-900 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{editingId ? 'Editar Documento da Base' : 'Fornecer Nova Informação para o Tutor'}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancelar
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Título do Material / Assunto / Norma <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Instrução Normativa DEIP nº 05/2024, POP 203 - Patrulhamento Tático..."
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as KnowledgeCategory)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="curso_pvi">Conteúdo de Curso PVI</option>
                  <option value="diretriz_pmpe">Diretriz / Portaria PMPE</option>
                  <option value="pop">Procedimento Operacional (POP)</option>
                  <option value="legislacao">Legislação / Norma ALEPE</option>
                  <option value="faq">Perguntas & Respostas (FAQ)</option>
                  <option value="outro">Documento Geral / Apostila</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Link / Referência (Opcional)
                </label>
                <input
                  type="text"
                  value={formSourceUrl}
                  onChange={(e) => setFormSourceUrl(e.target.value)}
                  placeholder="https://pvi.pm.pe.gov.br/..."
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  Conteúdo da Informação / Texto Completo <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md,.json"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>Importar Arquivo (.txt)</span>
                  </button>
                </div>
              </div>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Cole aqui o texto das aulas, ementas, perguntas com respostas esperadas, resoluções ou orientações normativas que o Tutor PVI deve utilizar para responder às perguntas..."
                rows={9}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-mono leading-relaxed resize-none"
                required
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>{formContent.length.toLocaleString()} caracteres</span>
                <span>{formContent ? formContent.split(/\s+/).filter(Boolean).length : 0} palavras</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{editingId ? 'Salvar Alterações' : 'Salvar na Base de Informações'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ABA: DOCUMENTOS FORNECIDOS PELO USUÁRIO */}
        {activeTab === 'custom' && (
          <div className="space-y-2.5">
            {/* BARRA DE AÇÃO E BUSCA */}
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Pesquisar nos documentos..."
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleLoadExample}
                title="Inserir documento de exemplo da PMPE para testar"
                className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-medium transition shrink-0 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>+ Exemplo DEIP</span>
              </button>
            </div>

            {/* AVISO QUANDO VAZIO */}
            {customDocs.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-6 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Nenhum documento personalizado ainda</h4>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[280px] mx-auto">
                    Você pode fornecer textos de aulas, portarias, POPs e apostilas para que o Tutor PVI responda com base neles.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab('new')}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Fornecer Documento</span>
                  </button>
                  <button
                    onClick={handleLoadExample}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                  >
                    Carregar Exemplo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCustom.map((doc) => {
                  const isExpanded = !!expandedDocIds[doc.id];
                  const catInfo = CATEGORY_LABELS[doc.category] || CATEGORY_LABELS.outro;

                  return (
                    <div
                      key={doc.id}
                      className={`bg-white rounded-xl border transition shadow-xs overflow-hidden ${
                        doc.active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                      }`}
                    >
                      <div
                        onClick={() => toggleExpand(doc.id)}
                        className="p-3 cursor-pointer hover:bg-slate-50/80 transition flex items-start justify-between gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5 mb-1 flex-wrap gap-y-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold border ${catInfo.color}`}
                            >
                              {catInfo.label}
                            </span>
                            {doc.active ? (
                              <span className="text-[9.5px] text-emerald-600 font-medium flex items-center space-x-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                <span>Ativo no Tutor</span>
                              </span>
                            ) : (
                              <span className="text-[9.5px] text-slate-400 font-medium">Inativo</span>
                            )}
                          </div>

                          <h3 className="text-xs font-bold text-slate-800 leading-snug truncate">
                            {doc.title}
                          </h3>

                          <p className="text-[10.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {doc.summary || doc.content}
                          </p>

                          <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-2">
                            <span>{doc.content.length.toLocaleString()} caracteres</span>
                            <span>•</span>
                            <span>{new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                            {doc.sourceUrl && (
                              <>
                                <span>•</span>
                                <a
                                  href={doc.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-blue-600 hover:underline inline-flex items-center space-x-0.5"
                                >
                                  <span>Origem</span>
                                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                                </a>
                              </>
                            )}
                          </div>
                        </div>

                        {/* AÇÕES NO CARD */}
                        <div className="flex items-center space-x-1 shrink-0 ml-1">
                          <button
                            onClick={(e) => handleToggleActive(doc.id, e)}
                            title={doc.active ? 'Desativar este documento' : 'Ativar este documento'}
                            className="p-1 text-slate-400 hover:text-blue-600 transition"
                          >
                            {doc.active ? (
                              <ToggleRight className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-slate-300" />
                            )}
                          </button>

                          <button
                            onClick={(e) => handleEdit(doc, e)}
                            title="Editar documento"
                            className="p-1 text-slate-400 hover:text-blue-600 transition"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => handleDelete(doc.id, e)}
                            title="Excluir documento"
                            className="p-1 text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="text-slate-400 ml-0.5">
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CONTEÚDO EXPANDIDO */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 p-3 bg-slate-50/60 space-y-2">
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap select-text text-slate-700">
                            {doc.content}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {onAskQuestionAboutDoc && (
                              <button
                                onClick={() => {
                                  onAskQuestionAboutDoc(`O que diz o documento "${doc.title}"?`);
                                }}
                                className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-[10.5px] font-semibold transition flex items-center space-x-1"
                              >
                                <Sparkles className="w-3 h-3 text-blue-600" />
                                <span>Perguntar ao Tutor sobre este documento</span>
                              </button>
                            )}

                            <span className="text-[10px] text-slate-400">
                              Indexado para consulta do Tutor
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ABA: FONTES OFICIAIS FIXAS */}
        {activeTab === 'builtin' && (
          <div className="space-y-2.5">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-900 flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Fontes Oficiais Fixas da PMPE:</span>
                <p className="text-[10.5px] text-blue-800 mt-0.5 leading-relaxed">
                  Estas bases oficiais estão integradas permanentemente ao Tutor PVI conforme determinação institucional da DEIP e legislação da ALEPE.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {filteredBuiltIn.map((doc) => {
                const isExpanded = !!expandedDocIds[doc.id];
                const catInfo = CATEGORY_LABELS[doc.category] || CATEGORY_LABELS.outro;

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                  >
                    <div
                      onClick={() => toggleExpand(doc.id)}
                      className="p-3 cursor-pointer hover:bg-slate-50 transition flex items-start justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold border ${catInfo.color}`}
                          >
                            {catInfo.label}
                          </span>
                          <span className="text-[9.5px] text-emerald-600 font-medium flex items-center space-x-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            <span>Oficial Permanente</span>
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-slate-800 leading-snug">
                          {doc.title}
                        </h3>

                        <p className="text-[10.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {doc.summary || doc.content}
                        </p>

                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-2">
                          <a
                            href={doc.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:underline inline-flex items-center space-x-0.5 font-medium"
                          >
                            <span>{doc.sourceUrl}</span>
                            <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                          </a>
                        </div>
                      </div>

                      <div className="text-slate-400 shrink-0 ml-1">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-100 p-3 bg-slate-50 space-y-2">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[10.5px] leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap select-text text-slate-700">
                          {doc.content}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* RODAPÉ DO GERENCIADOR */}
      <div className="bg-slate-100 border-t border-slate-200 px-3 py-2 shrink-0 flex items-center justify-between text-[10px] text-slate-500">
        <span className="truncate">Tutor PVI • Sincronização direta com a base</span>
        <button
          onClick={() => {
            setActiveTab('new');
          }}
          className="text-blue-700 hover:text-blue-900 font-semibold"
        >
          + Adicionar material
        </button>
      </div>
    </div>
  );
};
