/**
 * Dashboard Sidebar Navigation
 * 
 * Left sidebar with navigation to all dashboard features.
 * Includes icons, labels, and active state highlighting.
 */

'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Dna,
  Target,
  TrendingUp,
  BarChart3,
  Flame,
  Brain,
  Shield,
  BookOpen,
  GraduationCap,
  Award,
  Wallet,
  ShoppingBag,
  Users,
  UserCircle,
  Settings,
  FileText,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Search,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe,
  Lock,
  HelpCircle,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string | number;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Skills',
    href: '/skills',
    icon: Brain,
    children: [
      { label: 'Skill DNA', href: '/skills/dna', icon: Dna },
      { label: 'Growth Rings', href: '/skills/growth', icon: Target },
      { label: 'Skill Graph', href: '/skills/graph', icon: Globe },
      { label: 'Extraction', href: '/skills/extraction', icon: Sparkles },
      { label: 'Trending Skills', href: '/skills/trending', icon: TrendingUp },
      { label: 'Skill Heatmap', href: '/skills/heatmap', icon: BarChart3 },
      { label: 'Obsolescence Risk', href: '/skills/risk', icon: AlertTriangle },
    ],
  },
  {
    label: 'Learning',
    href: '/learning',
    icon: BookOpen,
    children: [
      { label: 'Learning Paths', href: '/learning-path', icon: GraduationCap },
      { label: 'Skill Mastery', href: '/mastery', icon: Award },
    ],
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    children: [
      { label: 'Team Skills', href: '/analytics/team-skills', icon: Users },
      { label: 'Platform Analytics', href: '/platform-analytics', icon: TrendingUp },
      { label: 'Reports', href: '/reports/builder', icon: FileText },
    ],
  },
  {
    label: 'Forecast',
    href: '/forecast',
    icon: TrendingUp,
  },
  {
    label: 'Gamification',
    href: '/gamification',
    icon: Flame,
  },
  {
    label: 'Credentials',
    href: '/mint',
    icon: Award,
  },
  {
    label: 'Wallet',
    href: '/wallet',
    icon: Wallet,
  },
  {
    label: 'Marketplace',
    href: '/marketplace',
    icon: ShoppingBag,
  },
  {
    label: 'Talent Search',
    href: '/talent-search',
    icon: Search,
  },
  {
    label: 'Candidate Profile',
    href: '/candidate-profile',
    icon: UserCircle,
  },
  {
    label: 'Experience',
    href: '/experience',
    icon: Briefcase,
  },
  {
    label: 'Assessments',
    href: '/assessments',
    icon: CheckCircle,
  },
  {
    label: 'Q&A',
    href: '/qa',
    icon: HelpCircle,
  },
  {
    label: 'Compliance',
    href: '/compliance',
    icon: Shield,
  },
  {
    label: 'RBAC',
    href: '/rbac',
    icon: Lock,
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: DollarSign,
  },
  {
    label: 'Documentation',
    href: '/docs',
    icon: FileText,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: UserCircle,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setExpandedItems([]);
    }
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href) || false;
  };

  const isExpanded = (label: string) => expandedItems.includes(label);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-r border-white/10 transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#A855F7] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[#F8FAFC]">SkillFlow</span>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const expanded = isExpanded(item.label);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.label}>
                {/* Main Nav Item */}
                <button
                  onClick={() => {
                    if (hasChildren && !collapsed) {
                      toggleExpand(item.label);
                    } else {
                      router.push(item.href);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-[#6366F1]/20 to-[#A855F7]/20 border border-[#6366F1]/30 text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      active ? 'text-[#6366F1]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                    }`}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-xs font-semibold">
                          {item.badge}
                        </span>
                      )}
                      {hasChildren && (
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            expanded ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Children */}
                {hasChildren && !collapsed && expanded && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-white/10 pl-3">
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = isActive(child.href);

                      return (
                        <button
                          key={child.label}
                          onClick={() => router.push(child.href)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            childActive
                              ? 'bg-white/10 text-[#F8FAFC] font-medium'
                              : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                          }`}
                        >
                          <ChildIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-[#6366F1]/10 to-[#A855F7]/10 border border-[#6366F1]/20">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#F8FAFC] truncate">
                Alex Morgan
              </div>
              <div className="text-xs text-[#64748B] truncate">
                alex@skillflow.com
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
