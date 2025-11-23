import ExercisePageComponent from '@/components/athlete/exercises/ExercisePageComponent';
import { useAuth } from '@/providers/AuthContext';
import { exerciseService } from '@/services/exercise.service';
import { personalRecordService } from '@/services/personalrecord.service';
import { Exercise, ExerciseCategory, PersonalRecord } from '@/types/datebase.types';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';


const categories: ('All' | ExerciseCategory)[] = [
  'All',
  'legs',
  'chest',
  'back',
  'shoulders',
  'arms',
  'core',
  'full_body',
];
export default function ExerciseIndexPage() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [personalRecords, setPersonalRecords] = useState<Map<string, PersonalRecord>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleExercisePress = (exerciseId: string) => {
    router.push({
      pathname: '/(athlete)/(tabs)/exercises/[exerciseId]',
      params: { exerciseId }
    });
  };

  const handleCreateExercise = () => {
    router.push('/(athlete)/(tabs)/exercises/create-exercise');
  };

  // Fetch exercises on mount
  useEffect(() => {
    loadExercises();
  }, []);

  // Refresh exercises when screen regains focus (e.g., after creating new exercise)
  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [])
  );

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getAllExercises(user?.id);
      setExercises(data);
      setFilteredExercises(data);

      // Load personal records for all exercises
      if (user?.id) {
        const prs = await personalRecordService.getUserPRs(user.id);
        const prMap = new Map<string, PersonalRecord>();
        prs.forEach(pr => {
          prMap.set(pr.exercise_id, pr);
        });
        setPersonalRecords(prMap);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
      alert('Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter exercises when search query or category changes
  useEffect(() => {
    let filtered = exercises;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (exercise) => exercise.category.toLowerCase() === selectedCategory.toLowerCase().replace(' ', '_')
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  }, [searchQuery, selectedCategory, exercises]);

  // Helper function to format category for display
  const formatCategory = (category: ExerciseCategory): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <ExercisePageComponent 
      handleExercisePress={handleExercisePress}
      handleCreateExercise={handleCreateExercise}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      categories={categories}
      selectedCategory={selectedCategory}
      loading={loading}
      filteredExercises={filteredExercises}
      formatCategory={formatCategory}
      setSelectedCategory={setSelectedCategory}
      personalRecords={personalRecords}
    />
  );

}
