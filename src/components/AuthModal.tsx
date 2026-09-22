import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  MapPin, 
  Heart, 
  Timer, 
  Activity, 
  ShieldCheck, 
  CheckCircle,
  ArrowRight,
  Flame,
  Sparkles
} from 'lucide-react';
import { AthleteProfile } from '../types';
import { calculateVDOT } from '../utils/vdotCalculator';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (athlete: AthleteProfile) => void;
  currentAthlete: AthleteProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentAthlete,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign in state
  const [email, setEmail] = useState('nagaraj@onwrdsports.in');
  const [password, setPassword] = useState('••••••••••••');

  // Sign up state
  const [newName, setNewName] = useState('Priya Sharma');
  const [newEmail, setNewEmail] = useState('priya.sharma@endurance.in');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newDiscipline, setNewDiscipline] = useState('Marathon & Half Marathon');
  const [newAge, setNewAge] = useState(29);
  const [newWeight, setNewWeight] = useState(62);
  const [newRestHr, setNewRestHr] = useState(50);
  const [newMaxHr, setNewMaxHr] = useState(190);
  const [benchmarkDist, setBenchmarkDist] = useState<number>(5000); // 5km
  const [benchmarkMin, setBenchmarkMin] = useState<number>(22);
  const [benchmarkSec, setBenchmarkSec] = useState<number>(15);

  if (!isOpen) return null;

  // Calculate live VDOT preview during signup
  const totalSec = benchmarkMin * 60 + benchmarkSec;
  const liveVdot = calculateVDOT(benchmarkDist, totalSec);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Default athlete
    const athlete: AthleteProfile = {
      name: email.includes('priya') ? 'Priya Sharma' : 'Nagaraj R.',
      city: email.includes('priya') ? 'Mumbai' : 'Bangalore',
      country: 'India',
      avatar: email.includes('priya')
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      vo2Max: email.includes('priya') ? 49 : 54,
      readinessScore: 88,
      hrRest: 48,
      hrMax: 188,
      weightKg: 68.5,
      currentStreakDays: 14,
      primaryDiscipline: 'Marathon & 70.3 Triathlon',
      weeklyGoalKm: 75,
      weeklyCompletedKm: 58.4,
    };
    onLoginSuccess(athlete);
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const athlete: AthleteProfile = {
      name: newName,
      city: newCity,
      country: 'India',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      vo2Max: Math.round(liveVdot),
      readinessScore: 92,
      hrRest: newRestHr,
      hrMax: newMaxHr,
      weightKg: newWeight,
      currentStreakDays: 1,
      primaryDiscipline: newDiscipline,
      weeklyGoalKm: 50,
      weeklyCompletedKm: 0,
    };
    onLoginSuccess(athlete);
    onClose();
  };

  const handleDemoSignIn = (type: 'nagaraj' | 'priya') => {
    if (type === 'priya') {
      onLoginSuccess({
        name: 'Priya Sharma',
        city: 'Mumbai',
        country: 'India',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        vo2Max: 49,
        readinessScore: 91,
        hrRest: 46,
        hrMax: 192,
        weightKg: 61,
        currentStreakDays: 18,
        primaryDiscipline: 'Ironman 70.3 Goa & Half Marathon',
        weeklyGoalKm: 65,
        weeklyCompletedKm: 46.2,
      });
    } else {
      onLoginSuccess({
        name: 'Nagaraj R.',
        city: 'Bangalore',
        country: 'India',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        vo2Max: 54,
        readinessScore: 88,
        hrRest: 48,
        hrMax: 188,
        weightKg: 68.5,
        currentStreakDays: 14,
        primaryDiscipline: 'Tata Mumbai Marathon Sub-3:30',
        weeklyGoalKm: 75,
        weeklyCompletedKm: 58.4,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#101015] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#181822] via-[#121217] to-[#181822] px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF5500]/15 border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white tracking-wide">
                {authMode === 'signin' ? 'ATHLETE SIGN IN' : 'CREATE ONWRD ATHLETE ACCOUNT'}
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Endurance profile &middot; VDOT & HR calibration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-800 bg-[#0C0C10]">
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-3 text-xs font-mono font-bold transition-all ${
              authMode === 'signin'
                ? 'text-[#FF5500] border-b-2 border-[#FF5500] bg-[#14141C]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-3 text-xs font-mono font-bold transition-all ${
              authMode === 'signup'
                ? 'text-[#FF5500] border-b-2 border-[#FF5500] bg-[#14141C]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            NEW ATHLETE SIGN UP (VDOT ONBOARDING)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {authMode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0A0A0E] border border-zinc-700 rounded-xl text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0A0A0E] border border-zinc-700 rounded-xl text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#FF5500] rounded" />
                  <span>Remember session</span>
                </label>
                <span className="text-[#FF5500] hover:underline cursor-pointer">Forgot password?</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF5500] hover:bg-[#FF6600] text-black font-heading font-extrabold text-sm uppercase tracking-wider transition-all orange-glow-sm cursor-pointer"
              >
                SIGN IN TO ONWRD
              </button>

              {/* Quick Demo Athlete Sign-in Buttons */}
              <div className="pt-4 border-t border-zinc-800 text-center space-y-2">
                <span className="text-[11px] font-mono text-zinc-500">Quick Switch Demo Athlete:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('nagaraj')}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#161622] hover:bg-[#20202F] border border-zinc-700 text-xs font-mono text-zinc-300 transition-colors text-left flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FF5500]"></span>
                    <div>
                      <div className="text-white font-bold">Nagaraj R.</div>
                      <div className="text-[10px] text-zinc-400">VDOT 54 &middot; Bengaluru</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('priya')}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#161622] hover:bg-[#20202F] border border-zinc-700 text-xs font-mono text-zinc-300 transition-colors text-left flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <div>
                      <div className="text-white font-bold">Priya S.</div>
                      <div className="text-[10px] text-zinc-400">VDOT 49 &middot; Mumbai</div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Sign Up with VDOT & Biometrics */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Athlete Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0E] border border-zinc-700 rounded-lg text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">City / State</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0E] border border-zinc-700 rounded-lg text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0E] border border-zinc-700 rounded-lg text-sm text-white font-mono focus:border-[#FF5500] focus:outline-none"
                />
              </div>

              {/* Benchmark Race for Mathematical VDOT */}
              <div className="p-3 bg-[#0B0B0F] border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Benchmark Race (Mathematical VDOT Seed)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#FF5500] bg-[#FF5500]/15 px-2 py-0.5 rounded">
                    VDOT: {liveVdot}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 block">Distance</label>
                    <select
                      value={benchmarkDist}
                      onChange={(e) => setBenchmarkDist(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-[#14141C] border border-zinc-700 rounded text-xs text-white font-mono"
                    >
                      <option value={5000}>5K (5,000m)</option>
                      <option value={10000}>10K (10,000m)</option>
                      <option value={21097.5}>Half Marathon</option>
                      <option value={42195}>Full Marathon</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 block">Minutes</label>
                    <input
                      type="number"
                      value={benchmarkMin}
                      onChange={(e) => setBenchmarkMin(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-[#14141C] border border-zinc-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 block">Seconds</label>
                    <input
                      type="number"
                      value={benchmarkSec}
                      onChange={(e) => setBenchmarkSec(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-[#14141C] border border-zinc-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Biometrics for HR Zones */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Resting HR</label>
                  <input
                    type="number"
                    value={newRestHr}
                    onChange={(e) => setNewRestHr(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#0A0A0E] border border-zinc-700 rounded text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Max HR</label>
                  <input
                    type="number"
                    value={newMaxHr}
                    onChange={(e) => setNewMaxHr(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#0A0A0E] border border-zinc-700 rounded text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#0A0A0E] border border-zinc-700 rounded text-xs text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF5500] hover:bg-[#FF6600] text-black font-heading font-extrabold text-sm uppercase tracking-wider transition-all orange-glow-sm cursor-pointer"
              >
                CREATE ACCOUNT & CALIBRATE (VDOT {liveVdot})
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
