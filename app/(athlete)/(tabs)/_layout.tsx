// app/(athlete)/(tabs)/_layout.tsx
import TabBar from '@/components/athlete/layout/TabBar';
import { useWorkout } from '@/providers/WorkoutContext';
import { workoutService } from '@/services/workout.service';
import { router, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';

type ActiveSummary = {
  id: string;
  name: string;
  start_time: string;
  exerciseCount: number;
};

export default function TabsLayout() {
  const { workoutId } = useWorkout();
  const pathname = usePathname();
  const [summary, setSummary] = useState<ActiveSummary | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!workoutId) {
        if (mounted) setSummary(null);
        return;
      }
      try {
        const s = await workoutService.getWorkoutSummary(workoutId);
        if (mounted) setSummary(s);
      } catch {
        if (mounted) setSummary(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [workoutId]);

  const hideBar =
    pathname?.startsWith('/(athlete)/workout') || pathname?.includes('/workout');

  const handlePress = () => {
    router.push('/workout');
  };

  return (
    <TabBar
      isWorkoutActive={!!workoutId && !!summary && !hideBar}
      activeSession={summary}
      handlePress={handlePress}
    />
  );
}