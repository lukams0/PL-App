import ExerciseComponent from '@/components/athlete/exercises/ExerciseComponent';
import { useAuth } from '@/providers/AuthContext';
import { exerciseService } from '@/services/exercise.service';
import { personalRecordService } from '@/services/personalrecord.service';
import { Exercise, PersonalRecord } from '@/types/datebase.types';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, XStack, YStack } from 'tamagui';

export default function ExerciseDetailPage() {
  const { exerciseId } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [prHistory, setPrHistory] = useState<PersonalRecord[]>([]);
  const [currentPR, setCurrentPR] = useState<PersonalRecord | null>(null);

  // Fetch exercise and PR data
  useEffect(() => {
    loadExerciseData();
  }, [exerciseId, user]);

  const loadExerciseData = async () => {
    if (!exerciseId || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch exercise details
      const exerciseData = await exerciseService.getExercise(exerciseId as string);
      if (!exerciseData) {
        setError('Exercise not found');
        return;
      }
      setExercise(exerciseData);

      const prHistoryData = await personalRecordService.getExercisePRHistory(
        user.id,
        exerciseId as string
      );
      setPrHistory(prHistoryData);

      if (prHistoryData.length > 0) {
        const currentPRData = await personalRecordService.getExercisePR(
          user.id,
          exerciseId as string
        );
        setCurrentPR(currentPRData);
      }
    } catch (err) {
      console.error('Error loading exercise data:', err);
      setError('Failed to load exercise data');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format category for display
  const formatCategory = (category: string | undefined) => {
    if (!category) return '';
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} backgroundColor="#f5f5f5" ai="center" jc="center">
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text mt="$4" color="$gray11">Loading exercise...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !exercise) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} backgroundColor="#f5f5f5">
          <XStack backgroundColor="#f5f5f5" p="$4" ai="center" gap="$3">
            <Button size="$3" chromeless onPress={handleBack} pressStyle={{ opacity: 0.7 }}>
              <ArrowLeft size={24} color="#6b7280" />
            </Button>
            <Text fontSize="$7" fontWeight="bold" color="$gray12">Exercise</Text>
          </XStack>
          <YStack f={1} ai="center" jc="center" p="$4">
            <Text fontSize="$6" color="$red10" textAlign="center" mb="$4">
              {error || 'Exercise not found'}
            </Text>
            <Button onPress={handleBack} theme="purple">
              Go Back
            </Button>
          </YStack>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <ExerciseComponent 
      handleBack={handleBack}
      exercise={exercise}
      formatCategory={formatCategory}
      prHistory={prHistory}
      formatDate={formatDate}
      currentPR={currentPR}
    />
  );

}