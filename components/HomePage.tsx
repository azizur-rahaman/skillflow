'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  Award,
  BarChart3,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { HomePageHeader } from './HomePageHeader';

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Animation counter states
  const [totalUsers, setTotalUsers] = useState(0);
  const [skillsTracked, setSkillsTracked] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [realTimeUsers, setRealTimeUsers] = useState(0);
  
  useEffect(() => {
    setMounted(true);
    
    // Animate counters
    const animateValue = (setter: (val: number) => void, target: number, duration: number) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
      
      return timer;
    };
    
    const timer1 = animateValue(setTotalUsers, 325000, 2000);
    const timer2 = animateValue(setSkillsTracked, 15000000, 2000);
    const timer3 = animateValue(setAccuracy, 99, 1500);
    const timer4 = animateValue(setRealTimeUsers, 1847, 2000);
    
    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
      clearInterval(timer4);
    };
  }, []);

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      router.push('/register');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0F172A] to-[#1E1B4B] relative overflow-hidden">
      {/* HomePage Header - Transparent */}
      <HomePageHeader />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#6366F1]/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#A855F7]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#22D3EE]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Your Financial Future{' '}
                <span className="bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#22D3EE] bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-[#94A3B8] leading-relaxed max-w-xl">
                Experience skill mastery with SkillFlow's innovative workforce development platform. 
                Track skills in real-time, gain actionable insights, and boost team performance effortlessly.
              </p>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@divyanshagarwal.com"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-[#4F46E5] hover:bg-[#6366F1] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#4F46E5]/50 hover:shadow-xl hover:shadow-[#4F46E5]/60 flex items-center justify-center gap-2 group"
              >
                Get started for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Social Sign In */}
            <div className="space-y-3">
              <p className="text-sm text-[#64748B]">Or Sign up with:</p>
              <div className="flex gap-3">
                <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </button>
                <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#A855F7] border-2 border-[#0F172A] flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm font-semibold text-white">
                  24.2k+ <span className="text-[#94A3B8] font-normal underline cursor-pointer hover:text-white transition-colors">Reviews</span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <div className="text-4xl font-bold text-white mb-1">10m+</div>
                <div className="text-[#94A3B8]">Daily Skill Assessments</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">99.99%</div>
                <div className="text-[#94A3B8]">Platform Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats Dashboard */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {/* Total Visits Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B]/80 to-[#1E293B]/40 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-[#94A3B8] mb-1">Statistics</div>
                  <div className="text-lg font-semibold text-white">Total users</div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-5xl font-bold text-white mb-2">
                    {totalUsers.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-[#10B981]">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">+18.34%</span>
                  </div>
                </div>
                {/* Mini Chart */}
                <div className="w-32 h-20">
                  <svg viewBox="0 0 120 80" className="w-full h-full">
                    <path
                      d="M 0 60 Q 20 40 40 45 T 80 30 Q 100 35 120 20"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      className="animate-draw-line"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Views by Country Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B]/80 to-[#1E293B]/40 backdrop-blur-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-[#94A3B8] mb-1">Statistics</div>
                  <div className="text-lg font-semibold text-white">Users by region</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {/* Pie Chart */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* USA - 39% */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#6366F1" strokeWidth="20" strokeDasharray="98 251" strokeDashoffset="0" />
                    {/* Canada - 28% */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="20" strokeDasharray="70 251" strokeDashoffset="-98" />
                    {/* UK - 23% */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#A78BFA" strokeWidth="20" strokeDasharray="58 251" strokeDashoffset="-168" />
                    {/* Australia - 10% */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#C4B5FD" strokeWidth="20" strokeDasharray="25 251" strokeDashoffset="-226" />
                  </svg>
                </div>
                {/* Legend */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
                      <span className="text-sm text-[#94A3B8]">USA</span>
                    </div>
                    <span className="text-sm text-white font-semibold">39.11%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                      <span className="text-sm text-[#94A3B8]">Canada</span>
                    </div>
                    <span className="text-sm text-white font-semibold">28.02%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#A78BFA]" />
                      <span className="text-sm text-[#94A3B8]">U.K.</span>
                    </div>
                    <span className="text-sm text-white font-semibold">23.13%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#C4B5FD]" />
                      <span className="text-sm text-[#94A3B8]">Australia</span>
                    </div>
                    <span className="text-sm text-white font-semibold">5.03%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Skills Goal Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1E293B]/80 to-[#1E293B]/40 backdrop-blur-xl border border-white/10 p-5 hover:border-white/20 transition-all duration-300">
                <div className="text-xs text-[#94A3B8] mb-4">Statistics</div>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#1E293B" strokeWidth="10" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="35" 
                      fill="none" 
                      stroke="url(#gradient)" 
                      strokeWidth="10" 
                      strokeDasharray="157" 
                      strokeDashoffset="45"
                      strokeLinecap="round"
                      className="animate-draw-circle"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-white">72%</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8]">Skills goal</span>
                    <span className="text-white font-semibold">$32,000</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8]">Remaining</span>
                    <span className="text-white font-semibold">$7,600</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#10B981] font-semibold">Achieved: $24,400</span>
                  </div>
                </div>
              </div>

              {/* Real-time Users Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1E293B]/80 to-[#1E293B]/40 backdrop-blur-xl border border-white/10 p-5 hover:border-white/20 transition-all duration-300">
                <div className="text-xs text-[#94A3B8] mb-2">Statistics</div>
                <div className="text-sm font-semibold text-white mb-4">Real-time users</div>
                <div className="flex items-end justify-between mb-3">
                  <div className="text-3xl font-bold text-white">{realTimeUsers}</div>
                  <div className="flex items-center gap-1 text-[#10B981] text-sm">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-semibold">12.75%</span>
                  </div>
                </div>
                {/* Time Series Chart */}
                <div className="w-full h-16">
                  <svg viewBox="0 0 200 60" className="w-full h-full">
                    <path
                      d="M 0 30 L 20 25 L 40 35 L 60 20 L 80 28 L 100 15 L 120 22 L 140 30 L 160 25 L 180 32 L 200 28"
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="2"
                      className="animate-draw-line"
                    />
                    <circle cx="80" cy="28" r="4" fill="#6366F1" className="animate-pulse" />
                    <circle cx="140" cy="30" r="4" fill="#6366F1" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-xs text-[#64748B] mt-2">
                  <span>10:00</span>
                  <span>12:00</span>
                  <span>14:00</span>
                  <span>16:00</span>
                  <span>18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes draw-line {
          from {
            stroke-dashoffset: 200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-circle {
          from {
            stroke-dashoffset: 220;
          }
          to {
            stroke-dashoffset: 45;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
        }

        .animate-draw-line {
          animation: draw-line 2s ease-out forwards;
        }

        .animate-draw-circle {
          animation: draw-circle 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
