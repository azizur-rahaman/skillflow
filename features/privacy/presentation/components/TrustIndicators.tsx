'use client';

import { Shield, Lock, UserCheck, Eye, Database, Globe } from 'lucide-react';

export default function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: 'SSL Encrypted',
      description: 'All data transmitted is encrypted',
      color: '#10B981',
    },
    {
      icon: Lock,
      title: 'GDPR Compliant',
      description: 'Follows EU data protection rules',
      color: '#4F46E5',
    },
    {
      icon: UserCheck,
      title: 'SOC 2 Certified',
      description: 'Independently audited security',
      color: '#A855F7',
    },
    {
      icon: Eye,
      title: 'Transparent',
      description: 'Clear data usage policies',
      color: '#22D3EE',
    },
    {
      icon: Database,
      title: 'Data Control',
      description: 'You own your data',
      color: '#F59E0B',
    },
    {
      icon: Globe,
      title: 'Privacy First',
      description: 'Built with privacy in mind',
      color: '#EC4899',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {indicators.map((indicator, index) => {
        const Icon = indicator.icon;
        return (
          <div
            key={index}
            className="
              group
              p-4 rounded-xl
              bg-white/5 backdrop-blur-sm
              border border-white/10
              hover:border-white/20
              transition-all duration-300
              text-center
            "
          >
            <div
              className="
                w-12 h-12 mx-auto mb-3
                rounded-lg
                flex items-center justify-center
                transition-transform duration-300
                group-hover:scale-110
              "
              style={{
                backgroundColor: `${indicator.color}15`,
                border: `2px solid ${indicator.color}40`,
              }}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: indicator.color }}
              />
            </div>
            <h4
              className="text-sm font-semibold mb-1"
              style={{ color: indicator.color }}
            >
              {indicator.title}
            </h4>
            <p className="text-xs text-white/50">
              {indicator.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
