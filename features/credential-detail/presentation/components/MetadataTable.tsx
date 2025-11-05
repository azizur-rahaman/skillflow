'use client';

/**
 * Metadata Table Component
 * 
 * Displays credential metadata including blockchain data, token attributes,
 * and properties in a clean, copyable format.
 */

import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import {
  MetadataTableProps,
  getMetadataFields,
  formatBlockchainExplorerUrl,
} from '../../types/credential-detail.types';
import { CredentialCategory } from '@/features/wallet/types/wallet.types';

export const MetadataTable: React.FC<MetadataTableProps> = ({
  metadata,
  blockchainData,
  compact = false,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const metadataFields = getMetadataFields({
    tokenId: blockchainData.tokenId,
    contractAddress: blockchainData.contractAddress,
    standard: blockchainData.tokenStandard as any,
    name: metadata.name,
    description: metadata.description,
    category: CredentialCategory.SkillMastery,
    skillName: metadata.properties?.skill_name || 'Unknown',
    skillLevel: Number(metadata.properties?.skill_level || 0),
    imageUrl: metadata.image,
    metadata,
    amount: 1,
    verificationStatus: 'Verified' as any,
    issuer: {
      id: metadata.properties?.issued_by || 'unknown',
      name: metadata.properties?.issued_by || 'Unknown',
      verified: true,
      walletAddress: '0x',
      logo: '',
    },
    issuedAt: new Date(metadata.properties?.issued_at || Date.now()),
    expiresAt: metadata.properties?.expires_at ? new Date(metadata.properties.expires_at) : null,
    attributes: metadata.attributes || [],
    viewCount: 0,
    shareCount: 0,
    verificationCount: 0,
    blockchainData,
    relatedCredentials: [],
    achievementPath: [],
    displaySettings: {
      showInPublicProfile: true,
      allowVerification: true,
      showIssuerSignature: true,
      displaySize: 'large',
      backgroundColor: '#1E293B',
      borderColor: '#6366F1',
    },
  });

  const handleCopy = async (value: string | number | Date, label: string) => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatValue = (value: string | number | Date, type?: string): string => {
    const strValue = String(value);
    if (type === 'address') {
      return `${strValue.slice(0, 6)}...${strValue.slice(-4)}`;
    }
    return strValue;
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">
          Credential Metadata
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          On-chain and off-chain metadata for this credential
        </p>
      </div>

      {/* Metadata Fields */}
      <div className="divide-y divide-slate-700">
        {metadataFields.map((field, index) => (
          <div
            key={index}
            className="px-6 py-4 hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Label */}
              <div className="flex-shrink-0 w-1/3">
                <span className="text-sm font-medium text-slate-400">
                  {field.label}
                </span>
              </div>

              {/* Value */}
              <div className="flex-1 min-w-0">
                {field.clickable && field.href ? (
                  <a
                    href={field.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
                  >
                    <span className={field.type === 'address' ? 'font-mono' : ''}>
                      {formatValue(field.value, field.type)}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span className={`text-sm text-slate-200 ${
                    field.type === 'address' || field.type === 'link' ? 'font-mono' : ''
                  }`}>
                    {String(field.value)}
                  </span>
                )}
              </div>

              {/* Copy Button */}
              {field.copyable && (
                <button
                  onClick={() => handleCopy(field.value, field.label)}
                  className="flex-shrink-0 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  title={`Copy ${field.label}`}
                >
                  {copiedField === field.label ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Blockchain Explorer Links */}
      <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700">
        <div className="flex flex-wrap gap-3">
          <a
            href={formatBlockchainExplorerUrl(
              blockchainData.network,
              'tx',
              blockchainData.transactionHash
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">
              View Transaction
            </span>
          </a>

          <a
            href={formatBlockchainExplorerUrl(
              blockchainData.network,
              'address',
              blockchainData.contractAddress
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">
              View Contract
            </span>
          </a>

          {blockchainData.ipfsMetadataUrl && (
            <a
              href={blockchainData.ipfsMetadataUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">
                View on IPFS
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
