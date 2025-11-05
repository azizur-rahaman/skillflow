'use client';

import { useRouter } from 'next/navigation';
import { Dna, TrendingUp, ShoppingBag, Sparkles } from 'lucide-react';
import { OnboardingProvider } from '@/features/onboarding/context/OnboardingContext';
import { OnboardingStep } from '@/features/onboarding/types/onboarding.types';
import OnboardingOverlay from '@/features/onboarding/presentation/components/OnboardingOverlay';
import SkillDNAPreview from '@/features/onboarding/presentation/components/previews/SkillDNAPreview';
import ForecastPreview from '@/features/onboarding/presentation/components/previews/ForecastPreview';
import MarketplacePreview from '@/features/onboarding/presentation/components/previews/MarketplacePreview';

export default function OnboardingTourPage() {
  const router = useRouter();

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to SkillFlow',
      description: 'Your predictive talent OS that helps you understand, grow, and showcase your skills using AI-powered insights.',
      icon: 'Sparkles',
      position: 'center',
      illustration: (
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#22D3EE] flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      ),
      features: [
        'AI-powered skill extraction from your resume and profiles',
        'Predictive analytics for future skill demand',
        'Blockchain-verified skill credentials',
      ],
    },
    {
      id: 'skill-dna',
      title: 'Skill DNA',
      description: 'Your unique skill fingerprint visualized as an interactive DNA helix. See how your skills connect and evolve over time.',
      icon: 'Dna',
      position: 'center',
      illustration: (
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] flex items-center justify-center">
          <Dna className="w-10 h-10 text-white" />
        </div>
      ),
      features: [
        'Visualize your complete skill profile',
        'Track skill strength and growth over time',
        'Discover skill relationships and affinities',
      ],
    },
    {
      id: 'forecast',
      title: 'Demand Forecasting',
      description: 'See which skills are trending up or becoming obsolete. Get 12-month predictions powered by machine learning.',
      icon: 'TrendingUp',
      position: 'center',
      illustration: (
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#A855F7] to-[#22D3EE] flex items-center justify-center">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>
      ),
      features: [
        'Real-time market demand analysis',
        'Emerging role recommendations',
        'Skill gap identification and learning paths',
      ],
    },
    {
      id: 'marketplace',
      title: 'Token Marketplace',
      description: 'Mint, trade, and verify blockchain-based skill credentials. Build a verifiable portfolio that employers can trust.',
      icon: 'ShoppingBag',
      position: 'center',
      illustration: (
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#22D3EE] flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>
      ),
      features: [
        'ERC-1155 blockchain credentials',
        'Verifiable skill tokens from trusted issuers',
        'Decentralized credential marketplace',
      ],
    },
    {
      id: 'complete',
      title: "You're All Set!",
      description: "Let's start building your Skill DNA and unlocking your future potential.",
      icon: 'Sparkles',
      position: 'center',
      illustration: (
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#22D3EE] via-[#A855F7] to-[#4F46E5] flex items-center justify-center animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      ),
      features: [
        'Connect your LinkedIn, GitHub, or Upwork',
        'Upload your resume for AI skill extraction',
        'Set up your personalized learning path',
      ],
    },
  ];

  const handleComplete = () => {
    // Redirect to connect data sources or dashboard
    router.push('/dashboard');
  };

  return (
    <OnboardingProvider steps={onboardingSteps} onComplete={handleComplete}>
      <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="onboarding-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#onboarding-grid)" />
          </svg>
        </div>

        {/* Content container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            {/* Preview Dashboards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
              <div className="transform scale-95">
                <SkillDNAPreview />
              </div>
              <div className="transform scale-95">
                <ForecastPreview />
              </div>
              <div className="transform scale-95">
                <MarketplacePreview />
              </div>
            </div>
          </div>
        </div>

        {/* Onboarding overlay with tooltip */}
        <OnboardingOverlay />
      </div>
    </OnboardingProvider>
  );
}
