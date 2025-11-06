'use client';

/**
 * PurchasePanel Component
 * 
 * Right sidebar with price, buy button, token info, and add to cart.
 */

import React from 'react';
import { ShoppingCart, Zap, Shield, Award, TrendingUp, Users } from 'lucide-react';
import { PurchasePanelProps } from '../../../types/marketplace-detail.types';
import { getCategoryColor } from '../../../types/marketplace.types';
import { getRemainingSupply, getSupplyPercentage } from '../../../types/marketplace-detail.types';

export const PurchasePanel: React.FC<PurchasePanelProps> = ({
  skill,
  onBuyNow,
  onAddToCart,
  inCart,
  isPurchasing,
}) => {
  const categoryColor = getCategoryColor(skill.category);
  const remainingSupply = getRemainingSupply(skill);
  const supplyPercentage = getSupplyPercentage(skill);

  return (
    <div className="sticky top-6 space-y-6">
      {/* Main Purchase Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        {/* Price Section */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {skill.price.toFixed(2)}
                </span>
                <span className="text-lg font-semibold text-cyan-400">FLOW</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                ≈ ${skill.priceUSD.toFixed(2)} USD
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+12%</span>
              </div>
              <p className="text-xs text-slate-500">this month</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 space-y-3">
          {/* Buy Now Button */}
          <button
            onClick={onBuyNow}
            disabled={isPurchasing || remainingSupply === 0}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
            }}
          >
            {/* Glow Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${categoryColor}40, transparent 70%)`,
              }}
            />
            
            <div className="relative flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              <span>
                {isPurchasing ? 'Processing...' : remainingSupply === 0 ? 'Sold Out' : 'Buy Now'}
              </span>
            </div>
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={onAddToCart}
            disabled={inCart || remainingSupply === 0}
            className="w-full py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl font-medium text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
          </button>
        </div>

        {/* Supply Info */}
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Available</span>
            <span className="font-semibold text-white">
              {remainingSupply} / {skill.totalSupply}
            </span>
          </div>
          
          {/* Supply Bar */}
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: `${supplyPercentage}%`,
                background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}aa)`,
              }}
            />
          </div>
          
          {supplyPercentage > 80 && (
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Limited supply - {remainingSupply} left!</span>
            </p>
          )}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">What's Included</h3>
        
        <div className="space-y-3">
          {/* Blockchain Verified */}
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: `${categoryColor}20` }}
            >
              <Shield className="w-4 h-4" style={{ color: categoryColor }} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Blockchain Verified</p>
              <p className="text-xs text-slate-400">
                Secure NFT credential on Polygon network
              </p>
            </div>
          </div>

          {/* Lifetime Access */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Lifetime Access</p>
              <p className="text-xs text-slate-400">
                {skill.validityPeriod || 'Permanent credential'}
              </p>
            </div>
          </div>

          {/* Community */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Global Recognition</p>
              <p className="text-xs text-slate-400">
                Accepted by {skill.totalPurchases}+ professionals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Token Info */}
      <div className="bg-slate-900/30 rounded-2xl border border-slate-800/50 p-6 space-y-3">
        <h3 className="text-sm font-semibold text-white">Token Information</h3>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Token Standard</span>
            <code className="font-mono text-cyan-400">{skill.tokenStandard}</code>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">Contract</span>
            <code className="font-mono text-cyan-400">
              {skill.contractAddress.substring(0, 6)}...{skill.contractAddress.substring(38)}
            </code>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">Minted</span>
            <span className="text-slate-300">
              {skill.mintedDate.toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400">Certification Type</span>
            <span className="text-slate-300">{skill.certificationType}</span>
          </div>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="text-center p-4 bg-slate-900/30 rounded-xl border border-slate-800/50">
        <p className="text-xs text-slate-400">
          🔒 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};
