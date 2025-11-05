/**
 * Trending Skills API Route
 * GET /api/skills/trending
 * 
 * Query parameters:
 * - timeRange: 7d | 30d | 90d | 1y
 * - category: all | programming | data-science | ai-ml | etc.
 * - industry: all | technology | finance | healthcare | etc.
 * - sortBy: rank | growth | demand
 * - search: string (optional)
 */

import { NextRequest, NextResponse } from 'next/server';
import type { TrendingSkill, TrendingSkillsResponse } from '@/features/trending-skills/types/trending-skills.types';

// Mock data - In production, this would come from your database
const mockTrendingSkills: TrendingSkill[] = [
  {
    id: '1',
    name: 'Large Language Models (LLMs)',
    category: 'ai-ml',
    rank: 1,
    previousRank: 3,
    growthPercentage: 287.5,
    trendDirection: 'up',
    demandScore: 98,
    sparklineData: [
      { timestamp: '2024-10-01', value: 45 },
      { timestamp: '2024-10-08', value: 52 },
      { timestamp: '2024-10-15', value: 68 },
      { timestamp: '2024-10-22', value: 79 },
      { timestamp: '2024-10-29', value: 91 },
      { timestamp: '2024-11-05', value: 98 },
    ],
    relatedSkills: ['GPT', 'Prompt Engineering', 'Fine-tuning'],
    averageSalaryImpact: 45,
    jobPostings: 12450,
    learningResources: 342,
  },
  {
    id: '2',
    name: 'Prompt Engineering',
    category: 'ai-ml',
    rank: 2,
    previousRank: 5,
    growthPercentage: 215.3,
    trendDirection: 'up',
    demandScore: 94,
    sparklineData: [
      { timestamp: '2024-10-01', value: 38 },
      { timestamp: '2024-10-08', value: 48 },
      { timestamp: '2024-10-15', value: 62 },
      { timestamp: '2024-10-22', value: 75 },
      { timestamp: '2024-10-29', value: 86 },
      { timestamp: '2024-11-05', value: 94 },
    ],
    relatedSkills: ['ChatGPT', 'AI Content Generation', 'NLP'],
    averageSalaryImpact: 38,
    jobPostings: 8920,
    learningResources: 289,
  },
  {
    id: '3',
    name: 'Kubernetes',
    category: 'devops',
    rank: 3,
    previousRank: 2,
    growthPercentage: 168.7,
    trendDirection: 'up',
    demandScore: 92,
    sparklineData: [
      { timestamp: '2024-10-01', value: 72 },
      { timestamp: '2024-10-08', value: 76 },
      { timestamp: '2024-10-15', value: 81 },
      { timestamp: '2024-10-22', value: 84 },
      { timestamp: '2024-10-29', value: 88 },
      { timestamp: '2024-11-05', value: 92 },
    ],
    relatedSkills: ['Docker', 'Terraform', 'CI/CD'],
    averageSalaryImpact: 32,
    jobPostings: 15670,
    learningResources: 523,
  },
  {
    id: '4',
    name: 'Rust Programming',
    category: 'programming',
    rank: 4,
    previousRank: 8,
    growthPercentage: 142.8,
    trendDirection: 'up',
    demandScore: 87,
    sparklineData: [
      { timestamp: '2024-10-01', value: 52 },
      { timestamp: '2024-10-08', value: 58 },
      { timestamp: '2024-10-15', value: 66 },
      { timestamp: '2024-10-22', value: 74 },
      { timestamp: '2024-10-29', value: 81 },
      { timestamp: '2024-11-05', value: 87 },
    ],
    relatedSkills: ['Systems Programming', 'WebAssembly', 'Performance'],
    averageSalaryImpact: 41,
    jobPostings: 4320,
    learningResources: 178,
  },
  {
    id: '5',
    name: 'Next.js',
    category: 'programming',
    rank: 5,
    previousRank: 4,
    growthPercentage: 125.4,
    trendDirection: 'up',
    demandScore: 85,
    sparklineData: [
      { timestamp: '2024-10-01', value: 68 },
      { timestamp: '2024-10-08', value: 71 },
      { timestamp: '2024-10-15', value: 75 },
      { timestamp: '2024-10-22', value: 78 },
      { timestamp: '2024-10-29', value: 82 },
      { timestamp: '2024-11-05', value: 85 },
    ],
    relatedSkills: ['React', 'TypeScript', 'Server Components'],
    averageSalaryImpact: 28,
    jobPostings: 6780,
    learningResources: 412,
  },
  {
    id: '6',
    name: 'Generative AI',
    category: 'ai-ml',
    rank: 6,
    previousRank: 7,
    growthPercentage: 198.6,
    trendDirection: 'up',
    demandScore: 91,
    sparklineData: [
      { timestamp: '2024-10-01', value: 44 },
      { timestamp: '2024-10-08', value: 54 },
      { timestamp: '2024-10-15', value: 66 },
      { timestamp: '2024-10-22', value: 76 },
      { timestamp: '2024-10-29', value: 84 },
      { timestamp: '2024-11-05', value: 91 },
    ],
    relatedSkills: ['Stable Diffusion', 'DALL-E', 'Midjourney'],
    averageSalaryImpact: 43,
    jobPostings: 7650,
    learningResources: 267,
  },
  {
    id: '7',
    name: 'Cybersecurity',
    category: 'devops',
    rank: 7,
    previousRank: 6,
    growthPercentage: 89.3,
    trendDirection: 'up',
    demandScore: 88,
    sparklineData: [
      { timestamp: '2024-10-01', value: 74 },
      { timestamp: '2024-10-08', value: 76 },
      { timestamp: '2024-10-15', value: 79 },
      { timestamp: '2024-10-22', value: 82 },
      { timestamp: '2024-10-29', value: 85 },
      { timestamp: '2024-11-05', value: 88 },
    ],
    relatedSkills: ['Zero Trust', 'Penetration Testing', 'SOC'],
    averageSalaryImpact: 36,
    jobPostings: 11240,
    learningResources: 598,
  },
  {
    id: '8',
    name: 'Data Storytelling',
    category: 'data-science',
    rank: 8,
    previousRank: 10,
    growthPercentage: 76.2,
    trendDirection: 'up',
    demandScore: 82,
    sparklineData: [
      { timestamp: '2024-10-01', value: 58 },
      { timestamp: '2024-10-08', value: 62 },
      { timestamp: '2024-10-15', value: 68 },
      { timestamp: '2024-10-22', value: 73 },
      { timestamp: '2024-10-29', value: 78 },
      { timestamp: '2024-11-05', value: 82 },
    ],
    relatedSkills: ['Data Visualization', 'Tableau', 'Communication'],
    averageSalaryImpact: 24,
    jobPostings: 5430,
    learningResources: 234,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const timeRange = searchParams.get('timeRange') || '30d';
    const category = searchParams.get('category') || 'all';
    const industry = searchParams.get('industry') || 'all';
    const sortBy = searchParams.get('sortBy') || 'rank';
    const search = searchParams.get('search') || '';

    // Filter skills based on parameters
    let filteredSkills = [...mockTrendingSkills];

    // Filter by category
    if (category !== 'all') {
      filteredSkills = filteredSkills.filter(skill => skill.category === category);
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSkills = filteredSkills.filter(skill =>
        skill.name.toLowerCase().includes(searchLower) ||
        skill.relatedSkills.some(related => related.toLowerCase().includes(searchLower))
      );
    }

    // Sort skills
    if (sortBy === 'growth') {
      filteredSkills.sort((a, b) => b.growthPercentage - a.growthPercentage);
    } else if (sortBy === 'demand') {
      filteredSkills.sort((a, b) => b.demandScore - a.demandScore);
    }
    // Default is already sorted by rank

    // Re-rank after filtering
    filteredSkills = filteredSkills.map((skill, index) => ({
      ...skill,
      rank: index + 1,
    }));

    const response: TrendingSkillsResponse = {
      skills: filteredSkills,
      timeRange: timeRange as any,
      category: category as any,
      industry: industry as any,
      lastUpdated: new Date().toISOString(),
      totalSkillsTracked: 15000,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in trending skills API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending skills' },
      { status: 500 }
    );
  }
}
