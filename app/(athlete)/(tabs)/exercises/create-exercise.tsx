import CreateExerciseComponent from '@/components/athlete/exercises/CreateExerciseComponent';
import { useAuth } from '@/providers/AuthContext';
import { exerciseService } from '@/services/exercise.service';
import { ExerciseCategory } from '@/types/datebase.types';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';


const categories: { value: ExerciseCategory; label: string }[] = [
  { value: 'legs', label: 'Legs' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms' },
  { value: 'core', label: 'Core' },
  { value: 'full_body', label: 'Full Body' },
];

export default function CreateExerciseScreen() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | ''>('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter an exercise name');
      return;
    }

    if (!category) {
      Alert.alert('Validation Error', 'Please select a category');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an exercise');
      return;
    }

    setIsSaving(true);
    try {
      await exerciseService.createCustomExercise(user.id, {
        name: name.trim(),
        category,
        description: description.trim() || undefined,
        form_notes: notes.trim() || undefined,
      });

      Alert.alert('Success', 'Exercise created successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating exercise:', error);
      Alert.alert('Error', 'Failed to create exercise. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CreateExerciseComponent 
      handleBack={handleBack}
      handleSave={handleSave}
      name={name}
      setName={setName}
      categories={categories}
      category={category}
      setCategory={setCategory}
      description={description}
      setDescription={setDescription}
      notes={notes}
      setNotes={setNotes}
      isSaving={isSaving}
    />
  );
}