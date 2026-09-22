import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Award, 
  ChevronRight, 
  X, 
  Send, 
  Layers, 
  Target, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { TrainingPlan, Workout, SportType } from '../types';

interface TrainingPlansProps {
  plans: TrainingPlan[];
  onSelectPlanToBuy: (plan: TrainingPlan) => void;
  onPushToWatch: (workoutTitle: string) => void;
}

export const TrainingPlans: React.FC<TrainingPlansProps> = ({
  plans,
  onSelectPlanToBuy,
  onPushToWatch,
}) => {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [activePlanModal, setActivePlanModal] = useState<TrainingPlan | null>(null);
  const [selectedWorkoutModal, setSelectedWorkoutModal] = useState<Workout | null>(null);
  const [watchSyncSuccess, setWatchSyncSuccess] = useState(false);

  const filteredPlans = plans.filter((plan) => {
    if (selectedSport === 'all') return true;
    return plan.sport === selectedSport;
  });

  const handlePushWorkout = (workout: Workout) => {
    onPushToWatch(workout.title);
    setWatchSyncSuccess(true);
    setTimeout(() => setWatchSyncSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Title Section */}
      <div className="bg-[#121217] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF5500]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5500]">
              PERIODIZED SCIENTIFIC COACHING
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FF5500]/10 text-[#FF5500] text-[10px] font-mono font-bold">
              GARMIN & COROS COMPATIBLE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            ENDURANCE TRAINING PLANS
          </h1>
          <p className="text-zinc-400 text-sm max-w-3xl mt-1">
            Engineered by Indian national record holders and certified sports physiologists. Tailored for humid conditions, Indian elevation profiles, and direct watch interval synchronizations.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { id: 'all', label: 'All Plans' },
              { id: 'run', label: 'Running (10K / 21K / 42K)' },
              { id: 'triathlon', label: 'Triathlon (Goa 70.3)' },
              { id: 'ride', label: 'Cycling (Tour of Nilgiris)' },
            ].map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
                  selectedSport === sport.id
                    ? 'bg-[#FF5500] text-black font-bold shadow-[0_0_15px_rgba(255,85,0,0.3)]'
                    : 'bg-[#181822] text-zinc-400 hover:text-white hover:bg-[#20202D] border border-zinc-800'
                }`}
              >
                {sport.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlans.map((plan) => {
          return (
            <div
              key={plan.id}
              className="bg-[#121218] border border-zinc-800 hover:border-[#FF5500]/50 rounded-2xl p-6 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30">
                    {plan.featuredBadge || plan.level}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{plan.durationWeeks} Weeks &middot; {plan.hoursPerWeek}</span>
                  </div>
                </div>

                {/* Plan Title */}
                <h3 className="text-2xl font-heading font-extrabold text-white tracking-wide group-hover:text-[#FF5500] transition-colors">
                  {plan.title}
                </h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                  {plan.description}
                </p>

                {/* Coach Bio */}
                <div className="flex items-center gap-3 my-4 p-3 rounded-xl bg-[#0E0E12] border border-zinc-800/80">
                  <img
                    src={plan.coachAvatar}
                    alt={plan.coachName}
                    className="w-10 h-10 rounded-full object-cover border border-[#FF5500]/40"
                  />
                  <div>
                    <p className="text-xs font-bold text-white font-sans">{plan.coachName}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">{plan.coachTitle}</p>
                  </div>
                </div>

                {/* Key Goals checklist */}
                <div className="space-y-1.5 my-3">
                  {plan.keyGoals.map((goal, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500] flex-shrink-0 mt-0.5" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-4 mt-2 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Course Fee</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-heading font-extrabold text-white">
                      ₹{plan.priceInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">incl. GST</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePlanModal(plan)}
                    className="px-3.5 py-2 rounded-xl bg-[#1C1C26] hover:bg-[#252535] text-zinc-200 text-xs font-mono font-semibold transition-colors border border-zinc-700"
                  >
                    View Phases
                  </button>
                  {plan.isEnrolled ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>ENROLLED</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectPlanToBuy(plan)}
                      className="px-4 py-2 rounded-xl bg-[#FF5500] hover:bg-[#FF6600] text-black text-xs font-heading font-extrabold uppercase tracking-wider transition-all orange-glow-sm cursor-pointer"
                    >
                      ENROLL (₹{plan.priceInr})
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Details & Phases Modal */}
      {activePlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#111116] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#171720] via-[#131319] to-[#171720] border-b border-zinc-800 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] uppercase">
                  {activePlanModal.durationWeeks} WEEKS &middot; {activePlanModal.level}
                </span>
                <h2 className="text-2xl font-heading font-extrabold text-white mt-1">
                  {activePlanModal.title}
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Chief Architect: {activePlanModal.coachName} ({activePlanModal.coachTitle})
                </p>
              </div>
              <button
                onClick={() => setActivePlanModal(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Phases & Workouts */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Periodization Timeline */}
              <div>
                <h3 className="text-base font-heading font-bold text-white mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FF5500]" />
                  <span>PERIODIZATION PHASES & MACROCYCLES</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePlanModal.phases.map((phase, idx) => (
                    <div key={idx} className="bg-[#16161F] border border-zinc-800/80 rounded-xl p-4">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-[#FF5500] font-bold">{phase.weeks}</span>
                        <span className="text-zinc-500">Block 0{idx + 1}</span>
                      </div>
                      <p className="text-sm font-bold text-white">{phase.name}</p>
                      <p className="text-xs text-zinc-400 mt-1">{phase.focus}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Structured Workouts */}
              {activePlanModal.sampleWorkouts.length > 0 && (
                <div>
                  <h3 className="text-base font-heading font-bold text-white mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#FF5500]" />
                    <span>SAMPLE STRUCTURED WORKOUTS (READY TO PUSH TO GARMIN)</span>
                  </h3>
                  <div className="space-y-3">
                    {activePlanModal.sampleWorkouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="bg-[#16161F] border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF5500]/15 text-[#FF5500] font-bold mr-2">
                              {workout.day}
                            </span>
                            <span className="text-sm font-bold text-white">{workout.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                            <span>{workout.targetDurationMinutes} min</span>
                            <span>&middot;</span>
                            <span className="text-[#FF5500] font-bold">{workout.tss} TSS</span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 mb-3">{workout.description}</p>

                        {/* Structured intervals step table */}
                        <div className="bg-[#0C0C10] rounded-lg p-3 space-y-2 text-xs font-mono">
                          {workout.structuredSteps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-center justify-between border-b border-zinc-900 pb-1.5 last:border-0 last:pb-0">
                              <span className="text-[#FF5500] font-bold w-20">{step.phase}</span>
                              <span className="text-zinc-200 flex-1">{step.durationOrDist}</span>
                              <span className="text-zinc-400">{step.targetPaceOrHr}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handlePushWorkout(workout)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D1D27] hover:bg-[#FF5500] hover:text-black text-xs font-mono text-zinc-200 transition-colors border border-zinc-700"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Push to Garmin Edge / Watch</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {watchSyncSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Workout synced to Garmin Forerunner 965 and Wahoo ELEMNT successfully!</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0D0D12] border-t border-zinc-800 flex items-center justify-between">
              <div className="text-xs font-mono text-zinc-400">
                <span>Fee: </span>
                <span className="text-white font-bold text-base">₹{activePlanModal.priceInr.toLocaleString('en-IN')}</span>
              </div>
              {!activePlanModal.isEnrolled ? (
                <button
                  onClick={() => {
                    const p = activePlanModal;
                    setActivePlanModal(null);
                    onSelectPlanToBuy(p);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#FF6600] text-black font-heading font-extrabold text-sm uppercase tracking-wider orange-glow-sm"
                >
                  ENROLL VIA UPI & RU PAY
                </button>
              ) : (
                <span className="text-emerald-400 font-mono text-xs font-bold">ALREADY ENROLLED & ACTIVE</span>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
