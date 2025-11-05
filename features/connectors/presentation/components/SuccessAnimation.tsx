'use client';

import { useEffect, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
  show: boolean;
  title: string;
  description: string;
}

export default function SuccessAnimation({ show, title, description }: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti Effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 animate-confetti"
            style={{
              left: `${50 + (Math.random() - 0.5) * 20}%`,
              top: '50%',
              backgroundColor: ['#4F46E5', '#A855F7', '#22D3EE', '#10B981'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 + Math.random()}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Success Card */}
      <div className="
        pointer-events-auto
        p-8 rounded-2xl
        bg-gradient-to-br from-[#1E293B] to-[#0F172A]
        border-2 border-[#10B981]
        shadow-2xl shadow-[#10B981]/50
        animate-success-pop
        max-w-md
      ">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* Outer Pulse Ring */}
            <div className="absolute inset-0 rounded-full bg-[#10B981] opacity-40 animate-ping" />
            
            {/* Check Icon */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-[#10B981] to-[#22D3EE] flex items-center justify-center">
              <Check className="w-10 h-10 text-white animate-check-draw" strokeWidth={3} />
            </div>

            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#22D3EE] animate-sparkle" />
            <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-[#A855F7] animate-sparkle" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-white font-bold text-2xl text-center mb-2">
          {title}
        </h3>
        <p className="text-white/70 text-center text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
