"use client";

import React from "react";
import { useDocumentation } from "../../context/DocumentationContext";
import { DocSection } from "../../types";
import {
  Book,
  HelpCircle,
  FileText,
  Shield,
  Lightbulb,
  Settings,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    slug: "getting-started",
    icon: "Book",
    subsections: [
      { id: "introduction", title: "Introduction", slug: "introduction" },
      { id: "quick-start", title: "Quick Start", slug: "quick-start" },
      { id: "account-setup", title: "Account Setup", slug: "account-setup" },
    ],
  },
  {
    id: "features",
    title: "Features",
    slug: "features",
    icon: "Lightbulb",
    subsections: [
      { id: "skill-dna", title: "Skill DNA", slug: "skill-dna" },
      { id: "growth-rings", title: "Growth Rings", slug: "growth-rings" },
      { id: "skill-graph", title: "Skill Graph", slug: "skill-graph" },
      { id: "talent-search", title: "Talent Search", slug: "talent-search" },
      { id: "credentials", title: "Credentials", slug: "credentials" },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    slug: "faq",
    icon: "HelpCircle",
  },
  {
    id: "guides",
    title: "Guides",
    slug: "guides",
    icon: "FileText",
    subsections: [
      {
        id: "for-individuals",
        title: "For Individuals",
        slug: "for-individuals",
      },
      {
        id: "for-enterprises",
        title: "For Enterprises",
        slug: "for-enterprises",
      },
      { id: "for-educators", title: "For Educators", slug: "for-educators" },
    ],
  },
  {
    id: "ethical-ai",
    title: "Ethical AI Whitepaper",
    slug: "ethical-ai",
    icon: "Shield",
  },
  {
    id: "api-reference",
    title: "API Reference",
    slug: "api-reference",
    icon: "Settings",
  },
];

const iconMap: Record<string, React.ElementType> = {
  Book,
  HelpCircle,
  FileText,
  Shield,
  Lightbulb,
  Settings,
};

interface SidebarSectionProps {
  section: DocSection;
  isActive: boolean;
  onClick: () => void;
  depth?: number;
}

function SidebarSection({
  section,
  isActive,
  onClick,
  depth = 0,
}: SidebarSectionProps) {
  const { activeSection, setActiveSection } = useDocumentation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const Icon = section.icon ? iconMap[section.icon] : FileText;
  const hasSubsections = section.subsections && section.subsections.length > 0;

  const handleClick = () => {
    if (hasSubsections) {
      setIsExpanded(!isExpanded);
    }
    onClick();
  };

  return (
    <div className="mb-1">
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
          "hover:bg-muted/50 group",
          isActive && "bg-primary/10 text-primary border-l-2 border-primary",
          !isActive && "text-muted-foreground hover:text-foreground",
          depth > 0 && "pl-8"
        )}
      >
        {depth === 0 && Icon && (
          <Icon
            className={cn(
              "w-4 h-4 transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />
        )}
        <span className="flex-1 text-left text-sm font-medium">
          {section.title}
        </span>
        {hasSubsections &&
          (isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          ))}
      </button>

      {hasSubsections && isExpanded && (
        <div className="mt-1 space-y-1">
          {section.subsections!.map((subsection) => (
            <SidebarSection
              key={subsection.id}
              section={subsection}
              isActive={activeSection === subsection.id}
              onClick={() => setActiveSection(subsection.id)}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocumentationSidebar() {
  const { activeSection, setActiveSection, sidebarCollapsed, toggleSidebar } =
    useDocumentation();

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-card border border-border"
        onClick={toggleSidebar}
      >
        {sidebarCollapsed ? (
          <Menu className="w-5 h-5" />
        ) : (
          <X className="w-5 h-5" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen",
          "bg-card border-r border-border",
          "transition-all duration-300 ease-in-out z-40",
          sidebarCollapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-0 lg:min-w-0"
            : "translate-x-0 w-80 lg:w-80",
          "flex flex-col"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-foreground">Documentation</h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:flex"
              onClick={toggleSidebar}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Support & ethical clarity
          </p>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {docSections.map((section) => (
              <SidebarSection
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>Last updated: Nov 2025</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
