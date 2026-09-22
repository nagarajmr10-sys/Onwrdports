import React from 'react';
import { OnwrdLogo } from './OnwrdLogo';
import { 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  Cpu,
  Smartphone
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'dashboard' | 'plans' | 'math_plans' | 'gadgets' | 'activities' | 'pricing') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#08080A] border-t border-[#1C1C24] text-zinc-400 text-xs font-sans mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand & Mission (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <OnwrdLogo size="md" />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Onwrd Sports is India's premier endurance training platform. Engineered for runners, triathletes, and cyclists seeking mathematical precision, multi-gadget synchronization, and periodized training blueprints.
            </p>
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Indiranagar, Bangalore, Karnataka &middot; 560038</span>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
              PLATFORM
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#FF5500] transition-colors">
                  Athlete Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#FF5500] transition-colors">
                  PMC Fitness (CTL/ATL)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plans')} className="hover:text-[#FF5500] transition-colors">
                  Structured Training Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gadgets')} className="hover:text-[#FF5500] transition-colors">
                  Garmin & Strava Sync
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('activities')} className="hover:text-[#FF5500] transition-colors">
                  Activity Telemetry Log
                </button>
              </li>
            </ul>
          </div>

          {/* Hardware & Compatibility (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>SUPPORTED HARDWARE</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
              <span className="p-1.5 rounded bg-[#111116] border border-zinc-850">Garmin Connect</span>
              <span className="p-1.5 rounded bg-[#111116] border border-zinc-850">Strava API v3</span>
              <span className="p-1.5 rounded bg-[#111116] border border-zinc-850">Wahoo ELEMNT</span>
              <span className="p-1.5 rounded bg-[#111116] border border-zinc-850">Coros Pace / Apex</span>
              <span className="p-1.5 rounded bg-[#111116] border border-zinc-850">Apple Watch Ultra</span>
              <span className="p-1.5 rounded bg-[#111116] border border-zinc-850">Polar Flow & Suunto</span>
            </div>
          </div>

          {/* India Payments & GST Compliance (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>INDIA PAYMENTS & GST</span>
            </h4>
            <div className="p-3 bg-[#111116] border border-zinc-850 rounded-xl space-y-1.5 font-mono text-[11px]">
              <div className="text-white font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NPCI UPI 2.0 & RuPay</span>
              </div>
              <p className="text-zinc-400 text-[10px]">
                Google Pay, PhonePe, Paytm, BHIM, CRED, RuPay Debit & NetBanking.
              </p>
              <div className="pt-1.5 border-t border-zinc-800 text-[10px] text-zinc-400">
                GSTIN: 29AABCO9984K1Z5 (SAC 998431)
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-zinc-500 font-mono text-[11px] gap-2">
          <span>&copy; {new Date().getFullYear()} Onwrd Sports Technologies Pvt Ltd. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy & Telemetry</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-400 cursor-pointer">Refund Policy (India)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
