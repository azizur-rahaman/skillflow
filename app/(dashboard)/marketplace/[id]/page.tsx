'use client';

/**
 * Marketplace Skill Detail Page
 * 
 * Comprehensive skill token detail page with large banner, purchase panel,
 * tabs for description/reviews/issuer, and crypto checkout modal.
 */

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { MarketplaceSkillDetailProvider, useMarketplaceSkillDetail } from '@/features/marketplace/context/MarketplaceSkillDetailContext';
import {
  SkillBanner,
  PurchasePanel,
  TabsSection,
  CryptoCheckoutModal,
} from '@/features/marketplace/presentation/components/detail';

/**
 * Skill Detail Content Component
 */
const SkillDetailContent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const skillId = params.id as string;

  const {
    skill,
    loading,
    error,
    activeTab,
    isPurchasing,
    showCheckoutModal,
    transactionState,
    inCart,
    fetchSkillDetail,
    setActiveTab,
    buyNow,
    addToCart,
    closeCheckout,
    confirmPurchase,
  } = useMarketplaceSkillDetail();

  // Fetch skill detail on mount
  useEffect(() => {
    if (skillId) {
      fetchSkillDetail(skillId);
    }
  }, [skillId, fetchSkillDetail]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
          <p className="text-slate-400">Loading skill details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Skill</h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No skill found
  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
            <span className="text-3xl">🔍</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Skill Not Found
            </h2>
            <p className="text-slate-400 mb-4">
              The skill you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <button
              onClick={() => router.push("/marketplace")}
              className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <SkillBanner
          skill={skill}
          onBack={() => router.push('/marketplace')}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs Section */}
            <TabsSection
              skill={skill}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Right Column - Purchase Panel */}
          <div className="lg:col-span-1">
            <PurchasePanel
              skill={skill}
              onBuyNow={buyNow}
              onAddToCart={addToCart}
              inCart={inCart}
              isPurchasing={isPurchasing}
            />
          </div>
        </div>
      </div>

      {/* Crypto Checkout Modal */}
      <CryptoCheckoutModal
        isOpen={showCheckoutModal}
        onClose={closeCheckout}
        skill={skill}
        transactionState={transactionState}
        onConfirm={confirmPurchase}
      />
    </div>
  );
};

/**
 * Main Page Component with Provider
 */
export default function SkillDetailPage() {
  return (
    <MarketplaceSkillDetailProvider>
      <SkillDetailContent />
    </MarketplaceSkillDetailProvider>
  );
}
