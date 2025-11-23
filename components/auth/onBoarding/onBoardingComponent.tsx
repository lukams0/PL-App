import { Keyboard } from "react-native";
import { Button, Card, Input, Progress, Text, XStack, YStack } from "tamagui";

type Gender = "Male" | "Female" | "Other" | "";
type WeightUnit = "kg" | "lbs";
type HeightUnit = "in" | "cm";
type ExperienceId = "beginner" | "intermediate" | "advanced" | "expert";
type ExperienceState = ExperienceId | ""; 
type GoalId = "strength" | "compete" | "track" | "technique";

type ExperienceLevel = { id: ExperienceId; label: string; desc: string };
type GoalOption = { id: string; label: string; icon: string };

type OnBoardingProps = {
  age: string;
  setAge: (v: string) => void;
  gender: Gender;
  setGender: (v: Gender) => void;
  weight: string;
  setWeight: (v: string) => void;
  weightUnit: WeightUnit;
  setWeightUnit: (v: WeightUnit) => void;
  height: string;
  setHeight: (v: string) => void;
  heightUnit: HeightUnit;
  setHeightUnit: (v: HeightUnit) => void;
  experience: ExperienceState;
  setExperience: (v: ExperienceState) => void;
  goals: string[];           
  setGoals: (v: string[]) => void;
  error: string;
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  experienceLevels: readonly ExperienceLevel[];
  goalOptions: readonly GoalOption[];
  handleBack: () => void;
  handleNext: () => void;
  toggleGoal: (v: string) => void;
  isStepValid: () => string|boolean;
};


export default function OnBoardingComponent({
    age,
    setAge,
    gender,
    setGender,
    weight,
    setWeight,
    weightUnit,
    setWeightUnit,
    height,
    setHeight,
    heightUnit,
    setHeightUnit,
    experience,
    setExperience,
    goals,
    setGoals,
    error,
    currentStep,
    totalSteps,
    loading,
    experienceLevels,
    goalOptions,
    handleBack,
    handleNext,
    toggleGoal,
    isStepValid,

}: OnBoardingProps) {
    return (
    <YStack
      f={1}
      backgroundColor="#f5f5f5"
      pt="$8"
      px="$4"
      pb="$4"
      onPress={() => Keyboard.dismiss()}
    >
      {/* Progress Bar */}
      <YStack mb="$6" mt="$2">
        <XStack jc="space-between" mb="$2">
          <Text color="$gray11" fontSize="$2">
            Step {currentStep} of {totalSteps}
          </Text>
          <Text color="#7c3aed" fontSize="$2" fontWeight="bold">
            {Math.round((currentStep / totalSteps) * 100)}%
          </Text>
        </XStack>
        <Progress value={(currentStep / totalSteps) * 100} max={100}>
          <Progress.Indicator animation="bouncy" backgroundColor="#7c3aed" />
        </Progress>
      </YStack>

      {/* Error Message */}
      {error && (
        <YStack
          backgroundColor="#fee2e2"
          p="$3"
          borderRadius="$3"
          borderWidth={1}
          borderColor="#ef4444"
          mb="$4"
        >
          <Text fontSize="$3" color="#dc2626">
            {error}
          </Text>
        </YStack>
      )}

      {/* Content Area */}
      <YStack f={1} jc="flex-start" mt="$4">
        <Card elevate size="$4" w="100%" p="$6" gap="$6">
          
          {/* Step 1: Age & Gender */}
          {currentStep === 1 && (
            <YStack gap="$4">
              <YStack ai="center" gap="$2" mb="$2">
                <Text fontSize="$8" fontWeight="bold" color="#7c3aed">
                  Let's Get Started
                </Text>
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  Tell us a bit about yourself
                </Text>
              </YStack>

              <YStack gap="$2">
                <Text color="$gray11" fontSize="$3">
                  Age
                </Text>
                <Input
                  size="$4"
                  placeholder="25"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  borderColor="#e9d5ff"
                  focusStyle={{ borderColor: '#7c3aed' }}
                />
              </YStack>

              <YStack gap="$2">
                <Text color="$gray11" fontSize="$3">
                  Gender
                </Text>
                <XStack gap="$3">
                  <Button
                    f={1}
                    size="$4"
                    backgroundColor={gender === 'Male' ? '#7c3aed' : 'white'}
                    color={gender === 'Male' ? 'white' : '$gray11'}
                    borderColor="#e9d5ff"
                    borderWidth={1}
                    onPress={() => setGender('Male')}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    Male
                  </Button>
                  <Button
                    f={1}
                    size="$4"
                    backgroundColor={gender === 'Female' ? '#7c3aed' : 'white'}
                    color={gender === 'Female' ? 'white' : '$gray11'}
                    borderColor="#e9d5ff"
                    borderWidth={1}
                    onPress={() => setGender('Female')}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    Female
                  </Button>
                  <Button
                    f={1}
                    size="$4"
                    backgroundColor={gender === 'Other' ? '#7c3aed' : 'white'}
                    color={gender === 'Other' ? 'white' : '$gray11'}
                    borderColor="#e9d5ff"
                    borderWidth={1}
                    onPress={() => setGender('Other')}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    Other
                  </Button>
                </XStack>
              </YStack>
            </YStack>
          )}

          {/* Step 2: Weight */}
          {currentStep === 2 && (
            <YStack gap="$4">
              <YStack ai="center" gap="$2" mb="$2">
                <Text fontSize="$8" fontWeight="bold" color="#7c3aed">
                  Your Weight
                </Text>
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  This helps us track your progress
                </Text>
              </YStack>

              <YStack gap="$2">
                <Text color="$gray11" fontSize="$3">
                  Current Weight
                </Text>
                <XStack gap="$3">
                  <Input
                    f={1}
                    size="$4"
                    placeholder="185"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    borderColor="#e9d5ff"
                    focusStyle={{ borderColor: '#7c3aed' }}
                  />
                  <XStack gap="$2">
                    <Button
                      size="$4"
                      backgroundColor={weightUnit === 'lbs' ? '#7c3aed' : 'white'}
                      color={weightUnit === 'lbs' ? 'white' : '$gray11'}
                      borderColor="#e9d5ff"
                      borderWidth={1}
                      onPress={() => setWeightUnit('lbs')}
                      pressStyle={{ opacity: 0.8 }}
                    >
                      lbs
                    </Button>
                    <Button
                      size="$4"
                      backgroundColor={weightUnit === 'kg' ? '#7c3aed' : 'white'}
                      color={weightUnit === 'kg' ? 'white' : '$gray11'}
                      borderColor="#e9d5ff"
                      borderWidth={1}
                      onPress={() => setWeightUnit('kg')}
                      pressStyle={{ opacity: 0.8 }}
                    >
                      kg
                    </Button>
                  </XStack>
                </XStack>
              </YStack>
            </YStack>
          )}

          {/* Step 3: Height */}
          {currentStep === 3 && (
            <YStack gap="$4">
              <YStack ai="center" gap="$2" mb="$2">
                <Text fontSize="$8" fontWeight="bold" color="#7c3aed">
                  Your Height
                </Text>
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  Used to calculate strength standards
                </Text>
              </YStack>

              <YStack gap="$2">
                <Text color="$gray11" fontSize="$3">
                  Height
                </Text>
                <XStack gap="$3">
                  <Input
                    f={1}
                    size="$4"
                    placeholder={heightUnit === 'in' ? '70' : '178'}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="decimal-pad"
                    borderColor="#e9d5ff"
                    focusStyle={{ borderColor: '#7c3aed' }}
                  />
                  <XStack gap="$2">
                    <Button
                      size="$4"
                      backgroundColor={heightUnit === 'in' ? '#7c3aed' : 'white'}
                      color={heightUnit === 'in' ? 'white' : '$gray11'}
                      borderColor="#e9d5ff"
                      borderWidth={1}
                      onPress={() => setHeightUnit('in')}
                      pressStyle={{ opacity: 0.8 }}
                    >
                      in
                    </Button>
                    <Button
                      size="$4"
                      backgroundColor={heightUnit === 'cm' ? '#7c3aed' : 'white'}
                      color={heightUnit === 'cm' ? 'white' : '$gray11'}
                      borderColor="#e9d5ff"
                      borderWidth={1}
                      onPress={() => setHeightUnit('cm')}
                      pressStyle={{ opacity: 0.8 }}
                    >
                      cm
                    </Button>
                  </XStack>
                </XStack>
              </YStack>
            </YStack>
          )}

          {/* Step 4: Experience */}
          {currentStep === 4 && (
            <YStack gap="$4">
              <YStack ai="center" gap="$2" mb="$2">
                <Text fontSize="$8" fontWeight="bold" color="#7c3aed">
                  Lifting Experience
                </Text>
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  How long have you been powerlifting?
                </Text>
              </YStack>

              <YStack gap="$3">
                {experienceLevels.map((level) => (
                  <Button
                    key={level.id}
                    size="$5"
                    backgroundColor={experience === level.id ? '#7c3aed' : 'white'}
                    color={experience === level.id ? 'white' : '$gray11'}
                    borderColor="#e9d5ff"
                    borderWidth={2}
                    onPress={() => setExperience(level.id)}
                    pressStyle={{ opacity: 0.8 }}
                    jc="flex-start"
                  >
                    <YStack ai="flex-start" gap="$1">
                      <Text
                        fontSize="$5"
                        fontWeight="bold"
                        color={experience === level.id ? 'white' : '$gray12'}
                      >
                        {level.label}
                      </Text>
                      <Text
                        fontSize="$2"
                        color={experience === level.id ? 'white' : '$gray10'}
                      >
                        {level.desc}
                      </Text>
                    </YStack>
                  </Button>
                ))}
              </YStack>
            </YStack>
          )}

          {/* Step 5: Goals */}
          {currentStep === 5 && (
            <YStack gap="$4">
              <YStack ai="center" gap="$2" mb="$2">
                <Text fontSize="$8" fontWeight="bold" color="#7c3aed">
                  Your Goals
                </Text>
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  Select all that apply
                </Text>
              </YStack>

              <YStack gap="$3">
                {goalOptions.map((goal) => (
                  <Button
                    key={goal.id}
                    size="$5"
                    backgroundColor={goals.includes(goal.id) ? '#7c3aed' : 'white'}
                    color={goals.includes(goal.id) ? 'white' : '$gray11'}
                    borderColor="#e9d5ff"
                    borderWidth={2}
                    onPress={() => toggleGoal(goal.id)}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    <XStack gap="$3" ai="center">
                      <Text fontSize="$6">{goal.icon}</Text>
                      <Text
                        fontSize="$5"
                        fontWeight="bold"
                        color={goals.includes(goal.id) ? 'white' : '$gray12'}
                      >
                        {goal.label}
                      </Text>
                    </XStack>
                  </Button>
                ))}
              </YStack>
            </YStack>
          )}
          
          {/* Navigation Buttons */}
          <XStack gap="$3" mt="$2">
            {currentStep > 1 && (
              <Button
                f={1}
                size="$5"
                backgroundColor="white"
                color="$gray11"
                borderColor="#e9d5ff"
                borderWidth={1}
                onPress={handleBack}
                pressStyle={{ opacity: 0.8 }}
                disabled={loading}
              >
                Back
              </Button>
            )}
            <Button
              f={currentStep === 1 ? 1 : 2}
              size="$5"
              backgroundColor="#7c3aed"
              color="white"
              onPress={handleNext}
              disabled={!isStepValid() || loading}
              opacity={!isStepValid() || loading ? 0.5 : 1}
              pressStyle={{ backgroundColor: '#6d28d9' }}
            >
              {loading ? 'Saving...' : currentStep === totalSteps ? 'Complete' : 'Next'}
            </Button>
          </XStack>
        </Card>
      </YStack>
    </YStack>
  );
}