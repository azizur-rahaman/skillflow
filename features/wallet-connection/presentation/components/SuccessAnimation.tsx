'use client';

/**
 * Success Animation Component
 * 
 * Animated success checkmark with confetti effect for successful wallet connection.
 */

import React, { useEffect, useState } from 'react';
import { SuccessAnimationProps } from '../../types/wallet-connection.types';

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  visible,
  walletAddress,
  network,
  onComplete,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    if (visible) {
      // Trigger checkmark animation
      const checkmarkTimer = setTimeout(() => {
        setShowCheckmark(true);
      }, 100);

      // Trigger confetti
      const confettiTimer = setTimeout(() => {
        setShowConfetti(true);
      }, 300);

      // Auto-complete after animation
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => {
        clearTimeout(checkmarkTimer);
        clearTimeout(confettiTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setShowCheckmark(false);
      setShowConfetti(false);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm animate-fade-in" />

      {/* Success card */}
      <div className="relative max-w-md w-full">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl blur-3xl opacity-40"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #10B981, transparent 70%)',
          }}
        />

        {/* Card */}
        <div className="relative bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center shadow-2xl animate-scale-in">
          {/* Checkmark circle */}
          <div className="relative mx-auto mb-6 w-24 h-24">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping-slow" />

            {/* Inner circle */}
            <div 
              className={`
                absolute inset-0 rounded-full bg-emerald-500 flex items-center justify-center
                transition-transform duration-500
                ${showCheckmark ? 'scale-100' : 'scale-0'}
              `}
            >
              {/* Checkmark */}
              <svg 
                className="w-14 h-14 text-white animate-draw-check"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                  strokeDasharray="30"
                  strokeDashoffset={showCheckmark ? "0" : "30"}
                />
              </svg>
            </div>
          </div>

          {/* Success message */}
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">
            Wallet Connected!
          </h2>
          <p className="text-slate-400 mb-6">
            Your wallet has been successfully linked to SkillFlow
          </p>

          {/* Wallet details */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Wallet Address</div>
              <div className="text-sm font-mono text-slate-300">{walletAddress}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-xs text-slate-500 mb-1">Network</div>
              <div className="text-sm font-medium text-slate-300">{network}</div>
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={onComplete}
            className="mt-6 w-full px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
            }}
          >
            Continue to Dashboard
          </button>
        </div>

        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 60}%`,
                  top: '50%',
                  background: ['#10B981', '#3B82F6', '#A855F7', '#F59E0B', '#EF4444'][i % 5],
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes draw-check {
          from {
            stroke-dashoffset: 30;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-draw-check {
          animation: draw-check 0.6s ease-out 0.2s forwards;
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};
