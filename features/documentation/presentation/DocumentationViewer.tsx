"use client";

import React from "react";
import {
  DocumentationProvider,
  useDocumentation,
} from "../context/DocumentationContext";
import { DocumentationSidebar } from "./components/DocumentationSidebar";
import { SearchBar } from "./components/SearchBar";
import { GettingStartedSection } from "./components/GettingStartedSection";
import { FAQSection } from "./components/FAQSection";
import { EthicalAISection } from "./components/EthicalAISection";
import { ReportIssueButton } from "./components/ReportIssueButton";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function DocumentationContent() {
  const { activeSection, sidebarCollapsed } = useDocumentation();

  const renderSection = () => {
    switch (activeSection) {
      case "getting-started":
      case "introduction":
      case "quick-start":
      case "account-setup":
        return <GettingStartedSection />;

      case "faq":
        return <FAQSection />;

      case "ethical-ai":
        return <EthicalAISection />;

      // Add more sections as needed
      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Section: {activeSection}
            </h2>
            <p className="text-muted-foreground">
              Content for this section is coming soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <DocumentationSidebar />

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-0" : "ml-0 lg:ml-0"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-2xl">
                <SearchBar />
              </div>
              <ReportIssueButton />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="container mx-auto px-6 py-8 max-w-6xl">
            {renderSection()}
          </div>

          {/* Footer */}
          <footer className="border-t border-border mt-16 py-8">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Product
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <a
                        href="/features"
                        className="hover:text-foreground transition-colors"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="/pricing"
                        className="hover:text-foreground transition-colors"
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a
                        href="/roadmap"
                        className="hover:text-foreground transition-colors"
                      >
                        Roadmap
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Support
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <a
                        href="/docs"
                        className="hover:text-foreground transition-colors"
                      >
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a
                        href="/docs/faq"
                        className="hover:text-foreground transition-colors"
                      >
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a
                        href="/contact"
                        className="hover:text-foreground transition-colors"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Company
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <a
                        href="/about"
                        className="hover:text-foreground transition-colors"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="/blog"
                        className="hover:text-foreground transition-colors"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="/careers"
                        className="hover:text-foreground transition-colors"
                      >
                        Careers
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Legal
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <a
                        href="/privacy"
                        className="hover:text-foreground transition-colors"
                      >
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a
                        href="/terms"
                        className="hover:text-foreground transition-colors"
                      >
                        Terms
                      </a>
                    </li>
                    <li>
                      <a
                        href="/security"
                        className="hover:text-foreground transition-colors"
                      >
                        Security
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  © 2025 SkillFlow Nexus. All rights reserved.
                </p>
                <p className="text-xs text-muted-foreground">
                  Made with ethical AI and zero-knowledge proofs
                </p>
              </div>
            </div>
          </footer>
        </ScrollArea>
      </main>
    </div>
  );
}

export function DocumentationViewer() {
  return (
    <DocumentationProvider>
      <DocumentationContent />
    </DocumentationProvider>
  );
}
