import OnBoardingComponent from "@/components/auth/onBoarding/onBoardingComponent";
import { useAuth } from "@/providers/AuthContext";
import { router } from "expo-router";
import { useState } from "react";

export default function OnBoardingPage() {
    const {completeOnboarding, loading} = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const [age, setAge] = useState('');
    const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState<'in' | 'cm'>('in');
    const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert' | ''>('');
    const [goals, setGoals] = useState<string[]>([]);
    const [error, setError] = useState('');

    const experienceLevels = [
        { id: 'beginner' as const, label: 'Beginner', desc: 'Less than 1 year' },
        { id: 'intermediate' as const, label: 'Intermediate', desc: '1-3 years' },
        { id: 'advanced' as const, label: 'Advanced', desc: '3-5 years' },
        { id: 'expert' as const, label: 'Expert', desc: '5+ years' }
    ];

    const goalOptions = [
        { id: 'strength', label: 'Build Strength', icon: '💪' },
        { id: 'compete', label: 'Compete', icon: '🏆' },
        { id: 'track', label: 'Track Progress', icon: '📊' },
        { id: 'technique', label: 'Improve Technique', icon: '🎯' }
    ];

    const toggleGoal = (goalId: string) => {
        if (goals.includes(goalId)) {
        setGoals(goals.filter(g => g !== goalId));
        } else {
        setGoals([...goals, goalId]);
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        } else {
        handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        try {
        setError('');
        
        if (!gender || !experience) {
            setError('Please complete all required fields');
            return;
        }

        await completeOnboarding({
            age: parseInt(age),
            gender,
            weight: parseFloat(weight),
            weightUnit,
            height: parseFloat(height),
            heightUnit,
            experience,
            goals,
        });

        // Navigate to main app
        router.replace('/(athlete)/(tabs)');
        } catch (err: any) {
        console.error('Onboarding error:', err);
        setError(err.message || 'Failed to complete onboarding');
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
        case 1:
            return age && gender;
        case 2:
            return weight && weightUnit;
        case 3:
            return height && heightUnit;
        case 4:
            return experience;
        case 5:
            return goals.length > 0;
        default:
            return false;
        }
    };

    return <OnBoardingComponent 
            age={age}
            setAge={setAge}
            gender={gender}
            setGender={setGender}
            weight={weight}
            setWeight={setWeight}
            weightUnit={weightUnit}
            setWeightUnit={setWeightUnit}
            height={height}
            setHeight={setHeight}
            heightUnit={heightUnit}
            setHeightUnit={setHeightUnit}
            experience={experience}
            setExperience={setExperience}
            goals={goals}
            setGoals={setGoals}
            error={error}
            currentStep={currentStep}
            totalSteps={totalSteps}
            loading={loading}
            experienceLevels={experienceLevels}
            goalOptions={goalOptions}
            handleBack={handleBack}
            handleNext={handleNext}
            toggleGoal={toggleGoal}
            isStepValid={isStepValid}
    />
}   