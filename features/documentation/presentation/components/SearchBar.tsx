"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDocumentation } from "../../context/DocumentationContext";
import { Search, X, FileText, HelpCircle, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SearchResult } from "../../types";

// Mock search function - replace with actual API call
const mockSearch = async (query: string): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!query) return [];

  // Mock results
  return [
    {
      id: "1",
      title: "Getting Started with Skill DNA",
      excerpt:
        "Learn how to visualize and understand your skill composition using our DNA visualization tool...",
      type: "doc" as const,
      url: "/docs/skill-dna",
      relevance: 0.95,
    },
    {
      id: "2",
      title: "How do I mint my first credential?",
      excerpt:
        'To mint your first credential, navigate to the Credentials page and click "Mint New Credential"...',
      type: "faq" as const,
      url: "/docs/faq#mint-credential",
      relevance: 0.88,
    },
    {
      id: "3",
      title: "Ethical AI Whitepaper",
      excerpt:
        "Our commitment to transparent, fair, and explainable AI in skill assessment and talent matching...",
      type: "resource" as const,
      url: "/docs/ethical-ai",
      relevance: 0.75,
    },
  ].filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(query.toLowerCase())
  );
};

const typeIcons = {
  doc: BookOpen,
  faq: HelpCircle,
  resource: FileText,
};

export function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    setActiveSection,
  } = useDocumentation();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showResults, setShowResults] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (localQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await mockSearch(localQuery);
          setSearchResults(results);
          setSearchQuery(localQuery);
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery, setSearchResults, setIsSearching]);

  const handleClear = useCallback(() => {
    setLocalQuery("");
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  }, [setSearchQuery, setSearchResults]);

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      setShowResults(false);
      // Extract section from URL if possible
      const sectionMatch = result.url.match(/\/docs\/([^#]+)/);
      if (sectionMatch) {
        setActiveSection(sectionMatch[1]);
      }
    },
    [setActiveSection]
  );

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search documentation, FAQs..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => localQuery && setShowResults(true)}
          className={cn(
            "pl-12 pr-12 h-12 rounded-xl",
            "bg-input border-border",
            "focus:ring-2 focus:ring-primary focus:border-primary",
            "text-foreground placeholder:text-muted-foreground"
          )}
        />
        {localQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (searchResults.length > 0 || isSearching) && (
        <Card className="absolute top-full mt-2 w-full bg-card border-border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
            </div>
          ) : (
            <div className="p-2">
              {searchResults.map((result) => {
                const Icon = typeIcons[result.type];
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg",
                      "hover:bg-muted/50 transition-colors",
                      "flex items-start gap-3 group"
                    )}
                  >
                    <Icon className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {result.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {result.excerpt}
                      </p>
                      <span className="text-xs text-muted-foreground/60 mt-1 inline-block capitalize">
                        {result.type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* No Results */}
      {showResults &&
        !isSearching &&
        searchResults.length === 0 &&
        localQuery && (
          <Card className="absolute top-full mt-2 w-full bg-card border-border rounded-xl shadow-xl z-50 p-8 text-center">
            <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              No results found for &quot;
              <span className="text-foreground font-medium">{localQuery}</span>
              &quot;
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Try different keywords or browse the sidebar
            </p>
          </Card>
        )}
    </div>
  );
}
