'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import type { ProfileSection } from '../../types/profile.types';

interface EditableFieldProps {
  field: ProfileSection;
  label: string;
  placeholder: string;
  value: string;
  multiline?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  required?: boolean;
}

export default function EditableField({
  field,
  label,
  placeholder,
  value,
  multiline = false,
  maxLength = 200,
  icon,
  required = false,
}: EditableFieldProps) {
  const { state, updateField, saveField, cancelEdit } = useProfile();
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isSaving = state.editState.isSaving && state.editState.editingField === field;
  const isEmpty = value.length === 0;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      if (multiline) {
        textareaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  }, [isEditing, multiline]);

  const handleEdit = () => {
    setIsEditing(true);
    setLocalValue(value);
  };

  const handleSave = async () => {
    if (localValue.trim().length === 0 && required) {
      return;
    }

    updateField(field, localValue);
    await saveField(field);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsEditing(false);
    cancelEdit(field);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="group">
      {/* Label */}
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-white/60">{icon}</div>}
        <label className="text-sm font-medium text-white/80">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="
              ml-auto opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              p-1 rounded-lg hover:bg-white/5
              text-white/40 hover:text-indigo-400
            "
            aria-label={`Edit ${label}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Field Content */}
      <div className="relative">
        {isEditing ? (
          <div className="space-y-3">
            {/* Input/Textarea */}
            {multiline ? (
              <textarea
                ref={textareaRef}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={4}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white/5 border border-white/10
                  text-white placeholder-white/40
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  resize-none transition-all duration-200
                  animate-field-focus
                "
              />
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white/5 border border-white/10
                  text-white placeholder-white/40
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  transition-all duration-200
                  animate-field-focus
                "
              />
            )}

            {/* Character Count */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">
                {localValue.length} / {maxLength}
              </span>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="
                    px-3 py-1.5 rounded-lg
                    bg-white/5 hover:bg-white/10
                    text-white/60 hover:text-white
                    text-sm font-medium
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-1.5
                  "
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || (required && localValue.trim().length === 0)}
                  className="
                    px-3 py-1.5 rounded-lg
                    bg-gradient-to-r from-indigo-500 to-purple-500
                    hover:from-indigo-600 hover:to-purple-600
                    text-white text-sm font-medium
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-1.5
                    shadow-lg shadow-indigo-500/25
                    hover:shadow-indigo-500/40
                  "
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`
              px-4 py-3 rounded-xl
              bg-white/5 border border-white/10
              cursor-pointer
              transition-all duration-200
              hover:bg-white/10 hover:border-indigo-500/30
              ${isEmpty ? 'border-dashed' : ''}
            `}
            onClick={handleEdit}
          >
            {isEmpty ? (
              <p className="text-white/40 text-sm italic">{placeholder}</p>
            ) : (
              <p className="text-white/90 text-sm whitespace-pre-wrap">{value}</p>
            )}
          </div>
        )}
      </div>

      {/* Save Indicator */}
      {state.editState.lastSaved && !isEditing && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-green-400/80 animate-fade-in">
          <Check className="w-3 h-3" />
          <span>Saved</span>
        </div>
      )}
    </div>
  );
}
