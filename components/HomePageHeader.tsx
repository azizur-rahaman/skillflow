'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface MenuGroup {
  label: string;
  items: NavItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Products',
    items: [
      { label: 'Skills', href: '/skills' },
      { label: 'Assessments', href: '/assessments' },
      { label: 'Learning Path', href: '/learning-path' },
      { label: 'Credentials', href: '/credentials' },
      { label: 'Mastery', href: '/mastery' },
      { label: 'Gamification', href: '/gamification' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      { label: 'Talent Search', href: '/talent-search' },
      { label: 'Candidate Profile', href: '/candidate-profile' },
      { label: 'Forecast', href: '/forecast' },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Platform Analytics', href: '/platform-analytics' },
      { label: 'Reports', href: '/reports' },
    ],
  },
  {
    label: 'Developers',
    items: [
      { label: 'Docs', href: '/docs' },
      { label: 'Q&A', href: '/qa' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Mint', href: '/mint' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Learning', href: '/learning' },
      { label: 'Experience', href: '/experience' },
      { label: 'Compliance', href: '/compliance' },
      { label: 'RBAC', href: '/rbac' },
      { label: 'Wallet', href: '/wallet' },
      { label: 'Transactions', href: '/transactions' },
    ],
  },
];

export function HomePageHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.svg" alt="SkillFlow Logo" width={120} height={40} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuGroups.map((group) => (
              <div key={group.label} className="relative group/menu">
                <button className="flex items-center gap-1 px-4 py-2 text-[#E2E8F0] hover:text-white text-sm font-medium transition-colors">
                  {group.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown */}
                <div className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-[#0F172A] border border-white/10 shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 py-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-[#CBD5E1] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            <Link
              href="/pricing"
              className="px-4 py-2 text-[#E2E8F0] hover:text-white text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-6 py-2 text-[#E2E8F0] hover:text-white text-sm font-medium transition-colors border border-white/20 rounded-lg hover:border-white/40"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-[#4F46E5] hover:bg-[#6366F1] text-white text-sm font-semibold rounded-lg transition-all duration-200"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
