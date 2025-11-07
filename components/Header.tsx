'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

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

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll detection
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'translate-y-0 bg-[#0A0E27]/95 backdrop-blur-xl border-b border-white/10 shadow-lg' 
        : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo.svg" 
              alt="SkillFlow Logo" 
              width={120} 
              height={40} 
              className="group-hover:scale-105 transition-transform duration-200"
            />
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
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        isActive(item.href)
                          ? 'text-[#6366F1] bg-[#6366F1]/10'
                          : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
                      }`}
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
          <div className="hidden lg:flex items-center gap-3">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-[#F8FAFC] transition-all duration-200"
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
        <div className="lg:hidden border-t border-white/10 bg-[#0A0E27]">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-2.5 rounded-lg text-sm transition-all ${
                        isActive(item.href)
                          ? 'bg-[#6366F1]/20 text-[#6366F1] font-medium'
                          : 'text-[#CBD5E1] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/pricing"
                className="block px-4 py-2.5 rounded-lg text-sm text-[#CBD5E1] hover:bg-white/5 hover:text-white transition-all"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="block px-4 py-2.5 text-center text-sm font-medium text-[#E2E8F0] border border-white/20 rounded-lg hover:border-white/40"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2.5 text-center bg-[#4F46E5] hover:bg-[#6366F1] text-white text-sm font-semibold rounded-lg transition-all"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
