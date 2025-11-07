/**
 * Documentation Feature Types
 * Following SkillFlow Nexus architecture patterns
 */

export interface DocSection {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  subsections?: DocSection[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  relevanceScore?: number;
}

export interface DocumentResource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "markdown" | "external";
  url: string;
  category: string;
  metadata?: {
    author?: string;
    publishedDate?: string;
    version?: string;
    tags?: string[];
  };
}

export interface IssueReport {
  subject: string;
  description: string;
  category: "bug" | "feature" | "documentation" | "other";
  priority: "low" | "medium" | "high";
  email: string;
  pageUrl?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: "faq" | "doc" | "resource";
  url: string;
  relevance: number;
}
