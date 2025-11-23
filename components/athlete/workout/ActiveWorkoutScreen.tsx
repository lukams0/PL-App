import { ExerciseSet, WorkoutExerciseWithDetails, WorkoutWithDetails } from "@/services/workout.service";
import { Exercise } from "@/types/datebase.types";
import { router } from "expo-router";
import { ChevronDown, Clock, Plus, Save, Trash2 } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Spinner, Text, XStack, YStack } from "tamagui";
import { ExerciseSelectorModal } from "./ExerciseSelectorModal";
import SetRowComponent from "./SetRowComponent";

type ActiveWorkoutScreenComponentProps = {
    handleCancel: () => void;
    saving: boolean;
    workout: WorkoutWithDetails | null;
    formatTime: (n: number) => string;
    handleFinish: () => Promise<void>;
    elapsedSec: number;
    exercises: WorkoutExerciseWithDetails[];
    handleDeleteExercise: (s: string) => void;
    handleAddExercise: (e: Exercise) => Promise<void>;
    handleAddSet: (s: string) => Promise<void>;
    handleDeleteSet: (s: string, v: string) => Promise<void>;
    handleUpdateSet: (s: string, e: string, u: Partial<ExerciseSet>) => Promise<void>;
    setPickerOpen: (b: boolean) => void;
    notes: string;
    setNotes: (s: string) => void;
    pickerOpen: boolean;
    catalog: Exercise[];
    loadCatalog: () => Promise<void>;
}

export default function ActiveWorkoutScreenComponent({
    handleCancel,
    saving,
    workout,
    formatTime,
    handleFinish,
    elapsedSec,
    exercises,
    handleDeleteExercise,
    handleAddExercise,
    handleAddSet,
    handleDeleteSet,
    handleUpdateSet,
    setPickerOpen,
    notes,
    setNotes,
    pickerOpen,
    catalog,
    loadCatalog
    
} : ActiveWorkoutScreenComponentProps) {
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <YStack f={1} backgroundColor="#f5f5f5">
          {/* Header */}
          <XStack
            backgroundColor="white"
            p="$4"
            ai="center"
            jc="space-between"
            borderBottomWidth={1}
            borderBottomColor="#e5e7eb"
          >
            <Button size="$3" chromeless onPress={handleCancel} disabled={saving} accessibilityLabel="Cancel workout">
              <Trash2 size={24} color="#ef4444" />
            </Button>

            <TouchableOpacity onPress={() => router.back()}>
              <YStack ai="center" gap="$1">
                <XStack ai="center" gap="$2">
                  <Text fontSize="$5" fontWeight="bold" color="$gray12">
                    {workout?.name || 'Workout'}
                  </Text>
                  <ChevronDown size={20} color="#9ca3af" />
                </XStack>
                <XStack ai="center" gap="$2">
                  <Clock size={16} color="#7c3aed" />
                  <Text fontSize="$3" fontWeight="600" color="#7c3aed">
                    {formatTime(elapsedSec)}
                  </Text>
                </XStack>
              </YStack>
            </TouchableOpacity>

            <Button
              size="$3"
              backgroundColor="#16a34a"
              color="white"
              onPress={handleFinish}
              disabled={saving}
              pressStyle={{ backgroundColor: '#15803d' }}
            >
              {saving ? <Spinner size="small" color="white" /> : <Save size={20} color="white" />}
            </Button>
          </XStack>

          <ScrollView>
            <YStack p="$4" gap="$3" pb="$24">
              {/* Exercises */}
              {exercises.map((ex) => (
                <Card key={ex.id} elevate size="$4" p="$4" backgroundColor="white">
                  <YStack gap="$3">
                    <XStack ai="center" jc="space-between">
                      <YStack f={1} gap="$1">
                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                          {ex.exercise.name}
                        </Text>
                        <Text fontSize="$2" color="$gray10" textTransform="capitalize">
                          {(ex.exercise.category ?? '').replace('_', ' ')}
                        </Text>
                      </YStack>

                      {/* Bigger trash button */}
                      <Button
                        size="$3"
                        chromeless
                        onPress={() => handleDeleteExercise(ex.id)}
                        disabled={saving}
                        aria-label="Delete exercise"
                      >
                        <Trash2 size={28} color="#ef4444" />
                      </Button>
                    </XStack>

                    {/* Sets */}
                    <YStack gap="$2">
                      {ex.sets.map((set) => {
                        const locked = !!(set as any).completed;
                        return (
                          <SetRowComponent
                            key={set.id}
                            set={set}
                            exerciseId={ex.id}
                            locked={locked}
                            saving={saving}
                            onDelete={() => handleDeleteSet(set.id, ex.id)}
                            onUpdate={handleUpdateSet}
                          />
                        );
                      })}

                      {/* Add Set Button */}
                      <Button
                        size="$3"
                        backgroundColor="#f3f4f6"
                        color="$gray12"
                        icon={Plus}
                        onPress={() => handleAddSet(ex.id)}
                        disabled={saving}
                        pressStyle={{ backgroundColor: '#e5e7eb' }}
                        borderRadius="$3"
                      >
                        <Text fontWeight="600">Add Set</Text>
                      </Button>
                    </YStack>
                  </YStack>
                </Card>
              ))}

              {/* Add Exercise Button */}
              <Button
                size="$4"
                backgroundColor="white"
                borderColor="#7c3aed"
                borderWidth={2}
                borderStyle="dashed"
                color="#7c3aed"
                icon={Plus}
                onPress={() => setPickerOpen(true)}
                disabled={saving}
              >
                <Text>Add Exercise</Text>
              </Button>

              {/* Notes */}
              <Card elevate size="$4" p="$3" backgroundColor="white">
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    Notes
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: '#e5e7eb',
                      borderRadius: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      fontSize: 16,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    placeholder="How did you feel? Any achievements?"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    editable={!saving}
                  />
                </YStack>
              </Card>
            </YStack>
          </ScrollView>

          {/* Exercise Selector Modal */}
          {pickerOpen && (
            <ExerciseSelectorModal
              exercises={catalog}
              onSelect={handleAddExercise}
              onClose={() => setPickerOpen(false)}
              onRefresh={loadCatalog}
              disabled={saving}
            />
          )}
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}