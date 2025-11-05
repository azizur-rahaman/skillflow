'use client';

import { useState } from 'react';
import RegisterForm from '@/features/auth/presentation/components/RegisterForm';
import UserTypeSelector from '@/features/auth/presentation/components/UserTypeSelector';

type UserType = 'individual' | 'enterprise' | 'university';

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
    setTimeout(() => setStep(2), 300);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-12 px-4">
      {/* AI Neural Network Background */}
      <div className="absolute inset-0 bg-[#0F172A] z-0">
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 20% 30%, #4F46E5 0%, transparent 50%), radial-gradient(circle at 80% 70%, #A855F7 0%, transparent 50%)',
          }}
        />
        
        {/* Neural Network Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-register" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="1" fill="#22D3EE" opacity="0.3" />
                <line x1="0" y1="25" x2="50" y2="25" stroke="#4F46E5" strokeWidth="0.5" opacity="0.2" />
                <line x1="25" y1="0" x2="25" y2="50" stroke="#A855F7" strokeWidth="0.5" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-register)" />
          </svg>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle-float absolute rounded-full"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? '#4F46E5' : i % 3 === 1 ? '#A855F7' : '#22D3EE',
                opacity: 0.2,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            {/* Logo Icon */}
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 120 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M30 30 Q45 60, 30 90" 
                stroke="url(#registerGradient1)" 
                strokeWidth="6" 
                fill="none"
                strokeLinecap="round"
              />
              <path 
                d="M90 30 Q75 60, 90 90" 
                stroke="url(#registerGradient2)" 
                strokeWidth="6" 
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="30" cy="45" r="5" fill="#22D3EE" />
              <circle cx="90" cy="45" r="5" fill="#A855F7" />
              <circle cx="30" cy="75" r="5" fill="#4F46E5" />
              <circle cx="90" cy="75" r="5" fill="#22D3EE" />
              
              <defs>
                <linearGradient id="registerGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
                <linearGradient id="registerGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Brand Name */}
            <span 
              className="text-2xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              SkillFlow
            </span>
          </div>
        </div>

        {/* Progressive Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-3">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                transition-all duration-300
                ${step >= 1 ? 'bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] text-white' : 'bg-white/10 text-white/40'}
              `}>
                {step > 1 ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : '1'}
              </div>
              <span className="ml-2 text-sm font-medium text-white/80">User Type</span>
            </div>

            {/* Connector */}
            <div className={`
              w-16 h-1 rounded-full transition-all duration-300
              ${step >= 2 ? 'bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]' : 'bg-white/10'}
            `} />

            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                transition-all duration-300
                ${step >= 2 ? 'bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] text-white' : 'bg-white/10 text-white/40'}
              `}>
                2
              </div>
              <span className="ml-2 text-sm font-medium text-white/80">Account Details</span>
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Step 1: User Type Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Choose Your Path
                </h1>
                <p className="text-white/60 text-sm">
                  Select the option that best describes you
                </p>
              </div>

              <UserTypeSelector 
                selectedType={selectedUserType}
                onSelect={handleUserTypeSelect}
              />
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && selectedUserType && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create Your Account
                </h1>
                <p className="text-white/60 text-sm">
                  {selectedUserType === 'individual' && 'Start your skill evolution journey'}
                  {selectedUserType === 'enterprise' && 'Transform your workforce intelligence'}
                  {selectedUserType === 'university' && 'Empower the next generation'}
                </p>
              </div>

              <RegisterForm 
                userType={selectedUserType}
                onBack={handleBack}
              />
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center space-x-6 text-xs text-white/40">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure SSL</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>Privacy First</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-[#22D3EE] hover:text-[#4F46E5] font-medium transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
