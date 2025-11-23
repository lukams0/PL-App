import WorkoutPageComponent from '@/components/athlete/history/workoutPageComponent';
import { workoutService, WorkoutWithDetails } from '@/services/workout.service';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Spinner, Text, YStack } from 'tamagui';

export default function WorkoutDetailPage() {
  const { workoutId } = useLocalSearchParams();
  const [session, setSession] = useState<WorkoutWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [workoutId]);

  const loadSession = async () => {
    if (typeof workoutId !== 'string') return;
    
    try {
      setLoading(true);
      const data = await workoutService.getWorkoutDetails(workoutId);
      setSession(data);
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading workout details...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <Text fontSize="$5" fontWeight="bold" color="$gray12" textAlign="center">
            Workout Not Found
          </Text>
          <Button
            size="$4"
            backgroundColor="#7c3aed"
            color="white"
            onPress={handleBack}
            mt="$4"
          >
            Go Back
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <WorkoutPageComponent 
        session={session}
        handleBack={handleBack}
        formatDate={formatDate}
        formatTime={formatTime}
    />
  );
  
}