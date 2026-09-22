import React, { useState } from 'react';
import { 
  Calculator, 
  Flame, 
  Timer, 
  Zap, 
  CheckCircle2, 
  Send, 
  Calendar, 
  ChevronRight, 
  Award,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  calculateVDOT, 
  getVDOTTrainingPaces, 
  getEquivalentRaceTimes, 
  generateMathematicalPlan,
  getFirstPaces,
  calculateMAFHeartRate,
  formatDuration
} from '../utils/vdotCalculator';
import { Workout } from '../types';

interface AutomatedPlanGeneratorProps {
  onApplyGeneratedPlan: (generatedPlan: any, todayWorkout: Workout) => void;
  athleteAge?: number;
  initialVdot?: number;
}

export const AutomatedPlanGenerator: React.FC<AutomatedPlanGeneratorProps> = ({
  onApplyGeneratedPlan,
  athleteAge = 32,
  initialVdot = 54,
}) => {
  // Method selection
  const [methodology, setMethodology] = useState<'daniels_vdot' | 'first_run_less' | 'hansons_marathon' | 'maf_aerobic'>('daniels_vdot');
  const [targetEvent, setTargetEvent] = useState<'5k' | '10k' | 'half_marathon' | 'marathon'>('half_marathon');

  // Benchmark inputs
  const [benchmarkDist, setBenchmarkDist] = useState<number>(5000); // 5k in meters
  const [benchHours, setBenchHours] = useState<number>(0);
  const [benchMin, setBenchMin] = useState<number>(21);
  const [benchSec, setBenchSec] = useState<number>(30);

  // Expanded week viewer in schedule
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Compute exact mathematical VDOT from input
  const totalSec = benchHours * 3600 + benchMin * 60 + benchSec;
  const currentVdot = calculateVDOT(benchmarkDist, totalSec);

  // Mathematical outputs
  const paces = getVDOTTrainingPaces(currentVdot);
  const equivalentTimes = getEquivalentRaceTimes(currentVdot);
  const firstPaces = getFirstPaces(currentVdot);
  const maf = calculateMAFHeartRate(athleteAge, 2);

  // Generate the full periodized schedule
  const generatedPlan = generateMathematicalPlan(methodology, targetEvent, currentVdot, athleteAge);

  const handleApplyPlan = () => {
    // Pick the first workout of week 1 to become today's scheduled workout
    const firstWorkout = generatedPlan.weeks[0].workouts[0];
    const newTodayWorkout: Workout = {
      id: `w-math-${Date.now()}`,
      day: 'Today',
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: firstWorkout.title,
      sport: 'run',
      targetDurationMinutes: Math.round(firstWorkout.distanceKm * 5),
      targetDistanceKm: firstWorkout.distanceKm,
      tss: Math.round(firstWorkout.distanceKm * 7),
      intensity: firstWorkout.type.includes('Interval') ? 'VO2 Max Intervals' : 'Threshold',
      description: firstWorkout.description,
      isCompleted: false,
      structuredSteps: [
        { phase: 'Warmup', durationOrDist: '2.0 km easy', targetPaceOrHr: paces.easyPaceMinKm },
        { phase: 'Interval', durationOrDist: firstWorkout.title, targetPaceOrHr: firstWorkout.targetPace, notes: 'Strict Daniels mathematical pace' },
        { phase: 'Cooldown', durationOrDist: '1.5 km easy', targetPaceOrHr: paces.easyPaceMinKm },
      ],
    };

    onApplyGeneratedPlan(generatedPlan, newTodayWorkout);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Header */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              <span>MATHEMATICAL ENDURANCE ENGINE &middot; 0% AI ESTIMATION</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            AUTOMATED MATHEMATICAL TRAINING PLANS
          </h1>
          <p className="text-zinc-400 text-sm max-w-3xl mt-1">
            Prescribe your training strictly using peer-reviewed physiological formulas: Dr. Jack Daniels' Oxygen Consumption (VDOT), Furman Institute's FIRST "Run Less, Run Faster" (3+2), Hansons Cumulative Fatigue, and Maffetone MAF-180.
          </p>
        </div>
      </div>

      {/* 1. Benchmark Inputs & Methodology Config (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Benchmark Race (5 cols) */}
        <div className="lg:col-span-5 bg-[#121217] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
              1. Input Benchmark Race Result
            </span>
            <span className="text-[10px] font-mono text-[#FF5500]">Recent Performance</span>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Benchmark Distance</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '5K', dist: 5000 },
                { label: '10K', dist: 10000 },
                { label: '21.1K', dist: 21097.5 },
                { label: '42.2K', dist: 42195 },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setBenchmarkDist(item.dist)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                    benchmarkDist === item.dist
                      ? 'bg-[#FF5500] text-black border-[#FF5500]'
                      : 'bg-[#181822] text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Input Hours : Minutes : Seconds */}
          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Official Chip Time</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">Hours</span>
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={benchHours}
                  onChange={(e) => setBenchHours(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-[#09090C] border border-zinc-700 rounded-lg text-sm text-white font-mono text-center focus:border-[#FF5500] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">Minutes</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={benchMin}
                  onChange={(e) => setBenchMin(Math.max(0, Math.min(59, Number(e.target.value))))}
                  className="w-full px-3 py-2 bg-[#09090C] border border-zinc-700 rounded-lg text-sm text-white font-mono text-center focus:border-[#FF5500] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">Seconds</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={benchSec}
                  onChange={(e) => setBenchSec(Math.max(0, Math.min(59, Number(e.target.value))))}
                  className="w-full px-3 py-2 bg-[#09090C] border border-zinc-700 rounded-lg text-sm text-white font-mono text-center focus:border-[#FF5500] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Target Event for Plan */}
          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Target Race Goal</label>
            <select
              value={targetEvent}
              onChange={(e) => setTargetEvent(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-[#09090C] border border-zinc-700 rounded-lg text-xs text-white font-mono focus:border-[#FF5500] focus:outline-none"
            >
              <option value="5k">5K Speed Sharpener (12 Weeks)</option>
              <option value="10k">10K Lactate Builder (12 Weeks)</option>
              <option value="half_marathon">Half Marathon 21.1K (12 Weeks)</option>
              <option value="marathon">Full Marathon 42.2K (12 Weeks)</option>
            </select>
          </div>

          {/* Resulting VDOT Display Badge */}
          <div className="bg-[#0A0A0E] p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Mathematical VDOT</span>
              <span className="text-3xl font-heading font-black text-[#FF5500]">{currentVdot}</span>
            </div>
            <div className="text-right text-xs font-mono text-zinc-400">
              <span className="text-white font-bold block">Oxygen Velocity</span>
              <span>{Math.round(currentVdot * 1.05 * 10) / 10} ml/kg/min VO2</span>
            </div>
          </div>
        </div>

        {/* Right: Select Mathematical Philosophy (7 cols) */}
        <div className="lg:col-span-7 bg-[#121217] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
              2. Select Scientific Methodology
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Exact Mathematical Periodization</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Jack Daniels VDOT */}
            <div
              onClick={() => setMethodology('daniels_vdot')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                methodology === 'daniels_vdot'
                  ? 'bg-[#1C1C26] border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                  : 'bg-[#0E0E14] border-zinc-800 hover:bg-[#14141C]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-heading font-bold text-white">JACK DANIELS VDOT</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">5 PACES</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Olympic distance coach formula. Prescribes 5 exact physiological velocities: Easy, Marathon, Threshold, Interval, and Repetition.
              </p>
            </div>

            {/* Run Less, Run Faster FIRST 3+2 */}
            <div
              onClick={() => setMethodology('first_run_less')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                methodology === 'first_run_less'
                  ? 'bg-[#1C1C26] border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                  : 'bg-[#0E0E14] border-zinc-800 hover:bg-[#14141C]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-heading font-bold text-white">RUN LESS, RUN FASTER</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] font-bold">FIRST 3+2</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Furman Institute scientifically backed 3 high-intensity runs/wk (Track, Tempo, Long) + 2 cross-training sessions. Minimal injury risk.
              </p>
            </div>

            {/* Hansons Marathon Method */}
            <div
              onClick={() => setMethodology('hansons_marathon')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                methodology === 'hansons_marathon'
                  ? 'bg-[#1C1C26] border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                  : 'bg-[#0E0E14] border-zinc-800 hover:bg-[#14141C]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-heading font-bold text-white">HANSONS MARATHON</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">CUMULATIVE</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cumulative fatigue philosophy with long runs capped at 16 miles (26km). Teaches the body to run the final miles on tired legs.
              </p>
            </div>

            {/* Maffetone MAF-180 */}
            <div
              onClick={() => setMethodology('maf_aerobic')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                methodology === 'maf_aerobic'
                  ? 'bg-[#1C1C26] border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                  : 'bg-[#0E0E14] border-zinc-800 hover:bg-[#14141C]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-heading font-bold text-white">MAFFETONE MAF-180</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">&lt; {maf.mafTargetHr} BPM</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pure aerobic base engine using the 180-Formula. Cap HR at {maf.mafTargetHr} bpm to optimize mitochondrial fat oxidation.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">12-Week Periodized Macrocycle</span>
            <button
              id="apply-mathematical-plan-btn"
              onClick={handleApplyPlan}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#FF6600] text-black font-heading font-extrabold text-xs uppercase tracking-wider transition-all orange-glow-sm cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>APPLY TO MY GARMIN SCHEDULE</span>
            </button>
          </div>
        </div>

      </div>

      {appliedSuccess && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/50 rounded-2xl text-xs font-mono text-emerald-400 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Active Plan Updated: "{generatedPlan.title}" is now loaded into your dashboard and queued for your smartwatch!</span>
        </div>
      )}

      {/* 2. Exact Calculated Paces & Equivalent Predictions (Infographic Bar) */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-heading font-extrabold text-white">
              MATHEMATICALLY PRESCRIBED PACES (VDOT {currentVdot})
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Directly mapped to training zones without manual guesswork
            </p>
          </div>
          <div className="text-xs font-mono text-[#FF5500]">
            Equivalent 21.1K: {equivalentTimes.timeHalfMarathon} &middot; 42.2K: {equivalentTimes.timeMarathon}
          </div>
        </div>

        {/* 5 Daniels Training Paces */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
              <span>EASY (E)</span>
              <span className="text-[10px] text-blue-400 font-bold">59-74%</span>
            </div>
            <div className="text-xl font-heading font-extrabold text-white">{paces.easyPaceMinKm}</div>
            <span className="text-[10px] font-mono text-zinc-500">Recovery & Long runs</span>
          </div>

          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
              <span>MARATHON (M)</span>
              <span className="text-[10px] text-emerald-400 font-bold">75-84%</span>
            </div>
            <div className="text-xl font-heading font-extrabold text-white">{paces.marathonPaceMinKm}</div>
            <span className="text-[10px] font-mono text-zinc-500">Steady aerobic pace</span>
          </div>

          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
              <span>THRESHOLD (T)</span>
              <span className="text-[10px] text-amber-400 font-bold">85-88%</span>
            </div>
            <div className="text-xl font-heading font-extrabold text-amber-400">{paces.thresholdPaceMinKm}</div>
            <span className="text-[10px] font-mono text-zinc-500">Lactate clearance tempo</span>
          </div>

          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
              <span>INTERVAL (I)</span>
              <span className="text-[10px] text-[#FF5500] font-bold">95-100%</span>
            </div>
            <div className="text-xl font-heading font-extrabold text-[#FF5500]">{paces.intervalPaceMinKm}</div>
            <span className="text-[10px] font-mono text-zinc-500">VO2max 800-1200m repeats</span>
          </div>

          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-850">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
              <span>REPETITION (R)</span>
              <span className="text-[10px] text-red-400 font-bold">105-115%</span>
            </div>
            <div className="text-xl font-heading font-extrabold text-red-400">{paces.repetitionPaceMinKm}</div>
            <span className="text-[10px] font-mono text-zinc-500">200-400m speed mechanics</span>
          </div>
        </div>

        {/* Equivalent Race Time Predictions (Jack Daniels Formula) */}
        <div className="pt-3 border-t border-zinc-800/80">
          <span className="text-xs font-mono text-zinc-400 block mb-2">
            Mathematical Race Equivalents from VDOT {currentVdot}:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#14141D] border border-zinc-800 flex justify-between">
              <span className="text-zinc-400">5K:</span>
              <span className="text-white font-bold">{equivalentTimes.time5k}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#14141D] border border-zinc-800 flex justify-between">
              <span className="text-zinc-400">10K:</span>
              <span className="text-white font-bold">{equivalentTimes.time10k}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#14141D] border border-zinc-800 flex justify-between">
              <span className="text-zinc-400">Half Marathon:</span>
              <span className="text-[#FF5500] font-bold">{equivalentTimes.timeHalfMarathon}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#14141D] border border-zinc-800 flex justify-between">
              <span className="text-zinc-400">Full Marathon:</span>
              <span className="text-white font-bold">{equivalentTimes.timeMarathon}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Generated 12-Week Interactive Schedule */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-heading font-extrabold text-white">
              12-WEEK STRUCTURED WORKOUT SCHEDULE
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Phase: {generatedPlan.weeks[selectedWeek - 1].phase} &middot; Total {generatedPlan.weeks[selectedWeek - 1].weeklyMileageKm} km this week
            </p>
          </div>

          {/* Week Selector Chips */}
          <div className="flex flex-wrap gap-1.5">
            {generatedPlan.weeks.map((w) => (
              <button
                key={w.weekNumber}
                type="button"
                onClick={() => setSelectedWeek(w.weekNumber)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedWeek === w.weekNumber
                    ? 'bg-[#FF5500] text-black'
                    : 'bg-[#161622] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                W{w.weekNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Week's Workout List */}
        <div className="space-y-3">
          {generatedPlan.weeks[selectedWeek - 1].workouts.map((wo, wIdx) => (
            <div
              key={wIdx}
              className="bg-[#0D0D12] border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] font-bold">
                    {wo.day}
                  </span>
                  <span className="text-sm font-bold text-white">{wo.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-zinc-400">{wo.distanceKm} km</span>
                  <span className="text-zinc-600">&middot;</span>
                  <span className="text-[#FF5500] font-bold">Target: {wo.targetPace}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-mono">{wo.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
