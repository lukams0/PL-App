// app/(coach)/(tabs)/programs/edit/[programId].tsx
import EditProgramComponent, { ProgramBlock, ProgramExercise, ProgramWorkout } from '@/components/coach/programs/EditProgramComponent';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spinner, Text, YStack } from 'tamagui';

export default function EditProgramPage() {
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [programName, setProgramName] = useState('');
  const [description, setDescription] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('12');
  const [tags, setTags] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<ProgramBlock[]>([]);
  const [currentStep, setCurrentStep] = useState<'details' | 'blocks' | 'workouts' | 'review'>('details');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing program data
  useEffect(() => {
    const loadProgram = async () => {
      try {
        // In production, fetch from programService.getProgramDetails(programId)
        // For now, using fake data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fake existing program data
        setProgramName('12-Week Powerlifting');
        setDescription('Progressive overload program focused on improving the big 3 lifts with proper periodization and peaking.');
        setDurationWeeks('12');
        setTags(['powerlifting', 'strength', 'intermediate']);
        setBlocks([
          {
            id: '1',
            name: 'Volume Accumulation',
            description: 'High volume phase to build work capacity',
            startWeek: 1,
            endWeek: 4,
            focus: 'High volume, moderate intensity',
            workouts: [
              { id: '1-1', day: 'Monday', name: 'Squat Day', exercises: [] },
              { id: '1-2', day: 'Wednesday', name: 'Bench Day', exercises: [] },
              { id: '1-3', day: 'Friday', name: 'Deadlift Day', exercises: [] },
            ],
          },
          {
            id: '2',
            name: 'Intensity Phase',
            description: 'Increase intensity while reducing volume',
            startWeek: 5,
            endWeek: 8,
            focus: 'Reduced volume, increased intensity',
            workouts: [
              { id: '2-1', day: 'Monday', name: 'Heavy Squat', exercises: [] },
              { id: '2-2', day: 'Wednesday', name: 'Heavy Bench', exercises: [] },
              { id: '2-3', day: 'Friday', name: 'Heavy Deadlift', exercises: [] },
            ],
          },
          {
            id: '3',
            name: 'Peak & Taper',
            description: 'Peak strength and taper for competition',
            startWeek: 9,
            endWeek: 12,
            focus: 'Maximum intensity, minimal volume',
            workouts: [
              { id: '3-1', day: 'Monday', name: 'Peak Squat', exercises: [] },
              { id: '3-2', day: 'Thursday', name: 'Peak Bench/Dead', exercises: [] },
            ],
          },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading program:', error);
        Alert.alert('Error', 'Failed to load program');
        router.back();
      }
    };

    loadProgram();
  }, [programId]);

  const handleAddBlock = () => {
    const lastBlock = blocks[blocks.length - 1];
    const newBlock: ProgramBlock = {
      id: String(Date.now()),
      name: `Block ${blocks.length + 1}`,
      description: '',
      startWeek: lastBlock ? lastBlock.endWeek + 1 : 1,
      endWeek: lastBlock ? lastBlock.endWeek + 4 : 4,
      focus: '',
      workouts: [],
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<ProgramBlock>) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const handleDeleteBlock = (blockId: string) => {
    if (blocks.length <= 1) {
      Alert.alert('Cannot Delete', 'Program must have at least one block');
      return;
    }
    Alert.alert(
      'Delete Block',
      'Are you sure you want to delete this block and all its workouts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setBlocks(blocks.filter(block => block.id !== blockId)),
        },
      ]
    );
  };

  const handleAddWorkout = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const newWorkout: ProgramWorkout = {
      id: String(Date.now()),
      day: 'Monday',
      name: `Day ${block.workouts.length + 1}`,
      exercises: [],
    };

    handleUpdateBlock(blockId, {
      workouts: [...block.workouts, newWorkout],
    });
  };

  const handleUpdateWorkout = (blockId: string, workoutId: string, updates: Partial<ProgramWorkout>) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const updatedWorkouts = block.workouts.map(workout =>
      workout.id === workoutId ? { ...workout, ...updates } : workout
    );

    handleUpdateBlock(blockId, { workouts: updatedWorkouts });
  };

  const handleAddExercise = (blockId: string, workoutId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const workout = block.workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const newExercise: ProgramExercise = {
      id: String(Date.now()),
      exerciseName: '',
      sets: 3,
      reps: '8-12',
      rest: '90s',
      notes: '',
    };

    handleUpdateWorkout(blockId, workoutId, {
      exercises: [...workout.exercises, newExercise],
    });
  };

  const handleSaveProgram = async () => {
    if (!programName.trim()) {
      Alert.alert('Missing Information', 'Please enter a program name');
      return;
    }

    setIsSaving(true);
    try {
      // In production, save to database via programService
      console.log('Updating program:', {
        id: programId,
        name: programName,
        description,
        durationWeeks: parseInt(durationWeeks),
        tags,
        blocks,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Success', 'Program updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error saving program:', error);
      Alert.alert('Error', 'Failed to save program. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to go back? Any unsaved changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center" gap="$3">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray11">Loading program...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <EditProgramComponent
      programName={programName}
      setProgramName={setProgramName}
      description={description}
      setDescription={setDescription}
      durationWeeks={durationWeeks}
      setDurationWeeks={setDurationWeeks}
      tags={tags}
      handleAddTag={handleAddTag}
      handleRemoveTag={handleRemoveTag}
      blocks={blocks}
      handleAddBlock={handleAddBlock}
      handleUpdateBlock={handleUpdateBlock}
      handleDeleteBlock={handleDeleteBlock}
      handleAddWorkout={handleAddWorkout}
      handleUpdateWorkout={handleUpdateWorkout}
      handleAddExercise={handleAddExercise}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      selectedBlockId={selectedBlockId}
      setSelectedBlockId={setSelectedBlockId}
      isSaving={isSaving}
      handleSaveProgram={handleSaveProgram}
      handleBack={handleBack}
    />
  );
}