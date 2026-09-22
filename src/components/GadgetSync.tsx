import React, { useState } from 'react';
import { 
  Cpu, 
  RotateCw, 
  CheckCircle2, 
  Upload, 
  Watch, 
  Layers, 
  Battery, 
  ArrowUpRight, 
  Activity, 
  Check, 
  Radio,
  FileCode,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { GadgetConnection, Activity as ActivityType } from '../types';

interface GadgetSyncProps {
  gadgets: GadgetConnection[];
  onToggleGadget: (id: string) => void;
  onSyncAll: () => void;
  isSyncing: boolean;
  onImportFitActivity: (activity: ActivityType) => void;
}

export const GadgetSync: React.FC<GadgetSyncProps> = ({
  gadgets,
  onToggleGadget,
  onSyncAll,
  isSyncing,
  onImportFitActivity,
}) => {
  const [syncLogs, setSyncLogs] = useState<string[]>([
    '[10:48:12] Garmin Connect cloud webhook connected.',
    '[10:48:15] Synced activity: Cubbon Park Progressive Tempo Run (12.4 km).',
    '[10:48:16] VO2 max metric synchronized: 54 ml/kg/min.',
    '[10:48:18] Training readiness score updated: 88 (Prime to train).',
  ]);

  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [isUploadingFit, setIsUploadingFit] = useState(false);

  const handleSimulateFitUpload = (presetName: string, distanceKm: number, sport: 'run' | 'ride') => {
    setIsUploadingFit(true);
    setSimulatedFileName(presetName);

    setTimeout(() => {
      const newActivity: ActivityType = {
        id: `act-${Date.now()}`,
        title: presetName.replace('.FIT', '').replace(/_/g, ' '),
        sport: sport,
        date: new Date().toISOString().split('T')[0],
        timeAgo: 'Just imported from FIT telemetry',
        distanceKm: distanceKm,
        durationMinutes: Math.round(distanceKm * (sport === 'run' ? 4.7 : 1.9)),
        elevationGainM: sport === 'run' ? 58 : 340,
        avgPaceOrSpeed: sport === 'run' ? '4:38 /km' : '31.2 km/h',
        avgHeartRate: 154,
        maxHeartRate: 176,
        calories: Math.round(distanceKm * (sport === 'run' ? 68 : 22)),
        tss: Math.round(distanceKm * (sport === 'run' ? 6.5 : 1.6)),
        sourceDevice: 'Garmin Forerunner 965',
        location: 'Bangalore Endurance Corridor',
        splits: [
          { km: 1, pace: '4:50', hr: 140, elevation: 2 },
          { km: 2, pace: '4:42', hr: 146, elevation: 4 },
          { km: 3, pace: '4:36', hr: 152, elevation: 6 },
          { km: 4, pace: '4:30', hr: 158, elevation: 2 },
        ],
        hrZones: [
          { zone: 'Z1 Warmup', percentage: 12, timeMinutes: 5, color: '#38BDF8' },
          { zone: 'Z2 Aerobic Base', percentage: 48, timeMinutes: 22, color: '#10B981' },
          { zone: 'Z3 Tempo', percentage: 32, timeMinutes: 15, color: '#FBBF24' },
          { zone: 'Z4 Threshold', percentage: 8, timeMinutes: 4, color: '#FF5500' },
        ],
      };

      onImportFitActivity(newActivity);
      setIsUploadingFit(false);
      setSyncLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Parsed binary FIT file: ${presetName}`,
        `[${new Date().toLocaleTimeString()}] Imported ${distanceKm}km activity into Onwrd analytics engine!`,
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-[#121217] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5500]">
                TELEMETRY & HARDWARE INTEGRATION
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              GADGET SYNC ENGINE
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl mt-1">
              Direct two-way synchronization with Garmin Connect, Strava API, Wahoo Cloud, and Coros. Push structured workouts to your watch and automatically ingest heart rate, power, and GPS telemetry.
            </p>
          </div>

          <button
            id="sync-all-gadgets-btn"
            onClick={onSyncAll}
            disabled={isSyncing}
            className="flex-shrink-0 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#FF6600] text-black font-heading font-extrabold text-sm tracking-wider uppercase transition-all orange-glow cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'PULLING TELEMETRY...' : 'SYNC ALL HARDWARE NOW'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Connected Platforms & Gadgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {gadgets.map((gadget) => {
          return (
            <div
              key={gadget.id}
              className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                gadget.connected
                  ? 'bg-[#121218] border-zinc-800 hover:border-zinc-700'
                  : 'bg-[#0E0E12] border-zinc-800/40 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${gadget.connected ? 'bg-[#FF5500]/15 text-[#FF5500]' : 'bg-zinc-800 text-zinc-500'}`}>
                      <Watch className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-sans">{gadget.name}</h3>
                      <p className="text-xs text-zinc-400 font-mono">{gadget.brand}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1 ${
                    gadget.connected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {gadget.connected ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>CONNECTED</span>
                      </>
                    ) : (
                      <span>AVAILABLE</span>
                    )}
                  </span>
                </div>

                {gadget.deviceModel && (
                  <p className="text-xs text-zinc-300 font-mono mb-2">
                    Model: {gadget.deviceModel}
                  </p>
                )}

                {gadget.connected ? (
                  <div className="space-y-2 py-2 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
                    <div className="flex justify-between items-center">
                      <span>Last Ingested:</span>
                      <span className="text-zinc-200">{gadget.lastSync}</span>
                    </div>
                    {gadget.batteryLevel && (
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <Battery className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Battery:</span>
                        </span>
                        <span className="text-emerald-400 font-bold">{gadget.batteryLevel}%</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span>Synced Workouts:</span>
                      <span className="text-[#FF5500] font-bold">{gadget.syncHistoryCount}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 py-3">
                    Connect your {gadget.brand} account to enable automatic workout transfer and real-time interval pacing.
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-2 border-t border-zinc-800/50 flex items-center justify-between">
                <button
                  onClick={() => onToggleGadget(gadget.id)}
                  className={`w-full py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-colors ${
                    gadget.connected
                      ? 'border border-zinc-700 hover:border-red-500/50 text-zinc-300 hover:text-red-400 bg-zinc-900/50'
                      : 'bg-[#FF5500] hover:bg-[#FF6600] text-black'
                  }`}
                >
                  {gadget.connected ? 'DISCONNECT & PAIR' : `CONNECT ${gadget.brand.toUpperCase()}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FIT & GPX Manual Upload Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dropzone & Telemetry Importer (7 cols) */}
        <div className="lg:col-span-7 bg-[#121217] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-white">
                FIT / GPX / TCX FILE INGESTOR
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Upload raw endurance workout files from Garmin, Coros, or Wahoo
              </p>
            </div>
            <span className="p-2 rounded-lg bg-[#FF5500]/10 text-[#FF5500]">
              <FileCode className="w-5 h-5" />
            </span>
          </div>

          {/* Drag and Drop Zone */}
          <div className="border-2 border-dashed border-zinc-700 hover:border-[#FF5500]/70 rounded-xl p-6 text-center space-y-3 bg-[#0B0B0E]/60 transition-colors">
            <Upload className="w-8 h-8 text-zinc-500 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-zinc-200">
                Drag and drop your <span className="text-[#FF5500] font-mono">.FIT</span> or <span className="text-[#FF5500] font-mono">.GPX</span> file
              </p>
              <p className="text-xs text-zinc-500 mt-1">Supports high-frequency 1Hz GPS, second-by-second HR, and Cadence</p>
            </div>

            {/* Simulation Pre-loaded FIT Activity Buttons */}
            <div className="pt-2">
              <p className="text-[11px] font-mono text-zinc-400 mb-2">Or ingest simulated athlete workouts:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleSimulateFitUpload('Bangalore_10K_Championship_Intervals.FIT', 10.0, 'run')}
                  disabled={isUploadingFit}
                  className="px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#FF5500] hover:text-black border border-zinc-700 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ingest 10K Intervals .FIT</span>
                </button>
                <button
                  onClick={() => handleSimulateFitUpload('Nandi_Hills_Climb_Power_Telemetry.FIT', 48.5, 'ride')}
                  disabled={isUploadingFit}
                  className="px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#FF5500] hover:text-black border border-zinc-700 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ingest 48K Ride .FIT</span>
                </button>
              </div>
            </div>

            {isUploadingFit && (
              <div className="p-3 bg-[#1A1A24] border border-[#FF5500]/50 rounded-lg text-xs font-mono text-[#FF5500] flex items-center justify-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Parsing sensor tracks from {simulatedFileName}...</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Device Ingestion Console / Log (5 cols) */}
        <div className="lg:col-span-5 bg-[#121217] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#FF5500] animate-pulse" />
                <h3 className="text-sm font-heading font-bold text-white tracking-wider">
                  TELEMETRY SYNC CONSOLE
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">ACTIVE POLLING</span>
            </div>

            <div className="bg-[#09090C] rounded-xl p-3 border border-zinc-900 font-mono text-xs text-zinc-400 space-y-2 max-h-48 overflow-y-auto">
              {syncLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#FF5500]">&gt;</span>
                  <span className="text-zinc-300">{log}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 text-xs text-zinc-500 font-mono">
            <span>Garmin Connect Health API v2.8 &middot; OAuth 2.0 PKCE Secure Handshake</span>
          </div>
        </div>

      </div>

    </div>
  );
};
