import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome Tour | SkillFlow',
  description: 'Learn how to use SkillFlow to predict your future skills',
};

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
