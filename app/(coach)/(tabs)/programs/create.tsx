import CreateProgramComponent from '@/components/coach/programs/CreateProgramComponent';
import { router } from 'expo-router';
import { useState } from 'react';

export type ProgramBlock = {
  id: string;
  name: string;
  description: string;
  startWeek: number;
  endWeek: number;
  focus: string;
  workouts: ProgramWorkout[];
};

export type ProgramWorkout = {
  id: string;
  day: string;
  name: string;
  exercises: ProgramExercise[];
};

export type ProgramExercise = {
  id: string;
  exerciseName: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
};

export default function CreateProgramPage() {
  const [programName, setProgramName] = useState('');
  const [description, setDescription] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('12');
  const [tags, setTags] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<ProgramBlock[]>([
    {
      id: '1',
      name: 'Block 1',
      description: '',
      startWeek: 1,
      endWeek: 4,
      focus: 'Volume',
      workouts: [],
    },
  ]);
  const [currentStep, setCurrentStep] = useState<'details' | 'blocks' | 'workouts' | 'review'>('details');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    setBlocks(blocks.filter(block => block.id !== blockId));
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
    setIsSaving(true);
    // In real app, save to database
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <CreateProgramComponent
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