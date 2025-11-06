"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Download,
  ExternalLink,
  Eye,
  Lock,
  CheckCircle,
  BookOpen,
  FileText,
  Users,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

const whitepaperSections = [
  { id: "intro", title: "Introduction", page: 1 },
  { id: "principles", title: "Core Principles", page: 3 },
  { id: "transparency", title: "Transparency & Explainability", page: 7 },
  { id: "fairness", title: "Fairness & Bias Mitigation", page: 12 },
  { id: "privacy", title: "Privacy & Data Protection", page: 18 },
  { id: "accountability", title: "Accountability Framework", page: 24 },
  { id: "implementation", title: "Technical Implementation", page: 30 },
  { id: "governance", title: "Governance Model", page: 36 },
];

const keyPrinciples = [
  {
    icon: Eye,
    title: "Transparency",
    description: "All AI decisions are explainable and auditable",
    color: "text-blue-400",
  },
  {
    icon: Shield,
    title: "Fairness",
    description: "Bias detection and mitigation at every layer",
    color: "text-purple-400",
  },
  {
    icon: Lock,
    title: "Privacy",
    description: "Zero-knowledge proofs and data minimization",
    color: "text-cyan-400",
  },
  {
    icon: CheckCircle,
    title: "Accountability",
    description: "Clear responsibility chains and audit trails",
    color: "text-green-400",
  },
];

export function EthicalAISection() {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [viewMode, setViewMode] = useState<"embedded" | "external">("embedded");

  const handleDownload = () => {
    // Mock download - replace with actual PDF URL
    window.open("/documents/ethical-ai-whitepaper.pdf", "_blank");
  };

  const handleExternalView = () => {
    window.open("/documents/ethical-ai-whitepaper.pdf", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Ethical AI Whitepaper
            </h1>
          </div>
          <p className="text-muted-foreground">
            Our commitment to transparent, fair, and explainable artificial
            intelligence
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Badge
              variant="secondary"
              className="bg-muted text-foreground rounded-md"
            >
              Version 2.0
            </Badge>
            <Badge
              variant="secondary"
              className="bg-muted text-foreground rounded-md"
            >
              Published: Nov 2025
            </Badge>
            <Badge
              variant="secondary"
              className="bg-muted text-foreground rounded-md"
            >
              42 pages
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="rounded-xl border-border hover:bg-muted"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant="default"
            onClick={handleExternalView}
            className="rounded-xl bg-primary text-primary-foreground"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Key Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyPrinciples.map((principle) => {
          const Icon = principle.icon;
          return (
            <Card
              key={principle.title}
              className="bg-card border-border rounded-xl p-5 hover:border-primary/50 transition-all"
            >
              <Icon className={cn("w-8 h-8 mb-3", principle.color)} />
              <h3 className="text-base font-semibold text-foreground mb-2">
                {principle.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {principle.description}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table of Contents Sidebar */}
        <Card className="lg:col-span-3 bg-card border-border rounded-2xl p-5 h-fit">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Table of Contents
          </h3>
          <nav className="space-y-1">
            {whitepaperSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-all text-sm",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span className="block truncate">{section.title}</span>
                <span className="text-xs opacity-60">Page {section.page}</span>
              </button>
            ))}
          </nav>
        </Card>

        {/* PDF Viewer Area */}
        <Card className="lg:col-span-9 bg-card border-border rounded-2xl overflow-hidden">
          {/* Viewer Header */}
          <div className="border-b border-border p-4 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {whitepaperSections.find((s) => s.id === activeSection)
                  ?.title || "Introduction"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "embedded" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("embedded")}
                className="rounded-lg"
              >
                Embedded
              </Button>
              <Button
                variant={viewMode === "external" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("external")}
                className="rounded-lg"
              >
                External
              </Button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="relative bg-muted/10 h-[600px]">
            {viewMode === "embedded" ? (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Mock PDF viewer - replace with actual PDF viewer component */}
                <div className="text-center p-8 max-w-2xl">
                  <Brain className="w-16 h-16 mx-auto text-primary/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    PDF Viewer Integration
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    This area would display the embedded PDF viewer using a
                    library like
                    <code className="mx-1 px-2 py-0.5 bg-muted rounded text-primary">
                      react-pdf
                    </code>{" "}
                    or
                    <code className="ml-1 px-2 py-0.5 bg-muted rounded text-primary">
                      pdf.js
                    </code>
                    .
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">
                    For this demo, use the &quot;Download PDF&quot; or
                    &quot;Open in New Tab&quot; buttons above.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleDownload}
                      className="rounded-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={handleExternalView}
                      className="rounded-xl bg-primary"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open External
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src="/documents/ethical-ai-whitepaper.pdf"
                className="w-full h-full border-0"
                title="Ethical AI Whitepaper"
              />
            )}
          </div>
        </Card>
      </div>

      {/* Additional Resources */}
      <Card className="bg-card border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Related Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/docs/privacy-policy"
            className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all group"
          >
            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1">
              Privacy Policy
            </h4>
            <p className="text-xs text-muted-foreground">
              How we protect your data
            </p>
          </a>
          <a
            href="/docs/ai-methodology"
            className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all group"
          >
            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1">
              AI Methodology
            </h4>
            <p className="text-xs text-muted-foreground">
              Technical implementation details
            </p>
          </a>
          <a
            href="/docs/governance"
            className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all group"
          >
            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1">
              Governance Framework
            </h4>
            <p className="text-xs text-muted-foreground">
              Oversight and accountability
            </p>
          </a>
        </div>
      </Card>
    </div>
  );
}
