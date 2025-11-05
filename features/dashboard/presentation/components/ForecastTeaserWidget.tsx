/**
 * Forecast Teaser Component
 * 
 * Mini widget showing trending skills and demand predictions.
 * Displays hottest emerging skills with confidence scores.
 */

'use client';

import React from 'react';
import { TrendingUp, Flame, ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ForecastTeaser } from '../../types/dashboard.types';

interface ForecastTeaserWidgetProps {
  forecasts: ForecastTeaser[];
  maxItems?: number;
}

export function ForecastTeaserWidget({ forecasts, maxItems = 3 }: ForecastTeaserWidgetProps) {
  const router = useRouter();

  const getEmergingBadge = (status: string) => {
    const badges = {
      hot: { label: 'Hot', color: '#EF4444', bg: '#EF444410', glow: '#EF444430' },
      rising: { label: 'Rising', color: '#F59E0B', bg: '#F59E0B10', glow: '#F59E0B30' },
      stable: { label: 'Stable', color: '#22D3EE', bg: '#22D3EE10', glow: '#22D3EE30' },
      declining: { label: 'Declining', color: '#94A3B8', bg: '#94A3B810', glow: '#94A3B830' },
    };
    return badges[status as keyof typeof badges] || badges.stable;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#22D3EE] to-[#6366F1] flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Skill Forecast</h3>
              <p className="text-sm text-[#94A3B8]">AI-predicted demand trends</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/forecast')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] text-sm transition-all duration-200"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Forecast List */}
      <div className="p-6 space-y-4">
        {forecasts.slice(0, maxItems).map((forecast, index) => {
          const badge = getEmergingBadge(forecast.emergingStatus);
          const demandIncrease = forecast.predictedDemand - forecast.currentDemand;

          return (
            <div
              key={forecast.id}
              className="group relative p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Background Glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${badge.glow}, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                {/* Top Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-semibold text-[#F8FAFC]">
                        {forecast.skillName}
                      </h4>
                      
                      {/* Status Badge */}
                      <div
                        className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {forecast.emergingStatus === 'hot' && <Flame className="w-3 h-3" />}
                        {badge.label}
                      </div>
                    </div>

                    <div className="text-sm text-[#64748B]">
                      {forecast.domain}
                    </div>
                  </div>

                  {/* Growth Rate */}
                  <div className="flex items-center gap-1 text-[#10B981]">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      +{forecast.growthRate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Demand Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1.5">
                    <span>Demand Forecast</span>
                    <span>{forecast.timeHorizon}</span>
                  </div>

                  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    {/* Current Demand */}
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-[#64748B] to-[#64748B]/80"
                      style={{ width: `${forecast.currentDemand}%` }}
                    />
                    
                    {/* Predicted Growth */}
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-[#22D3EE] to-[#6366F1] animate-pulse"
                      style={{
                        left: `${forecast.currentDemand}%`,
                        width: `${demandIncrease}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-[#64748B]">
                      Now: {forecast.currentDemand}%
                    </span>
                    <span className="text-xs text-[#22D3EE] font-medium">
                      Predicted: {forecast.predictedDemand}%
                    </span>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#94A3B8]">
                    AI Confidence
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${forecast.confidence}%`,
                          background: forecast.confidence >= 85 
                            ? 'linear-gradient(90deg, #10B981, #10B981)' 
                            : forecast.confidence >= 70
                            ? 'linear-gradient(90deg, #22D3EE, #6366F1)'
                            : 'linear-gradient(90deg, #F59E0B, #EF4444)',
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#CBD5E1]">
                      {forecast.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-6">
        <button
          onClick={() => router.push('/forecast')}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-[#6366F1]/25 flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Explore Full Forecast</span>
        </button>
      </div>
    </div>
  );
}
