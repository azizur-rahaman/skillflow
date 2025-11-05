import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | SkillFlow',
  description: 'Sign in to your SkillFlow account - The Predictive Talent OS',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
