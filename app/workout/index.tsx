import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spinner, Text, YStack } from 'tamagui';

import ActiveWorkoutScreenComponent from '@/components/athlete/workout/ActiveWorkoutScreen';
import { useAuth } from '@/providers/AuthContext';
import { useWorkout } from '@/providers/WorkoutContext';
import { exerciseService } from '@/services/exercise.service';
import type {
  ExerciseSet,
  WorkoutExerciseWithDetails,
  WorkoutWithDetails,
} from '@/services/workout.service';
import { workoutService } from '@/services/workout.service';
import { Exercise } from '@/types/datebase.types';

type LocalExercise = WorkoutExerciseWithDetails;

export default function ActiveWorkoutModal() {
  const { user } = useAuth();
  const { workoutId, endWorkout } = useWorkout();
  const [workout, setWorkout] = useState<WorkoutWithDetails | null>(null);
  const [exercises, setExercises] = useState<LocalExercise[]>([]);
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [notes, setNotes] = useState('');

  // -------- Utilities --------
  const withSaving = useCallback(async (fn: () => Promise<void>) => {
    try {
      setSaving(true);
      await fn();
    } finally {
      setSaving(false);
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, []);

  const startMs = useMemo(
    () => (workout ? new Date(workout.start_time).getTime() : null),
    [workout]
  );

  // -------- Timers --------
  useEffect(() => {
    if (!startMs) return;
    const tick = () => setElapsedSec(Math.floor((Date.now() - startMs) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startMs]);

  // -------- Data loaders --------
  const loadWorkout = useCallback(async () => {
    if (!workoutId) return;
    const data = await workoutService.getWorkoutDetails(workoutId);
    if (data) {
      setWorkout(data);
      setExercises((data.exercises ?? []).slice());
      setNotes(data.notes ?? '');
    }
  }, [workoutId]);

  const loadCatalog = useCallback(async () => {
    const list = await exerciseService.getAllExercises();
    setCatalog(list);
  }, []);

  useEffect(() => {
    if (!workoutId) return;
    (async () => {
      try {
        setLoading(true);
        await Promise.all([loadWorkout(), loadCatalog()]);
      } catch (e) {
        console.error('Error loading workout:', e);
        Alert.alert('Error', 'Failed to load workout');
      } finally {
        setLoading(false);
      }
    })();
  }, [workoutId, loadWorkout, loadCatalog]);

  useFocusEffect(
    useCallback(() => {
      loadCatalog().catch(() => {});
    }, [loadCatalog])
  );

  // -------- Handlers --------
  const handleAddExercise = async (selected: Exercise) => {
    if (!workoutId) return;
    await withSaving(async () => {
      try {
        const order = exercises.length;
        const we = await workoutService.addExerciseToWorkout(workoutId, selected.id, order);

        const firstSet = await workoutService.addSetToExercise(we.id, {
          set_number: 1,
          weight: 0,
          reps: 0,
          rpe: null,
          completed: false,
        });

        const newEx: LocalExercise = {
          ...we,
          exercise: { id: selected.id, name: selected.name, category: selected.category as any },
          sets: [firstSet],
        };

        setExercises((prev) => [...prev, newEx]);
        setPickerOpen(false);
      } catch (e) {
        console.error('Add exercise failed:', e);
        Alert.alert('Error', 'Failed to add exercise');
      }
    });
  };

  const handleAddSet = async (workoutExerciseId: string) => {
    await withSaving(async () => {
      const ex = exercises.find((e) => e.id === workoutExerciseId);
      if (!ex) return;
      const nextNum = ex.sets.length + 1;
      const newSet = await workoutService.addSetToExercise(workoutExerciseId, {
        set_number: nextNum,
        weight: 0,
        reps: 0,
        rpe: null,
        completed: false,
      });
      setExercises((prev) =>
        prev.map((e) => (e.id === workoutExerciseId ? { ...e, sets: [...e.sets, newSet] } : e))
      );
    });
  };

  const handleUpdateSet = async (
    setId: string,
    workoutExerciseId: string,
    updates: Partial<ExerciseSet>
  ) => {
    // Optimistic UI
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === workoutExerciseId
          ? { ...ex, sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)) }
          : ex
      )
    );
    try {
      await workoutService.updateSet(setId, updates);
    } catch (e) {
      console.error('Update set failed:', e);
      await loadWorkout();
    }
  };

  const handleDeleteSet = async (setId: string, workoutExerciseId: string) => {
    const ex = exercises.find((e) => e.id === workoutExerciseId);
    if (!ex || ex.sets.length < 2) {
      Alert.alert('Cannot Delete', 'Each exercise must have at least one set.');
      return;
    }

    await withSaving(async () => {
      await workoutService.deleteSet(setId);

      setExercises((prev) =>
        prev.map((e) => {
          if (e.id !== workoutExerciseId) return e;
          const filtered = e.sets.filter((s) => s.id !== setId);
          const renumbered = filtered.map((s, idx) => ({ ...s, set_number: idx + 1 }));
          // persist renumbering (fire-and-forget)
          renumbered.forEach((s) => {
            const should = s.set_number;
            if (s.set_number !== should) {
              workoutService.updateSet(s.id, { set_number: should }).catch(() => {});
            }
          });
          return { ...e, sets: renumbered };
        })
      );
    });
  };

  const handleDeleteExercise = (workoutExerciseId: string) => {
    Alert.alert('Delete Exercise', 'Delete this exercise and all its sets?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await withSaving(async () => {
            await workoutService.removeExerciseFromWorkout(workoutExerciseId);
            setExercises((prev) => prev.filter((e) => e.id !== workoutExerciseId));
          });
        },
      },
    ]);
  };

  const handleFinish = async () => {
    if (!workoutId) return;

    const hasCompleted = exercises.some((ex) => ex.sets.some((s: any) => s.completed));
    if (!hasCompleted) {
      Alert.alert('No Sets Completed', "You haven't completed any sets. Finish workout anyway?", [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Finish Anyway', onPress: () => doComplete() },
      ]);
      return;
    }
    doComplete();
  };

  const doComplete = async () => {
    if (!workoutId) return;
    await withSaving(async () => {
      await workoutService.completeWorkout(workoutId, user?.id, notes);
      await endWorkout();
      Alert.alert('Workout Complete!', 'Great job! Your workout has been saved.', [
        { text: 'Go Home', onPress: () => router.replace('/(athlete)/(tabs)') },
      ]);
    });
  };

  const handleCancel = () => {
    Alert.alert('Cancel Workout', 'Cancel this workout? All progress will be lost.', [
      { text: 'Keep Working Out', style: 'cancel' },
      {
        text: 'Cancel Workout',
        style: 'destructive',
        onPress: async () => {
          if (!workoutId) return;
          try {
            await workoutService.cancelWorkout(workoutId);
            await endWorkout();
            router.replace('/(athlete)/(tabs)');
          } catch (e) {
            console.error('Cancel workout failed:', e);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading workout...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <ActiveWorkoutScreenComponent 
      handleCancel={handleCancel}
      saving={saving}
      workout={workout}
      formatTime={formatTime}
      elapsedSec={elapsedSec}
      handleFinish={handleFinish}
      exercises={exercises}
      handleDeleteExercise={handleDeleteExercise}
      handleAddExercise={handleAddExercise}
      handleAddSet={handleAddSet}
      handleDeleteSet={handleDeleteSet}
      handleUpdateSet={handleUpdateSet}
      setPickerOpen={setPickerOpen}
      notes={notes}
      setNotes={setNotes}
      pickerOpen={pickerOpen}
      catalog={catalog}
      loadCatalog={loadCatalog}
    />
  );

}
