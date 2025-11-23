import { Keyboard } from "react-native";
import {
    Button,
    Card,
    Input,
    Progress,
    Switch,
    Text,
    TextArea,
    XStack,
    YStack,
} from "tamagui";

export type CoachingFormat = 'online' | 'in_person' | 'hybrid';

export type CoachSpecialtyId =
    | 'powerlifting'
    | 'strength'
    | 'hypertrophy'
    | 'weightlifting'
    | 'general_fitness';

export type CoachAthleteLevelId =
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'expert';

type SpecialtyOption = { id: CoachSpecialtyId; label: string };
type LevelOption = { id: CoachAthleteLevelId; label: string };

type CoachOnBoardingProps = {
    yearsCoaching: string;
    setYearsCoaching: (v: string) => void;

    coachingFormat: CoachingFormat;
    setCoachingFormat: (v: CoachingFormat) => void;

    acceptingNewAthletes: boolean;
    setAcceptingNewAthletes: (v: boolean) => void;

    specialties: CoachSpecialtyId[];
    toggleSpecialty: (id: CoachSpecialtyId) => void;

    athleteLevels: CoachAthleteLevelId[];
    toggleAthleteLevel: (id: CoachAthleteLevelId) => void;

    bio: string;
    setBio: (v: string) => void;

    location: string;
    setLocation: (v: string) => void;

    monthlyRate: string;      // keep as string for the input, convert before saving
    setMonthlyRate: (v: string) => void;

    instagram: string;
    setInstagram: (v: string) => void;

    error: string;
    currentStep: number;
    totalSteps: number;
    loading: boolean;

    specialtyOptions: readonly SpecialtyOption[];
    levelOptions: readonly LevelOption[];

    handleBack: () => void;
    handleNext: () => void;
    isStepValid: () => string | boolean;
};

export default function CoachOnBoardingComponent({
    yearsCoaching,
    setYearsCoaching,
    coachingFormat,
    setCoachingFormat,
    acceptingNewAthletes,
    setAcceptingNewAthletes,
    specialties,
    toggleSpecialty,
    athleteLevels,
    toggleAthleteLevel,
    bio,
    setBio,
    location,
    setLocation,
    monthlyRate,
    setMonthlyRate,
    instagram,
    setInstagram,
    error,
    currentStep,
    totalSteps,
    loading,
    specialtyOptions,
    levelOptions,
    handleBack,
    handleNext,
    isStepValid,
}: CoachOnBoardingProps) {
    const progressPercent = Math.round((currentStep / totalSteps) * 100);
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
                        {progressPercent}%
                    </Text>
                </XStack>
                <Progress value={progressPercent} max={100}>
                    <Progress.Indicator animation="bouncy" backgroundColor="#7c3aed" />
                </Progress>
            </YStack>

            {/* Error */}
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

            <YStack f={1} jc="flex-start" mt="$4">
                <Card elevate size="$4" w="100%" p="$6" gap="$6">
                    {/* STEP 1: Basics (years, format, accepting) */}
                    {currentStep === 1 && (
                        <YStack gap="$4">
                            <YStack ai="center" gap="$2" mb="$2">
                                <Text fontSize="$8" fontWeight="bold" color="#7c3aed">
                                    Coach Basics
                                </Text>
                                <Text fontSize="$3" color="$gray10" textAlign="center">
                                    Tell us how you coach
                                </Text>
                            </YStack>

                            <YStack gap="$2">
                                <Text color="$gray11" fontSize="$3">
                                    Years Coaching
                                </Text>
                                <Input
                                    size="$4"
                                    placeholder="3"
                                    value={yearsCoaching}
                                    onChangeText={setYearsCoaching}
                                    keyboardType="number-pad"
                                    borderColor="#e9d5ff"
                                    focusStyle={{ borderColor: "#7c3aed" }}
                                />
                            </YStack>

                            <YStack gap="$2">
                                <Text color="$gray11" fontSize="$3">
                                    Coaching Format
                                </Text>
                                <YStack gap="$2">
                                    <Button
                                        size="$4"
                                        backgroundColor={coachingFormat === "online" ? "#7c3aed" : "white"}
                                        color={coachingFormat === "online" ? "white" : "$gray11"}
                                        borderColor="#e9d5ff"
                                        borderWidth={2}
                                        onPress={() => setCoachingFormat("online")}
                                        pressStyle={{ opacity: 0.8 }}
                                    >
                                        Online
                                    </Button>
                                    <Button
                                        size="$4"
                                        backgroundColor={coachingFormat === "in_person" ? "#7c3aed" : "white"}
                                        color={coachingFormat === "in_person" ? "white" : "$gray11"}
                                        borderColor="#e9d5ff"
                                        borderWidth={2}
                                        onPress={() => setCoachingFormat("in_person")}
                                        pressStyle={{ opacity: 0.8 }}
                                    >
                                        In person
                                    </Button>
                                    <Button
                                        size="$4"
                                        backgroundColor={coachingFormat === "hybrid" ? "#7c3aed" : "white"}
                                        color={coachingFormat === "hybrid" ? "white" : "$gray11"}
                                        borderColor="#e9d5ff"
                                        borderWidth={2}
                                        onPress={() => setCoachingFormat("hybrid")}
                                        pressStyle={{ opacity: 0.8 }}
                                    >
                                        Hybrid
                                    </Button>
                                </YStack>
                            </YStack>

                            <XStack ai="center" jc="space-between" mt="$2">
                                <Text color="$gray11" fontSize="$3">
                                    Accepting new athletes
                                </Text>
                                <Switch
                                    size="$3"
                                    checked={acceptingNewAthletes}
                                    onCheckedChange={(val) => setAcceptingNewAthletes(!!val)}
                                >
                                    <Switch.Thumb animation="quick" />
                                </Switch>
                            </XStack>
                        </YStack>
                    )}

                    {/* STEP 2: Specialties & Athlete Levels */}
                    {currentStep === 2 && (
                        <YStack gap="$4">
                            <YStack ai="center" gap="$2" mb="$2">
                                <Text fontSize="$8" fontWeight="bold" color="#7c3aed">
                                    Who You Coach
                                </Text>
                                <Text fontSize="$3" color="$gray10" textAlign="center">
                                    Select your specialties and athlete levels
                                </Text>
                            </YStack>

                            <YStack gap="$2">
                                <Text color="$gray11" fontSize="$3">
                                    Specialties
                                </Text>
                                <YStack gap="$2">
                                    {specialtyOptions.map((opt) => (
                                        <Button
                                            key={opt.id}
                                            size="$4"
                                            backgroundColor={specialties.includes(opt.id) ? "#7c3aed" : "white"}
                                            color={specialties.includes(opt.id) ? "white" : "$gray11"}
                                            borderColor="#e9d5ff"
                                            borderWidth={2}
                                            onPress={() => toggleSpecialty(opt.id)}
                                            pressStyle={{ opacity: 0.8 }}
                                        >
                                            {opt.label}
                                        </Button>
                                    ))}
                                </YStack>
                            </YStack>

                            <YStack gap="$2">
                                <Text color="$gray11" fontSize="$3">
                                    Athlete Levels
                                </Text>
                                <YStack gap="$2">
                                    {levelOptions.map((opt) => (
                                        <Button
                                            key={opt.id}
                                            size="$4"
                                            backgroundColor={athleteLevels.includes(opt.id) ? "#7c3aed" : "white"}
                                            color={athleteLevels.includes(opt.id) ? "white" : "$gray11"}
                                            borderColor="#e9d5ff"
                                            borderWidth={2}
                                            onPress={() => toggleAthleteLevel(opt.id)}
                                            pressStyle={{ opacity: 0.8 }}
                                        >
                                            {opt.label}
                                        </Button>
                                    ))}
                                </YStack>
                            </YStack>
                        </YStack>
                    )}

                    {/* STEP 3: Bio, Location, Optional Rate & Instagram */}
                    {currentStep === 3 && (
                        <YStack gap="$4">
                            <YStack ai="center" gap="$2" mb="$2">
                                <Text fontSize="$8" fontWeight="bold" color="#7c3aed">
                                    Final Details
                                </Text>
                                <Text fontSize="$3" color="$gray10" textAlign="center">
                                    Help athletes get to know you
                                </Text>
                            </YStack>

                            <YStack gap="$2">
                                <Text color="$gray11" fontSize="$3">
                                    Bio
                                </Text>
                                <TextArea
                                    rows={5}
                                    size="$4"
                                    placeholder="Describe your coaching style, experience, and what athletes can expect."
                                    value={bio}
                                    onChangeText={setBio}
                                    borderColor="#e9d5ff"
                                    focusStyle={{ borderColor: "#7c3aed" }}
                                />
                            </YStack>

                            <YStack gap="$2">
                                <Text color="$gray11" fontSize="$3">
                                    Location
                                </Text>
                                <Input
                                    size="$4"
                                    placeholder="Toronto, Canada"
                                    value={location}
                                    onChangeText={setLocation}
                                    borderColor="#e9d5ff"
                                    focusStyle={{ borderColor: "#7c3aed" }}
                                />
                            </YStack>

                            <YStack gap="$2">
                                <Text color="$gray11" fontSize="$3">
                                    Monthly rate (optional)
                                </Text>
                                <Input
                                    size="$4"
                                    placeholder="200"
                                    value={monthlyRate}
                                    onChangeText={setMonthlyRate}
                                    keyboardType="decimal-pad"
                                    borderColor="#e9d5ff"
                                    focusStyle={{ borderColor: "#7c3aed" }}
                                />
                            </YStack>

                            <YStack gap="$2">
                                <Text color="$gray11" fontSize="$3">
                                    Instagram (optional)
                                </Text>
                                <Input
                                    size="$4"
                                    placeholder="@yourhandle"
                                    value={instagram}
                                    onChangeText={setInstagram}
                                    autoCapitalize="none"
                                    borderColor="#e9d5ff"
                                    focusStyle={{ borderColor: "#7c3aed" }}
                                />
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
                            pressStyle={{ backgroundColor: "#6d28d9" }}
                        >
                            {loading ? "Saving..." : currentStep === totalSteps ? "Complete" : "Next"}
                        </Button>
                    </XStack>
                </Card>
            </YStack>
        </YStack>
    );
}
