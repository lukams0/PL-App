import { Workout, workoutService } from '@/services/workout.service';
import React, { createContext, ReactNode, useContext, useState } from 'react';

type ActiveWorkoutContextType = {
  activeWorkout: Workout | null;
  workoutId: string | null;
  startTime: number | null;
  isWorkoutActive: boolean;
  startWorkout: (workoutId: string) => Promise<void>;
  endWorkout: () => void;
  loadActiveWorkout: (userId: string) => Promise<void>;
};

const WorkoutContext = createContext<ActiveWorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [workoutId, setWorkoutId] = useState<string | null>(null);

  // Start a workout by session ID
  const startWorkout = async (newWorkoutId: string) => {
    try {
      console.log('Starting workout with session:', newWorkoutId);
      const workout = await workoutService.getWorkoutDetails(newWorkoutId);
      if (workout) {
        setActiveWorkout(workout);
        setWorkoutId(newWorkoutId);
        console.log('Active workout started:', workout.name);
      }
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  // End the active workout
  const endWorkout = () => {
    console.log('Ending active workout');
    setActiveWorkout(null);
    setWorkoutId(null);
  };

  // Load active workout from database (for resuming)
  const loadActiveWorkout = async (userId: string) => {
    try {
      console.log('Checking for active workout for user:', userId);
      const workout = await workoutService.getActiveWorkout();
      if (workout) {
        console.log('Found active workout:', workout.name);
        setActiveWorkout(workout);
        setWorkoutId(workout.id);
      } else {
        console.log('No active workout found');
        setActiveWorkout(null);
        setWorkoutId(null);
      }
    } catch (error) {
      console.error('Error loading active workout:', error);
    }
  };

  const isWorkoutActive = activeWorkout !== null;
  const startTime = activeWorkout ? new Date(activeWorkout.start_time).getTime() : null;

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        workoutId,
        startTime,
        isWorkoutActive,
        startWorkout,
        endWorkout,
        loadActiveWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}