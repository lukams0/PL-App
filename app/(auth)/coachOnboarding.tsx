
import CoachOnBoardingComponent, { CoachAthleteLevelId, CoachSpecialtyId } from "@/components/auth/onBoarding/coachOnBoarding";
import { useAuth } from "@/providers/AuthContext";
import { CoachingFormat } from "@/types/datebase.types";
import { router } from "expo-router";
import { useState } from "react";

export default function CoachOnBoardingPage() {
  const { completeCoachOnboarding, loading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [yearsCoaching, setYearsCoaching] = useState("");
  const [coachingFormat, setCoachingFormat] = useState<CoachingFormat>("online");
  const [acceptingNewAthletes, setAcceptingNewAthletes] = useState(true);

  const [specialties, setSpecialties] = useState<CoachSpecialtyId[]>([]);
  const [athleteLevels, setAthleteLevels] = useState<CoachAthleteLevelId[]>([]);

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [instagram, setInstagram] = useState("");

  const [error, setError] = useState("");

  const specialtyOptions: { id: CoachSpecialtyId; label: string }[] = [
    { id: "powerlifting", label: "Powerlifting" },
    { id: "strength", label: "Strength" },
    { id: "hypertrophy", label: "Hypertrophy" },
    { id: "weightlifting", label: "Weightlifting" },
    { id: "general_fitness", label: "General Fitness" },
  ];

  const levelOptions: { id: CoachAthleteLevelId; label: string }[] = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
    { id: "expert", label: "Expert" },
  ];

  const toggleSpecialty = (id: CoachSpecialtyId) => {
    setSpecialties((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAthleteLevel = (id: CoachAthleteLevelId) => {
    setAthleteLevels((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setError("");

      // Basic required validation
      if (!yearsCoaching || specialties.length === 0 || athleteLevels.length === 0 || !bio || !location) {
        setError("Please complete all required fields.");
        return;
      }

      const yearsCoachingNumber = Number.parseInt(yearsCoaching, 10);
      const monthlyRateNumber =
        monthlyRate.trim() === "" ? null : Number.parseFloat(monthlyRate);

      await completeCoachOnboarding({
        yearsCoaching: yearsCoachingNumber,
        coachingFormat,
        acceptingNewAthletes,
        specialties,
        athleteLevels,
        bio,
        location,
        monthlyRate: isNaN(monthlyRateNumber as number) ? null : monthlyRateNumber,
        instagram: instagram.trim() || null,
      });

      // Navigate to coach main app area
      router.replace("/(coach)/(tabs)/index");
    } catch (err: any) {
      console.error("Coach onboarding error:", err);
      setError(err.message || "Failed to complete coach onboarding");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!yearsCoaching && !!coachingFormat;
      case 2:
        return specialties.length > 0 && athleteLevels.length > 0;
      case 3:
        return !!bio && !!location;
      default:
        return false;
    }
  };

  return (
    <CoachOnBoardingComponent
      yearsCoaching={yearsCoaching}
      setYearsCoaching={setYearsCoaching}
      coachingFormat={coachingFormat}
      setCoachingFormat={setCoachingFormat}
      acceptingNewAthletes={acceptingNewAthletes}
      setAcceptingNewAthletes={setAcceptingNewAthletes}
      specialties={specialties}
      toggleSpecialty={toggleSpecialty}
      athleteLevels={athleteLevels}
      toggleAthleteLevel={toggleAthleteLevel}
      bio={bio}
      setBio={setBio}
      location={location}
      setLocation={setLocation}
      monthlyRate={monthlyRate}
      setMonthlyRate={setMonthlyRate}
      instagram={instagram}
      setInstagram={setInstagram}
      error={error}
      currentStep={currentStep}
      totalSteps={totalSteps}
      loading={loading}
      specialtyOptions={specialtyOptions}
      levelOptions={levelOptions}
      handleBack={handleBack}
      handleNext={handleNext}
      isStepValid={isStepValid}
    />
  );
}
