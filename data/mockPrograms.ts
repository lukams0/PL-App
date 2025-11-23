// data/mockPrograms.ts
import type { Workout } from '@/types/datebase.types';
import type { Program } from '@/types/programs';

const makeWorkout = (partial: Partial<Workout>): Workout => ({
  id: partial.id ?? crypto.randomUUID?.() ?? String(Math.random()),
  athlete_id: partial.athlete_id ?? 'mock-athlete',
  block_id: partial.block_id ?? null,
  name: partial.name ?? 'Untitled Workout',
  description: partial.description ?? null,
  start_time: partial.start_time ?? new Date().toISOString(),
  end_time: partial.end_time ?? null,
  duration_minutes: partial.duration_minutes ?? 75,
  volume: partial.volume ?? 10000,
  notes: partial.notes ?? '',
  created_at: partial.created_at ?? new Date().toISOString(),
  updated_at: partial.updated_at ?? new Date().toISOString(),
});

// You can ignore these IDs once you hook into Supabase; they’re just to have
// a consistent linking story during development.
const block1Id = 'b1';
const block2Id = 'b2';
const meetBlock1Id = 'm1';
const meetBlock2Id = 'm2';
const lpBlockId = 'lp1';

export const mockPrograms: Program[] = [
  {
    id: 'plp-12wk-strength',
    name: 'PowerLift Pro – 12 Week Strength',
    description:
      'Four-day powerlifting program built around squat, bench, and deadlift with weekly overload and planned deloads.',
    goal: 'powerlifting',
    level: 'intermediate',
    durationWeeks: 12,
    startDate: '2025-09-01',
    endDate: '2025-11-23',
    status: 'current',
    progressPercent: 42,
    createdBy: 'self',
    blocks: [
      {
        id: block1Id,
        title: 'Block 1 – Volume Foundation',
        order: 1,
        focus: 'High-volume hypertrophy to build work capacity.',
        weekRange: 'Weeks 1–4',
        workouts: [
          makeWorkout({
            id: 'w-b1d1',
            block_id: block1Id,
            name: 'Day 1 – Squat Volume',
            description: 'High-bar squat focus with bench volume accessories.',
            start_time: '2025-09-01T17:00:00.000Z',
            duration_minutes: 90,
            volume: 18000,
          }),
          makeWorkout({
            id: 'w-b1d2',
            block_id: block1Id,
            name: 'Day 2 – Deadlift Volume',
            description: 'Deadlift and overhead press volume.',
            start_time: '2025-09-03T17:00:00.000Z',
            duration_minutes: 85,
            volume: 17000,
          }),
        ],
      },
      {
        id: block2Id,
        title: 'Block 2 – Strength Build',
        order: 2,
        focus: 'Lower volume, higher intensity, heavy compound lifts.',
        weekRange: 'Weeks 5–8',
        workouts: [
          makeWorkout({
            id: 'w-b2d1',
            block_id: block2Id,
            name: 'Day 1 – Heavy Squat',
            description: 'Low-bar squat and paused bench heavy sets.',
            start_time: '2025-10-01T17:00:00.000Z',
            duration_minutes: 95,
            volume: 16000,
          }),
          makeWorkout({
            id: 'w-b2d2',
            block_id: block2Id,
            name: 'Day 2 – Heavy Pull',
            description: 'Heavy deadlift + RDLs.',
            start_time: '2025-10-03T17:00:00.000Z',
            duration_minutes: 80,
            volume: 15000,
          }),
        ],
      },
    ],
  },
  {
    id: 'meet-prep-8wk',
    name: '8 Week Meet Prep',
    description:
      'Peaking block leading into a powerlifting meet with singles, heavy triples, and taper.',
    goal: 'powerlifting',
    level: 'advanced',
    durationWeeks: 8,
    startDate: '2025-04-01',
    endDate: '2025-05-26',
    status: 'completed',
    progressPercent: 100,
    createdBy: 'coach',
    blocks: [
      {
        id: meetBlock1Id,
        title: 'Block 1 – Heavy Triples',
        order: 1,
        focus: 'Build confidence with heavy triples close to opener.',
        weekRange: 'Weeks 1–4',
        workouts: [
          makeWorkout({
            id: 'w-m1d1',
            block_id: meetBlock1Id,
            name: 'Day 1 – Heavy Squat Triples',
            description: 'Low-bar squat triples @ 85–90%.',
            start_time: '2025-04-01T17:00:00.000Z',
            duration_minutes: 90,
            volume: 15000,
          }),
          makeWorkout({
            id: 'w-m1d2',
            block_id: meetBlock1Id,
            name: 'Day 2 – Heavy Bench',
            description: 'Comp bench triples and back-off volume.',
            start_time: '2025-04-03T17:00:00.000Z',
            duration_minutes: 75,
            volume: 11000,
          }),
        ],
      },
      {
        id: meetBlock2Id,
        title: 'Block 2 – Meet Peak & Taper',
        order: 2,
        focus: 'Singles at 90–95% then taper into meet day.',
        weekRange: 'Weeks 5–8',
        workouts: [
          makeWorkout({
            id: 'w-m2d1',
            block_id: meetBlock2Id,
            name: 'Day 1 – Squat Singles',
            description: 'Singles at 90–93% followed by light back-off.',
            start_time: '2025-05-01T17:00:00.000Z',
            duration_minutes: 70,
            volume: 10000,
          }),
          makeWorkout({
            id: 'w-m2d2',
            block_id: meetBlock2Id,
            name: 'Day 2 – Bench + Deadlift Opener Practice',
            description: 'Practice openers for bench and deadlift.',
            start_time: '2025-05-03T17:00:00.000Z',
            duration_minutes: 80,
            volume: 12000,
          }),
        ],
      },
    ],
  },
  {
    id: 'beg-3x-lp',
    name: 'Beginner 3×/Week Linear Progression',
    description:
      'Simple three day per week linear progression focused on squat, bench, and deadlift.',
    goal: 'strength',
    level: 'beginner',
    durationWeeks: 10,
    status: 'library',
    createdBy: 'library',
    blocks: [
      {
        id: lpBlockId,
        title: 'Linear Progression',
        order: 1,
        focus: 'Straight sets across with small weekly jumps.',
        weekRange: 'Weeks 1–10',
        workouts: [
          makeWorkout({
            id: 'w-lp1d1',
            block_id: lpBlockId,
            name: 'Day 1 – Squat / Bench',
            description: 'Squat 3×5, bench 3×5, accessories.',
            duration_minutes: 75,
            volume: 12000,
          }),
          makeWorkout({
            id: 'w-lp1d2',
            block_id: lpBlockId,
            name: 'Day 2 – Deadlift',
            description: 'Deadlift 1×5, light squats, accessories.',
            duration_minutes: 60,
            volume: 9000,
          }),
          makeWorkout({
            id: 'w-lp1d3',
            block_id: lpBlockId,
            name: 'Day 3 – Squat / Bench (Light)',
            description: 'Technique-focused squat and bench work.',
            duration_minutes: 65,
            volume: 10000,
          }),
        ],
      },
    ],
  },
];
