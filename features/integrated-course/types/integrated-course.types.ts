/**
 * Type definitions for integrated third-party course player
 * Supports Coursera, LinkedIn Learning, and other platforms
 */

/**
 * Supported learning platforms
 */
export enum CoursePlatform {
  COURSERA = 'coursera',
  LINKEDIN_LEARNING = 'linkedin-learning',
  UDEMY = 'udemy',
  EDEX = 'edx',
  SKILLSHARE = 'skillshare',
}

/**
 * Video player state
 */
export enum PlayerState {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  ENDED = 'ended',
  ERROR = 'error',
}

/**
 * Transcript segment
 */
export interface TranscriptSegment {
  id: string;
  startTime: number; // seconds
  endTime: number; // seconds
  text: string;
  speaker?: string;
}

/**
 * Note taken during course
 */
export interface CourseNote {
  id: string;
  timestamp: number; // video time in seconds
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  sectionId?: string;
}

/**
 * Course section/module
 */
export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  duration: number; // seconds
  order: number;
  videoUrl: string;
  thumbnailUrl?: string;
  isCompleted: boolean;
  completedAt?: Date;
  transcript?: TranscriptSegment[];
  resources?: CourseResource[];
}

/**
 * Course resource (downloads, links)
 */
export interface CourseResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'article' | 'code' | 'link';
  url: string;
  size?: string;
  downloadable: boolean;
}

/**
 * Complete course data
 */
export interface IntegratedCourse {
  id: string;
  platform: CoursePlatform;
  externalId: string; // Platform's course ID
  title: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    imageUrl?: string;
  };
  thumbnailUrl: string;
  totalDuration: number; // seconds
  sections: CourseSection[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  certificateAvailable: boolean;
  enrolledAt: Date;
  lastAccessedAt: Date;
}

/**
 * User progress for course
 */
export interface CourseProgress {
  courseId: string;
  userId: string;
  currentSectionId: string;
  currentTime: number; // seconds into current section
  completedSections: string[]; // section IDs
  totalTimeSpent: number; // total seconds watched
  completionPercentage: number; // 0-100
  lastWatchedAt: Date;
  notes: CourseNote[];
  bookmarks: number[]; // timestamps in seconds
}

/**
 * Player settings
 */
export interface PlayerSettings {
  volume: number; // 0-1
  playbackSpeed: number; // 0.5, 1, 1.25, 1.5, 2
  quality: 'auto' | '360p' | '480p' | '720p' | '1080p';
  subtitlesEnabled: boolean;
  autoplay: boolean;
}

/**
 * Platform-specific embed configuration
 */
export interface PlatformEmbedConfig {
  platform: CoursePlatform;
  embedUrl: string;
  allowFullscreen: boolean;
  allowAutoplay: boolean;
  customParams?: Record<string, string>;
}

/**
 * Context state
 */
export interface IntegratedCourseState {
  course: IntegratedCourse | null;
  progress: CourseProgress | null;
  currentSection: CourseSection | null;
  playerState: PlayerState;
  playerSettings: PlayerSettings;
  isTranscriptOpen: boolean;
  isNotesOpen: boolean;
  selectedNote: CourseNote | null;
  loading: boolean;
  error: string | null;
}

/**
 * Context actions
 */
export interface IntegratedCourseActions {
  loadCourse: (courseId: string) => Promise<void>;
  navigateToSection: (sectionId: string) => void;
  updateProgress: (time: number) => void;
  completeSection: (sectionId: string) => void;
  setPlayerState: (state: PlayerState) => void;
  updatePlayerSettings: (settings: Partial<PlayerSettings>) => void;
  toggleTranscript: () => void;
  toggleNotes: () => void;
  addNote: (content: string, timestamp: number) => void;
  updateNote: (noteId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  addBookmark: (timestamp: number) => void;
  removeBookmark: (timestamp: number) => void;
  seekToTimestamp: (timestamp: number) => void;
}

/**
 * Helper: Get platform logo URL
 */
export const getPlatformLogo = (platform: CoursePlatform): string => {
  const logos: Record<CoursePlatform, string> = {
    [CoursePlatform.COURSERA]: '/platforms/coursera-logo.svg',
    [CoursePlatform.LINKEDIN_LEARNING]: '/platforms/linkedin-learning-logo.svg',
    [CoursePlatform.UDEMY]: '/platforms/udemy-logo.svg',
    [CoursePlatform.EDEX]: '/platforms/edx-logo.svg',
    [CoursePlatform.SKILLSHARE]: '/platforms/skillshare-logo.svg',
  };
  return logos[platform];
};

/**
 * Helper: Get platform color
 */
export const getPlatformColor = (platform: CoursePlatform): string => {
  const colors: Record<CoursePlatform, string> = {
    [CoursePlatform.COURSERA]: '#0056D2',
    [CoursePlatform.LINKEDIN_LEARNING]: '#0A66C2',
    [CoursePlatform.UDEMY]: '#A435F0',
    [CoursePlatform.EDEX]: '#02262B',
    [CoursePlatform.SKILLSHARE]: '#00C1A2',
  };
  return colors[platform];
};

/**
 * Helper: Format time in MM:SS or HH:MM:SS
 */
export const formatVideoTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Helper: Format duration
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Helper: Build embed URL for platform
 */
export const buildEmbedUrl = (
  platform: CoursePlatform,
  externalId: string,
  sectionId?: string
): string => {
  switch (platform) {
    case CoursePlatform.COURSERA:
      return `https://www.coursera.org/embed/${externalId}${sectionId ? `?lectureId=${sectionId}` : ''}`;
    case CoursePlatform.LINKEDIN_LEARNING:
      return `https://www.linkedin.com/learning/embed/${externalId}${sectionId ? `/${sectionId}` : ''}`;
    case CoursePlatform.UDEMY:
      return `https://www.udemy.com/course/${externalId}/embed/${sectionId || ''}`;
    default:
      return '';
  }
};

/**
 * Helper: Calculate overall course progress
 */
export const calculateCourseProgress = (
  completedSections: string[],
  totalSections: number
): number => {
  if (totalSections === 0) return 0;
  return Math.round((completedSections.length / totalSections) * 100);
};

/**
 * Helper: Find transcript segment at time
 */
export const findTranscriptSegment = (
  transcript: TranscriptSegment[],
  currentTime: number
): TranscriptSegment | null => {
  return (
    transcript.find(
      (segment) => currentTime >= segment.startTime && currentTime < segment.endTime
    ) || null
  );
};

/**
 * Helper: Get next section
 */
export const getNextSection = (
  sections: CourseSection[],
  currentSectionId: string
): CourseSection | null => {
  const currentIndex = sections.findIndex((s) => s.id === currentSectionId);
  if (currentIndex === -1 || currentIndex === sections.length - 1) return null;
  return sections[currentIndex + 1];
};

/**
 * Helper: Get previous section
 */
export const getPreviousSection = (
  sections: CourseSection[],
  currentSectionId: string
): CourseSection | null => {
  const currentIndex = sections.findIndex((s) => s.id === currentSectionId);
  if (currentIndex <= 0) return null;
  return sections[currentIndex - 1];
};
