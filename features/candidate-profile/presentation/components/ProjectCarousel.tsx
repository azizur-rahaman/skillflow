/**
 * Project Carousel Component
 * 
 * Horizontal scrollable showcase of candidate's projects with
 * images, tech stack, role, duration, and outcomes.
 */

'use client';

import { useState, useRef } from 'react';
import { Project, formatDuration } from '@/features/candidate-profile/types/profile.types';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Github, 
  Play,
  FileText,
  Calendar,
  TrendingUp,
  Star,
  Code
} from 'lucide-react';

interface ProjectCarouselProps {
  projects: Project[];
  onProjectClick?: (projectId: string) => void;
}

export const ProjectCarousel = ({ projects, onProjectClick }: ProjectCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 400;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + 
      (direction === 'right' ? scrollAmount : -scrollAmount);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };
  
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };
  
  const getCategoryColor = (category: string): string => {
    const colors = {
      professional: '#6366F1',
      personal: '#22D3EE',
      'open-source': '#10B981',
      academic: '#A855F7',
    };
    return colors[category as keyof typeof colors] || '#6366F1';
  };
  
  const getImpactColor = (impact: string): string => {
    return impact === 'high' ? '#10B981' : impact === 'medium' ? '#F59E0B' : '#64748B';
  };
  
  if (projects.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Featured Projects</h2>
          <p className="text-sm text-slate-400">
            {projects.length} project{projects.length !== 1 ? 's' : ''} showcasing real-world impact
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:border-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:border-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projects.map((project) => {
            const categoryColor = getCategoryColor(project.category);
            const primaryImage = project.images.find(img => img.isPrimary)?.url || 
                                project.images[0]?.url;
            
            return (
              <div
                key={project.id}
                className="flex-shrink-0 w-[400px] snap-start group"
              >
                <div className="h-full rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 hover:border-indigo-500 transition-all duration-300 overflow-hidden hover:scale-[1.02]">
                  {/* Project Image */}
                  {primaryImage ? (
                    <div className="relative h-48 overflow-hidden bg-slate-800">
                      <img
                        src={primaryImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60" />
                      
                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 backdrop-blur-sm border border-amber-500/30">
                          <Star className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-medium text-amber-400">Featured</span>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div
                        className="absolute top-4 left-4 px-3 py-1.5 rounded-lg backdrop-blur-sm text-xs font-medium capitalize"
                        style={{
                          backgroundColor: `${categoryColor}20`,
                          border: `1px solid ${categoryColor}40`,
                          color: categoryColor,
                        }}
                      >
                        {project.category.replace('-', ' ')}
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <Code className="w-16 h-16 text-slate-600" />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Title & Role */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="font-medium text-indigo-400">{project.role}</span>
                        {project.company && (
                          <>
                            <span>•</span>
                            <span>{project.company}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-slate-300 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Duration */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDuration(
                        project.duration.startDate,
                        project.duration.endDate,
                        project.duration.isOngoing
                      )}
                      {project.duration.isOngoing && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          Ongoing
                        </span>
                      )}
                    </div>
                    
                    {/* Tech Stack */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Tech Stack
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 6).map((tech, i) => (
                          <div
                            key={i}
                            className="px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700 text-xs text-slate-300"
                          >
                            {tech.name}
                          </div>
                        ))}
                        {project.techStack.length > 6 && (
                          <div className="px-2 py-1 rounded-md bg-slate-800/50 text-xs text-slate-400">
                            +{project.techStack.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Key Outcomes */}
                    {project.outcomes.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Impact
                        </div>
                        <div className="space-y-1.5">
                          {project.outcomes.slice(0, 2).map((outcome, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm"
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: getImpactColor(outcome.impact) }}
                              />
                              <div className="flex-1">
                                <span className="text-slate-400">{outcome.metric}: </span>
                                <span 
                                  className="font-semibold"
                                  style={{ color: getImpactColor(outcome.impact) }}
                                >
                                  {outcome.value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Links */}
                    <div className="flex gap-2 pt-2">
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-sm font-medium text-indigo-400 hover:bg-indigo-500/20 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live
                        </a>
                      )}
                      
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 hover:border-indigo-500 transition-all"
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </a>
                      )}
                      
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 hover:border-indigo-500 transition-all"
                        >
                          <Play className="w-4 h-4" />
                          Demo
                        </a>
                      )}
                      
                      {project.links.caseStudy && (
                        <a
                          href={project.links.caseStudy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 hover:border-indigo-500 transition-all"
                        >
                          <FileText className="w-4 h-4" />
                          Case Study
                        </a>
                      )}
                    </div>
                    
                    {/* View Details Button */}
                    <button
                      onClick={() => onProjectClick?.(project.id)}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-sm font-medium text-white hover:border-indigo-500 hover:bg-slate-800 transition-all"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
        <div>
          <div className="text-2xl font-bold text-white mb-1">
            {projects.length}
          </div>
          <div className="text-xs text-slate-400">Total Projects</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-amber-400 mb-1">
            {projects.filter(p => p.featured).length}
          </div>
          <div className="text-xs text-slate-400">Featured</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {projects.filter(p => p.duration.isOngoing).length}
          </div>
          <div className="text-xs text-slate-400">Ongoing</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {new Set(projects.flatMap(p => p.techStack.map(t => t.name))).size}
          </div>
          <div className="text-xs text-slate-400">Technologies</div>
        </div>
      </div>
    </div>
  );
};
