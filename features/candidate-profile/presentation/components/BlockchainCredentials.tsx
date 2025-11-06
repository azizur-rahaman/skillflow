/**
 * Blockchain Credentials Section
 * 
 * Display verified token badges with issuer information,
 * verification status, and blockchain explorer links.
 */

'use client';

import { BlockchainCredential } from '@/features/candidate-profile/types/profile.types';
import { ExternalLink, Shield, Calendar, Award, Check, Clock } from 'lucide-react';

interface BlockchainCredentialsProps {
  credentials: BlockchainCredential[];
  onViewOnChain?: (credential: BlockchainCredential) => void;
  onViewDetails?: (credentialId: string) => void;
}

export const BlockchainCredentials = ({ 
  credentials, 
  onViewOnChain,
  onViewDetails 
}: BlockchainCredentialsProps) => {
  if (credentials.length === 0) {
    return null;
  }
  
  const getNetworkColor = (network: string): string => {
    const colors = {
      ethereum: '#627EEA',
      polygon: '#8247E5',
      base: '#0052FF',
      skillchain: '#22D3EE',
    };
    return colors[network as keyof typeof colors] || '#6366F1';
  };
  
  const getStatusColor = (status: string): string => {
    return status === 'verified' ? '#10B981' : status === 'pending' ? '#F59E0B' : '#64748B';
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Blockchain Credentials</h2>
          <p className="text-sm text-slate-400">
            Verified on-chain certifications and skill tokens
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-emerald-400">
            {credentials.filter(c => c.verification.status === 'verified').length} Verified
          </span>
        </div>
      </div>
      
      {/* Credentials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credentials.map((credential) => {
          const networkColor = getNetworkColor(credential.blockchain.network);
          const statusColor = getStatusColor(credential.verification.status);
          
          return (
            <div
              key={credential.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 hover:border-indigo-500 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Gradient Overlay based on badge style */}
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${credential.displayBadge.gradientColors.join(', ')})`,
                }}
              />
              
              {/* Content */}
              <div className="relative p-6 space-y-4">
                {/* Badge Image */}
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div
                      className={`w-20 h-20 ${
                        credential.displayBadge.shape === 'circle' ? 'rounded-full' :
                        credential.displayBadge.shape === 'hexagon' ? 'rounded-lg' :
                        credential.displayBadge.shape === 'shield' ? 'rounded-xl' :
                        'rounded-lg'
                      } overflow-hidden ${
                        credential.displayBadge.glowEffect ? 'shadow-2xl' : 'shadow-lg'
                      }`}
                      style={credential.displayBadge.glowEffect ? {
                        boxShadow: `0 0 30px ${credential.displayBadge.gradientColors[0]}80`,
                      } : {}}
                    >
                      {credential.metadata.image ? (
                        <img
                          src={credential.metadata.image}
                          alt={credential.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${credential.displayBadge.gradientColors.join(', ')})`,
                          }}
                        >
                          <Award className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Verification Badge */}
                    {credential.verification.status === 'verified' && (
                      <div
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-900"
                        style={{ backgroundColor: statusColor }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Network Badge */}
                  <div
                    className="px-2 py-1 rounded-lg text-xs font-medium uppercase"
                    style={{
                      backgroundColor: `${networkColor}20`,
                      color: networkColor,
                      border: `1px solid ${networkColor}40`,
                    }}
                  >
                    {credential.blockchain.network}
                  </div>
                </div>
                
                {/* Credential Info */}
                <div>
                  <h3 className="font-bold text-white mb-1 line-clamp-2">
                    {credential.name}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                    {credential.description}
                  </p>
                  
                  {/* Issuer */}
                  <div className="flex items-center gap-2">
                    {credential.issuer.logo ? (
                      <img
                        src={credential.issuer.logo}
                        alt={credential.issuer.name}
                        className="w-5 h-5 rounded object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center">
                        <Shield className="w-3 h-3 text-slate-400" />
                      </div>
                    )}
                    <span className="text-sm text-slate-300">
                      {credential.issuer.name}
                    </span>
                    {credential.issuer.verified && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>
                
                {/* Metadata Attributes */}
                {credential.metadata.attributes.length > 0 && (
                  <div className="space-y-1">
                    {credential.metadata.attributes.slice(0, 2).map((attr, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-slate-400">{attr.trait_type}</span>
                        <span className="text-white font-medium">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Skills Certified */}
                {credential.metadata.skillsCertified.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {credential.metadata.skillsCertified.slice(0, 3).map((skill) => (
                      <div
                        key={skill}
                        className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-400"
                      >
                        {skill}
                      </div>
                    ))}
                    {credential.metadata.skillsCertified.length > 3 && (
                      <div className="px-2 py-1 rounded-md bg-slate-800/50 text-xs text-slate-400">
                        +{credential.metadata.skillsCertified.length - 3}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Date & Expiry */}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(credential.issuedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                  {credential.expiryDate && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expires {new Date(credential.expiryDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onViewDetails?.(credential.id)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm font-medium text-white hover:border-indigo-500 transition-all"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onViewOnChain?.(credential)}
                    className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-sm font-medium text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Chain
                  </button>
                </div>
              </div>
              
              {/* Token Standard Badge */}
              <div className="absolute top-4 right-4 px-2 py-1 rounded bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-xs text-slate-400">
                {credential.blockchain.tokenStandard}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
        <div>
          <div className="text-2xl font-bold text-white mb-1">
            {credentials.length}
          </div>
          <div className="text-xs text-slate-400">Total Credentials</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {credentials.filter(c => c.verification.status === 'verified').length}
          </div>
          <div className="text-xs text-slate-400">Verified</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {new Set(credentials.map(c => c.blockchain.network)).size}
          </div>
          <div className="text-xs text-slate-400">Networks</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-cyan-400 mb-1">
            {new Set(credentials.flatMap(c => c.metadata.skillsCertified)).size}
          </div>
          <div className="text-xs text-slate-400">Skills Certified</div>
        </div>
      </div>
    </div>
  );
};
