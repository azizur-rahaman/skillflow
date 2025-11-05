'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';
import { UserLevel, formatXP, getLevelColor } from '../../types/gamification.types';

/**
 * Props for XPProgressBar component
 */
interface XPProgressBarProps {
  userLevel: UserLevel;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Animated XP counter with level progress bar
 * Features: gradient progress fill, particle effects, level milestone indicators
 */
export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  userLevel,
  showAnimation = true,
  size = 'lg',
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedXP, setAnimatedXP] = useState(userLevel.currentXP);

  const levelColor = getLevelColor(userLevel.currentLevel);
  const xpToNextLevel = userLevel.xpForNextLevel - userLevel.currentXP;
  const xpInCurrentLevel = userLevel.currentXP - userLevel.xpForCurrentLevel;
  const xpNeededForLevel = userLevel.xpForNextLevel - userLevel.xpForCurrentLevel;

  // Animate progress bar
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setAnimatedProgress(userLevel.xpProgress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(userLevel.xpProgress);
    }
  }, [userLevel.xpProgress, showAnimation]);

  // Animate XP counter
  useEffect(() => {
    if (showAnimation) {
      const duration = 1000;
      const start = animatedXP;
      const end = userLevel.currentXP;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        setAnimatedXP(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    } else {
      setAnimatedXP(userLevel.currentXP);
    }
  }, [userLevel.currentXP, showAnimation]);

  const sizeClasses = {
    sm: {
      container: 'p-4',
      level: 'w-12 h-12 text-lg',
      title: 'text-sm',
      xp: 'text-xl',
      bar: 'h-2',
    },
    md: {
      container: 'p-5',
      level: 'w-14 h-14 text-xl',
      title: 'text-base',
      xp: 'text-2xl',
      bar: 'h-3',
    },
    lg: {
      container: 'p-6',
      level: 'w-16 h-16 text-2xl',
      title: 'text-lg',
      xp: 'text-3xl',
      bar: 'h-4',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-2 rounded-2xl overflow-hidden ${classes.container}`}
      style={{ borderColor: `${levelColor}40` }}
    >
      {/* Glowing background effect */}
      <div
        className="absolute inset-0 opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${levelColor}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header: Level badge + Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Level badge */}
            <div
              className={`${classes.level} rounded-xl flex items-center justify-center font-bold text-white relative overflow-hidden`}
              style={{
                background: `linear-gradient(135deg, ${levelColor}dd, ${levelColor})`,
                boxShadow: `0 0 20px ${levelColor}60`,
              }}
            >
              {/* Sparkle effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="relative z-10">{userLevel.currentLevel}</span>
              
              {/* Floating sparkle */}
              <Sparkles
                className="absolute top-1 right-1 w-3 h-3 text-white/80 animate-pulse"
                style={{ animationDuration: '2s' }}
              />
            </div>

            {/* Level info */}
            <div>
              <div className={`font-bold text-white ${classes.title}`}>
                {userLevel.levelTitle}
              </div>
              <div className="text-sm text-slate-400">Level {userLevel.currentLevel}</div>
            </div>
          </div>

          {/* Total XP */}
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: levelColor }} />
              <div className={`font-bold ${classes.xp}`} style={{ color: levelColor }}>
                {formatXP(animatedXP)}
              </div>
            </div>
            <div className="text-xs text-slate-400">Total XP</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          {/* Bar container */}
          <div className={`relative bg-slate-800 rounded-full overflow-hidden ${classes.bar}`}>
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(to right, transparent, ${levelColor}40, transparent)`,
              }}
            />

            {/* Progress fill */}
            <div
              className="relative h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${animatedProgress}%`,
                background: `linear-gradient(90deg, ${levelColor}cc, ${levelColor})`,
                boxShadow: `0 0 10px ${levelColor}80`,
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            {/* Milestone markers */}
            {[25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className="absolute top-0 bottom-0 w-0.5 bg-slate-700"
                style={{ left: `${milestone}%` }}
              />
            ))}
          </div>

          {/* Progress labels */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-400">
              <span className="font-semibold" style={{ color: levelColor }}>
                {formatXP(xpInCurrentLevel)}
              </span>{' '}
              / {formatXP(xpNeededForLevel)} XP
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <TrendingUp className="w-4 h-4" />
              <span>
                <span className="font-semibold text-white">{formatXP(xpToNextLevel)}</span> to
                Level {userLevel.currentLevel + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Next level preview */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>Next level unlocks:</div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-800/50 rounded text-white">
                +50 XP per task
              </span>
              <span className="px-2 py-1 bg-slate-800/50 rounded text-white">New badge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Particle effects (decorative) */}
      {showAnimation && (
        <>
          <div
            className="absolute top-4 right-4 w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: levelColor, animationDuration: '3s' }}
          />
          <div
            className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: levelColor, animationDuration: '4s' }}
          />
        </>
      )}
    </div>
  );
};

// Shimmer animation
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

// Inject keyframes
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}
