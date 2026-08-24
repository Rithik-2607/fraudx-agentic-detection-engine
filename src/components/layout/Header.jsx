import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, CircleDot, Play } from 'lucide-react';
import { useState } from 'react';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', breadcrumb: 'Fraud Intelligence / Dashboard' },
  '/live-monitor': { title: 'Live Monitor', breadcrumb: 'Fraud Intelligence / Live Monitor' },
  '/transactions': { title: 'Transactions', breadcrumb: 'Fraud Intelligence / Transactions' },
  '/fraud-rings': { title: 'Fraud Rings', breadcrumb: 'Fraud Intelligence / Fraud Rings' },
  '/investigations': { title: 'Investigations', breadcrumb: 'Fraud Intelligence / Investigations' },
  '/agents': { title: 'AI Agents', breadcrumb: 'Fraud Intelligence / AI Agents' },
  '/countermeasures': { title: 'Countermeasures', breadcrumb: 'Fraud Intelligence / Countermeasures' },
  '/reports': { title: 'Reports', breadcrumb: 'Fraud Intelligence / Reports' },
  '/analytics': { title: 'Analytics', breadcrumb: 'Fraud Intelligence / Analytics' },
  '/settings': { title: 'Settings', breadcrumb: 'System / Settings' },
};

export default function Header({ onMenuClick, onSearchClick, onNotificationsClick }) {
  const location = useLocation();
  const pathKey = '/' + location.pathname.split('/').filter(Boolean).slice(0, 1).join('/');
  const pageInfo = pageTitles[pathKey] || { title: 'FraudX', breadcrumb: 'Fraud Intelligence' };

  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-surface-600/50 bg-surface-800/80 backdrop-blur-sm">
      {/* Left: menu (mobile) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-surface-200 hover:text-white hover:bg-surface-700 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <p className="text-xs text-surface-300">{pageInfo.breadcrumb}</p>
        </div>
      </div>

      {/* Right: search, status, notifications, profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-700/60 text-surface-300 text-sm hover:bg-surface-600 hover:text-white transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-surface-600 text-surface-300 ml-2">⌘K</kbd>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-surface-200">
          <CircleDot className="w-3 h-3 text-accent-green animate-pulse-dot" />
          <span>System Operational</span>
        </div>

        <button
          onClick={onNotificationsClick}
          className="relative flex items-center justify-center w-8 h-8 rounded-lg text-surface-300 hover:text-white hover:bg-surface-700 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-red" />
        </button>

        <div className="w-7 h-7 rounded-full bg-accent-blue/20 flex items-center justify-center text-xs font-semibold text-accent-blue ml-1">
          RK
        </div>
      </div>
    </header>
  );
}
