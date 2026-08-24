import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Radio, ArrowLeftRight, Network, Search as SearchIcon,
  Bot, Shield, FileText, BarChart3, Settings, ChevronLeft, ChevronRight,
  Activity, CircleDot, Menu, X
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/live-monitor', label: 'Live Monitor', icon: Radio },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/fraud-rings', label: 'Fraud Rings', icon: Network },
  { path: '/investigations', label: 'Investigations', icon: SearchIcon },
  { path: '/agents', label: 'AI Agents', icon: Bot },
  { path: '/countermeasures', label: 'Countermeasures', icon: Shield },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const location = useLocation();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-surface-600/50">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-accent-blue" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-bold tracking-wide text-white">FRAUDX</h1>
              <p className="text-[10px] text-surface-200 tracking-wider uppercase">Autonomous Fraud Intelligence</p>
            </div>
          )}
        </div>
        {/* Desktop toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded text-surface-200 hover:text-white hover:bg-surface-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="lg:hidden flex items-center justify-center w-6 h-6 rounded text-surface-200 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <NavLink
              key={path}
              to={path}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? 'bg-accent-blue/12 text-accent-blue'
                  : 'text-surface-200 hover:text-white hover:bg-surface-700/60'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-accent-blue' : 'text-surface-300 group-hover:text-white'}`} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-surface-600/50 px-2 py-3 space-y-0.5">
        {/* System status */}
        <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
          <CircleDot className="w-4 h-4 text-accent-green animate-pulse-dot" />
          {!collapsed && (
            <span className="text-xs text-surface-200">System Operational</span>
          )}
        </div>

        <NavLink
          to="/settings"
          onClick={onMobileClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
            ${location.pathname === '/settings'
              ? 'bg-accent-blue/12 text-accent-blue'
              : 'text-surface-200 hover:text-white hover:bg-surface-700/60'
            }
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {/* User */}
        <div className={`flex items-center gap-3 px-3 py-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-accent-blue/20 flex items-center justify-center text-xs font-semibold text-accent-blue flex-shrink-0">
            RK
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Rahul K.</p>
              <p className="text-[11px] text-surface-300 truncate">Fraud Analyst</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-surface-800 border-r border-surface-600/50 transition-all duration-200 ${
          collapsed ? 'w-[68px]' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-surface-800 border-r border-surface-600/50 w-60 transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
