'use client';

/**
 * Evidence Verification Step
 * 
 * Step 2: Upload and verify evidence for credential minting.
 */

import React, { useState } from 'react';
import { Upload, File, Check, X, Loader2, Shield, ExternalLink, AlertCircle } from 'lucide-react';
import {
  EvidenceVerificationProps,
  EvidenceType,
  EvidenceStatus,
  getEvidenceTypeIcon,
  getEvidenceTypeColor,
  formatFileSize,
  validateEvidenceRequirements,
  calculateEvidenceCompletion,
} from '../../types/minting.types';

export const EvidenceVerification: React.FC<EvidenceVerificationProps> = ({
  skill,
  evidence,
  requirements,
  onAddEvidence,
  onRemoveEvidence,
  onVerifyEvidence,
  loading = false,
}) => {
  const [selectedType, setSelectedType] = useState<EvidenceType>(EvidenceType.Project);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const validation = validateEvidenceRequirements(evidence, requirements);
  const completion = calculateEvidenceCompletion(evidence, requirements);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!url && !description)) return;

    setUploading(true);
    try {
      await onAddEvidence({
        type: selectedType,
        title,
        description,
        url: url || undefined,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setUrl('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Verify Your Evidence
        </h2>
        <p className="text-slate-400">
          Upload proof of your {skill.name} mastery to mint your credential
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Evidence Completion</span>
          <span className="text-sm font-bold text-indigo-400">{Math.round(completion)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Requirements */}
      <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Required Evidence</h3>
        </div>
        <div className="space-y-2">
          {requirements.map((req, index) => {
            const submitted = evidence.filter(e => e.type === req.type).length;
            const required = req.minCount || 1;
            const isSatisfied = !req.required || submitted >= required;

            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {isSatisfied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-slate-300">
                    {getEvidenceTypeIcon(req.type)} {req.type}
                  </span>
                  {req.required && (
                    <span className="text-xs text-red-400">*Required</span>
                  )}
                </div>
                <span className={isSatisfied ? 'text-emerald-400' : 'text-slate-500'}>
                  {submitted}/{required}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Form */}
      <div className="p-6 bg-slate-900 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Add Evidence</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Evidence Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Evidence Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(EvidenceType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedType === type
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                  style={{
                    borderColor: selectedType === type ? getEvidenceTypeColor(type) : undefined,
                    backgroundColor: selectedType === type ? `${getEvidenceTypeColor(type)}20` : undefined,
                  }}
                >
                  <div className="text-2xl mb-1">{getEvidenceTypeIcon(type)}</div>
                  <div className="text-xs text-slate-300">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React E-commerce Project"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your evidence..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              URL (optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !title || !description}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Add Evidence
              </>
            )}
          </button>
        </form>
      </div>

      {/* Evidence List */}
      {evidence.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Submitted Evidence</h3>
          {evidence.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-900 rounded-xl border border-slate-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {/* Type Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${getEvidenceTypeColor(item.type)}20` }}
                  >
                    {getEvidenceTypeIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {item.title}
                      </h4>
                      {item.status === EvidenceStatus.Verified && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-xs text-emerald-400">Verified</span>
                        </div>
                      )}
                      {item.status === EvidenceStatus.Verifying && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">
                          <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                          <span className="text-xs text-blue-400">Verifying...</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{item.description}</p>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Evidence
                      </a>
                    )}
                    {item.verificationNotes && (
                      <p className="text-xs text-slate-500 mt-2">
                        {item.verificationNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {item.status === EvidenceStatus.Pending && (
                    <button
                      onClick={() => onVerifyEvidence(item.id)}
                      className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/20 transition-colors"
                      title="Verify evidence"
                    >
                      <Shield className="w-4 h-4 text-indigo-400" />
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveEvidence(item.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-colors"
                    title="Remove evidence"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validation Message */}
      {!validation.valid && evidence.length > 0 && (
        <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-amber-400 mb-1">
                Additional Evidence Required
              </div>
              <div className="text-xs text-amber-400/80">
                Please add the following required evidence types:
              </div>
              <ul className="mt-2 space-y-1">
                {validation.missing.map((req, index) => (
                  <li key={index} className="text-xs text-amber-400/80">
                    • {req.type} - {req.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
