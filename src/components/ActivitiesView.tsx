import React, { useState } from 'react';
import { 
  Activity as ActivityType, 
  SportType 
} from '../types';
import { 
  Activity, 
  Search, 
  Filter, 
  Upload, 
  Calendar, 
  Clock, 
  Mountain, 
  Heart, 
  Zap, 
  ChevronRight,
  Flame
} from 'lucide-react';

interface ActivitiesViewProps {
  activities: ActivityType[];
  onSelectActivity: (activity: ActivityType) => void;
  onNavigateToGadgets: () => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  onSelectActivity,
  onNavigateToGadgets,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState<string>('all');

  const filteredActivities = activities.filter((act) => {
    const matchesSport = sportFilter === 'all' || act.sport === sportFilter;
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          act.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSport && matchesSearch;
  });

  // Calculate totals
  const totalKm = Math.round(filteredActivities.reduce((acc, a) => acc + a.distanceKm, 0) * 10) / 10;
  const totalMinutes = filteredActivities.reduce((acc, a) => acc + a.durationMinutes, 0);
  const totalElevation = filteredActivities.reduce((acc, a) => acc + a.elevationGainM, 0);
  const totalTss = filteredActivities.reduce((acc, a) => acc + a.tss, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Filter Bar */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-white">
              ENDURANCE ACTIVITY LOG
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              High-resolution GPS telemetry, second-by-second heart rate, and training stress scores
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToGadgets}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D1D27] hover:bg-[#FF5500] hover:text-black border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import .FIT Telemetry</span>
            </button>
          </div>
        </div>

        {/* Aggregated Totals Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80 font-mono text-xs">
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-900">
            <span className="text-zinc-500 block text-[10px]">TOTAL DISTANCE</span>
            <span className="text-xl font-heading font-extrabold text-white">{totalKm} km</span>
          </div>
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-900">
            <span className="text-zinc-500 block text-[10px]">TOTAL TIME</span>
            <span className="text-xl font-heading font-extrabold text-white">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
          </div>
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-900">
            <span className="text-zinc-500 block text-[10px]">TOTAL ELEVATION</span>
            <span className="text-xl font-heading font-extrabold text-white">+{totalElevation} m</span>
          </div>
          <div className="bg-[#0C0C10] p-3 rounded-xl border border-zinc-900">
            <span className="text-zinc-500 block text-[10px]">CUMULATIVE TSS</span>
            <span className="text-xl font-heading font-extrabold text-[#FF5500]">{totalTss} TSS</span>
          </div>
        </div>

        {/* Search & Sport Chips */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-800/60">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by route, city, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0C0C10] border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {['all', 'run', 'ride', 'swim'].map((sport) => (
              <button
                key={sport}
                onClick={() => setSportFilter(sport)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  sportFilter === sport
                    ? 'bg-[#FF5500] text-black font-bold'
                    : 'bg-[#181822] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {sport === 'all' ? 'All Sports' : sport.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-[#121217] rounded-2xl border border-zinc-800">
            <Activity className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-400">No matching activities found</p>
            <p className="text-xs text-zinc-600 mt-1">Try changing your search term or sport filter</p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="bg-[#121218] border border-zinc-800 hover:border-[#FF5500]/50 rounded-2xl p-5 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-xl ${
                  act.sport === 'run' ? 'bg-[#FF5500]/15 text-[#FF5500]' :
                  act.sport === 'ride' ? 'bg-blue-500/15 text-blue-400' :
                  'bg-emerald-500/15 text-emerald-400'
                }`}>
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FF5500] transition-colors">
                      {act.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {act.sourceDevice}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-1">
                    <span>{act.location}</span>
                    <span>&middot;</span>
                    <span>{act.timeAgo}</span>
                  </div>
                </div>
              </div>

              {/* Telemetry metrics strip */}
              <div className="flex items-center justify-between sm:justify-end gap-6 font-mono text-xs border-t sm:border-t-0 border-zinc-800/80 pt-3 sm:pt-0">
                <div>
                  <span className="text-zinc-500 text-[10px] block">DISTANCE</span>
                  <span className="text-white font-bold text-base">{act.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">PACE / SPEED</span>
                  <span className="text-[#FF5500] font-bold text-base">{act.avgPaceOrSpeed}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">DURATION</span>
                  <span className="text-white font-bold text-base">{act.durationMinutes} min</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">AVG HR</span>
                  <span className="text-zinc-300 font-bold text-base">{act.avgHeartRate} bpm</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">TSS</span>
                  <span className="text-zinc-200 font-bold text-base">{act.tss}</span>
                </div>
                <div className="hidden sm:block">
                  <button className="px-3.5 py-2 rounded-xl bg-[#1C1C26] group-hover:bg-[#FF5500] group-hover:text-black text-xs font-mono font-bold text-zinc-200 transition-colors">
                    Splits
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
