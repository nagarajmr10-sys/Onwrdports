import React, { useState } from 'react';
import { OnwrdLogo } from './OnwrdLogo';
import { 
  Activity, 
  Calendar, 
  Cpu, 
  CreditCard, 
  RotateCw, 
  CheckCircle2, 
  Menu, 
  X, 
  Flame, 
  Heart,
  TrendingUp,
  Award,
  Calculator,
  User,
  LogIn
} from 'lucide-react';
import { AthleteProfile } from '../types';

export type NavTabType = 'dashboard' | 'plans' | 'math_plans' | 'gadgets' | 'activities' | 'pricing';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  athlete: AthleteProfile;
  isSyncing: boolean;
  onQuickSync: () => void;
  onOpenUpgradeModal: () => void;
  onOpenAuthModal: () => void;
  isProUser: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  athlete,
  isSyncing,
  onQuickSync,
  onOpenUpgradeModal,
  onOpenAuthModal,
  isProUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'math_plans', label: 'VDOT Math Plans', icon: Calculator, badge: 'MATH' },
    { id: 'plans', label: 'Coached Plans', icon: Calendar },
    { id: 'gadgets', label: 'Gadget Sync', icon: Cpu },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'pricing', label: 'India Pricing & UPI', icon: CreditCard },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-[#1E1E26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="cursor-pointer transition-opacity hover:opacity-90"
            id="nav-brand-logo"
          >
            <OnwrdLogo size="md" animateOnHover />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id as NavTabType)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1C1C24] text-[#FF5500] border border-[#FF5500]/30 shadow-[0_0_12px_rgba(255,85,0,0.15)]'
                      : 'text-zinc-400 hover:text-white hover:bg-[#141419]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5500]' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="px-1 py-0.2 rounded bg-[#FF5500]/20 text-[#FF5500] text-[9px] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick Gadget Sync Button */}
            <button
              id="quick-sync-btn"
              onClick={onQuickSync}
              disabled={isSyncing}
              title="Sync Garmin, Strava & Wahoo"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                isSyncing
                  ? 'bg-[#1A1A22] border-[#FF5500] text-[#FF5500]'
                  : 'bg-[#121217] border-zinc-800 text-zinc-300 hover:border-[#FF5500]/50 hover:text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#FF5500]' : 'text-zinc-400'}`} />
              <span>{isSyncing ? 'SYNCING...' : 'SYNC GADGETS'}</span>
            </button>

            {/* Pro Status Badge or Upgrade Button */}
            {isProUser ? (
              <div 
                id="pro-status-badge"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/40 text-[#FF5500] text-xs font-bold font-mono tracking-wider"
              >
                <Award className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>ONWRD PRO</span>
              </div>
            ) : (
              <button
                id="header-upgrade-btn"
                onClick={onOpenUpgradeModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF5500] hover:bg-[#FF6600] text-black text-xs font-extrabold font-heading uppercase tracking-wider transition-all orange-glow-sm"
              >
                <Flame className="w-3.5 h-3.5 fill-black" />
                <span>GO PRO (₹699)</span>
              </button>
            )}

            {/* Sign In / Sign Up Athlete Button */}
            <button
              id="header-auth-btn"
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg bg-[#14141D] hover:bg-[#1D1D2B] border border-zinc-800 hover:border-[#FF5500]/40 transition-colors text-left"
              title="Sign in, sign up, or switch profile"
            >
              <div className="relative">
                <img
                  src={athlete.avatar}
                  alt={athlete.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#FF5500]/60"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0A0A0C]" />
              </div>
              <div className="text-left leading-tight hidden lg:block">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{athlete.name}</span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  VDOT {athlete.vo2Max} &middot; {athlete.city}
                </div>
              </div>
              <User className="w-3.5 h-3.5 text-zinc-400 ml-1" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAuthModal}
              className="p-2 rounded-lg bg-[#141419] border border-zinc-800 text-zinc-300"
              title="Account / Sign In"
            >
              <User className="w-4 h-4 text-[#FF5500]" />
            </button>
            <button
              onClick={onQuickSync}
              disabled={isSyncing}
              className="p-2 rounded-lg bg-[#141419] border border-zinc-800 text-zinc-300"
            >
              <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#FF5500]' : ''}`} />
            </button>
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#141419] border border-zinc-800 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0F0F14] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-2">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-2">
            <div 
              onClick={() => {
                onOpenAuthModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <img src={athlete.avatar} alt={athlete.name} className="w-8 h-8 rounded-full border border-[#FF5500]" />
              <div>
                <p className="text-sm font-bold text-white">{athlete.name}</p>
                <p className="text-xs text-zinc-400 font-mono">VDOT {athlete.vo2Max} | {athlete.city} (Switch)</p>
              </div>
            </div>
            {!isProUser && (
              <button
                onClick={() => {
                  onOpenUpgradeModal();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 text-xs font-bold bg-[#FF5500] text-black rounded uppercase"
              >
                PRO ₹699
              </button>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as NavTabType);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-[#1F1F2A] text-[#FF5500] border border-[#FF5500]/40'
                    : 'text-zinc-300 hover:bg-[#16161D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5500]' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {'badge' in item && item.badge && (
                  <span className="px-1.5 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] text-[9px] font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
