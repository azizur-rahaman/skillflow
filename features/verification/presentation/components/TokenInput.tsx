'use client';

/**
 * Token Input Component
 * 
 * Input field for entering credential token ID, verification URL, or QR code.
 * Auto-detects input format and provides validation feedback.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  TokenInputProps,
  VerificationInputMethod,
  parseVerificationInput,
  validateInputFormat,
} from '../../types/verification.types';

export const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Enter token ID, verification URL, or scan QR code...',
  autoFocus = true,
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [detectedMethod, setDetectedMethod] = useState<VerificationInputMethod | null>(null);

  // Update validation when input changes
  useEffect(() => {
    if (!inputValue.trim()) {
      setIsValid(null);
      setDetectedMethod(null);
      return;
    }

    const valid = validateInputFormat(inputValue);
    setIsValid(valid);

    if (valid) {
      const parsed = parseVerificationInput(inputValue);
      setDetectedMethod(parsed.method);
    } else {
      setDetectedMethod(null);
    }
  }, [inputValue]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInputValue('');
    setIsValid(null);
    setDetectedMethod(null);
    onChange?.('');
  }, [onChange]);

  // Handle paste
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedValue = e.clipboardData.getData('text');
    setInputValue(pastedValue);
    onChange?.(pastedValue);
  }, [onChange]);

  // Handle submit
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && inputValue.trim()) {
      onSubmit?.(inputValue);
    }
  }, [isValid, inputValue, onSubmit]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid && inputValue.trim()) {
      onSubmit?.(inputValue);
    }
  }, [isValid, inputValue, onSubmit]);

  // Get method badge
  const getMethodBadge = () => {
    if (!detectedMethod) return null;

    const badges = {
      [VerificationInputMethod.TokenID]: {
        label: 'Token ID',
        icon: '🔢',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      },
      [VerificationInputMethod.VerificationURL]: {
        label: 'URL',
        icon: '🔗',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      },
      [VerificationInputMethod.QRCode]: {
        label: 'QR Code',
        icon: '📷',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      },
    };

    const badge = badges[detectedMethod];

    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${badge.color} text-xs font-medium`}>
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        {/* Input Field */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onPaste={handlePaste}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`
              w-full px-4 py-3.5 pr-24
              bg-slate-900/50 backdrop-blur-sm
              border rounded-lg
              text-slate-100 placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              ${isValid === true ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/50' : ''}
              ${isValid === false ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : ''}
              ${isValid === null ? 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/50' : ''}
            `}
          />

          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Clear Button */}
            {inputValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-md hover:bg-slate-800/50 text-slate-400 hover:text-slate-300 transition-colors"
                aria-label="Clear input"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Validation Icon */}
            {isValid === true && (
              <div className="text-emerald-400" aria-label="Valid input">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {isValid === false && (
              <div className="text-red-400" aria-label="Invalid input">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Method Badge */}
        {detectedMethod && (
          <div className="absolute -top-3 left-4 z-10">
            {getMethodBadge()}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-3 flex items-start gap-2 text-sm text-slate-400">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p>
            Enter a token ID (e.g., <span className="text-slate-300 font-mono text-xs">0x1a2b3c...</span>),
            verification URL, or scan a QR code to verify credential authenticity.
          </p>
        </div>
      </div>

      {/* Submit Button (Hidden - form submits on Enter) */}
      <button type="submit" className="sr-only" disabled={!isValid || !inputValue.trim()}>
        Verify
      </button>
    </form>
  );
};
