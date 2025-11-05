'use client';

import { Database, Target, Share2 } from 'lucide-react';

export default function ConsentSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* What We Collect */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#4F46E5]/20 border-2 border-[#4F46E5]/40 flex items-center justify-center">
            <Database className="w-5 h-5 text-[#4F46E5]" />
          </div>
          <h3 className="text-white font-semibold">What We Collect</h3>
        </div>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start">
            <span className="text-[#4F46E5] mr-2">•</span>
            Profile information (name, email, photo)
          </li>
          <li className="flex items-start">
            <span className="text-[#4F46E5] mr-2">•</span>
            Resume and work history
          </li>
          <li className="flex items-start">
            <span className="text-[#4F46E5] mr-2">•</span>
            Skills and certifications
          </li>
          <li className="flex items-start">
            <span className="text-[#4F46E5] mr-2">•</span>
            Learning activity and progress
          </li>
        </ul>
      </div>

      {/* How We Use It */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#A855F7]/20 border-2 border-[#A855F7]/40 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#A855F7]" />
          </div>
          <h3 className="text-white font-semibold">How We Use It</h3>
        </div>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start">
            <span className="text-[#A855F7] mr-2">•</span>
            Build your personalized Skill DNA
          </li>
          <li className="flex items-start">
            <span className="text-[#A855F7] mr-2">•</span>
            Generate skill demand forecasts
          </li>
          <li className="flex items-start">
            <span className="text-[#A855F7] mr-2">•</span>
            Recommend learning paths
          </li>
          <li className="flex items-start">
            <span className="text-[#A855F7] mr-2">•</span>
            Match you with opportunities
          </li>
        </ul>
      </div>

      {/* Who We Share With */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#22D3EE]/20 border-2 border-[#22D3EE]/40 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <h3 className="text-white font-semibold">Who We Share With</h3>
        </div>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start">
            <span className="text-[#22D3EE] mr-2">•</span>
            <span className="italic">Only with your explicit consent</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#22D3EE] mr-2">•</span>
            Verified hiring partners (anonymized)
          </li>
          <li className="flex items-start">
            <span className="text-[#22D3EE] mr-2">•</span>
            Educational institutions (on request)
          </li>
          <li className="flex items-start">
            <span className="text-[#22D3EE] mr-2">•</span>
            Analytics providers (aggregated only)
          </li>
        </ul>
      </div>
    </div>
  );
}
