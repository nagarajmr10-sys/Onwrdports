import React from 'react';
import { 
  X, 
  MapPin, 
  Watch, 
  Heart, 
  Flame, 
  Mountain, 
  Timer, 
  TrendingUp, 
  Share2, 
  Download,
  Gauge
} from 'lucide-react';
import { Activity } from '../types';

interface ActivityDetailModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  onClose,
}) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#111116] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Strip */}
        <div className="p-6 bg-gradient-to-r from-[#171720] via-[#131319] to-[#171720] border-b border-zinc-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#FF5500]/20 text-[#FF5500] font-mono text-[10px] font-bold uppercase">
                {activity.sport.toUpperCase()} &middot; {activity.sourceDevice}
              </span>
              <span className="text-zinc-500 text-xs font-mono">{activity.timeAgo}</span>
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-white">
              {activity.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>{activity.location}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Key Metric Tiles (Strava / Garmin style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#16161F] border border-zinc-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Distance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-heading font-extrabold text-white">{activity.distanceKm}</span>
                <span className="text-xs font-mono text-zinc-400">km</span>
              </div>
            </div>

            <div className="bg-[#16161F] border border-zinc-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Avg Pace / Speed</span>
              <div className="text-2xl font-heading font-extrabold text-[#FF5500]">
                {activity.avgPaceOrSpeed}
              </div>
            </div>

            <div className="bg-[#16161F] border border-zinc-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Moving Time</span>
              <div className="text-2xl font-heading font-extrabold text-white">
                {activity.durationMinutes} <span className="text-xs font-mono text-zinc-400">min</span>
              </div>
            </div>

            <div className="bg-[#16161F] border border-zinc-800 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Training Stress</span>
              <div className="text-2xl font-heading font-extrabold text-white">
                {activity.tss} <span className="text-xs font-mono text-[#FF5500]">TSS</span>
              </div>
            </div>
          </div>

          {/* Secondary Telemetry: HR, Elevation, Calories */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#13131A] border border-zinc-800/80 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">Heart Rate</span>
                <span className="text-sm font-bold text-white font-mono">{activity.avgHeartRate} avg / {activity.maxHeartRate} max</span>
              </div>
            </div>

            <div className="bg-[#13131A] border border-zinc-800/80 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Mountain className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">Elevation Gain</span>
                <span className="text-sm font-bold text-white font-mono">+{activity.elevationGainM} m</span>
              </div>
            </div>

            <div className="bg-[#13131A] border border-zinc-800/80 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-[#FF5500]">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">Energy Burned</span>
                <span className="text-sm font-bold text-white font-mono">{activity.calories} kcal</span>
              </div>
            </div>
          </div>

          {/* Simulated GPS Route Visualization */}
          <div className="bg-[#0D0D12] border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider">
                GPS TRACE & ELEVATION CONTOUR
              </span>
              <span className="text-[10px] font-mono text-zinc-500">1Hz SATELLITE TELEMETRY</span>
            </div>

            <div className="relative h-32 bg-[#09090C] rounded-lg overflow-hidden border border-zinc-900 flex items-center justify-center">
              <svg viewBox="0 0 300 100" className="w-full h-full">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="40%" stopColor="#10B981" />
                    <stop offset="80%" stopColor="#FF5500" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
                {/* Elevation grid lines */}
                <line x1="0" y1="25" x2="300" y2="25" stroke="#1A1A22" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#1A1A22" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="300" y2="75" stroke="#1A1A22" strokeDasharray="3 3" />
                
                {/* Path line */}
                <path
                  d={activity.routePath || "M 10 65 Q 40 15 90 45 T 160 30 T 230 70 T 290 40"}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="65" r="4" fill="#38BDF8" />
                <circle cx="290" cy="40" r="4" fill="#FF5500" />
              </svg>

              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-zinc-500">Start (Cubbon)</div>
              <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#FF5500]">Finish Lap</div>
            </div>
          </div>

          {/* Kilometer Splits Table */}
          {activity.splits && activity.splits.length > 0 && (
            <div>
              <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider mb-2">
                KILOMETER SPLITS BREAKDOWN
              </h3>
              <div className="bg-[#0D0D12] rounded-xl border border-zinc-800 overflow-hidden font-mono text-xs">
                <div className="grid grid-cols-4 p-2.5 bg-[#14141C] text-zinc-400 font-bold border-b border-zinc-800 text-[11px]">
                  <span>SPLIT</span>
                  <span>PACE</span>
                  <span>HEART RATE</span>
                  <span className="text-right">ELEVATION</span>
                </div>
                <div className="divide-y divide-zinc-900 max-h-48 overflow-y-auto">
                  {activity.splits.map((s) => (
                    <div key={s.km} className="grid grid-cols-4 p-2.5 hover:bg-[#161622] text-zinc-300">
                      <span className="font-bold text-white">Km {s.km}</span>
                      <span className="text-[#FF5500] font-semibold">{s.pace}</span>
                      <span>{s.hr} bpm</span>
                      <span className="text-right text-zinc-400">{s.elevation > 0 ? `+${s.elevation}m` : `${s.elevation}m`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Heart Rate Zones */}
          {activity.hrZones && activity.hrZones.length > 0 && (
            <div>
              <h3 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider mb-2">
                TIME IN HEART RATE ZONES (FITPAGE / GARMIN STANDARD)
              </h3>
              <div className="space-y-2">
                {activity.hrZones.map((zone, idx) => (
                  <div key={idx} className="bg-[#0F0F14] p-2.5 rounded-lg border border-zinc-800 text-xs font-mono">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-bold">{zone.zone}</span>
                      <span className="text-zinc-400">{zone.timeMinutes} min ({zone.percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${zone.percentage}%`, backgroundColor: zone.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0D0D12] border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Exporting ${activity.title} as standard .FIT file.`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181822] hover:bg-[#20202E] border border-zinc-700 text-xs font-mono text-zinc-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .FIT</span>
            </button>
            <button
              onClick={() => alert('Synced activity link copied to clipboard.')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181822] hover:bg-[#20202E] border border-zinc-700 text-xs font-mono text-zinc-300"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FF5500] hover:bg-[#FF6600] text-black font-heading font-extrabold text-xs uppercase tracking-wider"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
