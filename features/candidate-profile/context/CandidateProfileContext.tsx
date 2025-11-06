/**
 * Candidate Profile Context
 * 
 * State management and mock data for candidate profile view
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CandidateProfile } from '../types/profile.types';

interface CandidateProfileContextType {
  profile: CandidateProfile;
  isLoading: boolean;
  actions: {
    downloadResume: (format: 'pdf' | 'docx' | 'json') => void;
    contactCandidate: () => void;
    viewSkillDetails: (skillId: string) => void;
    viewProjectDetails: (projectId: string) => void;
    viewCredentialOnChain: (credentialId: string) => void;
  };
}

const CandidateProfileContext = createContext<CandidateProfileContextType | undefined>(undefined);

export const useCandidateProfile = () => {
  const context = useContext(CandidateProfileContext);
  if (!context) {
    throw new Error('useCandidateProfile must be used within CandidateProfileProvider');
  }
  return context;
};

// Mock candidate profile data
const mockProfile: CandidateProfile = {
  id: 'profile-001',
  userId: 'user-001',
  
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Chen',
    fullName: 'Sarah Chen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    title: 'Senior Full-Stack Engineer & AI/ML Specialist',
    location: {
      city: 'San Francisco',
      region: 'California',
      country: 'United States',
      timezone: 'PST (UTC-8)',
      isRemote: true,
    },
    contact: {
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 123-4567',
      linkedIn: 'https://linkedin.com/in/sarahchen',
      github: 'https://github.com/sarahchen',
      portfolio: 'https://sarahchen.dev',
    },
    bio: 'Passionate full-stack engineer with 8+ years of experience building scalable web applications and implementing AI/ML solutions. Specialized in React, Node.js, Python, and cloud infrastructure. Strong track record of leading technical teams and delivering high-impact products.',
    languages: [
      { name: 'English', proficiency: 'native' },
      { name: 'Mandarin', proficiency: 'fluent' },
      { name: 'Spanish', proficiency: 'professional' },
    ],
    preferredWorkMode: 'remote',
  },
  
  professionalSummary: {
    headline: 'Award-winning engineer transforming ideas into production-ready AI-powered applications',
    yearsOfExperience: 8,
    currentRole: 'Tech Lead',
    currentCompany: 'TechCorp AI',
    availability: 'open-to-offers',
    expectedSalary: {
      min: 180000,
      max: 250000,
      currency: 'USD',
      period: 'yearly',
    },
    noticePeriod: '2 weeks',
    openToRoles: ['Staff Engineer', 'Principal Engineer', 'Engineering Manager', 'Tech Lead'],
    preferredIndustries: ['AI/ML', 'SaaS', 'FinTech', 'HealthTech'],
  },
  
  skillDNA: {
    overallConfidence: 87,
    totalSkills: 42,
    verifiedSkills: 28,
    lastUpdated: '2025-11-01',
    domains: [
      { domain: 'Frontend', skillCount: 12, avgConfidence: 92, color: '#22D3EE', icon: 'Code' },
      { domain: 'Backend', skillCount: 10, avgConfidence: 89, color: '#6366F1', icon: 'Server' },
      { domain: 'AI/ML', skillCount: 8, avgConfidence: 84, color: '#A855F7', icon: 'Brain' },
      { domain: 'DevOps', skillCount: 7, avgConfidence: 78, color: '#10B981', icon: 'Cloud' },
      { domain: 'Database', skillCount: 5, avgConfidence: 85, color: '#F59E0B', icon: 'Database' },
    ],
    topSkills: [
      { skillId: 's1', name: 'React', category: 'Frontend', confidence: 95, yearsOfExperience: 6, lastUsed: '2025-10-30', proficiencyLevel: 'expert', isTrending: true, isVerified: true, endorsementCount: 12 },
      { skillId: 's2', name: 'TypeScript', category: 'Frontend', confidence: 93, yearsOfExperience: 5, lastUsed: '2025-10-30', proficiencyLevel: 'expert', isTrending: true, isVerified: true, endorsementCount: 10 },
      { skillId: 's3', name: 'Node.js', category: 'Backend', confidence: 91, yearsOfExperience: 7, lastUsed: '2025-10-28', proficiencyLevel: 'expert', isTrending: false, isVerified: true, endorsementCount: 15 },
      { skillId: 's4', name: 'Python', category: 'AI/ML', confidence: 88, yearsOfExperience: 6, lastUsed: '2025-10-29', proficiencyLevel: 'advanced', isTrending: true, isVerified: true, endorsementCount: 9 },
      { skillId: 's5', name: 'AWS', category: 'DevOps', confidence: 86, yearsOfExperience: 5, lastUsed: '2025-10-30', proficiencyLevel: 'advanced', isTrending: false, isVerified: true, endorsementCount: 8 },
      { skillId: 's6', name: 'Next.js', category: 'Frontend', confidence: 90, yearsOfExperience: 4, lastUsed: '2025-10-30', proficiencyLevel: 'advanced', isTrending: true, isVerified: true, endorsementCount: 7 },
      { skillId: 's7', name: 'PostgreSQL', category: 'Database', confidence: 85, yearsOfExperience: 6, lastUsed: '2025-10-25', proficiencyLevel: 'advanced', isTrending: false, isVerified: true, endorsementCount: 6 },
      { skillId: 's8', name: 'TensorFlow', category: 'AI/ML', confidence: 82, yearsOfExperience: 3, lastUsed: '2025-10-20', proficiencyLevel: 'advanced', isTrending: true, isVerified: false, endorsementCount: 5 },
      { skillId: 's9', name: 'Docker', category: 'DevOps', confidence: 84, yearsOfExperience: 5, lastUsed: '2025-10-28', proficiencyLevel: 'advanced', isTrending: false, isVerified: true, endorsementCount: 7 },
      { skillId: 's10', name: 'GraphQL', category: 'Backend', confidence: 87, yearsOfExperience: 4, lastUsed: '2025-10-27', proficiencyLevel: 'advanced', isTrending: true, isVerified: true, endorsementCount: 6 },
      { skillId: 's11', name: 'Kubernetes', category: 'DevOps', confidence: 76, yearsOfExperience: 3, lastUsed: '2025-10-15', proficiencyLevel: 'intermediate', isTrending: true, isVerified: false, endorsementCount: 4 },
      { skillId: 's12', name: 'MongoDB', category: 'Database', confidence: 83, yearsOfExperience: 5, lastUsed: '2025-10-22', proficiencyLevel: 'advanced', isTrending: false, isVerified: true, endorsementCount: 5 },
    ],
    emergingSkills: [
      { skillId: 'e1', name: 'LangChain', category: 'AI/ML', confidence: 72, yearsOfExperience: 1, lastUsed: '2025-10-30', proficiencyLevel: 'intermediate', isTrending: true, isVerified: false, endorsementCount: 2 },
      { skillId: 'e2', name: 'Rust', category: 'Backend', confidence: 68, yearsOfExperience: 1, lastUsed: '2025-10-18', proficiencyLevel: 'intermediate', isTrending: true, isVerified: false, endorsementCount: 1 },
      { skillId: 'e3', name: 'WebAssembly', category: 'Frontend', confidence: 65, yearsOfExperience: 0.5, lastUsed: '2025-10-10', proficiencyLevel: 'beginner', isTrending: true, isVerified: false, endorsementCount: 0 },
    ],
  },
  
  skillGraph: {
    nodes: [],
    edges: [],
    clusters: [],
    statistics: { totalConnections: 45, avgConnections: 3.2, densestCluster: 'Frontend', isolatedSkills: 2 },
  },
  
  blockchainCredentials: [
    {
      id: 'cred-001',
      tokenId: '12345',
      name: 'AWS Certified Solutions Architect',
      description: 'Professional certification demonstrating expertise in designing distributed systems on AWS',
      issuer: { name: 'Amazon Web Services', logo: '', verified: true },
      issuedDate: '2024-03-15',
      expiryDate: '2027-03-15',
      blockchain: {
        network: 'polygon',
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        tokenStandard: 'ERC-721',
        transactionHash: '0xabc123...',
      },
      metadata: {
        image: '',
        attributes: [
          { trait_type: 'Level', value: 'Professional', display_type: 'string' },
          { trait_type: 'Score', value: '920/1000', display_type: 'string' },
        ],
        skillsCertified: ['AWS', 'Cloud Architecture', 'EC2', 'S3', 'Lambda'],
      },
      verification: { status: 'verified', verifiedBy: ['AWS'], verificationDate: '2024-03-15' },
      displayBadge: {
        shape: 'shield',
        gradientColors: ['#FF9900', '#FF6600'],
        glowEffect: true,
        borderStyle: 'gradient',
      },
    },
    {
      id: 'cred-002',
      tokenId: '67890',
      name: 'Meta Certified React Developer',
      description: 'Advanced certification in React development and modern frontend architecture',
      issuer: { name: 'Meta', logo: '', verified: true },
      issuedDate: '2024-08-20',
      blockchain: {
        network: 'ethereum',
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        tokenStandard: 'ERC-721',
        transactionHash: '0xdef456...',
      },
      metadata: {
        image: '',
        attributes: [
          { trait_type: 'Level', value: 'Advanced', display_type: 'string' },
          { trait_type: 'Score', value: '95/100', display_type: 'string' },
        ],
        skillsCertified: ['React', 'Redux', 'React Hooks', 'Performance Optimization'],
      },
      verification: { status: 'verified', verifiedBy: ['Meta'], verificationDate: '2024-08-20' },
      displayBadge: {
        shape: 'circle',
        gradientColors: ['#0081FB', '#00A8FF'],
        glowEffect: true,
        borderStyle: 'gradient',
      },
    },
  ],
  
  certifications: [],
  
  projects: [
    {
      id: 'proj-001',
      title: 'AI-Powered Customer Support Platform',
      description: 'Built an intelligent customer support system using GPT-4 and custom ML models, reducing response time by 60% and improving customer satisfaction by 40%',
      role: 'Tech Lead & Senior Engineer',
      company: 'TechCorp AI',
      duration: { startDate: '2024-01-01', isOngoing: true },
      images: [{ url: '', isPrimary: true }],
      techStack: [
        { name: 'React', category: 'framework', proficiency: 'expert' },
        { name: 'Next.js', category: 'framework', proficiency: 'expert' },
        { name: 'Python', category: 'language', proficiency: 'advanced' },
        { name: 'OpenAI API', category: 'platform', proficiency: 'advanced' },
        { name: 'PostgreSQL', category: 'database', proficiency: 'advanced' },
        { name: 'Redis', category: 'database', proficiency: 'intermediate' },
      ],
      skillsUsed: ['React', 'Python', 'AI/ML', 'System Design'],
      outcomes: [
        { metric: 'Response Time Reduction', value: '60%', impact: 'high' },
        { metric: 'Customer Satisfaction', value: '+40%', impact: 'high' },
        { metric: 'Cost Savings', value: '$500K/year', impact: 'high' },
      ],
      links: { live: 'https://support.techcorp.ai', demo: 'https://demo.techcorp.ai' },
      category: 'professional',
      featured: true,
      confidenceBoost: 15,
    },
    {
      id: 'proj-002',
      title: 'Real-time Analytics Dashboard',
      description: 'Developed a high-performance real-time analytics platform processing 1M+ events per second',
      role: 'Full-Stack Engineer',
      duration: { startDate: '2023-06-01', endDate: '2023-12-31', isOngoing: false },
      images: [],
      techStack: [
        { name: 'React', category: 'framework', proficiency: 'expert' },
        { name: 'Node.js', category: 'platform', proficiency: 'expert' },
        { name: 'Kafka', category: 'platform', proficiency: 'advanced' },
        { name: 'ClickHouse', category: 'database', proficiency: 'intermediate' },
      ],
      skillsUsed: ['React', 'Node.js', 'Data Streaming', 'Performance Optimization'],
      outcomes: [
        { metric: 'Events Processed', value: '1M+/sec', impact: 'high' },
        { metric: 'Query Speed', value: '<100ms', impact: 'high' },
      ],
      links: { github: 'https://github.com/sarahchen/analytics-dashboard' },
      category: 'professional',
      featured: true,
      confidenceBoost: 12,
    },
  ],
  
  workExperience: [
    {
      id: 'exp-001',
      company: 'TechCorp AI',
      position: 'Tech Lead',
      location: 'San Francisco, CA (Remote)',
      employmentType: 'full-time',
      duration: { startDate: '2022-01-01', isCurrent: true },
      description: 'Leading a team of 8 engineers building AI-powered enterprise solutions',
      responsibilities: [
        'Lead technical architecture and design for AI/ML products',
        'Mentor junior and mid-level engineers',
        'Drive adoption of best practices and modern development workflows',
      ],
      achievements: [
        'Reduced deployment time by 70% through CI/CD improvements',
        'Scaled platform to handle 10M+ daily active users',
      ],
      skillsUsed: ['React', 'Python', 'AWS', 'Team Leadership'],
      techStack: ['React', 'Next.js', 'Python', 'TensorFlow', 'AWS', 'Docker'],
    },
  ],
  
  endorsements: [
    {
      id: 'end-001',
      skillId: 's1',
      skillName: 'React',
      endorser: {
        id: 'user-002',
        name: 'Michael Rodriguez',
        avatar: '',
        title: 'Engineering Manager',
        company: 'TechCorp AI',
        relationship: 'manager',
      },
      rating: 5,
      comment: 'Sarah is an exceptional React developer. Her deep understanding of the framework and ability to build complex, performant UIs is outstanding.',
      verificationMethod: 'linkedin',
      isBlockchainVerified: true,
      endorsedDate: '2025-09-15',
      weight: 0.95,
    },
    {
      id: 'end-002',
      skillId: 's3',
      skillName: 'Node.js',
      endorser: {
        id: 'user-003',
        name: 'Emily Watson',
        avatar: '',
        title: 'Senior Backend Engineer',
        company: 'TechCorp AI',
        relationship: 'colleague',
      },
      rating: 5,
      comment: 'Incredibly skilled at building scalable Node.js services. Sarah mentored me on best practices.',
      verificationMethod: 'platform',
      isBlockchainVerified: false,
      endorsedDate: '2025-10-01',
      weight: 0.85,
    },
  ],
  
  testimonials: [
    {
      id: 'test-001',
      author: {
        name: 'Michael Rodriguez',
        avatar: '',
        title: 'Engineering Manager',
        company: 'TechCorp AI',
      },
      content: 'Sarah is one of the most talented engineers I\'ve worked with. She combines deep technical expertise with excellent communication skills and a collaborative mindset. Her contributions to our AI platform have been transformative.',
      relationship: 'Direct manager at TechCorp AI',
      date: '2025-09-20',
      rating: 5,
      featured: true,
    },
  ],
  
  profileMetrics: {
    profileViews: 1247,
    profileViewsThisWeek: 89,
    searchAppearances: 342,
    contactRequests: 56,
    endorsementRate: 92,
    responseRate: 95,
    averageResponseTime: '2 hours',
  },
  
  activityMetrics: {
    lastLogin: '2025-11-05',
    skillsAddedLast30Days: 3,
    projectsUpdatedLast30Days: 2,
    endorsementsReceivedLast30Days: 4,
    learningHoursLast30Days: 12,
    streakDays: 45,
  },
  
  createdAt: '2023-01-15',
  updatedAt: '2025-11-05',
  lastActive: '2025-11-05',
  profileCompleteness: 95,
};

interface Props {
  children: ReactNode;
  initialProfile?: CandidateProfile;
}

export const CandidateProfileProvider = ({ children, initialProfile }: Props) => {
  const [profile] = useState<CandidateProfile>(initialProfile || mockProfile);
  const [isLoading] = useState(false);
  
  const actions = {
    downloadResume: (format: 'pdf' | 'docx' | 'json') => {
      console.log(`Downloading resume in ${format} format...`);
      // Implementation would trigger download
    },
    
    contactCandidate: () => {
      console.log('Opening contact modal...');
      // Implementation would open contact form
    },
    
    viewSkillDetails: (skillId: string) => {
      console.log(`Viewing skill details for: ${skillId}`);
      // Implementation would show skill detail modal
    },
    
    viewProjectDetails: (projectId: string) => {
      console.log(`Viewing project details for: ${projectId}`);
      // Implementation would navigate to project detail page
    },
    
    viewCredentialOnChain: (credentialId: string) => {
      console.log(`Opening blockchain explorer for credential: ${credentialId}`);
      // Implementation would open blockchain explorer
    },
  };
  
  return (
    <CandidateProfileContext.Provider value={{ profile, isLoading, actions }}>
      {children}
    </CandidateProfileContext.Provider>
  );
};
