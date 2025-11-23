export type UserRole = 'athlete' | 'coach';
export type GenderType = 'Male' | 'Female' | 'Other';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type WeightUnit = 'kg' | 'lbs';
export type DistanceUnit = 'metric' | 'imperial';
export type ExerciseCategory = 'legs' | 'chest' | 'back' | 'shoulders' | 'arms' | 'core' | 'full_body';
export const categories: ('All' | ExerciseCategory)[] = [
  'All',
  'legs',
  'chest',
  'back',
  'shoulders',
  'arms',
  'core',
  'full_body',
];
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AthleteProfile {
  id: string;
  user_id: string;
  age: number | null;
  gender: GenderType | null;
  weight_lbs: number | null;
  height_inches: number | null;
  weight_unit: WeightUnit;
  distance_unit: DistanceUnit;
  experience_level: ExperienceLevel | null;
  goals: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  athlete_id: string;
  block_id: string | null;
  name: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  volume: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  description: string;
  form_notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalRecord {
  id: string;
  athlete_id: string;
  exercise_id: string;
  weight_lbs: number;
  reps: number;
  achieved_at: string;
  notes: string | null;
  created_at: string;
}

// Extended PR with exercise details
export interface PersonalRecordWithExercise extends PersonalRecord {
  exercise: Exercise;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  coach_id: string | null;
  duration_weeks: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Block {
  id: string;
  program_id: string;
  name: string;
  description: string | null;
  start_week: number;
  end_week: number;
  focus: string | null;
  block_order: number;
  created_at: string;
  updated_at: string;
}

export interface AthleteProgram {
  id: string;
  athlete_id: string;
  program_id: string;
  start_date: string;
  end_date: string | null;
  current_week: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export type CoachingFormat = 'online' | 'in_person' | 'hybrid';

export type CoachSpecialty =
  | 'powerlifting'
  | 'strength'
  | 'hypertrophy'
  | 'weightlifting'
  | 'general_fitness';

export type CoachAthleteLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface CoachProfile {
  id: string;
  user_id: string;
  bio: string;
  years_coaching: number;
  specialties: CoachSpecialty[];
  coaching_format: CoachingFormat;
  accepting_new_athletes: boolean;
  athlete_levels: CoachAthleteLevel[];
  location: string | null;
  monthly_rate: number | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
}
