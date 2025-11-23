import HistoryPageComponent from '@/components/athlete/history/HistoryPageComponent';
import { useAuth } from '@/providers/AuthContext';
import { Workout, workoutService } from '@/services/workout.service';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function HistoryScreen() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await workoutService.getAthleteWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const handleWorkoutPress = (workoutId: string) => {
    router.push({
      pathname: '/(athlete)/(tabs)/history/[workoutId]',
      params: { workoutId }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0 min';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  // Calculate stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeekWorkouts = workouts.filter(s => {
    const date = new Date(s.start_time);
    return date >= weekAgo;
  });
  const totalVolume = Math.round(
    workouts.reduce((sum, s) => sum + (s.volume || 0), 0) / 1000
  );

  return (
    <HistoryPageComponent 
        refreshing={refreshing}
        onRefresh={onRefresh}
        workouts={workouts}
        thisWeekWorkouts={thisWeekWorkouts}
        totalVolume={totalVolume}
        loading={loading}
        formatDate={formatDate}
        formatDuration={formatDuration}
        handleWorkoutPress={handleWorkoutPress}
    />
  );
}