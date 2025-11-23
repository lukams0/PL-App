import { supabase } from "@/lib/supabase";
import { personalRecordService } from "./personalrecord.service";

export interface Workout {
  id: string;
  athlete_id: string;
  block_id: string | null;
  name: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  volume: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_order: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogExercise {
  id: string;
  name: string;
  category: string | null;
}

export interface ExerciseSet {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  weight: number;
  reps: number;
  rpe: number | null;
  created_at: string;
  completed?: boolean;
}

/** map DB row -> TS ExerciseSet */
const mapSetFromDb = (row: any): ExerciseSet => ({
  id: row.id,
  workout_exercise_id: row.workout_exercise_id,
  set_number: row.set_num,
  weight: row.weight,
  reps: row.reps,
  rpe: row.rpe,
  created_at: row.created_at,
});

/** map TS -> DB payload for insert/update */
const mapSetToDb = (set: {
  set_number?: number;
  weight?: number;
  reps?: number;
  rpe?: number | null;
  completed?: boolean;
}) => {
  const payload: any = {};
  if (set.set_number !== undefined) payload.set_num = set.set_number;
  if (set.weight !== undefined) payload.weight = set.weight;
  if (set.reps !== undefined) payload.reps = set.reps;
  if (set.rpe !== undefined) payload.rpe = set.rpe;
  if (set.completed !== undefined) payload.completed = set.completed; // if column exists
  return payload;
};

export interface WorkoutExerciseWithDetails extends WorkoutExercise {
  exercise: CatalogExercise;
  sets: ExerciseSet[];
}

export interface WorkoutWithDetails extends Workout {
  exercises: WorkoutExerciseWithDetails[];
}

class WorkoutService {
  /** Option B: athlete_id is filled by DB default (current_athlete_id()) */
  async createWorkout(data: { name: string; notes?: string; }): Promise<Workout> {
    const { data: workout, error } = await supabase
      .from('workouts')
      .insert({
        name: data.name,
        start_time: new Date().toISOString(),
        notes: data.notes ?? null,
        // athlete_id omitted on purpose
      })
      .select()
      .single();

    if (error) throw error;
    return workout;
  }

  /** RLS already scopes to the current athlete; no need for athleteId filter */
  async getAthleteWorkouts(): Promise<Workout[]> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getWorkoutDetails(workoutId: string): Promise<WorkoutWithDetails | null> {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        id, athlete_id, block_id, name, start_time, end_time,
        duration_minutes, volume, notes, created_at, updated_at,
        exercises:workout_exercises (
          id, workout_id, exercise_id, exercise_order, notes, created_at, updated_at,
          exercise:exercises ( id, name, category ),
          sets:exercise_sets (
            id, workout_exercise_id,
            set_num, weight:weight, reps, rpe, created_at
          )
        )
      `)
      .eq('id', workoutId)
      .single();

    if (error) throw error;
    if (!data) return null;

    const sorted = {
      ...data,
      exercises: (data.exercises ?? [])
        .sort((a: any, b: any) => a.exercise_order - b.exercise_order)
        .map((we: any) => ({
          ...we,
          sets: (we.sets ?? []).sort((a: any, b: any) => a.set_num - b.set_num),
        })),
    } as WorkoutWithDetails;

    return sorted;
  }

  async addExerciseToWorkout(
    workoutId: string,
    exerciseId: string,
    order: number,
    notes?: string
  ): Promise<WorkoutExercise> {
    const { data, error } = await supabase
      .from('workout_exercises')
      .insert({
        workout_id: workoutId,
        exercise_id: exerciseId,
        exercise_order: order,
        notes: notes ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data!;
  }

  async removeExerciseFromWorkout(workoutExerciseId: string): Promise<void> {
    const { error } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('id', workoutExerciseId);

    if (error) throw error;
  }

  async updateWorkoutExercise(
    workoutExerciseId: string,
    updates: { notes?: string; exercise_order?: number; }
  ): Promise<WorkoutExercise> {
    const { data, error } = await supabase
      .from('workout_exercises')
      .update(updates)
      .eq('id', workoutExerciseId)
      .select()
      .single();

    if (error) throw error;
    return data!;
  }

  async addSetToExercise(
    workoutExerciseId: string,
    setData: { set_number: number; weight: number; reps: number; rpe?: number | null; completed?: boolean; }
  ): Promise<ExerciseSet> {
    const payload = {
      workout_exercise_id: workoutExerciseId,
      ...mapSetToDb(setData),
    };

    const { data, error } = await supabase
      .from('exercise_sets')
      .insert(payload)
      .select('id, workout_exercise_id, set_num, weight, reps, rpe, created_at')
      .single();

    if (error) throw error;
    return mapSetFromDb(data);
  }

  async updateSet(
    setId: string,
    updates: { weight?: number; reps?: number; rpe?: number | null; completed?: boolean; set_number?: number; }
  ): Promise<ExerciseSet> {
    const { data, error } = await supabase
      .from('exercise_sets')
      .update(mapSetToDb(updates))
      .eq('id', setId)
      .select('id, workout_exercise_id, set_num, weight, reps, rpe, created_at')
      .single();

    if (error) throw error;
    return mapSetFromDb(data);
  }

  async deleteSet(setId: string): Promise<void> {
    const { error } = await supabase
      .from('exercise_sets')
      .delete()
      .eq('id', setId);

    if (error) throw error;
  }

  async completeWorkout(workoutId: string, userId?: string, notes?: string): Promise<Workout> {
    const endTime = new Date().toISOString();

    const { data: workout, error: wErr } = await supabase
      .from('workouts')
      .select('start_time')
      .eq('id', workoutId)
      .single();
    if (wErr || !workout) throw new Error('Session not found');

    const startTime = new Date(workout.start_time);
    const durationMinutes = Math.round((new Date(endTime).getTime() - startTime.getTime()) / 60000);

    const { data: workoutExercises } = await supabase
      .from('workout_exercises')
      .select('id')
      .eq('workout_id', workoutId);

    const workoutExerciseIds = (workoutExercises ?? []).map(we => we.id);

    let totalVolume = 0;
    if (workoutExerciseIds.length > 0) {
      const { data: sets } = await supabase
        .from('exercise_sets')
        .select('weight, reps, completed') // DB names
        .in('workout_exercise_id', workoutExerciseIds);

      totalVolume = (sets ?? [])
        .filter(s => (s as any).completed) // depends on your column existing
        .reduce((sum, s: any) => sum + (Number(s.weight) * Number(s.reps)), 0);
    }

    const { data: completed, error: uErr } = await supabase
      .from('workouts')
      .update({
        end_time: endTime,
        duration_minutes: durationMinutes,
        volume: totalVolume,
        notes: notes ?? null,
      })
      .eq('id', workoutId)
      .select()
      .single();

    if (uErr) throw uErr;
    if(!userId) return completed!;
    await this.trackPersonalRecords(workoutId, userId);
    return completed!;
  }

  async cancelWorkout(workoutId: string): Promise<void> {
    
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId)
    if (error) throw error;


  }

  /** RLS scopes rows; no athleteId filter needed */
  async getAthleteStats(): Promise<{
    totalWorkouts: number;
    totalVolume: number;
    averageDuration: number;
    thisWeekWorkouts: number;
  }> {
    const { data: workouts, error } = await supabase
      .from('workouts')
      .select('duration_minutes, volume, start_time')
      .not('end_time', 'is', null);

    if (error) throw error;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalWorkouts = workouts?.length ?? 0;
    const totalVolume = workouts?.reduce((sum, w) => sum + (w.volume ?? 0), 0) ?? 0;
    const averageDuration = totalWorkouts > 0
      ? (workouts!.reduce((sum, w) => sum + (w.duration_minutes ?? 0), 0) / totalWorkouts)
      : 0;
    const thisWeekWorkouts = (workouts ?? []).filter(w => new Date(w.start_time) >= oneWeekAgo).length;

    return {
      totalWorkouts,
      totalVolume,
      averageDuration: Math.round(averageDuration),
      thisWeekWorkouts,
    };
  }

  async getWorkoutSummary(workoutId: string): Promise<{ id: string; name: string; start_time: string; exerciseCount: number; } | null> {
    const { data: workout, error: sessionError } = await supabase
      .from('workouts')
      .select('id, name, start_time')
      .eq('id', workoutId)
      .single();

    if (sessionError || !workout) return null;

    const { data: exercises } = await supabase
      .from('workout_exercises')
      .select('id')
      .eq('workout_id', workoutId);

    return { ...workout, exerciseCount: exercises?.length ?? 0 };
  }

  /** RLS scopes rows; no athleteId filter needed */
  async getActiveWorkout(): Promise<Workout | null> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .is('end_time', null)
      .order('start_time', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }
  
  /**
   * Track personal records from completed session
   * Checks all completed sets and updates PRs if new records were achieved
   */
  private async trackPersonalRecords(sessionId: string, userId: string): Promise<void> {
  try {
    console.log('Tracking personal records for session:', sessionId);

    // Get all session exercises with their sets
    const { data: sessionExercises, error: exerciseError } = await supabase
      .from('workout_exercises')
      .select('id, exercise_id')
      .eq('workout_id', sessionId);

    if (exerciseError || !sessionExercises) {
      console.error('Error fetching session exercises for PR tracking:', exerciseError);
      return;
    }

    // For each exercise, find the best completed set
    for (const sessionExercise of sessionExercises) {
      const { data: sets, error: setsError } = await supabase
        .from('exercise_sets')
        .select('weight, reps, completed')  // 👈 use weight, not weight_lbs
        .eq('workout_exercise_id', sessionExercise.id)
        .eq('completed', true)
        .order('weight', { ascending: false })
        .order('reps', { ascending: false });

      if (setsError || !sets || sets.length === 0) {
        continue; // No completed sets for this exercise
      }

      // Get the best set (highest weight, or highest reps at same weight)
      const bestSet = sets[0];

      // Check if this would be a new PR
      const isNewPR = await personalRecordService.wouldBeNewPR(
        userId,
        sessionExercise.exercise_id,
        bestSet.weight,
        bestSet.reps
      );

      if (isNewPR) {
        console.log(
          `New PR achieved for exercise ${sessionExercise.exercise_id}: ${bestSet.weight}lbs x ${bestSet.reps}`
        );

        // Upsert the new PR (weight from sets.weight → PR.weight_lbs)
        await personalRecordService.upsertPR(
          userId,
          sessionExercise.exercise_id,
          {
            weight_lbs: bestSet.weight,
            reps: bestSet.reps,
            achieved_at: new Date().toISOString(),
          }
        );
      }
    }

    console.log('Personal records tracking completed');
  } catch (error) {
    console.error('Error tracking personal records:', error);
    // Don't throw - we don't want to fail the session completion if PR tracking fails
  }
}


}

export const workoutService = new WorkoutService();
