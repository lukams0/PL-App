import LoadingScreen from "@/components/general/loading";
import { useAuth } from "@/providers/AuthContext";
import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function Index() {

  const { user, profile, loading, onboardingComplete, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    if (user && onboardingComplete === null) {
      hasCompletedOnboarding(user.id);
    }
  }, [user, onboardingComplete, hasCompletedOnboarding]);


  if (loading) {
    return (
      <LoadingScreen/>
    );
  }

  // No user - go to sign in
  if (!user) {
    console.log('Index: No user, redirecting to sign in');
    return <Redirect href="/(auth)/sign-in" />;
  }
  if(onboardingComplete === false) {
    return <Redirect href="/(auth)/onboarding"/>;
  }
  if(profile?.role === "coach") {
    return <Redirect href="/(coach)/(tabs)" />;
  } else {
    console.log('Index: User and profile exist, redirecting to athlete home');
  return <Redirect href="/(athlete)/(tabs)" />;
  }
  
}
