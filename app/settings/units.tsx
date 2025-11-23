import UnitsSettingsComponent from "@/components/athlete/settings/UnitsSettingsComponent";
import { useAuth } from "@/providers/AuthContext";
import { profileService } from "@/services/profile.service";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Spinner, Text, YStack } from "tamagui";

export default function UnitsSettings() {
    const { user, refreshProfile } = useAuth();
    const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
    const [distanceUnit, setDistanceUnit] = useState<'imperial' | 'metric'>('imperial');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            if (!user) return;

            setLoading(true);
            const athleteProfile = await profileService.getAthleteProfile(user.id);

        if (athleteProfile) {
            setWeightUnit(athleteProfile.weight_unit || '');
            setDistanceUnit(athleteProfile.distance_unit || '');
        }
        } catch (err) {
            console.error('Load profile error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    }

    const handleSave = async () => {
        try {
            if (!user) return;

            setError('');
            setIsSaving(true);

            // Update athlete profile
            const athleteProfile = await profileService.getAthleteProfile(user.id);
            if (athleteProfile) {
                await profileService.updateAthleteProfile(user.id, {
                    weight_unit: weightUnit || null,
                    distance_unit: distanceUnit || null,
                });
            }

            await refreshProfile();

            Alert.alert('Success', 'Preferences updated successfully!', [
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
        <UnitsSettingsComponent
            handleBack={handleBack}
            handleSave={handleSave}
            weightUnit={weightUnit}
            setWeightUnit={setWeightUnit}
            distanceUnit={distanceUnit}
            setDistanceUnit={setDistanceUnit}

        />
    );
}