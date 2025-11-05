'use client';

import React from 'react';
import { Upload, FileText, Sparkles, Github, Linkedin } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center max-w-lg">
        {/* Icon */}
        <div className="relative mb-6 inline-block">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-[#334155] flex items-center justify-center relative">
            <FileText className="w-16 h-16 text-[#6366F1]" />
            
            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#A855F7] flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#6366F1] flex items-center justify-center animate-pulse" style={{ animationDelay: '500ms' }}>
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="absolute top-1/4 -right-4 w-5 h-5 rounded-full bg-gradient-to-br from-[#A855F7] to-[#22D3EE] flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6366F1]/20 to-[#A855F7]/20 blur-xl animate-pulse" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">
          No Skills Extracted Yet
        </h2>
        
        {/* Description */}
        <p className="text-[#94A3B8] mb-8 leading-relaxed">
          Upload your resume or connect your professional profiles to automatically extract 
          and verify your skills using our AI-powered analysis engine.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold transition-all duration-300 shadow-lg shadow-[#6366F1]/25 hover:shadow-xl hover:shadow-[#6366F1]/40 hover:-translate-y-0.5">
            <Upload className="w-5 h-5" />
            Upload Resume
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#6366F1]/50 hover:bg-[#6366F1]/10 text-[#6366F1] font-semibold transition-all duration-300 hover:border-[#6366F1] hover:-translate-y-0.5">
            <Sparkles className="w-5 h-5" />
            Connect Profiles
          </button>
        </div>

        {/* Quick Connect Options */}
        <div className="space-y-3">
          <div className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-3">
            Or connect from
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <button className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E293B] border border-[#334155] hover:border-[#0A66C2] text-[#CBD5E1] hover:text-[#0A66C2] transition-all duration-200">
              <Linkedin className="w-4 h-4" />
              <span className="text-sm font-medium">LinkedIn</span>
            </button>
            
            <button className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E293B] border border-[#334155] hover:border-[#F8FAFC] text-[#CBD5E1] hover:text-[#F8FAFC] transition-all duration-200">
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-10 pt-6 border-t border-[#334155]/50">
          <div className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-3">
            💡 Pro Tips
          </div>
          <ul className="text-sm text-[#94A3B8] space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-[#22D3EE] mt-0.5">•</span>
              <span>Upload a detailed resume with projects and achievements for better extraction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6366F1] mt-0.5">•</span>
              <span>Connect multiple sources to cross-verify skills and increase confidence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#A855F7] mt-0.5">•</span>
              <span>Our AI analyzes context and provides evidence for each extracted skill</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
