import AthleteHomeComponent from "@/components/athlete/home/HomeComponent";
import { useAuth } from "@/providers/AuthContext";
import { useWorkout } from "@/providers/WorkoutContext";
import { workoutService } from "@/services/workout.service";
import { Workout } from "@/types/datebase.types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spinner, Text, YStack } from "tamagui";

export default function AthleteHomePage() {
  const { user } = useAuth();
  const { startWorkout, loadActiveWorkout } = useWorkout();
  const [activeProgram, setActiveProgram] = useState<any>(null);
  const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startingWorkout, setStartingWorkout] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);


  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Check for active workout
      await loadActiveWorkout(user.id);

      // Load athlete stats
      const statsData = await workoutService.getAthleteStats();
      setStats(statsData);

      // // Get active program
      // const program = await programService.getActiveProgram(user.id);
      // setActiveProgram(program);

      // if (program) {
      //   // Get workouts for current week
      //   const workouts = await programService.getWeekWorkouts(
      //     program.program_id,
      //     program.current_week
      //   );

      //   // Filter for today's workouts
      //   const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      //   const todaysWorkouts = workouts.filter(w =>
      //     w.day_of_week?.toLowerCase() === today.toLowerCase()
      //   );

      //   setTodayWorkouts(todaysWorkouts);
      // }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStartWorkout = async (workout: Workout) => {
    if (!user || startingWorkout) return;

    try {
      setStartingWorkout(true);

      // Create session in database
      const session = await workoutService.createWorkout({
        name: workout.name,
        notes: ''
      });

      // Set active workout in context
      await startWorkout(session.id);

      // Small delay to ensure state is set before navigation
      await new Promise(resolve => setTimeout(resolve, 300));

      // Open workout modal
      //router.push('/workout');

      // Reset loading state after navigation
      setStartingWorkout(false);
    } catch (error) {
      console.error('Error starting workout:', error);
      setStartingWorkout(false);
    }
  };

  const handleStartCustomWorkout = async () => {
    if (!user || startingWorkout) return;

    try {
      setStartingWorkout(true);

      // Create session in database
      const session = await workoutService.createWorkout({
        name: 'Custom Workout',
        notes: ''
      });

      // Set active workout in context
      await startWorkout(session.id);

      // Small delay to ensure state is set before navigation
      await new Promise(resolve => setTimeout(resolve, 300));

      // Open workout modal
      router.push('../workout');

      // Reset loading state after navigation
      setStartingWorkout(false);
    } catch (error) {
      console.error('Error starting workout:', error);
      setStartingWorkout(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading your workout plan...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <AthleteHomeComponent 
      refreshing={refreshing}
      onRefresh={onRefresh}
      stats={stats}
      activeProgram={activeProgram}
      todayWorkouts={todayWorkouts}
      startingWorkout={startingWorkout}
      handleStartCustomWorkout={handleStartCustomWorkout}
      handleStartWorkout={handleStartWorkout}
    />
  );
}
