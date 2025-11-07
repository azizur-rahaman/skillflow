'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  BarChart3,
  ClipboardCheck,
  UserCircle,
  Shield,
  Award,
  FileText,
  Briefcase,
  TrendingUp,
  Gamepad2,
  BookOpen,
  Route,
  ShoppingCart,
  Target,
  Coins,
  Settings,
  Lightbulb,
  Search,
  DollarSign,
  Wallet,
  Activity,
  Users,
  FileBarChart,
  CheckSquare,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Platform Analytics', href: '/platform-analytics', icon: Activity },
  { label: 'Assessments', href: '/assessments', icon: ClipboardCheck },
  { label: 'Candidate Profile', href: '/candidate-profile', icon: UserCircle },
  { label: 'Compliance', href: '/compliance', icon: CheckSquare },
  { label: 'Credentials', href: '/credentials', icon: Award },
  { label: 'Docs', href: '/docs', icon: FileText },
  { label: 'Experience', href: '/experience', icon: Briefcase },
  { label: 'Forecast', href: '/forecast', icon: TrendingUp },
  { label: 'Gamification', href: '/gamification', icon: Gamepad2 },
  { label: 'Learning', href: '/learning', icon: BookOpen },
  { label: 'Learning Path', href: '/learning-path', icon: Route },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
  { label: 'Mastery', href: '/mastery', icon: Target },
  { label: 'Mint', href: '/mint', icon: Coins },
  { label: 'Profile', href: '/profile', icon: UserCircle },
  { label: 'Q&A', href: '/qa', icon: Lightbulb },
  { label: 'RBAC', href: '/rbac', icon: Shield },
  { label: 'Reports', href: '/reports', icon: FileBarChart },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Skills', href: '/skills', icon: Target },
  { label: 'Talent Search', href: '/talent-search', icon: Search },
  { label: 'Transactions', href: '/transactions', icon: DollarSign },
  { label: 'Wallet', href: '/wallet', icon: Wallet },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const filteredNavItems = searchQuery
    ? navigationItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : navigationItems;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#A855F7] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-lg">SF</span>
              </div>
              <span className="text-xl font-bold text-[#F8FAFC] hidden sm:inline">
                SkillFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Dropdown */}
          <nav className="hidden md:flex items-center gap-2">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#F8FAFC] transition-all duration-200">
                <Menu className="w-4 h-4" />
                <span>Navigate</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto rounded-xl bg-[#1E293B] border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {/* Search in dropdown */}
                <div className="sticky top-0 p-3 bg-[#1E293B] border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="text"
                      placeholder="Search pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] text-sm"
                    />
                  </div>
                </div>

                <div className="p-2 grid grid-cols-2 gap-1">
                  {filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30'
                            : 'hover:bg-white/5 text-[#CBD5E1]'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-[#22D3EE]/20 text-[#22D3EE]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {filteredNavItems.length === 0 && (
                  <div className="p-8 text-center text-[#64748B] text-sm">
                    No pages found
                  </div>
                )}
              </div>
            </div>

            {/* Quick Access Buttons */}
            <Link
              href="/settings"
              className={`p-2 rounded-lg transition-all duration-200 ${
                isActive('/settings')
                  ? 'bg-[#6366F1]/20 text-[#6366F1]'
                  : 'hover:bg-white/5 text-[#CBD5E1]'
              }`}
            >
              <Settings className="w-5 h-5" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-[#F8FAFC] transition-all duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#6366F1] text-sm"
                />
              </div>
            </div>

            <nav className="max-h-[60vh] overflow-y-auto space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30'
                        : 'hover:bg-white/5 text-[#CBD5E1]'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs px-2 py-1 rounded bg-[#22D3EE]/20 text-[#22D3EE]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
