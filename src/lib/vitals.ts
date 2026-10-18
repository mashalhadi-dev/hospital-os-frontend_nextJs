/**
 * Clinical vitals classification against standard reference ranges.
 * Used by the Nurse vitals form (live feedback) and dashboards (history badges).
 */

export type VitalSeverity = 'normal' | 'warn' | 'crit';

export interface VitalFlag {
  severity: VitalSeverity;
  label: string; // human-readable flag, e.g. "High BP (Stage 2)"
}

/** Maps a numeric severity to a comparable rank for computing overall worst. */
const RANK: Record<VitalSeverity, number> = { normal: 0, warn: 1, crit: 2 };

export function worstSeverity(flags: VitalFlag[]): VitalSeverity {
  return flags.reduce<VitalSeverity>(
    (worst, flag) => (RANK[flag.severity] > RANK[worst] ? flag.severity : worst),
    'normal',
  );
}

/** Systolic BP — normal <120, elevated 120–129, high 130–179, crisis ≥180 or <90 */
export function classifySystolic(mmHg: number): VitalFlag {
  if (mmHg >= 180 || mmHg < 90) return { severity: 'crit', label: mmHg >= 180 ? 'Hypertensive crisis' : 'Hypotension' };
  if (mmHg >= 130) return { severity: 'warn', label: 'High systolic' };
  if (mmHg >= 120) return { severity: 'warn', label: 'Elevated systolic' };
  return { severity: 'normal', label: 'Normal' };
}

/** Diastolic BP — normal <80, high ≥90, crisis ≥120 or <60 */
export function classifyDiastolic(mmHg: number): VitalFlag {
  if (mmHg >= 120 || mmHg < 60) return { severity: 'crit', label: mmHg >= 120 ? 'Hypertensive crisis' : 'Hypotension' };
  if (mmHg >= 90) return { severity: 'warn', label: 'High diastolic' };
  if (mmHg >= 80) return { severity: 'warn', label: 'Elevated diastolic' };
  return { severity: 'normal', label: 'Normal' };
}

/** Heart rate — normal 60–100, brady/tachy outside */
export function classifyHeartRate(bpm: number): VitalFlag {
  if (bpm < 50 || bpm > 130) return { severity: 'crit', label: bpm < 50 ? 'Severe bradycardia' : 'Severe tachycardia' };
  if (bpm < 60) return { severity: 'warn', label: 'Bradycardia' };
  if (bpm > 100) return { severity: 'warn', label: 'Tachycardia' };
  return { severity: 'normal', label: 'Normal' };
}

/** Temperature — normal 36.1–37.2°C, fever ≥38, hypothermia <35 */
export function classifyTemperature(celsius: number): VitalFlag {
  if (celsius >= 39 || celsius < 35) return { severity: 'crit', label: celsius >= 39 ? 'High fever' : 'Hypothermia' };
  if (celsius >= 37.3) return { severity: 'warn', label: 'Fever' };
  if (celsius < 36.1) return { severity: 'warn', label: 'Low temperature' };
  return { severity: 'normal', label: 'Normal' };
}

/** SpO2 — normal ≥95, low 90–94, critical <90 */
export function classifySpo2(percent: number): VitalFlag {
  if (percent < 90) return { severity: 'crit', label: 'Severe hypoxemia' };
  if (percent < 95) return { severity: 'warn', label: 'Low oxygen' };
  return { severity: 'normal', label: 'Normal' };
}

/** Capillary glucose — normal 70–140, out-of-range beyond */
export function classifyGlucose(mgDl: number): VitalFlag {
  if (mgDl < 54 || mgDl > 250) return { severity: 'crit', label: mgDl < 54 ? 'Hypoglycemia' : 'Severe hyperglycemia' };
  if (mgDl < 70 || mgDl > 180) return { severity: 'warn', label: mgDl < 70 ? 'Low glucose' : 'High glucose' };
  return { severity: 'normal', label: 'Normal' };
}

export interface VitalSignInput {
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  heartRate: number;
  temperatureCelsius: number;
  oxygenSaturation: number;
  bloodGlucoseMgDl: number;
}

export interface VitalsClassification {
  flags: Record<keyof VitalSignInput, VitalFlag>;
  overall: VitalSeverity;
}

/** Classify a full vitals record; returns per-field flags + overall worst severity. */
export function classifyVitals(v: VitalSignInput): VitalsClassification {
  const flags = {
    systolicBloodPressure: classifySystolic(v.systolicBloodPressure),
    diastolicBloodPressure: classifyDiastolic(v.diastolicBloodPressure),
    heartRate: classifyHeartRate(v.heartRate),
    temperatureCelsius: classifyTemperature(v.temperatureCelsius),
    oxygenSaturation: classifySpo2(v.oxygenSaturation),
    bloodGlucoseMgDl: classifyGlucose(v.bloodGlucoseMgDl),
  } satisfies Record<keyof VitalSignInput, VitalFlag>;
  return { flags, overall: worstSeverity(Object.values(flags)) };
}

/** Tailwind classes per severity — token-based so they adapt to light/dark. */
export const SEVERITY_TEXT: Record<VitalSeverity, string> = {
  normal: 'text-success',
  warn: 'text-warning',
  crit: 'text-danger',
};

export const SEVERITY_BADGE: Record<VitalSeverity, string> = {
  normal: 'bg-emerald-subtle text-success border-emerald/30',
  warn: 'bg-amber-subtle text-warning border-amber/30',
  crit: 'bg-crimson-subtle text-danger border-crimson/40 animate-pulse',
};
