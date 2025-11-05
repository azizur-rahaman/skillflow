'use client';

import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

export default function ForecastPreview() {
  const trends = [
    { skill: 'AI/ML Engineering', trend: 'up', percentage: '+245%', color: '#22D3EE' },
    { skill: 'Blockchain Development', trend: 'up', percentage: '+189%', color: '#4F46E5' },
    { skill: 'Cybersecurity', trend: 'up', percentage: '+156%', color: '#A855F7' },
    { skill: 'Legacy PHP', trend: 'down', percentage: '-34%', color: '#EF4444' },
  ];

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Chart Area */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#22D3EE]/20 border border-[#22D3EE]/40 rounded-lg">
            <TrendingUp className="w-6 h-6 text-[#22D3EE]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Skill Demand Forecast</h3>
            <p className="text-white/50 text-sm">Next 12 months prediction</p>
          </div>
        </div>

        {/* Trend Chart Visualization */}
        <div className="flex-1 relative mb-6">
          {/* Simulated Line Chart */}
          <svg className="w-full h-64" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 50}
                x2="400"
                y2={i * 50}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Upward trend line */}
            <path
              d="M 0 180 Q 100 140, 200 100 T 400 20"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Area fill */}
            <path
              d="M 0 180 Q 100 140, 200 100 T 400 20 L 400 200 L 0 200 Z"
              fill="url(#gradientFill1)"
              opacity="0.2"
            />

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
              <linearGradient id="gradientFill1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>

            {/* Data points */}
            {[0, 100, 200, 300, 400].map((x, i) => (
              <circle
                key={i}
                cx={x}
                cy={180 - i * 40}
                r="4"
                fill="#22D3EE"
                className="animate-pulse"
              />
            ))}
          </svg>

          {/* Time labels */}
          <div className="flex justify-between text-xs text-white/40 mt-2">
            <span>Now</span>
            <span>3 mo</span>
            <span>6 mo</span>
            <span>9 mo</span>
            <span>12 mo</span>
          </div>
        </div>

        {/* Trending Skills List */}
        <div className="space-y-3">
          <h4 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">
            Emerging Skills
          </h4>
          {trends.map((item, index) => (
            <div
              key={index}
              className="
                flex items-center justify-between
                p-3 rounded-xl
                bg-white/5 border border-white/10
                hover:border-white/20
                transition-all duration-200
              "
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white/80 text-sm">{item.skill}</span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm font-semibold"
                  style={{ color: item.color }}
                >
                  {item.percentage}
                </span>
                {item.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4" style={{ color: item.color }} />
                ) : (
                  <ArrowDown className="w-4 h-4" style={{ color: item.color }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
