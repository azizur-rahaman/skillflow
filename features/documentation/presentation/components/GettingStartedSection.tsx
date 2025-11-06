"use client";

import React from "react";
import { useDocumentation } from "../../context/DocumentationContext";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Rocket,
  Zap,
  Shield,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const quickStartSteps = [
  {
    icon: Rocket,
    title: "Create Your Account",
    description:
      "Sign up and complete your profile to get started with SkillFlow.",
    action: "Sign Up",
    link: "/register",
  },
  {
    icon: Zap,
    title: "Connect Your Data",
    description:
      "Link your professional profiles to allow AI analysis of your skills.",
    action: "Connect",
    link: "/onboarding/connect-data",
  },
  {
    icon: BookOpen,
    title: "Explore Your Skill DNA",
    description:
      "Discover your unique skill composition and growth opportunities.",
    action: "Explore",
    link: "/skills/dna",
  },
];

const popularDocs = [
  {
    title: "Understanding Skill DNA",
    description:
      "Learn how our AI visualizes and analyzes your skill composition",
    category: "Features",
    link: "/docs/skill-dna",
  },
  {
    title: "Minting Credentials",
    description:
      "Create verifiable blockchain credentials for your achievements",
    category: "Guides",
    link: "/docs/credentials",
  },
  {
    title: "Talent Search Guide",
    description:
      "Find the right talent or opportunities using AI-powered search",
    category: "Features",
    link: "/docs/talent-search",
  },
  {
    title: "Privacy & Security",
    description: "How we protect your data with zero-knowledge proofs",
    category: "Security",
    link: "/docs/privacy",
  },
];

export function GettingStartedSection() {
  const { setActiveSection } = useDocumentation();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-cyan-500/20 p-8 md:p-12">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-foreground">
              Documentation v1.0
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to SkillFlow
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Your comprehensive guide to leveraging AI-powered skill
            intelligence, verifiable credentials, and talent discovery.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setActiveSection("quick-start")}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Quick Start
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveSection("faq")}
              className="rounded-xl border-border hover:bg-muted"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse FAQ
            </Button>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl" />
      </div>

      {/* Quick Start Guide */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Quick Start Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStartSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.title}
                className="bg-card border-border rounded-2xl p-6 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-primary">
                    Step {index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {step.description}
                </p>

                <Button
                  variant="ghost"
                  className="w-full justify-between rounded-xl hover:bg-primary/10 hover:text-primary group-hover:translate-x-1 transition-all"
                  onClick={() => (window.location.href = step.link)}
                >
                  {step.action}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Popular Documentation */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Popular Documentation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularDocs.map((doc) => (
            <Card
              key={doc.title}
              className="bg-card border-border rounded-xl p-5 hover:border-primary/50 transition-all group cursor-pointer"
              onClick={() => (window.location.href = doc.link)}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="text-xs font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">
                  {doc.category}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {doc.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ethical AI Callout */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-border rounded-2xl p-6">
          <Shield className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ethical AI Commitment
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Learn about our transparent, fair, and explainable AI approach. Read
            our comprehensive whitepaper on ethical AI practices.
          </p>
          <Button
            variant="outline"
            onClick={() => setActiveSection("ethical-ai")}
            className="rounded-xl border-border hover:bg-muted hover:border-primary/50"
          >
            Read Whitepaper
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        {/* API Reference */}
        <Card className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <code className="text-lg font-mono font-bold text-foreground">
              {"{ API }"}
            </code>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Developer Resources
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Integrate SkillFlow into your applications with our comprehensive
            API documentation and SDKs.
          </p>
          <Button
            variant="outline"
            onClick={() => setActiveSection("api-reference")}
            className="rounded-xl border-border hover:bg-muted hover:border-primary/50"
          >
            View API Docs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
