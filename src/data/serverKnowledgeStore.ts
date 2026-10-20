import fs from 'fs';
import path from 'path';
import { KnowledgeDocument, KnowledgeBaseStats } from '../types/knowledge';
import { BUILT_IN_KNOWLEDGE } from './defaultKnowledge';

const STORAGE_FILE = path.join(process.cwd(), 'custom_knowledge.json');

class ServerKnowledgeStore {
  private customDocs: KnowledgeDocument[] = [];

  constructor() {
    this.loadCustomDocs();
  }

  private loadCustomDocs() {
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.customDocs = parsed;
        }
      }
    } catch (err) {
      console.warn('Não foi possível carregar custom_knowledge.json:', err);
      this.customDocs = [];
    }
  }

  private saveCustomDocs() {
    try {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.customDocs, null, 2), 'utf-8');
    } catch (err) {
      console.error('Erro ao salvar custom_knowledge.json:', err);
    }
  }

  public getAll(): { builtIn: KnowledgeDocument[]; custom: KnowledgeDocument[] } {
    return {
      builtIn: BUILT_IN_KNOWLEDGE,
      custom: this.customDocs,
    };
  }

  public getActiveDocuments(): KnowledgeDocument[] {
    const activeBuiltIn = BUILT_IN_KNOWLEDGE.filter((d) => d.active);
    const activeCustom = this.customDocs.filter((d) => d.active);
    return [...activeBuiltIn, ...activeCustom];
  }

  public addOrUpdate(docData: Partial<KnowledgeDocument> & { title: string; content: string }): KnowledgeDocument {
    const now = Date.now();
    const existingIndex = docData.id ? this.customDocs.findIndex((d) => d.id === docData.id) : -1;

    if (existingIndex >= 0) {
      const updated: KnowledgeDocument = {
        ...this.customDocs[existingIndex],
        ...docData,
        title: docData.title.trim(),
        content: docData.content.trim(),
        updatedAt: now,
      };
      this.customDocs[existingIndex] = updated;
      this.saveCustomDocs();
      return updated;
    }

    const newDoc: KnowledgeDocument = {
      id: docData.id || `custom-${now}-${Math.random().toString(36).substring(2, 7)}`,
      title: docData.title.trim(),
      category: docData.category || 'outro',
      sourceUrl: docData.sourceUrl?.trim() || '',
      content: docData.content.trim(),
      summary: docData.summary?.trim() || docData.content.trim().slice(0, 160) + '...',
      active: docData.active !== undefined ? docData.active : true,
      createdAt: now,
      isBuiltIn: false,
    };

    this.customDocs.unshift(newDoc);
    this.saveCustomDocs();
    return newDoc;
  }

  public delete(id: string): boolean {
    const initialLen = this.customDocs.length;
    this.customDocs = this.customDocs.filter((d) => d.id !== id);
    if (this.customDocs.length !== initialLen) {
      this.saveCustomDocs();
      return true;
    }
    return false;
  }

  public toggleActive(id: string): KnowledgeDocument | null {
    const doc = this.customDocs.find((d) => d.id === id);
    if (doc) {
      doc.active = !doc.active;
      this.saveCustomDocs();
      return doc;
    }
    return null;
  }

  public getStats(): KnowledgeBaseStats {
    const all = [...BUILT_IN_KNOWLEDGE, ...this.customDocs];
    const totalWords = all.reduce((acc, d) => acc + (d.content ? d.content.split(/\\s+/).filter(Boolean).length : 0), 0);
    const totalChars = all.reduce((acc, d) => acc + (d.content ? d.content.length : 0), 0);

    return {
      totalDocuments: all.length,
      builtInCount: BUILT_IN_KNOWLEDGE.length,
      customCount: this.customDocs.length,
      activeCount: all.filter((d) => d.active).length,
      totalWords,
      totalChars,
    };
  }

  public buildCustomKnowledgePrompt(): string {
    const activeCustom = this.customDocs.filter((d) => d.active);
    if (activeCustom.length === 0) {
      return '';
    }

    let text = '\n4. BASE DE INFORMAÇÕES E DOCUMENTOS FORNECIDOS PELO INSTRUTOR / USUÁRIO:\n';
    activeCustom.forEach((doc, idx) => {
      text += `\n--- DOCUMENTO FORNECIDO ${idx + 1}: ${doc.title} ---\n`;
      text += `Categoria: ${doc.category}\n`;
      if (doc.sourceUrl) text += `Fonte/Referência: ${doc.sourceUrl}\n`;
      text += `Conteúdo:\n${doc.content}\n`;
    });
    return text;
  }

  public findMatchingCustomAnswer(query: string): string | null {
    const lowerQuery = query.toLowerCase().trim();
    const activeCustom = this.customDocs.filter((d) => d.active);

    for (const doc of activeCustom) {
      const lowerTitle = doc.title.toLowerCase();
      const lowerContent = doc.content.toLowerCase();

      // Check if user query mentions specific words from title (excluding common stop words)
      const stopWords = ['sobre', 'para', 'como', 'qual', 'quais', 'onde', 'quando', 'deip', 'pmpe', 'segundo', 'conforme', 'curso', 'cursos', 'módulo', 'módulos', 'pvi', 'nota', 'mínima', 'avaliação', 'instrução', 'instruções'];
      const titleWords = lowerTitle
        .replace(/[^\w\sáéíóúâêîôûãõç]/gi, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 4 && !stopWords.includes(w));

      const titleMatch = titleWords.length > 0 && titleWords.some((w) => lowerQuery.includes(w));

      if (titleMatch || (lowerTitle.length > 8 && lowerQuery.includes(lowerTitle))) {
        return `Conforme o documento **"${doc.title}"** fornecido na Base de Informações:${doc.sourceUrl ? ` (${doc.sourceUrl})` : ''}\n\n${doc.content.slice(0, 1500)}${doc.content.length > 1500 ? '\n\n*(Consulte o documento completo na Base de Informações do Tutor)*' : ''}`;
      }

      // Check key sentences/paragraphs inside content
      const paragraphs = doc.content.split(/\n+/).filter((p) => p.trim().length > 15);
      for (const p of paragraphs) {
        const pLower = p.toLowerCase();
        const contentWords = pLower
          .replace(/[^\w\sáéíóúâêîôûãõç]/gi, ' ')
          .split(/\s+/)
          .filter((w) => w.length >= 4 && !['sobre', 'conforme', 'segundo', 'porque', 'quando', 'durante', 'polícia', 'militar', 'deip', 'pmpe', 'curso', 'cursos', 'módulo', 'módulos', 'nota', 'mínima', 'avaliação', 'aluno', 'alunos', 'pvi'].includes(w));

        const matchedCount = contentWords.filter((w) => lowerQuery.includes(w)).length;
        if (matchedCount >= 2) {
          return `De acordo com o documento **"${doc.title}"** fornecido na Base de Informações:\n\n${p.trim()}\n\n*Fonte: Base de Informações da PVI / Instrutor.*`;
        }
      }
    }

    return null;
  }
}

export const serverKnowledgeStore = new ServerKnowledgeStore();
