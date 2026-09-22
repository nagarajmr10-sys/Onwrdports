import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  LineChart,
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart,
  Legend,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { 
  Flame, 
  Activity, 
  TrendingUp, 
  Heart, 
  Mountain, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Send, 
  ShieldCheck, 
  Calendar,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { 
  AthleteProfile, 
  Activity as ActivityType, 
  PMCMetric, 
  Workout,
  RestingHRRecord
} from '../types';
import { WEEKLY_RESTING_HR_DATA, INITIAL_PMC_DATA } from '../data/mockSportsData';

interface DashboardProps {
  athlete: AthleteProfile;
  pmcData?: PMCMetric[];
  activities: ActivityType[];
  todayWorkout: Workout;
  hrZones: { zone: string; range: string; percentage: number; timeMinutes: number; color: string }[];
  weeklyVolume: { day: string; run: number; bike: number; swim: number; strength: number; totalMinutes: number }[];
  restingHrData?: RestingHRRecord[];
  onSelectActivity: (activity: ActivityType) => void;
  onNavigateToPlans: () => void;
  onNavigateToGadgets: () => void;
  onOpenUpgradeModal: () => void;
  isProUser: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  athlete,
  pmcData = INITIAL_PMC_DATA,
  activities,
  todayWorkout,
  hrZones,
  weeklyVolume,
  restingHrData = WEEKLY_RESTING_HR_DATA,
  onSelectActivity,
  onNavigateToPlans,
  onNavigateToGadgets,
  onOpenUpgradeModal,
  isProUser,
}) => {
  // PMC Visibility Toggles
  const [showCtl, setShowCtl] = useState(true);
  const [showAtl, setShowAtl] = useState(true);
  const [showTsb, setShowTsb] = useState(true);
  const [showTss, setShowTss] = useState(true);

  // Weekly mileage progress
  const weeklyPct = Math.min(100, Math.round((athlete.weeklyCompletedKm / athlete.weeklyGoalKm) * 100));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Garmin / Fitpage Style: Training Readiness Hero Card */}
      <div className="bg-gradient-to-br from-[#13131A] via-[#0E0E14] to-[#161414] border border-zinc-800 rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Athlete Readiness & Biometrics */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Circular Readiness Gauge */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#1D1D27"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#FF5500"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * athlete.readinessScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-heading text-3xl sm:text-4xl font-black text-white leading-none">
                  {athlete.readinessScore}
                </span>
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                  READINESS
                </span>
              </div>
            </div>

            {/* Status explanation */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>PRIME TO TRAIN</span>
                </span>
                <span className="text-xs text-zinc-400 font-mono">Synced from Garmin FR965</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-wide">
                EXCELLENT RECOVERY & FORWARD FORM
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1">
                Your HRV status is balanced (62ms), sleep score reached 92%, and your acute training fatigue has subsided. Today is optimal for threshold and interval pacing.
              </p>
            </div>
          </div>

          {/* Biometric Vital Chips */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-[#0B0B0E] p-3 sm:p-4 rounded-xl border border-zinc-800/80 font-mono text-center">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Resting HR</span>
              <span className="text-base sm:text-lg font-bold text-white">{athlete.hrRest} <span className="text-[10px] text-zinc-400">bpm</span></span>
            </div>
            <div className="border-x border-zinc-800 px-2 sm:px-4">
              <span className="text-[10px] text-zinc-400 uppercase block">Est. VO2 Max</span>
              <span className="text-base sm:text-lg font-bold text-[#FF5500]">{athlete.vo2Max}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Streak</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400">{athlete.currentStreakDays} <span className="text-[10px] text-zinc-400">days</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Stats Strip (TrainingPeaks / Strava) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Weekly Distance */}
        <div className="bg-[#121217] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>WEEKLY KM</span>
            <Activity className="w-3.5 h-3.5 text-[#FF5500]" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-heading font-extrabold text-white">{athlete.weeklyCompletedKm}</span>
              <span className="text-xs font-mono text-zinc-400">/ {athlete.weeklyGoalKm} km</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#FF5500] rounded-full transition-all duration-700"
                style={{ width: `${weeklyPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fitness (CTL) */}
        <div className="bg-[#121217] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>FITNESS (CTL)</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-heading font-extrabold text-blue-400">75</div>
            <span className="text-[10px] font-mono text-emerald-400">+4.2 pts 42-day build</span>
          </div>
        </div>

        {/* Fatigue (ATL) */}
        <div className="bg-[#121217] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>FATIGUE (ATL)</span>
            <Flame className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-heading font-extrabold text-purple-400">62</div>
            <span className="text-[10px] font-mono text-zinc-400">7-day acute strain</span>
          </div>
        </div>

        {/* Form (TSB) */}
        <div className="bg-[#121217] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>FORM (TSB)</span>
            <Zap className="w-3.5 h-3.5 text-[#FF5500]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-heading font-extrabold text-[#FF5500]">+13</div>
            <span className="text-[10px] font-mono text-emerald-400">Race Ready Freshness</span>
          </div>
        </div>

        {/* Weekly Elevation */}
        <div className="bg-[#121217] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>ELEVATION</span>
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-heading font-extrabold text-white">736 <span className="text-xs font-mono text-zinc-400">m</span></div>
            <span className="text-[10px] font-mono text-zinc-400">Nandi Hills climb</span>
          </div>
        </div>

        {/* Total TSS */}
        <div className="bg-[#121217] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>WEEKLY TSS</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-heading font-extrabold text-white">345 <span className="text-xs font-mono text-[#FF5500]">TSS</span></div>
            <span className="text-[10px] font-mono text-zinc-400">On Target Load</span>
          </div>
        </div>
      </div>

      {/* 2.5 Garmin & Strava Health & Daily Telemetry Hub (Steps, Calories, Elevation GAP, Load Focus) */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-heading font-extrabold text-white">
                GARMIN & STRAVA DAILY BIOMETRIC TELEMETRY
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] font-bold">
                LIVE GADGET TELEMETRY
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Daily steps, active vs resting calories, grade-adjusted elevation, and Garmin training load focus
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            Last Garmin sync: <span className="text-emerald-400">2 min ago</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Card A: Daily Steps (Garmin Style) */}
          <div className="bg-[#0C0C10] border border-zinc-850 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <Activity className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>DAILY STEPS</span>
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">95% OF GOAL</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-heading font-extrabold text-white">11,428</span>
                <span className="text-xs font-mono text-zinc-400">/ 12,000</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#FF5500] h-full rounded-full" style={{ width: '95.2%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-900 text-[11px] font-mono">
              <div>
                <span className="text-zinc-500 block text-[9px]">STEP DISTANCE</span>
                <span className="text-zinc-200 font-bold">8.9 km</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[9px]">FLOORS CLIMBED</span>
                <span className="text-zinc-200 font-bold">18 floors</span>
              </div>
            </div>
          </div>

          {/* Card B: Calories Burnt (Active vs Resting - Garmin/Strava) */}
          <div className="bg-[#0C0C10] border border-zinc-850 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <Flame className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>CALORIES BURNT</span>
                </span>
                <span className="text-[#FF5500] text-[10px] font-bold">2,624 TOTAL KCAL</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-heading font-extrabold text-[#FF5500]">844</span>
                <span className="text-xs font-mono text-zinc-400">Active kcal</span>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 mt-1">
                +1,780 resting metabolic rate (BMR)
              </p>
            </div>

            <div className="space-y-1.5 mt-3 pt-3 border-t border-zinc-900 text-[11px] font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Workout Burn:</span>
                <span className="text-white font-bold">710 kcal (Run)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Daily Movement:</span>
                <span className="text-white font-bold">134 kcal</span>
              </div>
            </div>
          </div>

          {/* Card C: Elevation & Strava Grade-Adjusted Pace (GAP) */}
          <div className="bg-[#0C0C10] border border-zinc-850 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ELEVATION & GAP</span>
                </span>
                <span className="text-blue-400 text-[10px] font-bold">STRAVA ALGORITHM</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-heading font-extrabold text-white">4:32</span>
                <span className="text-xs font-mono text-[#FF5500]">GAP /km</span>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 mt-1">
                Flat equivalent pace (Actual: 5:08/km on hills)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-zinc-900 text-[11px] font-mono">
              <div>
                <span className="text-zinc-500 block text-[9px]">TOTAL GAIN</span>
                <span className="text-emerald-400 font-bold">+736 m</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[9px]">MAX GRADIENT</span>
                <span className="text-zinc-200 font-bold">14.8%</span>
              </div>
            </div>
          </div>

          {/* Card D: Garmin Training Load Focus */}
          <div className="bg-[#0C0C10] border border-zinc-850 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>GARMIN LOAD FOCUS</span>
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">PRODUCTIVE</span>
              </div>

              {/* Mini load bars */}
              <div className="space-y-1.5 font-mono text-[10px]">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-0.5">
                    <span>Anaerobic</span>
                    <span className="text-purple-400">110 / 120 (Optimal)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-0.5">
                    <span>High Aerobic</span>
                    <span className="text-[#FF5500]">340 / 350 (Optimal)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#FF5500] h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-0.5">
                    <span>Low Aerobic</span>
                    <span className="text-blue-400">620 / 600 (Optimal)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-900 text-[10px] font-mono text-zinc-400">
              Optimal balance for marathon & 70.3 endurance
            </div>
          </div>

        </div>
      </div>

      {/* 3. TrainingPeaks & Strava Performance Management Chart (PMC) */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-heading font-extrabold text-white">
                PERFORMANCE MANAGEMENT CHART (PMC)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] font-bold">
                TRAININGPEAKS & COGGAN ALGORITHM
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              42-day Chronic Training Load (Fitness), 7-day Acute Load (Fatigue), and Training Stress Balance (Form)
            </p>
          </div>

          {/* Interactive Metric Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCtl(!showCtl)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                showCtl 
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.2)]' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>CTL Fitness (42d)</span>
            </button>
            <button
              onClick={() => setShowAtl(!showAtl)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                showAtl 
                  ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.2)]' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>ATL Fatigue (7d)</span>
            </button>
            <button
              onClick={() => setShowTsb(!showTsb)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                showTsb 
                  ? 'bg-[#FF5500]/20 border-[#FF5500] text-[#FF5500] shadow-[0_0_8px_rgba(255,85,0,0.2)]' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
              <span>TSB Form (Race Freshness)</span>
            </button>
            <button
              onClick={() => setShowTss(!showTss)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                showTss 
                  ? 'bg-zinc-700/50 border-zinc-600 text-zinc-300' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              <span className="w-2 h-2 rounded bg-zinc-500" />
              <span>Daily TSS</span>
            </button>
          </div>
        </div>

        {/* Current PMC Vital Stat Widgets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <div className="flex items-center justify-between text-zinc-500 text-[10px]">
              <span>CURRENT FITNESS (CTL)</span>
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-heading font-extrabold text-[#38BDF8]">
                {pmcData[pmcData.length - 1]?.ctl ?? 75}
              </span>
              <span className="text-xs text-zinc-400">load</span>
              <span className="ml-1 text-[10px] text-emerald-400 font-bold">+4.2/wk</span>
            </div>
            <span className="text-[10px] text-zinc-500 block mt-0.5">42-day rolling training load</span>
          </div>

          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <div className="flex items-center justify-between text-zinc-500 text-[10px]">
              <span>CURRENT FATIGUE (ATL)</span>
              <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-heading font-extrabold text-[#C084FC]">
                {pmcData[pmcData.length - 1]?.atl ?? 62}
              </span>
              <span className="text-xs text-zinc-400">load</span>
              <span className="ml-1 text-[10px] text-purple-400 font-bold">-14 vs peak</span>
            </div>
            <span className="text-[10px] text-zinc-500 block mt-0.5">7-day acute systemic fatigue</span>
          </div>

          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <div className="flex items-center justify-between text-zinc-500 text-[10px]">
              <span>TRAINING STRESS BALANCE (TSB)</span>
              <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-heading font-extrabold text-[#FF5500]">
                +{pmcData[pmcData.length - 1]?.tsb ?? 13}
              </span>
              <span className="text-xs text-zinc-400">form</span>
              <span className="ml-1 text-[10px] text-emerald-400 font-bold">RACE READY</span>
            </div>
            <span className="text-[10px] text-zinc-500 block mt-0.5">CTL - ATL = Peak Freshness</span>
          </div>

          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <div className="flex items-center justify-between text-zinc-500 text-[10px]">
              <span>TODAY'S STIMULUS (TSS)</span>
              <span className="w-2 h-2 rounded bg-zinc-500" />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-heading font-extrabold text-white">
                {pmcData[pmcData.length - 1]?.tss ?? 85}
              </span>
              <span className="text-xs text-zinc-400">TSS</span>
              <span className="ml-1 text-[10px] text-zinc-400 font-bold">Tempo Run</span>
            </div>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Cubbon Park 12.4km session</span>
          </div>
        </div>

        {/* The Recharts Dual-Axis PMC Graph */}
        <div className="h-80 sm:h-96 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pmcData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid stroke="#1A1A24" strokeDasharray="3 3" vertical={false} />
              
              <XAxis 
                dataKey="date" 
                stroke="#52525B" 
                tick={{ fontSize: 11, fontFamily: 'monospace' }} 
              />
              
              {/* Left Y-Axis: Training Load (CTL, ATL, TSS) */}
              <YAxis 
                yAxisId="left"
                domain={[0, 130]} 
                stroke="#52525B" 
                tick={{ fontSize: 11, fontFamily: 'monospace' }} 
                unit=" TSS"
              />

              {/* Right Y-Axis: Form (TSB: -30 to +30) */}
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[-30, 30]} 
                ticks={[-30, -20, -10, 0, 10, 20, 30]}
                stroke="#52525B" 
                tick={{ fontSize: 11, fontFamily: 'monospace' }} 
                unit=" TSB"
              />

              {/* TSB = 0 Neutral Form Reference Line */}
              <ReferenceLine 
                yAxisId="right" 
                y={0} 
                stroke="#52525B" 
                strokeDasharray="4 4" 
                label={{ 
                  value: 'TSB = 0 (Neutral Form Baseline)', 
                  fill: '#71717A', 
                  fontSize: 10, 
                  fontFamily: 'monospace', 
                  position: 'insideTopLeft' 
                }} 
              />

              {/* Race Ready Form Window (+5 to +25) */}
              <ReferenceArea 
                yAxisId="right" 
                y1={5} 
                y2={25} 
                fill="#10B981" 
                fillOpacity={0.05} 
              />

              {/* Rich Custom Dark Tooltip */}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as PMCMetric;
                    const tsbVal = data.tsb;
                    let tsbCondition = 'Optimal Training Overload';
                    let tsbColor = 'text-amber-400';

                    if (tsbVal >= 5) {
                      tsbCondition = 'Peak Race Freshness (Supercompensated)';
                      tsbColor = 'text-emerald-400';
                    } else if (tsbVal >= 0) {
                      tsbCondition = 'Neutral / Active Recovery Freshness';
                      tsbColor = 'text-blue-400';
                    } else if (tsbVal < -20) {
                      tsbCondition = 'High Fatigue Accumulation / Caution';
                      tsbColor = 'text-rose-400';
                    }

                    return (
                      <div className="bg-[#0F0F14] border border-zinc-700/80 rounded-xl p-3.5 shadow-2xl font-mono text-xs space-y-1.5 min-w-[240px]">
                        <div className="text-white font-bold border-b border-zinc-800 pb-1.5 flex justify-between items-center">
                          <span>{data.date} ({data.day})</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 ${tsbColor} font-bold`}>
                            TSB {tsbVal > 0 ? `+${tsbVal}` : tsbVal}
                          </span>
                        </div>

                        <div className="space-y-1 pt-0.5">
                          <div className="flex justify-between items-center text-zinc-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                              <span>CTL Fitness (42d):</span>
                            </span>
                            <span className="font-bold text-[#38BDF8]">{data.ctl}</span>
                          </div>

                          <div className="flex justify-between items-center text-zinc-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
                              <span>ATL Fatigue (7d):</span>
                            </span>
                            <span className="font-bold text-[#C084FC]">{data.atl}</span>
                          </div>

                          <div className="flex justify-between items-center text-zinc-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
                              <span>TSB Form (CTL - ATL):</span>
                            </span>
                            <span className="font-bold text-[#FF5500]">
                              {data.tsb > 0 ? `+${data.tsb}` : data.tsb}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-zinc-400 pt-1 border-t border-zinc-850">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded bg-zinc-500" />
                              <span>Daily Workout TSS:</span>
                            </span>
                            <span className="font-bold text-white">{data.tss} TSS</span>
                          </div>
                        </div>

                        <div className="pt-1.5 text-[10px] text-zinc-400 border-t border-zinc-850">
                          Status: <span className={tsbColor}>{tsbCondition}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* TSS Bars (Left Axis) */}
              {showTss && (
                <Bar 
                  yAxisId="left"
                  dataKey="tss" 
                  fill="#2E2E3A" 
                  radius={[4, 4, 0, 0]} 
                  name="Daily TSS" 
                  opacity={0.65} 
                />
              )}

              {/* CTL Line: Blue (Left Axis) */}
              {showCtl && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ctl"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#38BDF8', stroke: '#0C0C10', strokeWidth: 2 }}
                  name="CTL Fitness (42d)"
                />
              )}

              {/* ATL Line: Purple (Left Axis) */}
              {showAtl && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="atl"
                  stroke="#C084FC"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: '#C084FC', stroke: '#0C0C10', strokeWidth: 2 }}
                  name="ATL Fatigue (7d)"
                />
              )}

              {/* TSB Line: Fluorescent Orange (Right Axis) */}
              {showTsb && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tsb"
                  stroke="#FF5500"
                  strokeWidth={3}
                  dot={{ r: 3.5, fill: '#FF5500', stroke: '#0C0C10', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#FFFFFF', stroke: '#FF5500', strokeWidth: 3 }}
                  name="TSB Form (Race Readiness)"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* PMC Infographic Explanation & Scientific Guide */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0C0C10] border border-zinc-850">
              <span className="w-3 h-1 bg-[#38BDF8] rounded-full flex-shrink-0" />
              <div>
                <span className="text-[#38BDF8] font-bold">CTL Fitness (75):</span>
                <p className="text-zinc-400 text-[11px]">42-day rolling load. Aerobic engine capacity built.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0C0C10] border border-zinc-850">
              <span className="w-3 h-1 bg-[#C084FC] rounded-full flex-shrink-0" />
              <div>
                <span className="text-[#C084FC] font-bold">ATL Fatigue (62):</span>
                <p className="text-zinc-400 text-[11px]">7-day acute strain. Receding rapidly after taper.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0C0C10] border border-zinc-850">
              <span className="w-3 h-1 bg-[#FF5500] rounded-full flex-shrink-0" />
              <div>
                <span className="text-[#FF5500] font-bold">TSB Form (+13):</span>
                <p className="text-zinc-400 text-[11px]">Freshness. In the green prime race window (+5 to +25).</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
            <span>Coggan Formula: TSB = CTL - ATL &middot; Safe Ramp Rate: &le; 5-8 CTL/wk</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Optimal Pre-Race Supercompensation Window
            </span>
          </div>
        </div>
      </div>

      {/* 3.5 Weekly Resting Heart Rate (RHR) Trend Chart (Garmin & Recharts) */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-heading font-extrabold text-white">
                WEEKLY RESTING HEART RATE & HRV TREND
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] font-bold">
                OPTICAL SENSOR TELEMETRY
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Garmin Elevate Gen 5 continuous 24/7 resting heart rate & parasympathetic recovery baseline
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]"></span>
              <span>Resting HR (bpm)</span>
            </span>
            <span className="text-zinc-600">&middot;</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-3 h-0.5 border-t border-dashed border-zinc-500"></span>
              <span>Baseline (49 bpm)</span>
            </span>
          </div>
        </div>

        {/* Quick Vital Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <span className="text-zinc-500 text-[10px] block">TODAY'S RHR</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-heading font-extrabold text-white">48</span>
              <span className="text-xs text-zinc-400">bpm</span>
              <span className="ml-1 text-[10px] text-emerald-400 font-bold">-1 vs avg</span>
            </div>
          </div>
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <span className="text-zinc-500 text-[10px] block">7-DAY AVERAGE</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-heading font-extrabold text-zinc-200">49.6</span>
              <span className="text-xs text-zinc-400">bpm</span>
            </div>
          </div>
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <span className="text-zinc-500 text-[10px] block">HRV 7-DAY STATUS</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-heading font-extrabold text-emerald-400">68</span>
              <span className="text-xs text-zinc-400">ms</span>
              <span className="ml-1 text-[10px] text-emerald-400 font-bold">Balanced</span>
            </div>
          </div>
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <span className="text-zinc-500 text-[10px] block">PHYSIOLOGICAL FORM</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-heading font-extrabold text-[#FF5500]">Prime</span>
              <span className="text-[10px] text-zinc-400">Supercompensated</span>
            </div>
          </div>
        </div>

        {/* Recharts LineChart for Resting HR */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={restingHrData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
              <CartesianGrid stroke="#1A1A24" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#52525B" 
                tick={{ fontSize: 11, fontFamily: 'monospace' }} 
              />
              <YAxis 
                domain={[44, 56]} 
                stroke="#52525B" 
                tick={{ fontSize: 11, fontFamily: 'monospace' }} 
                unit=" bpm"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as RestingHRRecord;
                    return (
                      <div className="bg-[#0F0F14] border border-zinc-700/80 rounded-xl p-3 shadow-2xl font-mono text-xs space-y-1">
                        <div className="text-white font-bold border-b border-zinc-800 pb-1 flex justify-between gap-4">
                          <span>{data.day} ({data.date})</span>
                          <span className="text-emerald-400 text-[10px]">{data.status}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-zinc-300 pt-1">
                          <span>Resting Heart Rate:</span>
                          <span className="text-[#FF5500] font-bold">{data.restingHr} bpm</span>
                        </div>
                        <div className="flex justify-between gap-4 text-zinc-400">
                          <span>7-Day Baseline:</span>
                          <span className="text-zinc-200">{data.baseline} bpm</span>
                        </div>
                        <div className="flex justify-between gap-4 text-zinc-400">
                          <span>Nightly HRV:</span>
                          <span className="text-emerald-400 font-bold">{data.hrvMs} ms</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine 
                y={49} 
                stroke="#52525B" 
                strokeDasharray="4 4" 
                label={{ 
                  value: '7-Day Baseline (49 bpm)', 
                  fill: '#71717A', 
                  fontSize: 10, 
                  fontFamily: 'monospace', 
                  position: 'insideTopRight' 
                }} 
              />
              <Line
                type="monotone"
                dataKey="restingHr"
                stroke="#FF5500"
                strokeWidth={3}
                dot={{ r: 5, fill: '#FF5500', stroke: '#0E0E14', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#FFFFFF', stroke: '#FF5500', strokeWidth: 3 }}
                name="Resting HR (bpm)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insight footer callout */}
        <div className="p-3 bg-[#0C0C10] border border-zinc-850 rounded-xl flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#FF5500] flex-shrink-0" />
            <span>
              Resting HR decreased to <strong className="text-white">48 bpm</strong> following Friday's rest day and recovery sleep. Low morning RHR coupled with elevated HRV (<strong className="text-emerald-400">68ms</strong>) indicates high parasympathetic tone and ready physiological adaptation.
            </span>
          </div>
        </div>
      </div>

      {/* 4. Two Columns: Fitpage Heart Rate Zones & Weekly Discipline Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Heart Rate Zones (Fitpage / Garmin Standard) - 6 cols */}
        <div className="lg:col-span-6 bg-[#121217] border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-heading font-extrabold text-white">
                HEART RATE ZONE DISTRIBUTION
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Aerobic base (Z2) 80/20 polarized distribution rule
              </p>
            </div>
            <Heart className="w-5 h-5 text-[#FF5500]" />
          </div>

          <div className="space-y-3">
            {hrZones.map((zone, idx) => (
              <div key={idx} className="bg-[#0D0D12] p-3 rounded-xl border border-zinc-850">
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
                    <span className="text-white font-bold">{zone.zone}</span>
                    <span className="text-zinc-500">({zone.range})</span>
                  </div>
                  <span className="text-zinc-300 font-bold">{zone.timeMinutes}m &middot; {zone.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${zone.percentage}%`, backgroundColor: zone.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-[#171722] border border-zinc-800 rounded-xl text-xs text-zinc-400 font-mono">
            <span className="text-emerald-400 font-bold">Optimal Endurance Distribution: </span>
            52% of your weekly volume was in strict Zone 2 Aerobic Base, optimizing mitochondrial fat oxidation.
          </div>
        </div>

        {/* Weekly Discipline Breakdown Chart - 6 cols */}
        <div className="lg:col-span-6 bg-[#121217] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-heading font-extrabold text-white">
                  WEEKLY DISCIPLINE VOLUME
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Multi-sport hours: Run (31.1km), Bike (139km), Swim (4km)
                </p>
              </div>
              <Layers className="w-5 h-5 text-[#FF5500]" />
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#1A1A24" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="#52525B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <YAxis stroke="#52525B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F0F14',
                      borderColor: '#272733',
                      borderRadius: '10px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="run" fill="#FF5500" name="Run (km)" stackId="a" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="bike" fill="#38BDF8" name="Bike (km)" stackId="a" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="swim" fill="#10B981" name="Swim (km)" stackId="a" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-around pt-3 border-t border-zinc-800 text-xs font-mono">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#FF5500] rounded"></span> Run (31.1k)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#38BDF8] rounded"></span> Bike (139k)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#10B981] rounded"></span> Swim (4.0k)</span>
          </div>
        </div>

      </div>

      {/* 5. Today's Scheduled Structured Workout Card */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/15 text-[#FF5500] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] uppercase">
                  ACTIVE TRAINING PLAN &middot; WEEK 4
                </span>
                <span className="text-xs font-mono text-zinc-400">{todayWorkout.dateStr}</span>
              </div>
              <h3 className="text-xl font-heading font-extrabold text-white mt-0.5">
                TODAY: {todayWorkout.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>COMPLETED ON GARMIN (85 TSS)</span>
            </span>
          </div>
        </div>

        {/* Structured Workout Steps */}
        <div className="bg-[#0C0C10] rounded-xl p-4 border border-zinc-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            {todayWorkout.structuredSteps.map((step, idx) => (
              <div key={idx} className="bg-[#14141C] p-3 rounded-lg border border-zinc-800">
                <span className="text-[#FF5500] font-bold block mb-1">{step.phase}</span>
                <p className="text-white font-bold">{step.durationOrDist}</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">{step.targetPaceOrHr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Recent Activities Stream with Deep Telemetry Link */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-heading font-extrabold text-white">
              RECENT ACTIVITIES & TELEMETRY
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Directly ingested from Garmin Forerunner 965 and Strava API
            </p>
          </div>
          <button
            onClick={onNavigateToGadgets}
            className="text-xs font-mono text-[#FF5500] hover:underline flex items-center gap-1"
          >
            <span>Manage Connected Hardware</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="bg-[#0E0E14] border border-zinc-800/80 hover:border-[#FF5500]/40 rounded-xl p-4 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-xl ${
                  act.sport === 'run' ? 'bg-[#FF5500]/15 text-[#FF5500]' :
                  act.sport === 'ride' ? 'bg-blue-500/15 text-blue-400' :
                  'bg-emerald-500/15 text-emerald-400'
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white group-hover:text-[#FF5500] transition-colors">
                      {act.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {act.sourceDevice}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {act.location} &middot; {act.timeAgo}
                  </p>
                </div>
              </div>

              {/* Activity Stats Pills */}
              <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px]">DISTANCE</span>
                  <span className="text-white font-bold text-sm">{act.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">AVG PACE</span>
                  <span className="text-[#FF5500] font-bold text-sm">{act.avgPaceOrSpeed}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">ELEVATION</span>
                  <span className="text-zinc-300 font-bold text-sm">+{act.elevationGainM}m</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">TSS</span>
                  <span className="text-zinc-200 font-bold text-sm">{act.tss}</span>
                </div>
                <div className="hidden md:block">
                  <button className="px-3 py-1.5 rounded-lg bg-[#181822] group-hover:bg-[#FF5500] group-hover:text-black text-xs font-mono font-semibold text-zinc-300 transition-colors">
                    View Splits
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. India Payment & Onwrd Pro Promotion Callout */}
      {!isProUser && (
        <div className="bg-gradient-to-r from-[#171722] via-[#121218] to-[#1F1410] border border-[#FF5500]/40 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-[#FF5500] text-black font-mono font-bold text-[10px] uppercase tracking-wider">
                  INDIA ATHLETE PASS
                </span>
                <span className="text-xs font-mono text-zinc-400">UPI &middot; RuPay &middot; NetBanking</span>
              </div>
              <h3 className="text-2xl font-heading font-extrabold text-white">
                UNLOCK ONWRD PRO & CUSTOM PERIODIZED PLANS
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
                Gain access to unlimited structured watch workout syncs, advanced PMC fitness metrics, and India-tailored marathon training plans starting at just ₹699 / month.
              </p>
            </div>

            <button
              onClick={onOpenUpgradeModal}
              className="flex-shrink-0 px-6 py-3 rounded-xl bg-[#FF5500] hover:bg-[#FF6600] text-black font-heading font-extrabold text-sm uppercase tracking-wider transition-all orange-glow cursor-pointer"
            >
              UPGRADE WITH UPI (₹699)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
