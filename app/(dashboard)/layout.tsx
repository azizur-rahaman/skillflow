/**
 * Dashboard Layout
 * 
 * Layout wrapper for all dashboard routes.
 * Provides common structure including sidebar navigation and header.
 */

'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content with left margin for sidebar */}
      <main className="ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
