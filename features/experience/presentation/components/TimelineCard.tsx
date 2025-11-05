'use client';

import React from 'react';
import { MapPin, Calendar, Building2, Edit2, Trash2, ExternalLink, Award, Users } from 'lucide-react';
import type { Experience, Project, TimelineItem } from '../../types/experience.types';
import { useExperience } from '../../context/ExperienceContext';

interface TimelineCardProps {
  item: TimelineItem;
  index: number;
}

export default function TimelineCard({ item, index }: TimelineCardProps) {
  const { openEditExperience, openEditProject, deleteExperience, deleteProject } = useExperience();

  const isExperience = 'company' in item.data;
  const data = item.data as Experience | Project;

  const formatDuration = () => {
    const start = data.dateRange.startDate;
    const end = data.dateRange.endDate;

    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const endStr = data.dateRange.isCurrent
      ? 'Present'
      : end?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) || 'Present';

    // Calculate duration
    const endDate = data.dateRange.isCurrent ? new Date() : end || new Date();
    const months = (endDate.getFullYear() - start.getFullYear()) * 12 + (endDate.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let durationStr = '';
    if (years > 0) durationStr += `${years} yr${years > 1 ? 's' : ''}`;
    if (remainingMonths > 0) durationStr += ` ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;

    return `${startStr} - ${endStr} · ${durationStr.trim()}`;
  };

  const handleEdit = () => {
    if (isExperience) {
      openEditExperience(item.id);
    } else {
      openEditProject(item.id);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete this ${isExperience ? 'experience' : 'project'}?`)) {
      if (isExperience) {
        await deleteExperience(item.id);
      } else {
        await deleteProject(item.id);
      }
    }
  };

  return (
    <div
      className="
        group relative
        p-6 rounded-2xl
        bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50
        border border-white/10
        backdrop-blur-sm
        transition-all duration-300
        hover:border-indigo-500/30
        hover:shadow-lg hover:shadow-indigo-500/10
        animate-timeline-slide
      "
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Logo/Icon */}
        {isExperience && (data as Experience).companyLogo ? (
          <img
            src={(data as Experience).companyLogo}
            alt={(data as Experience).company}
            className="w-12 h-12 rounded-lg object-cover border border-white/10"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            {isExperience ? (
              <Building2 className="w-6 h-6 text-indigo-400" />
            ) : (
              <Award className="w-6 h-6 text-purple-400" />
            )}
          </div>
        )}

        {/* Title & Company */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white/90 mb-1">
            {isExperience ? (data as Experience).title : (data as Project).title}
          </h3>
          {isExperience ? (
            <p className="text-sm text-white/60 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {(data as Experience).company}
              {(data as Experience).isVerified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                  ✓ Verified
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-indigo-400">{(data as Project).tagline}</p>
          )}
        </div>

        {/* Current Badge */}
        {data.dateRange.isCurrent && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30">
            Current
          </span>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-white/50">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{formatDuration()}</span>
        </div>

        {isExperience && (data as Experience).location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{(data as Experience).location}</span>
          </div>
        )}

        {!isExperience && (data as Project).teamSize && (
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{(data as Project).teamSize} team members</span>
          </div>
        )}

        {!isExperience && (data as Project).role && (
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>{(data as Project).role}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-white/70 mb-4 line-clamp-2">
        {data.description}
      </p>

      {/* Highlights/Achievements */}
      {isExperience && (data as Experience).achievements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-wide">
            Key Achievements
          </h4>
          <ul className="space-y-1">
            {(data as Experience).achievements.slice(0, 2).map((achievement, i) => (
              <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span className="flex-1">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isExperience && (data as Project).highlights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-wide">
            Highlights
          </h4>
          <ul className="space-y-1">
            {(data as Project).highlights.slice(0, 2).map((highlight, i) => (
              <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span className="flex-1">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {isExperience
            ? (data as Experience).skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="
                    px-3 py-1 rounded-lg text-xs font-medium
                    bg-gradient-to-r from-indigo-500/20 to-purple-500/20
                    text-indigo-300 border border-indigo-500/30
                    transition-all duration-200
                    hover:from-indigo-500/30 hover:to-purple-500/30
                    animate-skill-badge-pulse
                  "
                >
                  {skill}
                </span>
              ))
            : (data as Project).technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="
                    px-3 py-1 rounded-lg text-xs font-medium
                    bg-gradient-to-r from-purple-500/20 to-pink-500/20
                    text-purple-300 border border-purple-500/30
                    transition-all duration-200
                    hover:from-purple-500/30 hover:to-pink-500/30
                    animate-skill-badge-pulse
                  "
                >
                  {tech}
                </span>
              ))}
        </div>
      </div>

      {/* Project Links */}
      {!isExperience && (data as Project).links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(data as Project).links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-xs font-medium text-cyan-300
                bg-cyan-500/10 border border-cyan-500/30
                hover:bg-cyan-500/20 hover:border-cyan-400/50
                transition-all duration-200
              "
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="
        absolute top-4 right-4
        flex items-center gap-2
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
      ">
        <button
          onClick={handleEdit}
          className="
            p-2 rounded-lg
            bg-white/5 hover:bg-white/10
            border border-white/10 hover:border-indigo-500/30
            text-white/60 hover:text-indigo-400
            transition-all duration-200
          "
          aria-label="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="
            p-2 rounded-lg
            bg-white/5 hover:bg-red-500/10
            border border-white/10 hover:border-red-500/30
            text-white/60 hover:text-red-400
            transition-all duration-200
          "
          aria-label="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline Connector (vertical line) */}
      <div className="absolute left-[30px] top-[72px] bottom-[-24px] w-px bg-gradient-to-b from-indigo-500/50 to-transparent" />
    </div>
  );
}
