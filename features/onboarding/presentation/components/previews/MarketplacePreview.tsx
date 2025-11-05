'use client';

import { ShoppingBag, Verified, Star } from 'lucide-react';

export default function MarketplacePreview() {
  const tokens = [
    {
      name: 'React Expert',
      issuer: 'Meta Certified',
      price: '0.5 ETH',
      rating: 4.9,
      verified: true,
      color: '#4F46E5',
    },
    {
      name: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      price: '0.8 ETH',
      rating: 5.0,
      verified: true,
      color: '#A855F7',
    },
    {
      name: 'AI/ML Engineering',
      issuer: 'Stanford University',
      price: '1.2 ETH',
      rating: 4.8,
      verified: true,
      color: '#22D3EE',
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#A855F7]/20 border border-[#A855F7]/40 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-[#A855F7]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Skill Token Marketplace</h3>
            <p className="text-white/50 text-sm">Verified blockchain credentials</p>
          </div>
        </div>

        {/* Token Cards */}
        <div className="space-y-4">
          {tokens.map((token, index) => (
            <div
              key={index}
              className="
                group
                relative
                p-5 rounded-2xl
                bg-white/5 backdrop-blur-sm
                border border-white/10
                hover:border-white/30
                hover:bg-white/10
                transition-all duration-300
                cursor-pointer
              "
              style={{
                boxShadow: `0 0 20px ${token.color}20`,
              }}
            >
              {/* Glow effect on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                style={{
                  background: `radial-gradient(circle at center, ${token.color}40, transparent)`,
                }}
              />

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white font-semibold">{token.name}</h4>
                    {token.verified && (
                      <Verified className="w-4 h-4 text-[#22D3EE]" />
                    )}
                  </div>
                  
                  <p className="text-white/50 text-sm mb-3">{token.issuer}</p>

                  <div className="flex items-center gap-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-white/80 text-sm font-medium">
                        {token.rating}
                      </span>
                    </div>

                    {/* Price */}
                    <div 
                      className="px-3 py-1 rounded-lg font-mono text-sm font-semibold"
                      style={{
                        backgroundColor: `${token.color}20`,
                        color: token.color,
                        border: `1px solid ${token.color}40`,
                      }}
                    >
                      {token.price}
                    </div>
                  </div>
                </div>

                {/* Token Icon */}
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center border-2"
                  style={{
                    backgroundColor: `${token.color}10`,
                    borderColor: `${token.color}40`,
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${token.color}, ${token.color}80)`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Browse All CTA */}
        <div className="mt-6 text-center">
          <button className="
            px-6 py-3
            bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#22D3EE]
            text-white font-semibold rounded-xl
            hover:opacity-90
            transition-all duration-200
            shadow-lg shadow-[#4F46E5]/30
          ">
            Browse All Tokens
          </button>
        </div>
      </div>
    </div>
  );
}
