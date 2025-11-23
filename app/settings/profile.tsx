import ProfileSettingsComponent from "@/components/athlete/settings/ProfileSettingsComponent";
import { useAuth } from "@/providers/AuthContext";
import { profileService } from "@/services/profile.service";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Spinner, Text, YStack } from "tamagui";

export default function ProfileSettings(){
    const {user, refreshProfile} = useAuth();
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    },  [])

    const loadProfile = async () => {
        try {
            if (!user) return;

            setLoading(true);
            const profile = await profileService.getProfile(user.id);
            const athleteProfile = await profileService.getAthleteProfile(user.id);

        if (profile) {
            setName(profile.full_name || '');
            setEmail(profile.email);
        }

        if (athleteProfile) {
            setAge(athleteProfile.age?.toString() || '');
            setGender(athleteProfile.gender || '');
        }
        } catch (err) {
            console.error('Load profile error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleSave = async () => {
        try {
        if (!user) return;

        setError('');
        setIsSaving(true);

        // Update main profile
        await profileService.updateProfile(user.id, {
            full_name: name,
        });

        // Update athlete profile
        const athleteProfile = await profileService.getAthleteProfile(user.id);
        if (athleteProfile) {
            await profileService.updateAthleteProfile(user.id, {
            age: age ? parseInt(age) : null,
            gender: gender || null,
            });
        }

        await refreshProfile();

        Alert.alert('Success', 'Profile updated successfully!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
        } catch (err: any) {
        console.error('Save profile error:', err);
        setError(err.message || 'Failed to update profile');
        } finally {
        setIsSaving(false);
        }
    };

    if (loading) {
        return (
        <YStack f={1} ai="center" jc="center" backgroundColor="#f5f5f5">
            <Spinner size="large" color="#7c3aed" />
            <Text fontSize="$4" color="$gray10" mt="$4">
            Loading profile...
            </Text>
        </YStack>
        );
    }

    return (
        <ProfileSettingsComponent 
            handleBack={handleBack}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            age={age}
            setAge={setAge}
            gender={gender}
            setGender={setGender}
            handleSave={handleSave}
            isSaving={isSaving}
            error={error}
        />
    );
}