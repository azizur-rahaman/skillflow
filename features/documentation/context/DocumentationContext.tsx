"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { SearchResult } from "../types";

interface DocumentationContextValue {
  activeSection: string;
  setActiveSection: (section: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  expandedFAQs: Set<string>;
  toggleFAQ: (id: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const DocumentationContext = createContext<
  DocumentationContextValue | undefined
>(undefined);

export function DocumentationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState<string>("getting-started");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const toggleFAQ = useCallback((id: string) => {
    setExpandedFAQs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const value: DocumentationContextValue = {
    activeSection,
    setActiveSection,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    expandedFAQs,
    toggleFAQ,
    sidebarCollapsed,
    toggleSidebar,
  };

  return (
    <DocumentationContext.Provider value={value}>
      {children}
    </DocumentationContext.Provider>
  );
}

export function useDocumentation() {
  const context = useContext(DocumentationContext);
  if (!context) {
    throw new Error(
      "useDocumentation must be used within DocumentationProvider"
    );
  }
  return context;
}
