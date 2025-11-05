'use client';

export default function SkillDNAPreview() {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-white/10" />
          ))}
        </div>
      </div>

      {/* DNA Helix Rings */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="relative w-64 h-64">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#4F46E5]/30 animate-pulse" />
          
          {/* Middle Ring */}
          <div className="absolute inset-8 rounded-full border-4 border-[#A855F7]/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
          
          {/* Inner Ring */}
          <div className="absolute inset-16 rounded-full border-4 border-[#22D3EE]/50 animate-pulse" style={{ animationDelay: '0.6s' }} />

          {/* Center Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#22D3EE] blur-xl opacity-60" />
          </div>

          {/* DNA Icon Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 18h16M4 6c2.5 4 5 8 0 12M20 6c-2.5 4-5 8 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Skill Labels */}
      <div className="absolute top-8 left-8 space-y-2">
        <div className="px-3 py-1.5 bg-[#4F46E5]/20 border border-[#4F46E5]/40 rounded-lg text-xs text-white/80">
          React • Expert
        </div>
        <div className="px-3 py-1.5 bg-[#A855F7]/20 border border-[#A855F7]/40 rounded-lg text-xs text-white/80">
          TypeScript • Advanced
        </div>
      </div>

      <div className="absolute bottom-8 right-8 space-y-2">
        <div className="px-3 py-1.5 bg-[#22D3EE]/20 border border-[#22D3EE]/40 rounded-lg text-xs text-white/80">
          Node.js • Intermediate
        </div>
        <div className="px-3 py-1.5 bg-[#4F46E5]/20 border border-[#4F46E5]/40 rounded-lg text-xs text-white/80">
          PostgreSQL • Advanced
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-40 text-center">
        <h3 className="text-white/90 font-semibold text-lg">Your Skill DNA</h3>
        <p className="text-white/50 text-sm mt-1">Unique skill fingerprint</p>
      </div>
    </div>
  );
}
