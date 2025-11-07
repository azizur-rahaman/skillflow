/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Loader2, Check } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import type { ExperienceFormData, ProjectFormData } from '../../types/experience.types';

export default function ExperienceModal() {
  const { state, closeModal, addExperience, updateExperience, addProject, updateProject, getExperience, getProject } = useExperience();

  const { modalState } = state;
  const isExperience = modalState.type === 'experience';
  const isEdit = modalState.mode === 'edit';

  // Form state
  const [formData, setFormData] = useState<ExperienceFormData | ProjectFormData>({
    title: '',
    company: '',
    location: '',
    employmentType: 'full-time',
    type: 'work',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    responsibilities: [''],
    achievements: [''],
    skills: [],
    tagline: '',
    status: 'in-progress',
    role: '',
    teamSize: undefined,
    technologies: [],
    highlights: [''],
    links: [],
  } as any);

  const [skillInput, setSkillInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load data for edit mode
  useEffect(() => {
    if (isEdit && modalState.editingId) {
      if (isExperience) {
        const exp = getExperience(modalState.editingId);
        if (exp) {
          setFormData({
            type: exp.type,
            title: exp.title,
            company: exp.company,
            location: exp.location,
            employmentType: exp.employmentType,
            startDate: exp.dateRange.startDate.toISOString().split('T')[0],
            endDate: exp.dateRange.endDate?.toISOString().split('T')[0] || '',
            isCurrent: exp.dateRange.isCurrent,
            description: exp.description,
            responsibilities: exp.responsibilities.length > 0 ? exp.responsibilities : [''],
            achievements: exp.achievements.length > 0 ? exp.achievements : [''],
            skills: exp.skills,
          });
        }
      } else {
        const proj = getProject(modalState.editingId);
        if (proj) {
          setFormData({
            title: proj.title,
            tagline: proj.tagline,
            description: proj.description,
            status: proj.status,
            startDate: proj.dateRange.startDate.toISOString().split('T')[0],
            endDate: proj.dateRange.endDate?.toISOString().split('T')[0] || '',
            isCurrent: proj.dateRange.isCurrent,
            role: proj.role,
            teamSize: proj.teamSize,
            skills: proj.skills,
            technologies: proj.technologies,
            highlights: proj.highlights.length > 0 ? proj.highlights : [''],
            links: proj.links,
          } as ProjectFormData);
        }
      }
    }
  }, [isEdit, modalState.editingId, isExperience, getExperience, getProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isExperience) {
        const data = formData as ExperienceFormData;
        if (isEdit && modalState.editingId) {
          await updateExperience(modalState.editingId, data);
        } else {
          await addExperience(data);
        }
      } else {
        const data = formData as ProjectFormData;
        if (isEdit && modalState.editingId) {
          await updateProject(modalState.editingId, data);
        } else {
          await addProject(data);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index) || [],
    }));
  };

  const addTechnology = () => {
    if (techInput.trim() && !isExperience) {
      setFormData((prev: any) => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      technologies: prev.technologies?.filter((_: any, i: number) => i !== index) || [],
    }));
  };

  const addListItem = (field: 'responsibilities' | 'achievements' | 'highlights') => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || ['']), ''],
    }));
  };

  const updateListItem = (field: 'responsibilities' | 'achievements' | 'highlights', index: number, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field]?.map((item: string, i: number) => (i === index ? value : item)) || [],
    }));
  };

  const removeListItem = (field: 'responsibilities' | 'achievements' | 'highlights', index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field]?.filter((_: any, i: number) => i !== index) || [],
    }));
  };

  if (!modalState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-modal-fade">
      <div className="
        w-full max-w-2xl max-h-[90vh] overflow-y-auto
        bg-gradient-to-br from-[#1E293B] to-[#1E293B]/90
        border border-white/10 rounded-2xl
        shadow-2xl shadow-black/50
      ">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-[#1E293B]/95 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white/90">
              {isEdit ? 'Edit' : 'Add'} {isExperience ? 'Experience' : 'Project'}
            </h2>
            <button
              onClick={closeModal}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {isExperience ? 'Job Title' : 'Project Name'} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-white/5 border border-white/10
                text-white placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                transition-all duration-200
              "
              placeholder={isExperience ? 'e.g., Senior Software Engineer' : 'e.g., E-commerce Platform'}
            />
          </div>

          {/* Experience-specific fields */}
          {isExperience && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Company <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={(formData as ExperienceFormData).company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Google"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
                  <input
                    type="text"
                    value={(formData as ExperienceFormData).location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Employment Type</label>
                  <select aria-label='job'
                    value={(formData as ExperienceFormData).employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Type</label>
                  <select aria-label='work'
                    value={(formData as ExperienceFormData).type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="work">Work</option>
                    <option value="education">Education</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Project-specific fields */}
          {!isExperience && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Tagline</label>
                <input
                  type="text"
                  value={(formData as ProjectFormData).tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Real-time collaboration platform"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Your Role</label>
                  <input
                    type="text"
                    value={(formData as ProjectFormData).role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Lead Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Team Size</label>
                  <input
                    type="number"
                    min="1"
                    value={(formData as ProjectFormData).teamSize || ''}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                <select aria-label='project status'
                  value={(formData as ProjectFormData).status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">End Date</label>
              <input area-label='end date'
                type="date"
                disabled={formData.isCurrent}
                value={formData.isCurrent ? '' : formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-white/80">I currently {isExperience ? 'work' : 'work on'} here</span>
          </label>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder={isExperience ? 'Describe your role and responsibilities' : 'Describe the project and your contributions'}
            />
          </div>

          {/* Dynamic Lists */}
          {isExperience ? (
            <>
              <DynamicList
                label="Responsibilities"
                items={(formData as ExperienceFormData).responsibilities}
                onUpdate={(items) => setFormData({ ...formData, responsibilities: items })}
              />
              <DynamicList
                label="Achievements"
                items={(formData as ExperienceFormData).achievements}
                onUpdate={(items) => setFormData({ ...formData, achievements: items })}
              />
            </>
          ) : (
            <DynamicList
              label="Highlights"
              items={(formData as ProjectFormData).highlights}
              onUpdate={(items) => setFormData({ ...formData, highlights: items })}
            />
          )}

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Skills Used</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a skill"
              />
              <button aria-label='add skill'
                type="button"
                onClick={addSkill}
                className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-2"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(i)} className="hover:text-red-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Technologies (Projects only) */}
          {!isExperience && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Technologies</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a technology"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData as ProjectFormData).technologies?.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-2"
                  >
                    {tech}
                    <button type="button" onClick={() => removeTechnology(i)} className="hover:text-red-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                <>
                  <Check className="w-5 h-5" />
                  Update
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add {isExperience ? 'Experience' : 'Project'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DynamicList({ label, items, onUpdate }: { label: string; items: string[]; onUpdate: (items: string[]) => void }) {
  const addItem = () => onUpdate([...items, '']);
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate(newItems);
  };
  const removeItem = (index: number) => onUpdate(items.filter((_, i) => i !== index));

  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={`Add ${label.toLowerCase().slice(0, -1)}`}
            />
            <button aria-label='remove'
              type="button"
              onClick={() => removeItem(i)}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="w-full px-4 py-2.5 rounded-xl border-2 border-dashed border-white/20 hover:border-indigo-500/50 text-white/60 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add {label.slice(0, -1)}
        </button>
      </div>
    </div>
  );
}
