'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #A855F7 50%, #22D3EE 100%)',
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-[#0F172A] opacity-30"></div>
      </div>

      {/* Motion Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full opacity-20"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#4F46E5' : i % 3 === 1 ? '#A855F7' : '#22D3EE',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 15 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center space-y-8 px-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="logo-glow absolute inset-0 rounded-full blur-3xl opacity-60" 
            style={{
              background: 'radial-gradient(circle, #22D3EE 0%, #A855F7 50%, #4F46E5 100%)',
            }}
          />
          <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            {/* Logo SVG - SkillFlow */}
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 120 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="logo-animate"
            >
              {/* DNA Helix inspired logo */}
              <path 
                d="M30 30 Q45 60, 30 90" 
                stroke="url(#gradient1)" 
                strokeWidth="6" 
                fill="none"
                strokeLinecap="round"
                className="path-animate"
              />
              <path 
                d="M90 30 Q75 60, 90 90" 
                stroke="url(#gradient2)" 
                strokeWidth="6" 
                fill="none"
                strokeLinecap="round"
                className="path-animate"
                style={{ animationDelay: '0.2s' }}
              />
              {/* Connecting nodes */}
              <circle cx="30" cy="45" r="5" fill="#22D3EE" className="node-pulse" />
              <circle cx="90" cy="45" r="5" fill="#A855F7" className="node-pulse" style={{ animationDelay: '0.3s' }} />
              <circle cx="30" cy="75" r="5" fill="#4F46E5" className="node-pulse" style={{ animationDelay: '0.6s' }} />
              <circle cx="90" cy="75" r="5" fill="#22D3EE" className="node-pulse" style={{ animationDelay: '0.9s' }} />
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="50%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <h1 
          className="text-5xl md:text-6xl font-bold text-white tracking-tight"
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif',
            textShadow: '0 0 40px rgba(34, 211, 238, 0.5)',
          }}
        >
          SkillFlow
        </h1>

        {/* Tagline */}
        <p 
          className="text-xl md:text-2xl text-white/90 font-light tracking-wide"
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          The Predictive Talent OS
        </p>

        {/* Loading Progress */}
        <div className="w-80 max-w-md mt-12">
          {/* Progress Bar Container */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
            {/* Progress Fill */}
            <div 
              className="absolute h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #4F46E5 0%, #A855F7 50%, #22D3EE 100%)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)',
              }}
            />
          </div>
          
          {/* Progress Percentage */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-white/60 font-medium">Loading...</span>
            <span className="text-sm text-white/80 font-semibold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -20px) rotate(90deg);
          }
          50% {
            transform: translate(-15px, -40px) rotate(180deg);
          }
          75% {
            transform: translate(-30px, -20px) rotate(270deg);
          }
        }

        @keyframes logo-glow-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes path-draw {
          0% {
            stroke-dasharray: 0 1000;
          }
          100% {
            stroke-dasharray: 1000 0;
          }
        }

        @keyframes node-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes logo-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .particle {
          animation: float-particle infinite ease-in-out;
        }

        .logo-glow {
          animation: logo-glow-pulse 3s infinite ease-in-out;
        }

        .logo-animate {
          animation: logo-spin 20s linear infinite;
        }

        .path-animate {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: path-draw 2s ease-in-out forwards;
        }

        .node-pulse {
          animation: node-pulse 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
