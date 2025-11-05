'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Building2, ArrowLeft } from 'lucide-react';

type UserType = 'individual' | 'enterprise' | 'university';

interface RegisterFormProps {
  userType: UserType;
  onBack: () => void;
}

export default function RegisterForm({ userType, onBack }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (userType !== 'individual' && !formData.organizationName.trim()) {
      newErrors.organizationName = `${userType === 'enterprise' ? 'Company' : 'University'} name is required`;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit logic (to be implemented)
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Register:', { ...formData, userType });
      setIsLoading(false);
    }, 1500);
  };

  const isEnterprise = userType === 'enterprise' || userType === 'university';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-sm text-white/60 hover:text-white/80 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Change user type
      </button>

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
          {isEnterprise ? 'Your Name' : 'Full Name'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-white/40" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className={`
              w-full pl-12 pr-4 py-3
              bg-white/5 border rounded-xl
              text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent
              transition-all duration-200
              ${errors.name ? 'border-red-500' : 'border-white/20'}
            `}
            placeholder="Enter your full name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </div>
        {errors.name && (
          <p id="name-error" className="mt-2 text-sm text-red-400" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Organization Name (for Enterprise/University) */}
      {isEnterprise && (
        <div>
          <label htmlFor="organizationName" className="block text-sm font-medium text-white/80 mb-2">
            {userType === 'enterprise' ? 'Company Name' : 'University Name'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="organizationName"
              name="organizationName"
              type="text"
              required
              value={formData.organizationName}
              onChange={handleChange}
              className={`
                w-full pl-12 pr-4 py-3
                bg-white/5 border rounded-xl
                text-white placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent
                transition-all duration-200
                ${errors.organizationName ? 'border-red-500' : 'border-white/20'}
              `}
              placeholder={`Enter ${userType === 'enterprise' ? 'company' : 'university'} name`}
              aria-invalid={errors.organizationName ? 'true' : 'false'}
              aria-describedby={errors.organizationName ? 'organization-error' : undefined}
            />
          </div>
          {errors.organizationName && (
            <p id="organization-error" className="mt-2 text-sm text-red-400" role="alert">
              {errors.organizationName}
            </p>
          )}
        </div>
      )}

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-white/40" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`
              w-full pl-12 pr-4 py-3
              bg-white/5 border rounded-xl
              text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent
              transition-all duration-200
              ${errors.email ? 'border-red-500' : 'border-white/20'}
            `}
            placeholder="you@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-red-400" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-white/40" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className={`
              w-full pl-12 pr-12 py-3
              bg-white/5 border rounded-xl
              text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent
              transition-all duration-200
              ${errors.password ? 'border-red-500' : 'border-white/20'}
            `}
            placeholder="At least 8 characters"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-2 text-sm text-red-400" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-white/40" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`
              w-full pl-12 pr-12 py-3
              bg-white/5 border rounded-xl
              text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent
              transition-all duration-200
              ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'}
            `}
            placeholder="Re-enter your password"
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="mt-2 text-sm text-red-400" role="alert">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div>
        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="h-4 w-4 mt-0.5 rounded border-white/20 bg-white/5 text-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE] focus:ring-offset-0"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-white/60">
            I agree to the{' '}
            <a href="/terms" className="text-[#22D3EE] hover:text-[#4F46E5] transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-[#22D3EE] hover:text-[#4F46E5] transition-colors">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="mt-2 text-sm text-red-400" role="alert">
            {errors.terms}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          w-full py-3 px-4
          bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#22D3EE]
          text-white font-semibold rounded-xl
          hover:opacity-90
          focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:ring-offset-2 focus:ring-offset-[#0F172A]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          shadow-lg shadow-[#4F46E5]/20
        "
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
        ) : (
          'Continue'
        )}
      </button>
    </form>
  );
}
