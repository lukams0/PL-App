import SignInComponent from "@/components/auth/signIn/signIn";
import { useAuth } from "@/providers/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function SignInPage() {
    const { signIn, loading, profile } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSignIn = async () => {
        try {
            setError("");
            if (!email || !password) {
                setError("Please fill in all fields");
                return;
            }

            await signIn({ email, password });
        } catch (err: any) {
            console.error("Sign in error:", err);
            setError(err.message || "Failed to sign in");
        }
    };

    useEffect(() => {
        if (!profile) return; // nothing yet

        if (profile.role === "coach") {
            router.replace("/(coach)/(tabs)");
        } else {
            // default to athlete if null/undefined/anything else
            router.replace("/(athlete)/(tabs)");
        }
    }, [profile]);

    const handleCreateAccount = () => {
        router.push('/(auth)/create-account')
    }

    const handleForgotPassword = () => {
        router.push('/(auth)/forgot-password')
    }

    const isFormValid = !!email && !!password;

    return (
        <SignInComponent
            error={error}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleForgotPassword={handleForgotPassword}
            handleSignIn={handleSignIn}
            handleCreateAccount={handleCreateAccount}
            loading={loading}
            isFormValid={isFormValid}
        />
    )
}