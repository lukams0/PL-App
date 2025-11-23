import { supabase } from "@/lib/supabase";

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

/**
 * Re-use your Workout types for nested selects
 * (You can import these from your workout service/types file
 * instead of redeclaring if you prefer.)
 */
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

export interface BlockWithWorkouts extends Block {
    workouts: Workout[];
}

export interface ProgramWithDetails extends Program {
    blocks: BlockWithWorkouts[];
}

export interface AthleteProgramWithProgram extends AthleteProgram {
    program: Program;
}

class ProgramService {
    /**
     * Create a new program.
     * For now coach_id is optional – you can later wire this up to a "current coach"
     * similar to current_athlete_id().
     */
    async createProgram(data: {
        name: string;
        description?: string;
        duration_weeks: number;
        is_public?: boolean;
        coach_id?: string | null;
    }): Promise<Program> {
        const { data: program, error } = await supabase
            .from("programs")
            .insert({
                name: data.name,
                description: data.description ?? "",
                duration_weeks: data.duration_weeks,
                is_public: data.is_public ?? true,
                coach_id: data.coach_id ?? null,
            })
            .select("*")
            .single();

        if (error) throw error;
        return program as Program;
    }

    /**
     * Get all public programs (program library).
     * RLS will still apply, but this is intended as your browseable library.
     */
    async getPublicPrograms(): Promise<Program[]> {
        const { data, error } = await supabase
            .from("programs")
            .select("*")
            .eq("is_public", true)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return (data ?? []) as Program[];
    }

    /**
     * Get a single program with its blocks and (optionally) workouts under each block.
     *
     * ⚠️ This assumes:
     * - blocks.program_id → programs.id FK
     * - workouts.block_id → blocks.id FK
     * If your Supabase relationship names differ, adjust the select string.
     */
    async getProgramDetails(programId: string): Promise<ProgramWithDetails | null> {
        const { data, error } = await supabase
            .from("programs")
            .select(
                `
        id, name, description, coach_id, duration_weeks, is_public, created_at, updated_at,
        blocks:blocks (
          id, program_id, name, description, start_week, end_week, focus, block_order, created_at, updated_at,
          workouts:workouts (
            id, athlete_id, block_id, name, start_time, end_time,
            duration_minutes, volume, notes, created_at, updated_at
          )
        )
      `
            )
            .eq("id", programId)
            .single();

        if (error) throw error;
        if (!data) return null;

        const sorted: ProgramWithDetails = {
            ...(data as any),
            blocks: ((data as any).blocks ?? [])
                .sort((a: any, b: any) => a.block_order - b.block_order)
                .map((block: any) => ({
                    ...block,
                    workouts: (block.workouts ?? []).sort(
                        (a: any, b: any) =>
                            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                    ),
                })),
        };

        return sorted;
    }

    /**
     * Get all programs assigned to the current athlete.
     *
     * RLS should scope athlete_programs to the current athlete,
     * so we don’t filter by athlete_id explicitly.
     */
    async getAthletePrograms(): Promise<AthleteProgramWithProgram[]> {
        const { data, error } = await supabase
            .from("athlete_programs")
            .select(
                `
      id, athlete_id, program_id, start_date, end_date,
      current_week, status, created_at, updated_at,
      program:programs (
        id, name, description, coach_id, duration_weeks, is_public, created_at, updated_at
      )
    `
            )
            .order("start_date", { ascending: false });

        if (error) throw error;

        const rows = (data ?? []) as any[];

        const normalized: AthleteProgramWithProgram[] = rows.map((row) => ({
            id: row.id,
            athlete_id: row.athlete_id,
            program_id: row.program_id,
            start_date: row.start_date,
            end_date: row.end_date,
            current_week: row.current_week,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
            program: Array.isArray(row.program) ? row.program[0] : row.program,
        }));

        return normalized;
    }


    /**
     * Get the latest active program for the current athlete.
     * (status = 'active', latest start_date)
     */
    async getActiveAthleteProgram(): Promise<AthleteProgramWithProgram | null> {
        const { data, error } = await supabase
            .from("athlete_programs")
            .select(
                `
      id, athlete_id, program_id, start_date, end_date,
      current_week, status, created_at, updated_at,
      program:programs (
        id, name, description, coach_id, duration_weeks, is_public, created_at, updated_at
      )
    `
            )
            .eq("status", "active")
            .order("start_date", { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if ((error as any).code === "PGRST116") return null;
            throw error;
        }

        if (!data) return null;

        const row = data as any;

        const normalized: AthleteProgramWithProgram = {
            id: row.id,
            athlete_id: row.athlete_id,
            program_id: row.program_id,
            start_date: row.start_date,
            end_date: row.end_date,
            current_week: row.current_week,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
            program: Array.isArray(row.program) ? row.program[0] : row.program,
        };

        return normalized;
    }


    /**
     * Assign a program to the current athlete.
     * Similar idea to createWorkout: athlete_id is assumed to be
     * filled in by a DB default (e.g. current_athlete_id()) via RLS.
     */
    async assignProgramToCurrentAthlete(params: {
        programId: string;
        startDate?: string; // default: today
        status?: string; // default: 'active'
        current_week?: number | null; // default: 1
    }): Promise<AthleteProgram> {
        const startDate =
            params.startDate ?? new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const status = params.status ?? "active";
        const currentWeek = params.current_week ?? 1;

        const { data, error } = await supabase
            .from("athlete_programs")
            .insert({
                program_id: params.programId,
                start_date: startDate,
                end_date: null,
                status,
                current_week: currentWeek,
                // athlete_id omitted on purpose – DB default handles it
            })
            .select("*")
            .single();

        if (error) throw error;
        return data as AthleteProgram;
    }

    /**
     * Update an athlete_program row (progress, status, etc.)
     */
    async updateAthleteProgram(
        athleteProgramId: string,
        updates: {
            current_week?: number | null;
            status?: string;
            end_date?: string | null;
        }
    ): Promise<AthleteProgram> {
        const { data, error } = await supabase
            .from("athlete_programs")
            .update(updates)
            .eq("id", athleteProgramId)
            .select("*")
            .single();

        if (error) throw error;
        return data as AthleteProgram;
    }

    /**
     * Cancel an athlete's program assignment.
     * (If you prefer soft-delete, change this to update status instead.)
     */
    async cancelProgramAssignment(athleteProgramId: string): Promise<void> {
        const { error } = await supabase
            .from("athlete_programs")
            .delete()
            .eq("id", athleteProgramId);

        if (error) throw error;
    }

    /**
     * Simple helper to get a program summary by id
     * (no blocks/workouts, just high-level info).
     */
    async getProgramSummary(
        programId: string
    ): Promise<{ id: string; name: string; duration_weeks: number; is_public: boolean } | null> {
        const { data, error } = await supabase
            .from("programs")
            .select("id, name, duration_weeks, is_public")
            .eq("id", programId)
            .single();

        if (error || !data) return null;
        return data as {
            id: string;
            name: string;
            duration_weeks: number;
            is_public: boolean;
        };
    }
}

export const programService = new ProgramService();
