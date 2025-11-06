'use client';

/**
 * CryptoCheckoutModal Component
 * 
 * Animated modal with blockchain transaction steps.
 * Shows wallet connect -> sign -> confirm -> success flow.
 */

import React from 'react';
import { X, CheckCircle, AlertCircle, Loader2, ExternalLink, Copy } from 'lucide-react';
import { CryptoCheckoutModalProps, TransactionStep, getTransactionStepColor, getTransactionStepIcon, formatTransactionHash, formatWalletAddress } from '../../../types/marketplace-detail.types';

export const CryptoCheckoutModal: React.FC<CryptoCheckoutModalProps> = ({
  isOpen,
  onClose,
  skill,
  transactionState,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isProcessing = [
    TransactionStep.ConnectingWallet,
    TransactionStep.SigningTransaction,
    TransactionStep.ProcessingTransaction,
    TransactionStep.Confirming,
  ].includes(transactionState.step);

  const isSuccess = transactionState.step === TransactionStep.Success;
  const isFailed = transactionState.step === TransactionStep.Failed;
  const canClose = !isProcessing;

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        {canClose && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}

        {/* Animated Background Gradient */}
        <div
          className="absolute inset-0 opacity-10 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${getTransactionStepColor(transactionState.step)}40, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="relative p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            {/* Animated Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-4">
              {isProcessing && (
                <Loader2
                  className="w-10 h-10 animate-spin"
                  style={{ color: getTransactionStepColor(transactionState.step) }}
                />
              )}
              {isSuccess && (
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              )}
              {isFailed && (
                <AlertCircle className="w-10 h-10 text-red-400" />
              )}
              {transactionState.step === TransactionStep.Idle && (
                <span className="text-4xl">{getTransactionStepIcon(transactionState.step)}</span>
              )}
              {transactionState.step === TransactionStep.WalletConnected && (
                <CheckCircle className="w-10 h-10 text-cyan-400" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-white">
              {transactionState.step}
            </h2>
            
            {transactionState.error && (
              <p className="text-sm text-red-400">{transactionState.error}</p>
            )}
          </div>

          {/* Transaction Details */}
          {transactionState.step !== TransactionStep.Idle && transactionState.step !== TransactionStep.ConnectingWallet && (
            <div className="space-y-3 bg-slate-800/50 rounded-xl p-4">
              {/* Skill */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
                <img
                  src={skill.image}
                  alt={skill.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{skill.title}</p>
                  <p className="text-sm text-slate-400">by {skill.seller.name}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Skill Price</span>
                  <span className="text-white font-semibold">{skill.price.toFixed(2)} FLOW</span>
                </div>
                
                {transactionState.networkFee && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network Fee</span>
                    <span className="text-white">{transactionState.networkFee.toFixed(4)} FLOW</span>
                  </div>
                )}

                {transactionState.totalCost && (
                  <>
                    <div className="border-t border-slate-700 pt-2" />
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-white font-bold">{transactionState.totalCost.toFixed(4)} FLOW</span>
                    </div>
                  </>
                )}
              </div>

              {/* Wallet Address */}
              {transactionState.walletAddress && (
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Wallet Address</p>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg">
                    <code className="text-xs font-mono text-cyan-400 flex-1">
                      {formatWalletAddress(transactionState.walletAddress)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(transactionState.walletAddress!)}
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Transaction Hash */}
              {transactionState.transactionHash && (
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Transaction Hash</p>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg">
                    <code className="text-xs font-mono text-cyan-400 flex-1">
                      {formatTransactionHash(transactionState.transactionHash)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(transactionState.transactionHash!)}
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3 text-slate-400" />
                    </button>
                    <a
                      href={`https://polygonscan.com/tx/${transactionState.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transaction Steps Progress */}
          {isProcessing && (
            <div className="space-y-3">
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 animate-pulse"
                  style={{
                    width: (() => {
                      switch (transactionState.step) {
                        case TransactionStep.ConnectingWallet: return '25%';
                        case TransactionStep.SigningTransaction: return '50%';
                        case TransactionStep.ProcessingTransaction: return '75%';
                        case TransactionStep.Confirming: return '90%';
                        default: return '0%';
                      }
                    })(),
                  }}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { step: TransactionStep.ConnectingWallet, label: 'Connect' },
                  { step: TransactionStep.SigningTransaction, label: 'Sign' },
                  { step: TransactionStep.ProcessingTransaction, label: 'Process' },
                  { step: TransactionStep.Confirming, label: 'Confirm' },
                ].map((item, index) => {
                  const isActive = transactionState.step === item.step;
                  const isCompleted = Object.values(TransactionStep).indexOf(transactionState.step) > Object.values(TransactionStep).indexOf(item.step);
                  
                  return (
                    <div key={index} className="text-center">
                      <div
                        className={`w-2 h-2 rounded-full mx-auto mb-1 transition-all ${
                          isActive
                            ? 'bg-cyan-400 scale-125'
                            : isCompleted
                            ? 'bg-emerald-400'
                            : 'bg-slate-700'
                        }`}
                      />
                      <span className={isActive || isCompleted ? 'text-white' : 'text-slate-500'}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-2">
              <p className="text-sm text-emerald-400 font-semibold">🎉 Purchase Successful!</p>
              <p className="text-xs text-slate-300">
                Your skill credential has been minted and transferred to your wallet. You can now access all learning materials and display your verified credential.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {transactionState.step === TransactionStep.Idle && (
              <button
                onClick={onConfirm}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-cyan-500 transition-all"
              >
                Confirm Purchase
              </button>
            )}

            {isSuccess && (
              <>
                <button
                  onClick={() => window.location.href = '/dashboard/wallet'}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-cyan-500 transition-all"
                >
                  View in Wallet
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700 hover:text-white transition-all"
                >
                  Close
                </button>
              </>
            )}

            {isFailed && (
              <>
                <button
                  onClick={onConfirm}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-cyan-500 transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700 hover:text-white transition-all"
                >
                  Cancel
                </button>
              </>
            )}

            {isProcessing && (
              <p className="text-xs text-center text-slate-400">
                Please wait while we process your transaction...
              </p>
            )}
          </div>

          {/* Security Notice */}
          {transactionState.step === TransactionStep.SigningTransaction && (
            <div className="text-xs text-center text-slate-400 bg-slate-800/30 rounded-lg p-3">
              🔒 Please confirm the transaction in your wallet extension
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
