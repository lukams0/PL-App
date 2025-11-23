import SignInComponent from "@/components/auth/signIn/signIn";
import { useAuth } from "@/providers/AuthContext";
import { router } from "expo-router";
import { useState } from "react";

export default function SignInPage() {
    const {signIn, loading} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSignIn = async () => {
        try {
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        await signIn({ email, password });
        // Navigation will be handled by auth state change
        router.replace('/(athlete)/(tabs)');
        } catch (err: any) {
        console.error('Sign in error:', err);
        setError(err.message || 'Failed to sign in');
        }
    };

    const handleCreateAccount  = () => {
        router.push('/(auth)/create-account')
    }

    const handleForgotPassword = () => {
        router.push('/(auth)/forgot-password')
    }

    const isFormValid = !!email && !!password;

    return(
        <SignInComponent
            error = {error}
            email = {email}
            setEmail = {setEmail}
            password = {password}
            setPassword = {setPassword}
            handleForgotPassword = {handleForgotPassword}
            handleSignIn = {handleSignIn}
            handleCreateAccount = {handleCreateAccount}
            loading = {loading}
            isFormValid = {isFormValid}
        />
    )
}