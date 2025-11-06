/**
 * Endorsements Section
 * 
 * Display skill endorsements and testimonials with endorser information,
 * ratings, relationships, and verification methods.
 */

'use client';

import { useState } from 'react';
import { Endorsement, Testimonial } from '@/features/candidate-profile/types/profile.types';
import { Star, Shield, Quote, Linkedin, Mail, Award, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface EndorsementsSectionProps {
  endorsements: Endorsement[];
  testimonials: Testimonial[];
  onEndorserClick?: (endorserId: string) => void;
}

export const EndorsementsSection = ({ 
  endorsements, 
  testimonials,
  onEndorserClick 
}: EndorsementsSectionProps) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  
  // Group endorsements by skill
  const endorsementsBySkill = endorsements.reduce((acc, endorsement) => {
    if (!acc[endorsement.skillName]) {
      acc[endorsement.skillName] = [];
    }
    acc[endorsement.skillName].push(endorsement);
    return acc;
  }, {} as Record<string, Endorsement[]>);
  
  const getRelationshipColor = (relationship: string): string => {
    const colors = {
      manager: '#10B981',
      colleague: '#6366F1',
      client: '#F59E0B',
      mentor: '#A855F7',
      peer: '#22D3EE',
    };
    return colors[relationship as keyof typeof colors] || '#64748B';
  };
  
  const getVerificationIcon = (method: string) => {
    switch (method) {
      case 'linkedin': return <Linkedin className="w-3 h-3" />;
      case 'blockchain': return <Shield className="w-3 h-3" />;
      case 'email': return <Mail className="w-3 h-3" />;
      default: return <Check className="w-3 h-3" />;
    }
  };
  
  const displayedTestimonials = showAllTestimonials 
    ? testimonials 
    : testimonials.slice(0, 3);
  
  return (
    <div className="space-y-8">
      {/* Endorsements */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Skill Endorsements</h2>
            <p className="text-sm text-slate-400">
              {endorsements.length} endorsement{endorsements.length !== 1 ? 's' : ''} from verified professionals
            </p>
          </div>
          
          {endorsements.filter(e => e.isBlockchainVerified).length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">
                {endorsements.filter(e => e.isBlockchainVerified).length} Blockchain Verified
              </span>
            </div>
          )}
        </div>
        
        {/* Skills with Endorsements */}
        <div className="space-y-3">
          {Object.entries(endorsementsBySkill).map(([skillName, skillEndorsements]) => {
            const avgRating = skillEndorsements.reduce((sum, e) => sum + e.rating, 0) / skillEndorsements.length;
            const isExpanded = selectedSkill === skillName;
            
            return (
              <div
                key={skillName}
                className="rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 overflow-hidden"
              >
                {/* Skill Header */}
                <button
                  onClick={() => setSelectedSkill(isExpanded ? null : skillName)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-400" />
                      <span className="font-semibold text-white">{skillName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.round(avgRating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-300 ml-1">
                        {avgRating.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-slate-400">
                      {skillEndorsements.length} endorsement{skillEndorsements.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                
                {/* Endorsement List (Expandable) */}
                {isExpanded && (
                  <div className="border-t border-slate-700 p-4 space-y-3">
                    {skillEndorsements.map((endorsement) => (
                      <div
                        key={endorsement.id}
                        className="flex gap-4 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all"
                      >
                        {/* Endorser Avatar */}
                        <button
                          onClick={() => onEndorserClick?.(endorsement.endorser.id)}
                          className="flex-shrink-0 group"
                        >
                          <div className="relative">
                            {endorsement.endorser.avatar ? (
                              <img
                                src={endorsement.endorser.avatar}
                                alt={endorsement.endorser.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-indigo-500 transition-all"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-slate-700 group-hover:border-indigo-500 transition-all">
                                {endorsement.endorser.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}
                            
                            {/* Verification Badge */}
                            {endorsement.isBlockchainVerified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center border-2 border-slate-900">
                                <Shield className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                        
                        {/* Endorser Info & Comment */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="font-semibold text-white">
                                {endorsement.endorser.name}
                              </div>
                              <div className="text-sm text-slate-400">
                                {endorsement.endorser.title}
                                {endorsement.endorser.company && (
                                  <> • {endorsement.endorser.company}</>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div
                                  className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                                  style={{
                                    backgroundColor: `${getRelationshipColor(endorsement.endorser.relationship)}20`,
                                    color: getRelationshipColor(endorsement.endorser.relationship),
                                  }}
                                >
                                  {endorsement.endorser.relationship}
                                </div>
                                
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/50 text-xs text-slate-400">
                                  {getVerificationIcon(endorsement.verificationMethod)}
                                  <span className="capitalize">{endorsement.verificationMethod}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < endorsement.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {endorsement.comment && (
                            <p className="text-sm text-slate-300 italic">
                              "{endorsement.comment}"
                            </p>
                          )}
                          
                          <div className="text-xs text-slate-500 mt-2">
                            {new Date(endorsement.endorsedDate).toLocaleDateString('en-US', { 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Testimonials */}
      {testimonials.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Testimonials</h2>
            <p className="text-sm text-slate-400">
              Recommendations from colleagues and clients
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {displayedTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`relative p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border transition-all ${
                  testimonial.featured 
                    ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                    : 'border-slate-700'
                }`}
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12 text-indigo-400" />
                </div>
                
                {/* Featured Badge */}
                {testimonial.featured && (
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-lg bg-indigo-500 text-xs font-semibold text-white">
                    Featured
                  </div>
                )}
                
                {/* Author */}
                <div className="flex items-start gap-4 mb-4">
                  {testimonial.author.avatar ? (
                    <img
                      src={testimonial.author.avatar}
                      alt={testimonial.author.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-700"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-slate-700">
                      {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="font-semibold text-white">
                      {testimonial.author.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {testimonial.author.title}
                    </div>
                    <div className="text-sm text-indigo-400">
                      {testimonial.author.company}
                    </div>
                    {testimonial.rating && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < testimonial.rating!
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <p className="text-slate-300 leading-relaxed mb-4 relative z-10">
                  {testimonial.content}
                </p>
                
                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{testimonial.relationship}</span>
                  <span>
                    {new Date(testimonial.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show More Button */}
          {testimonials.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => setShowAllTestimonials(!showAllTestimonials)}
                className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white font-medium hover:border-indigo-500 transition-all inline-flex items-center gap-2"
              >
                {showAllTestimonials ? (
                  <>
                    <ChevronUp className="w-5 h-5" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    Show All {testimonials.length} Testimonials
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
        <div>
          <div className="text-2xl font-bold text-white mb-1">
            {endorsements.length}
          </div>
          <div className="text-xs text-slate-400">Total Endorsements</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-amber-400 mb-1">
            {(endorsements.reduce((sum, e) => sum + e.rating, 0) / endorsements.length).toFixed(1)}
          </div>
          <div className="text-xs text-slate-400">Avg Rating</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {endorsements.filter(e => e.isBlockchainVerified).length}
          </div>
          <div className="text-xs text-slate-400">Blockchain Verified</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {Object.keys(endorsementsBySkill).length}
          </div>
          <div className="text-xs text-slate-400">Skills Endorsed</div>
        </div>
      </div>
    </div>
  );
};
