import CreateAccountComponent from "@/components/auth/createAccount/createAccount";
import { useAuth } from "@/providers/AuthContext";
import { router } from "expo-router";
import { useState } from "react";

type AccountRole = 'athlete' | 'coach';

export default function CreateAccountPage() {
    const {signUp, loading} = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [accountRole, setAccountRole] = useState<AccountRole>('athlete');

    //const [loading] = useState(false);

    const handleSignUp = async () => {
        try {
        setError('');

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        
        await signUp({
            email,
            password,
            fullName: name,
            role: accountRole,
        });

        if(accountRole === 'athlete'){
            router.replace('/(auth)/onboarding');
        } else {
            router.replace('/(auth)/coachOnboarding');
        }
        
        } catch (err: any) {
        console.error('Sign up error:', err);
        setError(err.message || 'Failed to create account');
        }
    };

    const handleSignIn = () => {
        router.back();
    }

    const isFormValid = !!name && !!email && !!password && !!confirmPassword && (password === confirmPassword);

    return <CreateAccountComponent 
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        error={error}
        loading={loading}
        isFormValid={isFormValid}
        handleSignIn={handleSignIn}
        handleSignUp={handleSignUp}
        accountRole={accountRole}
        setAccountRole={setAccountRole}
    />
}