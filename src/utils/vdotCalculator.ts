/**
 * Mathematical Running Science & VDOT Formulas
 * Based on Jack Daniels' Running Formula (2nd & 3rd Editions)
 * and Furman Institute of Running and Scientific Training (FIRST - "Run Less, Run Faster")
 */

// Jack Daniels VDOT oxygen cost formulas:
// VO2 = -4.60 + 0.182258 * v + 0.000104 * v^2 (where v is velocity in m/min)
// Percent VO2max at race duration t (min):
// %VO2max = 0.8 + 0.1894393 * e^(-0.012778 * t) + 0.2989558 * e^(-0.1932605 * t)
// VDOT = VO2 / %VO2max

export interface RaceTimeInput {
  distanceMeters: number;
  timeSeconds: number;
}

export interface TrainingPaces {
  easyPaceMinKm: string;        // E Pace: 59-74% VO2max (aerobic base & recovery)
  marathonPaceMinKm: string;    // M Pace: 75-84% VO2max (steady aerobic)
  thresholdPaceMinKm: string;   // T Pace: 83-88% VO2max (lactate clearance / cruise intervals)
  intervalPaceMinKm: string;    // I Pace: 95-100% VO2max (3-5 min VO2max repeats)
  repetitionPaceMinKm: string;  // R Pace: 105-115% VO2max (200m-400m neuromuscular speed)
  // Raw seconds per km for math
  easySec: number;
  marathonSec: number;
  thresholdSec: number;
  intervalSec: number;
  repetitionSec: number;
}

export interface EquivalentRaceTimes {
  time5k: string;
  time10k: string;
  timeHalfMarathon: string;
  timeMarathon: string;
}

/**
 * Calculates exact VDOT using Jack Daniels' equations
 */
export function calculateVDOT(distanceMeters: number, timeSeconds: number): number {
  if (timeSeconds <= 0 || distanceMeters <= 0) return 30;
  const timeMinutes = timeSeconds / 60;
  const velocityMPerMin = distanceMeters / timeMinutes;

  // Oxygen cost equation
  const vo2Cost = -4.60 + 0.182258 * velocityMPerMin + 0.000104 * Math.pow(velocityMPerMin, 2);

  // Percent of max sustainable at this duration
  const percentMax =
    0.8 +
    0.1894393 * Math.exp(-0.012778 * timeMinutes) +
    0.2989558 * Math.exp(-0.1932605 * timeMinutes);

  if (percentMax <= 0) return 30;
  const vdot = vo2Cost / percentMax;
  return Math.round(vdot * 10) / 10;
}

/**
 * Calculates velocity (m/min) for a given VDOT and fractional VO2max
 */
function getVelocityForFraction(vdot: number, fraction: number): number {
  const targetVO2 = vdot * fraction;
  // Solve quadratic: 0.000104 * v^2 + 0.182258 * v - (4.60 + targetVO2) = 0
  const a = 0.000104;
  const b = 0.182258;
  const c = -(4.60 + targetVO2);
  const discriminant = b * b - 4 * a * c;
  const v = (-b + Math.sqrt(discriminant)) / (2 * a);
  return v; // meters per minute
}

/**
 * Converts velocity (m/min) to pace (seconds per km)
 */
function velocityToSecPerKm(velocityMPerMin: number): number {
  if (velocityMPerMin <= 0) return 360;
  const minPerKm = 1000 / velocityMPerMin;
  return minPerKm * 60;
}

/**
 * Formats seconds into mm:ss
 */
export function formatPace(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} /km`;
}

/**
 * Formats seconds into hh:mm:ss or mm:ss
 */
export function formatDuration(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/**
 * Compute Jack Daniels training paces based on VDOT
 */
export function getVDOTTrainingPaces(vdot: number): TrainingPaces {
  // Daniels intensity fractions
  const easyFraction = 0.70;      // ~65-74% VO2max
  const marathonFraction = 0.82;  // ~80-84% VO2max
  const thresholdFraction = 0.88; // ~86-88% VO2max
  const intervalFraction = 0.98;  // ~95-100% VO2max
  const repFraction = 1.08;       // ~105-110% VO2max

  const easySec = velocityToSecPerKm(getVelocityForFraction(vdot, easyFraction));
  const marathonSec = velocityToSecPerKm(getVelocityForFraction(vdot, marathonFraction));
  const thresholdSec = velocityToSecPerKm(getVelocityForFraction(vdot, thresholdFraction));
  const intervalSec = velocityToSecPerKm(getVelocityForFraction(vdot, intervalFraction));
  const repetitionSec = velocityToSecPerKm(getVelocityForFraction(vdot, repFraction));

  return {
    easyPaceMinKm: formatPace(easySec),
    marathonPaceMinKm: formatPace(marathonSec),
    thresholdPaceMinKm: formatPace(thresholdSec),
    intervalPaceMinKm: formatPace(intervalSec),
    repetitionPaceMinKm: formatPace(repetitionSec),
    easySec,
    marathonSec,
    thresholdSec,
    intervalSec,
    repetitionSec,
  };
}

/**
 * Predicts equivalent race times from VDOT using Daniels regression
 */
export function getEquivalentRaceTimes(vdot: number): EquivalentRaceTimes {
  // Distance meters: 5k (5000), 10k (10000), 21.0975k (21097.5), 42.195k (42195)
  const predictTimeForDist = (distanceMeters: number): number => {
    // Binary search for timeSeconds that yields this VDOT
    let low = 600; // 10 min
    let high = 28800; // 8 hours
    for (let i = 0; i < 25; i++) {
      const mid = (low + high) / 2;
      const testVdot = calculateVDOT(distanceMeters, mid);
      if (testVdot > vdot) {
        low = mid; // higher vdot means faster, so time is larger
      } else {
        high = mid;
      }
    }
    return (low + high) / 2;
  };

  return {
    time5k: formatDuration(predictTimeForDist(5000)),
    time10k: formatDuration(predictTimeForDist(10000)),
    timeHalfMarathon: formatDuration(predictTimeForDist(21097.5)),
    timeMarathon: formatDuration(predictTimeForDist(42195)),
  };
}

/**
 * FIRST "Run Less, Run Faster" 3+2 Method Pacing:
 * Key 1 (Track Repeats): 5K race pace minus 10-15s/km
 * Key 2 (Tempo Run): 10K race pace to 10K pace + 10s/km
 * Key 3 (Long Run): Marathon Pace + 20-35s/km
 * Plus 2 Cross-Training sessions (Cycling / Swimming @ 70-80% Max HR)
 */
export function getFirstPaces(vdot: number) {
  const paces = getVDOTTrainingPaces(vdot);
  const eq = getEquivalentRaceTimes(vdot);

  return {
    trackIntervalPace: formatPace(paces.intervalSec),
    tempoPace: formatPace(paces.thresholdSec),
    longRunPace: formatPace(paces.marathonSec + 25),
    crossTrainingIntensity: '70% - 80% Max HR (Cycling 90 RPM or Lap Swimming)',
  };
}

/**
 * Maffetone MAF 180 Heart Rate Formula:
 * 180 - Age (with adjustments for injury, recovery, or consistent training)
 */
export function calculateMAFHeartRate(age: number, trainingHistoryYears: number): {
  mafTargetHr: number;
  aerobicRange: string;
} {
  let base = 180 - age;
  if (trainingHistoryYears >= 2) {
    base += 5; // Trained consistently without injury
  } else if (trainingHistoryYears < 1) {
    base -= 5; // Beginner or returning from break
  }
  return {
    mafTargetHr: base,
    aerobicRange: `${base - 10} - ${base} bpm`,
  };
}

/**
 * Automated Mathematical Schedule Generator
 * Builds a 12-week periodized plan with mathematical interval splits
 */
export function generateMathematicalPlan(
  methodology: 'daniels_vdot' | 'first_run_less' | 'hansons_marathon' | 'maf_aerobic',
  targetEvent: '5k' | '10k' | 'half_marathon' | 'marathon',
  vdot: number,
  athleteAge: number = 32
) {
  const paces = getVDOTTrainingPaces(vdot);
  const first = getFirstPaces(vdot);
  const maf = calculateMAFHeartRate(athleteAge, 2);

  const planTitleMap = {
    daniels_vdot: `Jack Daniels VDOT ${vdot} Periodized Formula`,
    first_run_less: `FIRST 3+2 Run Less Run Faster Program (VDOT ${vdot})`,
    hansons_marathon: `Hansons Marathon Method Cumulative Fatigue (VDOT ${vdot})`,
    maf_aerobic: `Dr. Phil Maffetone MAF-180 Heart Rate Engine`,
  };

  // Generate 12 weeks of structured schedule
  const weeks = [];
  const totalWeeks = 12;

  for (let w = 1; w <= totalWeeks; w++) {
    // Progressive mileage & intensity
    let phase = 'Base Building';
    if (w >= 9) phase = 'Peak & Sharpening';
    else if (w >= 5) phase = 'Threshold & Quality Build';
    if (w === 12) phase = 'Taper & Supercompensation';

    const longRunDistanceKm = Math.min(
      targetEvent === 'marathon' ? 32 : targetEvent === 'half_marathon' ? 20 : 14,
      Math.round((10 + (w * 1.5)) * 10) / 10
    );

    let workouts = [];

    if (methodology === 'first_run_less') {
      // 3 quality runs + 2 cross training
      workouts = [
        {
          day: 'Tuesday (Key 1: Track Speed)',
          title: `${4 + Math.floor(w / 3)}x 800m Repeats`,
          type: 'Track Intervals',
          distanceKm: 8.5,
          targetPace: paces.intervalPaceMinKm,
          description: `Run 800m repeats at exact VDOT ${vdot} Interval Pace (${paces.intervalPaceMinKm}) with 400m recovery jog.`,
        },
        {
          day: 'Wednesday (Cross Training 1)',
          title: 'Indoor Bike Cadence & Aerobic Sweat',
          type: 'Cross-Training',
          distanceKm: 25,
          targetPace: '90-95 RPM @ 75% Max HR',
          description: 'Non-impact aerobic session to build capillary density without leg joint pounding.',
        },
        {
          day: 'Thursday (Key 2: Lactate Tempo)',
          title: `${5 + Math.floor(w / 2)}km Sustained Tempo`,
          type: 'Threshold',
          distanceKm: 9.0,
          targetPace: paces.thresholdPaceMinKm,
          description: `Lock into Daniels Threshold Pace (${paces.thresholdPaceMinKm}). Heart rate 86-88% max.`,
        },
        {
          day: 'Friday (Cross Training 2)',
          title: 'Lap Swimming & Core Mobility',
          type: 'Cross-Training',
          distanceKm: 1.8,
          targetPace: 'Aerobic Z2 Drills',
          description: 'Deep breathing thoracic capacity and full-body active recovery.',
        },
        {
          day: 'Sunday (Key 3: Quality Long Run)',
          title: `${longRunDistanceKm}km Marathon-Paced Long Run`,
          type: 'Endurance',
          distanceKm: longRunDistanceKm,
          targetPace: formatPace(paces.marathonSec + 20),
          description: `Progressive long run holding ${formatPace(paces.marathonSec + 20)}. Practice race fueling every 35 min.`,
        },
      ];
    } else if (methodology === 'hansons_marathon') {
      // Hansons 16-mile cap, cumulative fatigue
      workouts = [
        {
          day: 'Tuesday (Speed/Strength)',
          title: '6x 1,000m @ 10K Pacing',
          type: 'Speed',
          distanceKm: 10,
          targetPace: paces.intervalPaceMinKm,
          description: `Maintain high turnover on tired legs. Target ${paces.intervalPaceMinKm}.`,
        },
        {
          day: 'Thursday (Goal Marathon Pace)',
          title: `${8 + Math.floor(w / 2)}km @ Exact GMP`,
          type: 'Tempo',
          distanceKm: 12,
          targetPace: paces.marathonPaceMinKm,
          description: `Strict Hansons Tempo run at exact Marathon Pace (${paces.marathonPaceMinKm}).`,
        },
        {
          day: 'Saturday (Easy Aerobic Base)',
          title: '8km Easy Recovery Run',
          type: 'Recovery',
          distanceKm: 8,
          targetPace: paces.easyPaceMinKm,
          description: `Keep heart rate strictly under 140 bpm (${paces.easyPaceMinKm}).`,
        },
        {
          day: 'Sunday (Simulated Long Run)',
          title: `${Math.min(26, longRunDistanceKm)}km Cumulative Fatigue Long Run`,
          type: 'Long Run',
          distanceKm: Math.min(26, longRunDistanceKm),
          targetPace: formatPace(paces.marathonSec + 15),
          description: 'Hansons capping rule: teaches the body to run the final 16 miles of a marathon without overtaxing joints.',
        },
      ];
    } else if (methodology === 'maf_aerobic') {
      // Dr. Maffetone MAF 180 low HR pure aerobic development
      workouts = [
        {
          day: 'Tuesday (MAF Aerobic Run)',
          title: '10km Strict MAF-180 Heart Rate Run',
          type: 'MAF Aerobic',
          distanceKm: 10,
          targetPace: `< ${maf.mafTargetHr} bpm (approx ${paces.easyPaceMinKm})`,
          description: `Maximum Aerobic Function cap: Never allow heart rate to exceed ${maf.mafTargetHr} bpm. If HR climbs on hills, slow down or walk.`,
        },
        {
          day: 'Thursday (MAF Cadence Run)',
          title: '12km Aerobic Efficiency',
          type: 'MAF Aerobic',
          distanceKm: 12,
          targetPace: `< ${maf.mafTargetHr} bpm`,
          description: `Maintain 180 strides/min while keeping HR in ${maf.aerobicRange}.`,
        },
        {
          day: 'Saturday (MAF Recovery Spin)',
          title: '45 min Easy Cycling / Z1',
          type: 'Recovery',
          distanceKm: 18,
          targetPace: `< 115 bpm`,
          description: 'Gentle active flush.',
        },
        {
          day: 'Sunday (MAF Long Aerobic Engine)',
          title: `${longRunDistanceKm}km Pure Aerobic Long Run`,
          type: 'Long Run',
          distanceKm: longRunDistanceKm,
          targetPace: `< ${maf.mafTargetHr} bpm`,
          description: `Develop mitochondrial fat adaptation. Cap at ${maf.mafTargetHr} bpm.`,
        },
      ];
    } else {
      // Daniels VDOT 5-pace classic
      workouts = [
        {
          day: 'Tuesday (Repetition / Interval Paces)',
          title: `${5 + Math.floor(w / 3)}x 1,000m Daniels I-Pace`,
          type: 'VO2 Intervals',
          distanceKm: 11,
          targetPace: paces.intervalPaceMinKm,
          description: `Run 1000m intervals at ${paces.intervalPaceMinKm} with equal time jog recovery. Max VO2 stimulus.`,
        },
        {
          day: 'Thursday (Daniels Cruise Intervals)',
          title: '3x 2km @ Threshold (T-Pace)',
          type: 'Threshold',
          distanceKm: 10,
          targetPace: paces.thresholdPaceMinKm,
          description: `2,000m cruise repeats at ${paces.thresholdPaceMinKm} with 1 min rest between sets.`,
        },
        {
          day: 'Saturday (Easy Base & 6 Strides)',
          title: '7km Easy + 6x 100m R-Pace Strides',
          type: 'Strides',
          distanceKm: 8,
          targetPace: `${paces.easyPaceMinKm} & ${paces.repetitionPaceMinKm}`,
          description: `Easy recovery running ending with relaxed 100m strides at repetition pace (${paces.repetitionPaceMinKm}).`,
        },
        {
          day: 'Sunday (Daniels E-Pace Long Run)',
          title: `${longRunDistanceKm}km Aerobic Long Run`,
          type: 'Long Run',
          distanceKm: longRunDistanceKm,
          targetPace: paces.easyPaceMinKm,
          description: `Sustained aerobic base building at ${paces.easyPaceMinKm}.`,
        },
      ];
    }

    weeks.push({
      weekNumber: w,
      phase,
      weeklyMileageKm: workouts.reduce((sum, wo) => sum + (wo.type !== 'Cross-Training' ? wo.distanceKm : 0), 0),
      workouts,
    });
  }

  return {
    title: planTitleMap[methodology],
    methodology,
    targetEvent,
    vdot,
    paces,
    equivalentRaceTimes: getEquivalentRaceTimes(vdot),
    firstPaces: first,
    mafPaces: maf,
    totalWeeks,
    weeks,
  };
}
