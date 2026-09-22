export type SportType = 'run' | 'ride' | 'swim' | 'strength' | 'triathlon';

export interface Activity {
  id: string;
  title: string;
  sport: SportType;
  date: string;
  timeAgo: string;
  distanceKm: number;
  durationMinutes: number;
  elevationGainM: number;
  avgPaceOrSpeed: string; // e.g., "4:42 /km" or "29.4 km/h"
  avgHeartRate: number;
  maxHeartRate: number;
  calories: number;
  tss: number; // Training Stress Score
  sourceDevice: 'Garmin Forerunner 965' | 'Strava' | 'Wahoo ELEMNT' | 'Coros Pace 3' | 'Apple Watch Ultra';
  location: string;
  splits: { km: number; pace: string; hr: number; elevation: number }[];
  hrZones: { zone: string; percentage: number; timeMinutes: number; color: string }[];
  routePath?: string; // SVG path data for route visual
}

export interface TrainingPlan {
  id: string;
  title: string;
  sport: SportType;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  durationWeeks: number;
  hoursPerWeek: string;
  description: string;
  coachName: string;
  coachTitle: string;
  coachAvatar: string;
  priceInr: number;
  isEnrolled?: boolean;
  featuredBadge?: string;
  keyGoals: string[];
  phases: {
    name: string;
    weeks: string;
    focus: string;
  }[];
  sampleWorkouts: Workout[];
}

export interface Workout {
  id: string;
  day: string; // "Monday", "Tuesday", etc.
  dateStr?: string;
  title: string;
  sport: SportType;
  targetDurationMinutes: number;
  targetDistanceKm?: number;
  tss: number;
  intensity: 'Recovery' | 'Aerobic Endurance' | 'Tempo' | 'Threshold' | 'VO2 Max Intervals' | 'Rest';
  description: string;
  structuredSteps: {
    phase: 'Warmup' | 'Interval' | 'Recovery' | 'Cooldown';
    durationOrDist: string;
    targetPaceOrHr: string;
    notes?: string;
  }[];
  isCompleted?: boolean;
}

export interface GadgetConnection {
  id: string;
  name: string;
  brand: 'Garmin' | 'Strava' | 'Wahoo' | 'Coros' | 'Apple Health' | 'Polar' | 'Suunto';
  connected: boolean;
  lastSync: string;
  batteryLevel?: number;
  deviceModel?: string;
  autoSyncWorkouts: boolean;
  pushPlansToWatch: boolean;
  syncHistoryCount: number;
}

export interface PMCMetric {
  day: string;
  date: string;
  ctl: number; // Fitness (Chronic Training Load)
  atl: number; // Fatigue (Acute Training Load)
  tsb: number; // Form (Training Stress Balance = CTL - ATL)
  tss: number; // Daily TSS
}

export interface IndianPaymentOrder {
  orderId: string;
  planTitle: string;
  amountInr: number;
  gstAmountInr: number;
  totalInr: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'rupay';
  upiId?: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  timestamp: string;
}

export interface AthleteProfile {
  name: string;
  city: string;
  country: string;
  avatar: string;
  vo2Max: number;
  readinessScore: number;
  hrRest: number;
  hrMax: number;
  weightKg: number;
  currentStreakDays: number;
  primaryDiscipline: string;
  weeklyGoalKm: number;
  weeklyCompletedKm: number;
}

export interface RestingHRRecord {
  day: string;
  date: string;
  restingHr: number;
  baseline: number;
  hrvMs: number;
  status: string;
}
