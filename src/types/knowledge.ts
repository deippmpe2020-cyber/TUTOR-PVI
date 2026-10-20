export type KnowledgeCategory =
  | 'portal_pvi'
  | 'curso_pvi'
  | 'legislacao'
  | 'pop'
  | 'diretriz_pmpe'
  | 'faq'
  | 'outro';

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: KnowledgeCategory;
  sourceUrl?: string;
  content: string;
  summary?: string;
  active: boolean;
  createdAt: number;
  updatedAt?: number;
  isBuiltIn?: boolean;
}

export interface KnowledgeBaseStats {
  totalDocuments: number;
  builtInCount: number;
  customCount: number;
  activeCount: number;
  totalWords: number;
  totalChars: number;
}
