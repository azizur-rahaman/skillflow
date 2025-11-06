'use client';

/**
 * Marketplace Skill Detail Context
 * 
 * State management for marketplace skill detail page with crypto checkout.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  MarketplaceSkillDetail,
  MarketplaceSkillDetailContextState,
  MarketplaceDetailTab,
  TransactionState,
  TransactionStep,
  WalletInfo,
  IssuerCredential,
  Review,
  ReviewStats,
  RelatedSkill,
} from '../types/marketplace-detail.types';
import { SkillCategory, ListingStatus } from '../types/marketplace.types';

// ============================================================================
// Context
// ============================================================================

const MarketplaceSkillDetailContext = createContext<MarketplaceSkillDetailContextState | undefined>(
  undefined
);

// ============================================================================
// Provider
// ============================================================================

interface MarketplaceSkillDetailProviderProps {
  children: ReactNode;
  skillId?: string;
}

export const MarketplaceSkillDetailProvider: React.FC<MarketplaceSkillDetailProviderProps> = ({
  children,
  skillId: initialSkillId,
}) => {
  // State
  const [skill, setSkill] = useState<MarketplaceSkillDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MarketplaceDetailTab>(MarketplaceDetailTab.Description);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [transactionState, setTransactionState] = useState<TransactionState>({
    step: TransactionStep.Idle,
  });
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [inCart, setInCart] = useState(false);

  // Mock data - Replace with API call
  const getMockSkillDetail = useCallback((id: string): MarketplaceSkillDetail => {
    const mockIssuer: IssuerCredential = {
      id: 'issuer-1',
      organizationName: 'Tech Academy Pro',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
      website: 'https://techacademy.pro',
      description: 'Leading provider of professional technology certifications and skill credentials. Recognized globally for excellence in tech education.',
      establishedYear: 2015,
      totalCredentialsIssued: 45823,
      verificationLevel: 'Premium',
      accreditations: [
        {
          id: 'acc-1',
          name: 'ISO 9001:2015 Certified',
          issuedBy: 'International Organization for Standardization',
          issuedDate: new Date('2022-01-15'),
          expiryDate: new Date('2025-01-15'),
          verificationUrl: 'https://verify.iso.org',
          logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop',
        },
        {
          id: 'acc-2',
          name: 'ACE Accredited Provider',
          issuedBy: 'American Council on Education',
          issuedDate: new Date('2020-06-01'),
          logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop',
        },
      ],
      email: 'contact@techacademy.pro',
      location: 'San Francisco, CA',
      followers: 12543,
      rating: 4.8,
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      verified: true,
    };

    const mockReviews: Review[] = [
      {
        id: 'rev-1',
        userId: 'user-1',
        userName: 'Alex Thompson',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        userWallet: '0x123...abc',
        rating: 5,
        title: 'Excellent certification, highly recommended!',
        comment: 'This React certification has transformed my career. The comprehensive curriculum and hands-on projects gave me the confidence to tackle enterprise-level applications. Worth every penny!',
        createdAt: new Date('2024-10-15'),
        helpful: 24,
        verified: true,
        userLevel: 'Expert',
        userBadge: 'Early Adopter',
      },
      {
        id: 'rev-2',
        userId: 'user-2',
        userName: 'Sarah Chen',
        userAvatar: 'https://i.pravatar.cc/150?img=2',
        userWallet: '0x456...def',
        rating: 4,
        title: 'Great content, minor improvements needed',
        comment: 'Solid certification with excellent project examples. The video tutorials are clear and well-structured. Would love to see more advanced hooks patterns covered.',
        createdAt: new Date('2024-10-28'),
        helpful: 12,
        verified: true,
        userLevel: 'Advanced',
      },
      {
        id: 'rev-3',
        userId: 'user-3',
        userName: 'Marcus Rodriguez',
        userAvatar: 'https://i.pravatar.cc/150?img=3',
        userWallet: '0x789...ghi',
        rating: 5,
        title: 'Best investment in my learning journey',
        comment: 'The blockchain-verified certificate adds real credibility. Employers recognize this credential, and it helped me land my current role as a Senior React Developer.',
        createdAt: new Date('2024-11-01'),
        helpful: 18,
        verified: true,
        userLevel: 'Expert',
        userBadge: 'Top Contributor',
      },
    ];

    const mockStats: ReviewStats = {
      averageRating: 4.8,
      totalReviews: 234,
      distribution: {
        5: 189,
        4: 32,
        3: 8,
        2: 3,
        1: 2,
      },
      verifiedPurchaseCount: 234,
    };

    const mockRelatedSkills: RelatedSkill[] = [
      {
        id: 'skill-2',
        title: 'Advanced TypeScript',
        category: SkillCategory.Development,
        price: 55,
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
        rating: 4.7,
      },
      {
        id: 'skill-3',
        title: 'Next.js Mastery',
        category: SkillCategory.Development,
        price: 65,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        rating: 4.9,
      },
      {
        id: 'skill-4',
        title: 'State Management with Redux',
        category: SkillCategory.Development,
        price: 40,
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
        rating: 4.6,
      },
    ];

    return {
      id: 'skill-1',
      tokenId: 'TKN-000123',
      title: 'React.js Expert Certification',
      description: 'Master modern React development with hooks, context, and advanced patterns',
      fullDescription: `Master the art of building modern, scalable web applications with React.js. This comprehensive certification program covers everything from React fundamentals to advanced architectural patterns used in enterprise applications.

**What You'll Master:**
• Deep understanding of React's component lifecycle and rendering optimization
• Advanced hooks patterns including custom hooks and useReducer
• State management strategies with Context API and modern alternatives
• Performance optimization techniques and profiling
• Testing strategies with Jest and React Testing Library
• Real-world application architecture and best practices

**Program Highlights:**
✓ 40+ hours of video content
✓ 15 hands-on projects
✓ Code reviews by senior React developers
✓ Lifetime access to course materials
✓ Blockchain-verified certificate of completion
✓ Job placement assistance

This certification is recognized by leading tech companies and demonstrates your expertise in building production-ready React applications.`,
      category: SkillCategory.Development,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
      price: 45,
      priceUSD: 67.50,
      seller: {
        id: 'seller-1',
        name: 'Tech Academy Pro',
        avatar: mockIssuer.logo,
        walletAddress: mockIssuer.walletAddress,
        rating: mockIssuer.rating,
        totalSales: 456,
        memberSince: new Date('2020-03-15'),
        verified: mockIssuer.verified,
      },
      rating: 4.8,
      totalReviews: 234,
      totalPurchases: 456,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-11-03'),
      status: ListingStatus.Active,
      tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'Hooks', 'Components'],
      level: 'Advanced',
      duration: '3-4 months',
      
      // Extended fields
      learningOutcomes: [
        'Build complex, production-ready React applications',
        'Master React hooks and create custom hooks',
        'Implement advanced state management patterns',
        'Optimize application performance and bundle size',
        'Write comprehensive unit and integration tests',
        'Apply best practices for component architecture',
      ],
      prerequisites: [
        'Solid understanding of JavaScript (ES6+)',
        'Basic knowledge of HTML and CSS',
        'Familiarity with npm and package management',
        'Git version control basics',
      ],
      skillDomain: 'Web Development / Frontend Engineering',
      certificationType: 'Professional Certification',
      validityPeriod: 'Lifetime',
      
      issuer: mockIssuer,
      reviews: mockReviews,
      reviewStats: mockStats,
      
      tokenStandard: 'ERC-1155',
      contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3',
      mintedDate: new Date('2024-01-15'),
      totalSupply: 1000,
      circulatingSupply: 456,
      
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sampleCertificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
      relatedSkills: mockRelatedSkills,
    };
  }, []);

  // Fetch skill detail
  const fetchSkillDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const skillData = getMockSkillDetail(id);
      setSkill(skillData);
    } catch (err) {
      setError('Failed to load skill details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getMockSkillDetail]);

  // Tab management
  const handleSetActiveTab = useCallback((tab: MarketplaceDetailTab) => {
    setActiveTab(tab);
  }, []);

  // Purchase actions
  const buyNow = useCallback(async () => {
    if (!skill) return;
    
    setIsPurchasing(true);
    setShowCheckoutModal(true);
    
    // Auto-start checkout flow if wallet is connected
    if (wallet?.connected) {
      await confirmPurchase();
    }
  }, [skill, wallet]);

  const addToCart = useCallback(() => {
    if (!skill) return;
    
    setInCart(true);
    // In real app, add to cart context
    console.log('Added to cart:', skill.title);
  }, [skill]);

  // Checkout actions
  const openCheckout = useCallback(() => {
    setShowCheckoutModal(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setShowCheckoutModal(false);
    setTransactionState({ step: TransactionStep.Idle });
    setIsPurchasing(false);
  }, []);

  const confirmPurchase = useCallback(async () => {
    if (!skill) return;
    
    try {
      setIsPurchasing(true);
      
      // Step 1: Connect wallet if not connected
      if (!wallet?.connected) {
        setTransactionState({ step: TransactionStep.ConnectingWallet });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Simulate wallet connection
        const mockWallet: WalletInfo = {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3',
          balance: 150.5,
          balanceUSD: 225.75,
          connected: true,
          provider: 'MetaMask',
        };
        setWallet(mockWallet);
        setTransactionState({
          step: TransactionStep.WalletConnected,
          walletAddress: mockWallet.address,
        });
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      
      // Step 2: Sign transaction
      setTransactionState({
        step: TransactionStep.SigningTransaction,
        walletAddress: wallet?.address || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3',
        estimatedGas: '0.002 FLOW',
        networkFee: 0.002,
        totalCost: skill.price + 0.002,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Step 3: Process transaction
      setTransactionState((prev) => ({
        ...prev,
        step: TransactionStep.ProcessingTransaction,
      }));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Step 4: Confirm on blockchain
      const txHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setTransactionState((prev) => ({
        ...prev,
        step: TransactionStep.Confirming,
        transactionHash: txHash,
      }));
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Step 5: Success
      setTransactionState((prev) => ({
        ...prev,
        step: TransactionStep.Success,
      }));
      
      // Remove from cart if was in cart
      setInCart(false);
      
    } catch (err) {
      setTransactionState({
        step: TransactionStep.Failed,
        error: 'Transaction failed. Please try again.',
      });
      console.error(err);
    } finally {
      setIsPurchasing(false);
    }
  }, [skill, wallet]);

  // Wallet actions
  const connectWallet = useCallback(async () => {
    setTransactionState({ step: TransactionStep.ConnectingWallet });
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockWallet: WalletInfo = {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3',
        balance: 150.5,
        balanceUSD: 225.75,
        connected: true,
        provider: 'MetaMask',
      };
      
      setWallet(mockWallet);
      setTransactionState({ step: TransactionStep.WalletConnected, walletAddress: mockWallet.address });
    } catch (err) {
      setTransactionState({ step: TransactionStep.Failed, error: 'Failed to connect wallet' });
      console.error(err);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setTransactionState({ step: TransactionStep.Idle });
  }, []);

  // Review actions
  const submitReview = useCallback(async (rating: number, title: string, comment: string) => {
    if (!skill) return;
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Review submitted:', { rating, title, comment });
      // In real app, refresh skill data
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  }, [skill]);

  const markReviewHelpful = useCallback(async (reviewId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      console.log('Marked review as helpful:', reviewId);
      // In real app, update review helpful count
    } catch (err) {
      console.error('Failed to mark review as helpful:', err);
    }
  }, []);

  // Context value
  const value: MarketplaceSkillDetailContextState = {
    skill,
    loading,
    error,
    activeTab,
    isPurchasing,
    showCheckoutModal,
    transactionState,
    wallet,
    inCart,
    fetchSkillDetail,
    setActiveTab: handleSetActiveTab,
    buyNow,
    addToCart,
    openCheckout,
    closeCheckout,
    confirmPurchase,
    connectWallet,
    disconnectWallet,
    submitReview,
    markReviewHelpful,
  };

  return (
    <MarketplaceSkillDetailContext.Provider value={value}>
      {children}
    </MarketplaceSkillDetailContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

export const useMarketplaceSkillDetail = (): MarketplaceSkillDetailContextState => {
  const context = useContext(MarketplaceSkillDetailContext);
  
  if (context === undefined) {
    throw new Error(
      'useMarketplaceSkillDetail must be used within a MarketplaceSkillDetailProvider'
    );
  }
  
  return context;
};
