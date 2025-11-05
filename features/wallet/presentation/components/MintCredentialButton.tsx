'use client';

/**
 * MintCredentialButton Component
 * 
 * Gradient glow button that opens minting modal for creating new credentials.
 * Web3-style with blockchain aesthetic.
 */

import React, { useState } from 'react';
import { Sparkles, X, Loader2, Trophy, GraduationCap, CheckCircle, Award, Star, ThumbsUp } from 'lucide-react';
import {
  MintCredentialButtonProps,
  MintCredentialRequest,
  CredentialCategory,
  GasEstimate,
  formatUSD,
  formatGasFee,
} from '../../types/wallet.types';

export const MintCredentialButton: React.FC<MintCredentialButtonProps> = ({
  onMint,
  disabled = false,
  loading = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [minting, setMinting] = useState(false);
  const [formData, setFormData] = useState<Partial<MintCredentialRequest>>({
    category: CredentialCategory.SkillMastery,
    skillLevel: 75,
  });
  const [gasEstimate, setGasEstimate] = useState<GasEstimate>({
    gasLimit: '150000',
    maxFeePerGas: '35',
    maxPriorityFeePerGas: '2',
    estimatedCost: '0.00525',
    estimatedCostUSD: 0.0045,
    estimatedTime: 15,
  });

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!minting) {
      setModalOpen(false);
      setFormData({
        category: CredentialCategory.SkillMastery,
        skillLevel: 75,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.skillId || !formData.skillName) {
      return;
    }

    try {
      setMinting(true);
      await onMint(formData as MintCredentialRequest);
      handleCloseModal();
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setMinting(false);
    }
  };

  return (
    <>
      {/* Mint button */}
      <button
        onClick={handleOpenModal}
        disabled={disabled || loading}
        className="relative group px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{
          background: 'linear-gradient(135deg, #6366F1, #A855F7)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #6366F1, transparent 70%)',
          }}
        />

        <div className="relative flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Mint Credential</span>
            </>
          )}
        </div>
      </button>

      {/* Minting modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-2xl opacity-20 blur-2xl"
              style={{
                background: 'radial-gradient(circle at 50% 0%, #6366F1, transparent 70%)',
              }}
            />

            {/* Content */}
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Mint Credential</h3>
                    <p className="text-sm text-muted-foreground">
                      Create on-chain skill credential
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  disabled={minting}
                  className="p-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Skill ID */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Skill ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.skillId || ''}
                    onChange={(e) => setFormData({ ...formData, skillId: e.target.value })}
                    placeholder="e.g., react-js"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                    disabled={minting}
                  />
                </div>

                {/* Skill Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Skill Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.skillName || ''}
                    onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                    placeholder="e.g., React.js"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                    disabled={minting}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CredentialCategory })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                    disabled={minting}
                  >
                    {Object.values(CredentialCategory).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Skill Level */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Skill Level: {formData.skillLevel}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({ ...formData, skillLevel: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary"
                    disabled={minting}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your skill..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    disabled={minting}
                  />
                </div>

                {/* Gas estimate */}
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">Gas Estimate</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {formatGasFee(gasEstimate.estimatedCost)} MATIC
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ≈ {formatUSD(gasEstimate.estimatedCostUSD)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Estimated time: ~{gasEstimate.estimatedTime}s</span>
                    <span>Network: Polygon</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={minting}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={minting || !formData.skillId || !formData.skillName}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                      boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    {minting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Minting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Mint Now</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
