"use client";

import React, { useState } from "react";
import { useDocumentation } from "../../context/DocumentationContext";
import { FAQItem } from "../../types";
import { ChevronDown, ChevronUp, Search, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock FAQ data
const mockFAQs: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I get started with SkillFlow?",
    answer:
      "Getting started is easy! First, create an account and complete your profile. Then, connect your professional data sources (LinkedIn, GitHub, etc.) to allow our AI to analyze your skills. Finally, explore your Skill DNA visualization and start your learning journey.",
    category: "Getting Started",
    tags: ["onboarding", "setup", "basics"],
  },
  {
    id: "faq-2",
    question: "What is Skill DNA and how does it work?",
    answer:
      "Skill DNA is our proprietary visualization that represents your skill composition as a unique genetic code. It uses advanced AI to analyze your experience, projects, and learning history, then maps them onto a radial visualization showing your strengths, growth areas, and skill relationships.",
    category: "Features",
    tags: ["skill-dna", "visualization", "ai"],
  },
  {
    id: "faq-3",
    question: "How do blockchain credentials work?",
    answer:
      "SkillFlow uses blockchain technology to create verifiable, tamper-proof credentials. When you mint a credential, it's stored on a decentralized network, giving you permanent ownership. Employers can verify your credentials instantly without intermediaries, and you maintain complete control over sharing.",
    category: "Credentials",
    tags: ["blockchain", "credentials", "verification"],
  },
  {
    id: "faq-4",
    question: "Is my data private and secure?",
    answer:
      "Absolutely. We follow zero-knowledge proof principles - your raw data never leaves your control. Our AI processes data locally when possible, and all external processing is encrypted. You decide what to share, when, and with whom. Read our Ethical AI Whitepaper for complete transparency.",
    category: "Privacy & Security",
    tags: ["privacy", "security", "data-protection"],
  },
  {
    id: "faq-5",
    question: "How does the AI assess my skills?",
    answer:
      "Our AI uses multiple data points: your work history, projects, code contributions, certifications, peer endorsements, and assessment results. It applies natural language processing and machine learning to identify both explicit and implicit skills, then benchmarks them against industry standards.",
    category: "AI & Technology",
    tags: ["ai", "assessment", "skills"],
  },
  {
    id: "faq-6",
    question: "Can enterprises use SkillFlow for team management?",
    answer:
      "Yes! Our Enterprise plan includes team analytics, skills heatmaps, talent gap analysis, and succession planning tools. You can track team growth, identify training needs, and make data-driven workforce decisions while maintaining individual privacy.",
    category: "Enterprise",
    tags: ["enterprise", "teams", "management"],
  },
  {
    id: "faq-7",
    question: "How do I mint my first credential?",
    answer:
      'Navigate to the Credentials page, click "Mint New Credential", select the skill or achievement you want to credential, add supporting evidence (certificates, projects, etc.), and confirm the transaction. Your credential will be minted on the blockchain within minutes.',
    category: "Credentials",
    tags: ["minting", "credentials", "blockchain"],
  },
  {
    id: "faq-8",
    question: "What is the Skills Marketplace?",
    answer:
      "The Skills Marketplace is where you can discover learning opportunities, find mentors, offer your expertise, and connect with opportunities that match your skill profile. It's powered by our AI matching engine to ensure relevant, high-quality connections.",
    category: "Marketplace",
    tags: ["marketplace", "opportunities", "networking"],
  },
];

export function FAQSection() {
  const { expandedFAQs, toggleFAQ } = useDocumentation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(mockFAQs.map((faq) => faq.category)));

  // Filter FAQs
  const filteredFAQs = mockFAQs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground">
          Find quick answers to common questions about SkillFlow
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 rounded-xl bg-input border-border"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className={cn(
            "cursor-pointer px-4 py-2 rounded-full transition-all",
            selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted/50"
          )}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 rounded-full transition-all",
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted/50"
            )}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border rounded-2xl">
            <p className="text-muted-foreground">
              No FAQs found matching your search.
            </p>
          </Card>
        ) : (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedFAQs.has(faq.id);

            return (
              <Card
                key={faq.id}
                className={cn(
                  "bg-card border-border rounded-xl overflow-hidden transition-all",
                  isExpanded && "ring-2 ring-primary/20"
                )}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {faq.question}
                    </h3>
                    <span className="text-xs text-primary font-medium">
                      {faq.category}
                    </span>
                  </div>
                  <div className="shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-border/50 bg-muted/20">
                    <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                      {faq.answer}
                    </p>

                    {faq.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground/60" />
                        <div className="flex flex-wrap gap-1.5">
                          {faq.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-md"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
