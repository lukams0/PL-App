import ForgotPasswordComponent from "@/components/auth/forgotPassword/forgotPassword";
import { router } from "expo-router";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleBack = () => {
        router.back();
    };

    const handleResetPassword = async () => {
        //Call Service to reset password
    };

    return <ForgotPasswordComponent 
        email={email}
        setEmail={setEmail}
        loading={loading}
        success={success}
        error={error}
        handleBack={handleBack}
        handleResetPassword={handleResetPassword}
    />
}