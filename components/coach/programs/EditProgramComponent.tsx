// components/coach/programs/EditProgramComponent.tsx
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    ChevronDown,
    ChevronRight,
    Clock,
    Dumbbell,
    Edit,
    Plus,
    Save,
    Trash2
} from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, TextArea, XStack, YStack } from 'tamagui';

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

type Props = {
  programName: string;
  setProgramName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  durationWeeks: string;
  setDurationWeeks: (weeks: string) => void;
  tags: string[];
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  blocks: ProgramBlock[];
  handleAddBlock: () => void;
  handleUpdateBlock: (blockId: string, updates: Partial<ProgramBlock>) => void;
  handleDeleteBlock: (blockId: string) => void;
  handleAddWorkout: (blockId: string) => void;
  handleUpdateWorkout: (blockId: string, workoutId: string, updates: Partial<ProgramWorkout>) => void;
  handleAddExercise: (blockId: string, workoutId: string) => void;
  currentStep: 'details' | 'blocks' | 'workouts' | 'review';
  setCurrentStep: (step: 'details' | 'blocks' | 'workouts' | 'review') => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  isSaving: boolean;
  handleSaveProgram: () => Promise<void>;
  handleBack: () => void;
};

export default function EditProgramComponent({
  programName,
  setProgramName,
  description,
  setDescription,
  durationWeeks,
  setDurationWeeks,
  tags,
  handleAddTag,
  handleRemoveTag,
  blocks,
  handleAddBlock,
  handleUpdateBlock,
  handleDeleteBlock,
  handleAddWorkout,
  handleUpdateWorkout,
  handleAddExercise,
  currentStep,
  setCurrentStep,
  selectedBlockId,
  setSelectedBlockId,
  isSaving,
  handleSaveProgram,
  handleBack,
}: Props) {
  const availableTags = ['strength', 'powerlifting', 'hypertrophy', 'weightlifting', 'general', 'beginner', 'intermediate', 'advanced'];

  const renderStepIndicator = () => {
    const steps = [
      { key: 'details', label: 'Details', icon: Edit },
      { key: 'blocks', label: 'Blocks', icon: Calendar },
      { key: 'workouts', label: 'Workouts', icon: Dumbbell },
      { key: 'review', label: 'Review', icon: Save },
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <XStack ai="center" jc="center" gap="$2" p="$3">
        {steps.map((step, index) => (
          <XStack key={step.key} ai="center" gap="$2">
            <Pressable onPress={() => setCurrentStep(step.key as any)}>
              <YStack
                w={40}
                h={40}
                borderRadius="$10"
                backgroundColor={index <= currentIndex ? '#7c3aed' : '#e5e7eb'}
                ai="center"
                jc="center"
              >
                <step.icon size={20} color="white" />
              </YStack>
            </Pressable>
            {index < steps.length - 1 && (
              <YStack
                w={30}
                h={2}
                backgroundColor={index < currentIndex ? '#7c3aed' : '#e5e7eb'}
              />
            )}
          </XStack>
        ))}
      </XStack>
    );
  };

  const renderDetailsStep = () => (
    <YStack gap="$4">
      <Card elevate size="$4" p="$4" backgroundColor="white">
        <YStack gap="$3">
          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$gray12">
              Program Name
            </Text>
            <Input
              size="$4"
              value={programName}
              onChangeText={setProgramName}
              placeholder="e.g., 12-Week Powerlifting Prep"
              borderColor="#e9d5ff"
              focusStyle={{ borderColor: '#7c3aed' }}
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$gray12">
              Description
            </Text>
            <TextArea
              size="$4"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the program goals and structure..."
              borderColor="#e9d5ff"
              focusStyle={{ borderColor: '#7c3aed' }}
              numberOfLines={4}
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$gray12">
              Duration (weeks)
            </Text>
            <Input
              size="$4"
              value={durationWeeks}
              onChangeText={setDurationWeeks}
              placeholder="12"
              keyboardType="numeric"
              borderColor="#e9d5ff"
              focusStyle={{ borderColor: '#7c3aed' }}
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$gray12">
              Tags
            </Text>
            <XStack gap="$2" flexWrap="wrap">
              {availableTags.map(tag => (
                <Pressable
                  key={tag}
                  onPress={() => tags.includes(tag) ? handleRemoveTag(tag) : handleAddTag(tag)}
                >
                  <XStack
                    backgroundColor={tags.includes(tag) ? '#7c3aed' : 'white'}
                    borderWidth={1}
                    borderColor={tags.includes(tag) ? '#7c3aed' : '#e5e7eb'}
                    px="$3"
                    py="$2"
                    borderRadius="$3"
                  >
                    <Text 
                      fontSize="$3" 
                      color={tags.includes(tag) ? 'white' : '$gray11'}
                      fontWeight={tags.includes(tag) ? '600' : '400'}
                    >
                      {tag}
                    </Text>
                  </XStack>
                </Pressable>
              ))}
            </XStack>
          </YStack>
        </YStack>
      </Card>
    </YStack>
  );

  const renderBlocksStep = () => (
    <YStack gap="$4">
      {blocks.map((block) => (
        <Card key={block.id} elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <XStack ai="center" jc="space-between">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                {block.name}
              </Text>
              <Button
                size="$2"
                chromeless
                onPress={() => handleDeleteBlock(block.id)}
                pressStyle={{ opacity: 0.7 }}
              >
                <Trash2 size={18} color="#ef4444" />
              </Button>
            </XStack>

            <YStack gap="$2">
              <Text fontSize="$3" color="$gray10">Block Name</Text>
              <Input
                size="$3"
                value={block.name}
                onChangeText={(value) => handleUpdateBlock(block.id, { name: value })}
                placeholder="e.g., Volume Phase"
                borderColor="#e9d5ff"
                focusStyle={{ borderColor: '#7c3aed' }}
              />
            </YStack>

            <XStack gap="$3">
              <YStack f={1} gap="$2">
                <Text fontSize="$3" color="$gray10">Start Week</Text>
                <Input
                  size="$3"
                  value={String(block.startWeek)}
                  onChangeText={(value) => handleUpdateBlock(block.id, { startWeek: Number(value) || 1 })}
                  keyboardType="numeric"
                  borderColor="#e9d5ff"
                  focusStyle={{ borderColor: '#7c3aed' }}
                />
              </YStack>
              <YStack f={1} gap="$2">
                <Text fontSize="$3" color="$gray10">End Week</Text>
                <Input
                  size="$3"
                  value={String(block.endWeek)}
                  onChangeText={(value) => handleUpdateBlock(block.id, { endWeek: Number(value) || 1 })}
                  keyboardType="numeric"
                  borderColor="#e9d5ff"
                  focusStyle={{ borderColor: '#7c3aed' }}
                />
              </YStack>
            </XStack>

            <YStack gap="$2">
              <Text fontSize="$3" color="$gray10">Focus</Text>
              <Input
                size="$3"
                value={block.focus}
                onChangeText={(value) => handleUpdateBlock(block.id, { focus: value })}
                placeholder="e.g., Volume, Intensity, Peaking"
                borderColor="#e9d5ff"
                focusStyle={{ borderColor: '#7c3aed' }}
              />
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$3" color="$gray10">Description</Text>
              <TextArea
                size="$3"
                value={block.description}
                onChangeText={(value) => handleUpdateBlock(block.id, { description: value })}
                placeholder="Describe this block's goals..."
                borderColor="#e9d5ff"
                focusStyle={{ borderColor: '#7c3aed' }}
                numberOfLines={2}
              />
            </YStack>
          </YStack>
        </Card>
      ))}

      <Button
        size="$4"
        backgroundColor="#7c3aed"
        color="white"
        onPress={handleAddBlock}
        pressStyle={{ backgroundColor: '#6d28d9' }}
        icon={Plus}
      >
        Add Block
      </Button>
    </YStack>
  );

  const renderWorkoutsStep = () => (
    <YStack gap="$4">
      {blocks.map(block => (
        <Card key={block.id} elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <Pressable onPress={() => setSelectedBlockId(selectedBlockId === block.id ? null : block.id)}>
              <XStack ai="center" jc="space-between">
                <YStack f={1}>
                  <Text fontSize="$5" fontWeight="600" color="$gray12">
                    {block.name}
                  </Text>
                  <Text fontSize="$3" color="$gray10">
                    Weeks {block.startWeek}-{block.endWeek} • {block.workouts.length} workouts
                  </Text>
                </YStack>
                {selectedBlockId === block.id ? <ChevronDown size={20} color="#6b7280" /> : <ChevronRight size={20} color="#6b7280" />}
              </XStack>
            </Pressable>

            {selectedBlockId === block.id && (
              <YStack gap="$3" mt="$2">
                {block.workouts.map(workout => (
                  <Card key={workout.id} backgroundColor="#faf5ff" p="$3">
                    <YStack gap="$2">
                      <XStack ai="center" jc="space-between">
                        <YStack f={1} gap="$1">
                          <Input
                            size="$3"
                            value={workout.name}
                            onChangeText={(value) => handleUpdateWorkout(block.id, workout.id, { name: value })}
                            placeholder="Workout name"
                            borderColor="#e9d5ff"
                            focusStyle={{ borderColor: '#7c3aed' }}
                            backgroundColor="white"
                          />
                        </YStack>
                        <Input
                          size="$3"
                          value={workout.day}
                          onChangeText={(value) => handleUpdateWorkout(block.id, workout.id, { day: value })}
                          placeholder="Day"
                          borderColor="#e9d5ff"
                          focusStyle={{ borderColor: '#7c3aed' }}
                          backgroundColor="white"
                          w={100}
                          ml="$2"
                        />
                      </XStack>
                      <Text fontSize="$3" color="$gray10">
                        {workout.exercises.length} exercises
                      </Text>
                      <Button
                        size="$3"
                        backgroundColor="white"
                        borderWidth={1}
                        borderColor="#e5e7eb"
                        onPress={() => handleAddExercise(block.id, workout.id)}
                        pressStyle={{ backgroundColor: '#f9fafb' }}
                      >
                        <XStack ai="center" gap="$2">
                          <Plus size={16} color="#7c3aed" />
                          <Text fontSize="$3" color="#7c3aed">Add Exercise</Text>
                        </XStack>
                      </Button>
                    </YStack>
                  </Card>
                ))}

                <Button
                  size="$4"
                  backgroundColor="#7c3aed"
                  color="white"
                  onPress={() => handleAddWorkout(block.id)}
                  pressStyle={{ backgroundColor: '#6d28d9' }}
                  icon={Plus}
                >
                  Add Workout
                </Button>
              </YStack>
            )}
          </YStack>
        </Card>
      ))}
    </YStack>
  );

  const renderReviewStep = () => (
    <YStack gap="$4">
      <Card elevate size="$4" p="$4" backgroundColor="white">
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="700" color="$gray12">
            {programName || 'Untitled Program'}
          </Text>
          <Text fontSize="$3" color="$gray10">
            {description || 'No description provided'}
          </Text>

          <XStack gap="$3" flexWrap="wrap">
            <XStack ai="center" gap="$1">
              <Clock size={16} color="#7c3aed" />
              <Text fontSize="$3" color="$gray11">
                {durationWeeks} weeks
              </Text>
            </XStack>
            <XStack ai="center" gap="$1">
              <Calendar size={16} color="#7c3aed" />
              <Text fontSize="$3" color="$gray11">
                {blocks.length} blocks
              </Text>
            </XStack>
            <XStack ai="center" gap="$1">
              <Dumbbell size={16} color="#7c3aed" />
              <Text fontSize="$3" color="$gray11">
                {blocks.reduce((acc, block) => acc + block.workouts.length, 0)} total workouts
              </Text>
            </XStack>
          </XStack>

          {tags.length > 0 && (
            <XStack gap="$2" flexWrap="wrap">
              {tags.map(tag => (
                <XStack
                  key={tag}
                  backgroundColor="#faf5ff"
                  px="$2"
                  py="$1"
                  borderRadius="$2"
                >
                  <Text fontSize="$2" color="#7c3aed">
                    #{tag}
                  </Text>
                </XStack>
              ))}
            </XStack>
          )}
        </YStack>
      </Card>

      {blocks.map(block => (
        <Card key={block.id} elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$2">
            <XStack ai="center" jc="space-between">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                {block.name}
              </Text>
              <Text fontSize="$3" color="$gray10">
                Weeks {block.startWeek}-{block.endWeek}
              </Text>
            </XStack>
            <Text fontSize="$3" color="$gray10">
              Focus: {block.focus || 'Not specified'}
            </Text>
            <Text fontSize="$3" color="#7c3aed">
              {block.workouts.length} workouts
            </Text>
          </YStack>
        </Card>
      ))}
    </YStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <YStack f={1} backgroundColor="#f5f5f5">
          {/* Header */}
          <XStack backgroundColor="white" p="$4" ai="center" gap="$3" borderBottomWidth={1} borderBottomColor="#e5e7eb">
            <Button
              size="$3"
              chromeless
              onPress={handleBack}
              pressStyle={{ opacity: 0.7 }}
            >
              <ArrowLeft size={24} color="#6b7280" />
            </Button>
            <Text fontSize="$7" fontWeight="bold" color="$gray12">
              Edit Program
            </Text>
          </XStack>

          {/* Step Indicator */}
          <YStack backgroundColor="white" borderBottomWidth={1} borderBottomColor="#e5e7eb">
            {renderStepIndicator()}
          </YStack>

          {/* Content */}
          <ScrollView style={{ flex: 1 }}>
            <YStack p="$4">
              {currentStep === 'details' && renderDetailsStep()}
              {currentStep === 'blocks' && renderBlocksStep()}
              {currentStep === 'workouts' && renderWorkoutsStep()}
              {currentStep === 'review' && renderReviewStep()}
            </YStack>
          </ScrollView>

          {/* Footer Actions */}
          <XStack
            backgroundColor="white"
            p="$4"
            gap="$3"
            borderTopWidth={1}
            borderTopColor="#e5e7eb"
          >
            {currentStep !== 'details' && (
              <Button
                f={1}
                size="$4"
                backgroundColor="white"
                borderWidth={1}
                borderColor="#e5e7eb"
                onPress={() => {
                  const steps: ('details' | 'blocks' | 'workouts' | 'review')[] = ['details', 'blocks', 'workouts', 'review'];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1]);
                  }
                }}
                pressStyle={{ backgroundColor: '#f9fafb' }}
                icon={ArrowLeft}
              >
                Previous
              </Button>
            )}

            {currentStep === 'review' ? (
              <Button
                f={1}
                size="$4"
                backgroundColor="#7c3aed"
                color="white"
                onPress={handleSaveProgram}
                disabled={isSaving || !programName}
                opacity={isSaving || !programName ? 0.5 : 1}
                pressStyle={{ backgroundColor: '#6d28d9' }}
                icon={Save}
              >
                {isSaving ? 'Saving...' : 'Update Program'}
              </Button>
            ) : (
              <Button
                f={1}
                size="$4"
                backgroundColor="#7c3aed"
                color="white"
                onPress={() => {
                  const steps: ('details' | 'blocks' | 'workouts' | 'review')[] = ['details', 'blocks', 'workouts', 'review'];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1]);
                  }
                }}
                pressStyle={{ backgroundColor: '#6d28d9' }}
                iconAfter={ArrowRight}
              >
                Next
              </Button>
            )}
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}