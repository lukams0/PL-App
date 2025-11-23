import SecuritySettingsComponent from "@/components/athlete/settings/SecuritySettingsComponent";
import { authService } from "@/services/auth.service";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export default function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('');

    const handleBack = () => {
        router.back();
    };

    const handleSave = async () => {
        try {
            setError('');

            // Validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                setError('Please fill in all fields');
                return;
            }

            if (newPassword !== confirmPassword) {
                setError('New passwords do not match');
                return;
            }

            if (newPassword.length < 8) {
                setError('Password must be at least 8 characters');
                return;
            }

            setIsSaving(true);

            // Update password
            await authService.updatePassword(newPassword);

            // Clear fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            Alert.alert('Success', 'Password updated successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (err: any) {
            console.error('Change password error:', err);
            setError(err.message || 'Failed to update password');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SecuritySettingsComponent 
            handleBack={handleBack}
            handleSave={handleSave}
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setCurrentPassword={setCurrentPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            error={error}
            showConfirm={showConfirm}
            showCurrent={showCurrent}
            showNew={showNew}
            setShowConfirm={setShowConfirm}
            setShowCurrent={setShowCurrent}
            setShowNew={setShowNew}
            isSaving={isSaving}
        />
    );
}