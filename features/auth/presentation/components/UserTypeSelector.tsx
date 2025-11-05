'use client';

import { User, Building2, GraduationCap } from 'lucide-react';

type UserType = 'individual' | 'enterprise' | 'university';

interface UserTypeSelectorProps {
  selectedType: UserType | null;
  onSelect: (type: UserType) => void;
}

export default function UserTypeSelector({ selectedType, onSelect }: UserTypeSelectorProps) {
  const userTypes = [
    {
      type: 'individual' as UserType,
      title: 'Individual',
      description: 'For professionals tracking personal skill growth',
      icon: User,
      gradient: 'from-[#4F46E5] to-[#22D3EE]',
      features: ['Skill DNA Analysis', 'Personalized Learning', 'Career Forecasting'],
    },
    {
      type: 'enterprise' as UserType,
      title: 'Enterprise',
      description: 'For companies managing workforce intelligence',
      icon: Building2,
      gradient: 'from-[#A855F7] to-[#4F46E5]',
      features: ['Team Analytics', 'Talent Insights', 'Skill Gap Analysis'],
    },
    {
      type: 'university' as UserType,
      title: 'University',
      description: 'For institutions preparing future talent',
      icon: GraduationCap,
      gradient: 'from-[#22D3EE] to-[#A855F7]',
      features: ['Student Tracking', 'Program Optimization', 'Industry Alignment'],
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {userTypes.map(({ type, title, description, icon: Icon, gradient, features }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`
            relative group
            p-6 rounded-2xl
            border-2 transition-all duration-300
            text-left
            ${
              selectedType === type
                ? 'border-[#22D3EE] bg-gradient-to-br from-[#4F46E5]/10 to-[#22D3EE]/10'
                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }
          `}
          aria-pressed={selectedType === type}
        >
          {/* Selection Indicator */}
          {selectedType === type && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          {/* Icon with Gradient Background */}
          <div className="mb-4">
            <div className={`
              inline-flex p-3 rounded-xl
              bg-gradient-to-br ${gradient}
              group-hover:scale-110 transition-transform duration-300
            `}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-white/60 text-sm mb-4">
            {description}
          </p>

          {/* Features */}
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-xs text-white/50">
                <svg className="w-4 h-4 mr-2 text-[#22D3EE]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          {/* Hover Effect Glow */}
          <div className={`
            absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10
            bg-gradient-to-br ${gradient} blur-xl
          `} style={{ filter: 'blur(20px)' }} />
        </button>
      ))}
    </div>
  );
}
