// types/programs.ts

import type { Workout } from '@/types/datebase.types';

export type ProgramStatus = 'current' | 'upcoming' | 'completed' | 'library';

export type ProgramGoal = 'powerlifting' | 'strength' | 'hypertrophy' | 'general';
export type ProgramLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface ProgramBlock {
  id: string;
  title: string;       // "Block 1 – Volume"
  order: number;       // 1, 2, 3...
  focus: string;       // short blurb
  weekRange: string;   // "Weeks 1–4"
  notes?: string;
  workouts: Workout[]; // REAL workouts in your DB
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  goal: ProgramGoal;
  level: ProgramLevel;
  durationWeeks: number;
  startDate?: string;        // ISO string
  endDate?: string;
  status: ProgramStatus;
  progressPercent?: number;  // 0–100 for current programs
  createdBy: 'self' | 'coach' | 'library';
  blocks: ProgramBlock[];
}
