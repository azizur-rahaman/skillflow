'use client';

/**
 * Notes Panel Component
 * Side panel for taking timestamped notes during video playback
 */

import React, { useState } from 'react';
import {
  StickyNote,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Tag,
  X,
  Save,
  Bookmark,
} from 'lucide-react';
import { useIntegratedCourse } from '../../context/IntegratedCourseContext';
import { formatVideoTime } from '../../types/integrated-course.types';
import type { CourseNote } from '../../types/integrated-course.types';

export function NotesPanel() {
  const { state, actions } = useIntegratedCourse();
  const { progress, isNotesOpen, currentSection } = state;

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  if (!progress || !currentSection) return null;

  const currentSectionNotes = progress.notes.filter(
    (note) => note.sectionId === currentSection.id
  );
  const allNotes = progress.notes;

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    actions.addNote(noteContent, progress.currentTime);
    setNoteContent('');
    setIsAddingNote(false);
  };

  const handleUpdateNote = (noteId: string) => {
    if (!noteContent.trim()) return;
    actions.updateNote(noteId, noteContent);
    setEditingNoteId(null);
    setNoteContent('');
  };

  const handleEditNote = (note: CourseNote) => {
    setEditingNoteId(note.id);
    setNoteContent(note.content);
    setIsAddingNote(false);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setNoteContent('');
    setIsAddingNote(false);
  };

  const handleSeekToNote = (timestamp: number) => {
    actions.seekToTimestamp(timestamp);
  };

  if (!isNotesOpen) {
    return (
      <button
        onClick={actions.toggleNotes}
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white shadow-lg shadow-[#6366F1]/20 flex items-center justify-center transition-all duration-200 hover:scale-110 z-40"
        aria-label="Open notes panel"
      >
        <StickyNote className="w-6 h-6" />
        {allNotes.length > 0 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#22D3EE] rounded-full flex items-center justify-center text-xs font-bold">
            {allNotes.length}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-[#1E293B] border-l border-[#334155] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#334155]">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-[#6366F1]" />
          <h3 className="text-[#F8FAFC] font-semibold">Notes</h3>
          <span className="px-2 py-0.5 bg-[#6366F1]/20 text-[#6366F1] text-xs font-medium rounded-full">
            {allNotes.length}
          </span>
        </div>
        <button
          onClick={actions.toggleNotes}
          className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#6366F1] transition-colors"
          aria-label="Close notes panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Add Note Button */}
      {!isAddingNote && !editingNoteId && (
        <div className="p-4 border-b border-[#334155]">
          <button
            onClick={() => setIsAddingNote(true)}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Note at {formatVideoTime(progress.currentTime)}
          </button>
        </div>
      )}

      {/* Add/Edit Note Form */}
      {(isAddingNote || editingNoteId) && (
        <div className="p-4 border-b border-[#334155] space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <Clock className="w-4 h-4" />
            <span>
              {editingNoteId
                ? formatVideoTime(
                    allNotes.find((n) => n.id === editingNoteId)?.timestamp || 0
                  )
                : formatVideoTime(progress.currentTime)}
            </span>
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write your note here..."
            className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#6366F1] resize-none"
            rows={4}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              onClick={editingNoteId ? () => handleUpdateNote(editingNoteId) : handleAddNote}
              className="flex-1 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingNoteId ? 'Update' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-lg bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#6366F1] font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {allNotes.length === 0 ? (
          <div className="text-center py-12">
            <StickyNote className="w-12 h-12 text-[#334155] mx-auto mb-3" />
            <p className="text-[#94A3B8] text-sm">No notes yet</p>
            <p className="text-[#64748B] text-xs mt-1">
              Add notes while watching to remember key points
            </p>
          </div>
        ) : (
          <>
            {/* Current Section Notes */}
            {currentSectionNotes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">
                  This Section ({currentSectionNotes.length})
                </h4>
                {currentSectionNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={actions.deleteNote}
                    onSeek={handleSeekToNote}
                  />
                ))}
              </div>
            )}

            {/* Other Notes */}
            {allNotes.length > currentSectionNotes.length && (
              <div className="space-y-3 mt-6">
                <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide">
                  Other Sections ({allNotes.length - currentSectionNotes.length})
                </h4>
                {allNotes
                  .filter((note) => note.sectionId !== currentSection.id)
                  .map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={actions.deleteNote}
                      onSeek={handleSeekToNote}
                    />
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-[#334155] bg-[#0F172A]/50">
        <div className="flex items-center justify-between text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4" />
            <span>{allNotes.length} notes</span>
          </div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span>{progress.bookmarks.length} bookmarks</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Note Card
 */
function NoteCard({
  note,
  onEdit,
  onDelete,
  onSeek,
}: {
  note: CourseNote;
  onEdit: (note: CourseNote) => void;
  onDelete: (noteId: string) => void;
  onSeek: (timestamp: number) => void;
}) {
  return (
    <div className="p-4 bg-[#0F172A] border border-[#334155] rounded-xl hover:border-[#6366F1]/50 transition-colors group">
      {/* Timestamp */}
      <button
        onClick={() => onSeek(note.timestamp)}
        className="flex items-center gap-2 text-xs text-[#6366F1] hover:text-[#A855F7] font-medium mb-2 transition-colors"
      >
        <Clock className="w-3.5 h-3.5" />
        <span>{formatVideoTime(note.timestamp)}</span>
      </button>

      {/* Content */}
      <p className="text-[#F8FAFC] text-sm leading-relaxed mb-3">{note.content}</p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] text-xs rounded-md flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#64748B]">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#6366F1] hover:bg-[#1E293B] transition-colors"
            aria-label="Edit note"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#1E293B] transition-colors"
            aria-label="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
