'use client';

/**
 * Credential Detail Page
 * 
 * NFT-inspired digital credential detail page with large skill token display,
 * metadata table, QR verification, and issuer signature in elegant futuristic layout.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Download, ExternalLink } from 'lucide-react';
import { CredentialDetailProvider, useCredentialDetail } from '@/features/credential-detail/context/CredentialDetailContext';
import {
  CredentialCard,
  MetadataTable,
  VerificationQR,
  IssuerSignature,
} from '@/features/credential-detail/presentation/components';
import {
  DetailTab,
  VerificationMethod,
  SharePlatform,
  formatBlockchainExplorerUrl,
} from '@/features/credential-detail/types/credential-detail.types';

/**
 * Credential Detail Content Component
 */
const CredentialDetailContent: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const {
    credential,
    activeTab,
    verification,
    loading,
    error,
    loadCredential,
    setActiveTab,
    requestVerification,
    shareCredential,
    downloadCredential,
  } = useCredentialDetail();

  const [showShareMenu, setShowShareMenu] = useState(false);

  // Load credential on mount
  useEffect(() => {
    const tokenId = params.id as string;
    if (tokenId) {
      loadCredential(tokenId);
    }
  }, [params.id, loadCredential]);

  // Handle share
  const handleShare = async (platform: SharePlatform) => {
    if (!credential) return;

    try {
      await shareCredential({
        tokenId: credential.tokenId,
        platform,
        message: `Check out my ${credential.name} credential!`,
      });
      setShowShareMenu(false);
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // Handle download
  const handleDownload = async (format: 'pdf' | 'png' | 'json') => {
    try {
      await downloadCredential(format);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // Handle view blockchain
  const handleViewBlockchain = () => {
    if (!credential) return;
    
    const explorerUrl = formatBlockchainExplorerUrl(
      credential.blockchainData.network,
      'tx',
      credential.blockchainData.transactionHash
    );
    window.open(explorerUrl, '_blank');
  };

  // Handle verification request
  const handleVerify = async (method: VerificationMethod) => {
    if (!credential) return;

    try {
      await requestVerification({
        tokenId: credential.tokenId,
        method,
      });
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  if (loading && !credential) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading credential...</p>
        </div>
      </div>
    );
  }

  if (error || !credential) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Credential Not Found</h2>
          <p className="text-slate-400 mb-6">{error || 'The credential you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/wallet')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  // Generate mock issuer signature data
  const issuerSignature = {
    issuer: credential.issuer,
    signerName: 'Dr. Sarah Johnson',
    signerTitle: 'Director of Certification',
    signedAt: credential.issuedAt,
    signature: `0x${credential.blockchainData.verificationHash.slice(2, 130)}`,
    signatureImageUrl: '/signatures/director-signature.png',
    certificateNumber: `SF-${credential.issuedAt.getFullYear()}${String(credential.issuedAt.getMonth() + 1).padStart(2, '0')}-${credential.tokenId.slice(-8).toUpperCase()}`,
    validUntil: credential.expiresAt,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={() => router.push('/wallet')}
              className="inline-flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Wallet</span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Share Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg border border-slate-700 shadow-xl overflow-hidden">
                    <button
                      onClick={() => handleShare(SharePlatform.LinkedIn)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      Share on LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare(SharePlatform.Twitter)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare(SharePlatform.Email)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      Share via Email
                    </button>
                    <button
                      onClick={() => handleShare(SharePlatform.Copy)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDownload('pdf')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Credential Card */}
          <div className="lg:col-span-1">
            <CredentialCard
              credential={credential}
              onShare={() => setShowShareMenu(!showShareMenu)}
              onDownload={() => handleDownload('png')}
              onViewBlockchain={handleViewBlockchain}
            />
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-1 flex gap-1">
              {Object.values(DetailTab).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === DetailTab.Overview && (
              <div className="space-y-6">
                <MetadataTable
                  metadata={credential.metadata}
                  blockchainData={credential.blockchainData}
                />
              </div>
            )}

            {activeTab === DetailTab.Metadata && (
              <div className="space-y-6">
                <MetadataTable
                  metadata={credential.metadata}
                  blockchainData={credential.blockchainData}
                />
              </div>
            )}

            {activeTab === DetailTab.Verification && (
              <div className="space-y-6">
                <VerificationQR
                  credential={credential}
                  verification={verification}
                  onVerify={handleVerify}
                  loading={loading}
                />
                <IssuerSignature signature={issuerSignature} />
              </div>
            )}

            {activeTab === DetailTab.Attributes && (
              <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Attributes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {credential.attributes.map((attr, index) => (
                    <div key={index} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                        {attr.trait_type}
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {attr.display_type === 'boost_percentage' 
                          ? `+${attr.value}%`
                          : attr.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === DetailTab.History && (
              <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Achievement History</h3>
                <div className="space-y-4">
                  {credential.achievementPath.map((milestone, index) => (
                    <div key={milestone.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center">
                          <span className="text-sm font-bold text-indigo-400">{index + 1}</span>
                        </div>
                        {index < credential.achievementPath.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-700 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="text-sm font-semibold text-white mb-1">
                          {milestone.title}
                        </div>
                        <div className="text-sm text-slate-400 mb-2">
                          {milestone.description}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{milestone.completedAt.toLocaleDateString()}</span>
                          {milestone.xpEarned && (
                            <span className="text-indigo-400">+{milestone.xpEarned} XP</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Credential Detail Page with Provider
 */
export default function CredentialDetailPage() {
  return (
    <CredentialDetailProvider>
      <CredentialDetailContent />
    </CredentialDetailProvider>
  );
}
