'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, X, FileText, ExternalLink } from 'lucide-react';
import { ConsentProvider, useConsent } from '@/features/privacy/context/ConsentContext';
import PermissionCard from '@/features/privacy/presentation/components/PermissionCard';
import TrustIndicators from '@/features/privacy/presentation/components/TrustIndicators';
import ConsentSummary from '@/features/privacy/presentation/components/ConsentSummary';

function ConsentScreenContent() {
  const router = useRouter();
  const {
    state,
    grantAllPermissions,
    denyAllOptionalPermissions,
    saveConsent,
  } = useConsent();
  const [isSaving, setIsSaving] = useState(false);

  const requiredPermissions = state.permissions.filter((p) => p.isRequired);
  const optionalPermissions = state.permissions.filter((p) => !p.isRequired);

  const allRequiredGranted = requiredPermissions.every(
    (p) => p.status === 'granted' || p.isRequired
  );

  const handleAcceptAll = () => {
    grantAllPermissions();
  };

  const handleDenyAll = () => {
    denyAllOptionalPermissions();
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveConsent();
    setIsSaving(false);
    // Redirect after consent
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="consent-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#consent-grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#22D3EE] rounded-full animate-pulse" />
              <span className="text-white/70 text-sm font-medium">
                Privacy & Data Control
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              Your Data, Your Control
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-2">
              We believe in transparency. Review and customize how we use your
              data to provide the best SkillFlow experience.
            </p>
            <p className="text-white/50 text-sm">
              You can change these preferences anytime in Settings.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mb-12">
            <TrustIndicators />
          </div>

          {/* Consent Summary */}
          <ConsentSummary />

          {/* Required Permissions */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <h2 className="text-white font-semibold text-xl">
                Essential Permissions
              </h2>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <p className="text-white/50 text-sm text-center mb-6">
              These permissions are required for SkillFlow to function properly
            </p>
            <div className="space-y-4">
              {requiredPermissions.map((permission) => (
                <PermissionCard key={permission.id} permission={permission} />
              ))}
            </div>
          </div>

          {/* Optional Permissions */}
          {optionalPermissions.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <h2 className="text-white font-semibold text-xl">
                  Optional Permissions
                </h2>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-white/50 text-sm">
                  Customize your experience with these optional features
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="text-[#22D3EE] hover:text-[#4F46E5] text-sm font-medium transition-colors"
                  >
                    Accept All
                  </button>
                  <span className="text-white/30">|</span>
                  <button
                    onClick={handleDenyAll}
                    className="text-white/40 hover:text-white/60 text-sm font-medium transition-colors"
                  >
                    Deny All
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {optionalPermissions.map((permission) => (
                  <PermissionCard key={permission.id} permission={permission} />
                ))}
              </div>
            </div>
          )}

          {/* Legal Links */}
          <div className="mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#A855F7]" />
              <h3 className="text-white font-semibold">Legal Documents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/legal/privacy-policy"
                target="_blank"
                className="
                  flex items-center justify-between
                  p-4 rounded-xl
                  bg-white/5 border border-white/10
                  hover:border-white/20 hover:bg-white/10
                  transition-all duration-200
                  group
                "
              >
                <span className="text-white/80 text-sm">Privacy Policy</span>
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-[#22D3EE] transition-colors" />
              </a>
              <a
                href="/legal/terms-of-service"
                target="_blank"
                className="
                  flex items-center justify-between
                  p-4 rounded-xl
                  bg-white/5 border border-white/10
                  hover:border-white/20 hover:bg-white/10
                  transition-all duration-200
                  group
                "
              >
                <span className="text-white/80 text-sm">Terms of Service</span>
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-[#22D3EE] transition-colors" />
              </a>
              <a
                href="/legal/data-processing"
                target="_blank"
                className="
                  flex items-center justify-between
                  p-4 rounded-xl
                  bg-white/5 border border-white/10
                  hover:border-white/20 hover:bg-white/10
                  transition-all duration-200
                  group
                "
              >
                <span className="text-white/80 text-sm">
                  Data Processing Agreement
                </span>
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-[#22D3EE] transition-colors" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="
                flex items-center gap-2
                px-6 py-3
                bg-white/5 border border-white/20
                text-white/60
                rounded-xl
                hover:bg-white/10 hover:border-white/30 hover:text-white/80
                transition-all duration-200
              "
            >
              <X className="w-4 h-4" />
              Cancel
            </button>

            <div className="flex items-center gap-4">
              {/* Permission Summary */}
              <div className="text-sm text-white/50">
                {state.permissions.filter((p) => p.status === "granted").length}{" "}
                of {state.permissions.length} permissions granted
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={!allRequiredGranted || isSaving}
                className={`
                  flex items-center gap-2
                  px-8 py-3
                  font-semibold rounded-xl
                  transition-all duration-200
                  ${
                    allRequiredGranted && !isSaving
                      ? "bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#22D3EE] text-white shadow-lg shadow-[#4F46E5]/30 hover:opacity-90"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }
                `}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Continue to SkillFlow
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-white/40 text-xs mt-8">
            By continuing, you agree to our Terms of Service and acknowledge
            that you&apos;ve read our Privacy Policy.
            <br />
            Last updated: November 5, 2025
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConsentPage() {
  const router = useRouter();

  const handleComplete = () => {
    console.log('Consent saved successfully');
    router.push('/dashboard');
  };

  return (
    <ConsentProvider onComplete={handleComplete}>
      <ConsentScreenContent />
    </ConsentProvider>
  );
}
