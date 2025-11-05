'use client';

/**
 * Transcript Panel Component
 * Toggleable transcript with auto-scroll synced to video time
 */

import React, { useEffect, useRef, useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { useIntegratedCourse } from '../../context/IntegratedCourseContext';
import { formatVideoTime, findTranscriptSegment } from '../../types/integrated-course.types';
import type { TranscriptSegment } from '../../types/integrated-course.types';

export function TranscriptPanel() {
  const { state, actions } = useIntegratedCourse();
  const { progress, currentSection, isTranscriptOpen } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const activeSegmentRef = useRef<HTMLDivElement>(null);

  const transcript = currentSection?.transcript || [];
  const currentTime = progress?.currentTime || 0;
  const activeSegment = findTranscriptSegment(transcript, currentTime);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentRef.current && isTranscriptOpen) {
      activeSegmentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSegment, isTranscriptOpen]);

  const filteredTranscript = searchQuery
    ? transcript.filter((segment) =>
        segment.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transcript;

  const handleSegmentClick = (timestamp: number) => {
    actions.seekToTimestamp(timestamp);
  };

  if (!currentSection) return null;

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={actions.toggleTranscript}
        className="w-full flex items-center justify-between p-4 bg-[#0F172A]/50 hover:bg-[#0F172A] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div className="text-left">
            <h3 className="text-[#F8FAFC] font-semibold">Transcript</h3>
            <p className="text-[#94A3B8] text-sm">
              {transcript.length > 0 ? `${transcript.length} segments` : 'No transcript available'}
            </p>
          </div>
        </div>
        {isTranscriptOpen ? (
          <ChevronUp className="w-5 h-5 text-[#94A3B8]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#94A3B8]" />
        )}
      </button>

      {/* Content */}
      {isTranscriptOpen && transcript.length > 0 && (
        <div className="border-t border-[#334155]">
          {/* Search Bar */}
          <div className="p-4 border-b border-[#334155]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transcript..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#6366F1] text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-[#94A3B8] mt-2">
                {filteredTranscript.length} results found
              </p>
            )}
          </div>

          {/* Transcript Segments */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-2">
            {filteredTranscript.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#94A3B8] text-sm">No results found</p>
              </div>
            ) : (
              filteredTranscript.map((segment) => {
                const isActive = activeSegment?.id === segment.id;
                const highlightedText = searchQuery
                  ? highlightSearchText(segment.text, searchQuery)
                  : segment.text;

                return (
                  <div
                    key={segment.id}
                    ref={isActive ? activeSegmentRef : null}
                    onClick={() => handleSegmentClick(segment.startTime)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-[#6366F1]/20 border border-[#6366F1]'
                        : 'bg-[#0F172A]/50 border border-transparent hover:border-[#334155] hover:bg-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Timestamp */}
                      <button
                        className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#6366F1] text-white'
                            : 'bg-[#334155] text-[#94A3B8] hover:bg-[#6366F1] hover:text-white'
                        }`}
                      >
                        {formatVideoTime(segment.startTime)}
                      </button>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        {segment.speaker && (
                          <p className="text-xs text-[#6366F1] font-semibold mb-1">
                            {segment.speaker}
                          </p>
                        )}
                        <p
                          className={`text-sm leading-relaxed ${
                            isActive ? 'text-[#F8FAFC] font-medium' : 'text-[#94A3B8]'
                          }`}
                          dangerouslySetInnerHTML={{ __html: highlightedText }}
                        />
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* No Transcript Message */}
      {isTranscriptOpen && transcript.length === 0 && (
        <div className="p-8 text-center border-t border-[#334155]">
          <FileText className="w-12 h-12 text-[#334155] mx-auto mb-3" />
          <p className="text-[#94A3B8] text-sm">
            Transcript not available for this section
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Helper: Highlight search text in transcript
 */
function highlightSearchText(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(
    regex,
    '<mark class="bg-[#22D3EE]/30 text-[#22D3EE] rounded px-1">$1</mark>'
  );
}
