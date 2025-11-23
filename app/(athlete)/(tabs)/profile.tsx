import ProfileComponent from "@/components/athlete/profile/profileComponent";
import { useAuth } from "@/providers/AuthContext";
import { personalRecordService } from "@/services/personalrecord.service";
import { profileService } from "@/services/profile.service";
import { workoutService } from "@/services/workout.service";
import { AthleteProfile, PersonalRecordWithExercise } from "@/types/datebase.types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spinner, Text, YStack } from "tamagui";

export default function ProfileScreen() {

    const {user, profile} = useAuth();
    const [athleteProfile, setAthleteProfile] = useState<AthleteProfile | null>(null);
    const [topPRs, setTopPRs] = useState<PersonalRecordWithExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<any>();

    useEffect(() => {
        loadAthleteProfile();
    }, [user]);

    const loadAthleteProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await profileService.getAthleteProfile(user.id);
            setAthleteProfile(data);
            const stats = await workoutService.getAthleteStats();
            setStats(stats);
            const prs = await personalRecordService.getTopPRs(user.id, 5);
            setTopPRs(prs);
        } catch (error) {
            console.error('Error loading athlete profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsPress = () => {
        router.push('/settings/settings.modal');
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadAthleteProfile();
        setRefreshing(false);
    };

    const getExperienceLevelDisplay = (level: string | null | undefined) => {
        if (!level) return 'Not Set';
        return level.charAt(0).toUpperCase() + level.slice(1);
    };

    const formatHeight = (inches: number | null | undefined) => {
        if (!inches) return 'Not Set';
        if(athleteProfile?.distance_unit === 'imperial'){
            const feet = Math.floor(inches / 12);
            const remainingInches = Math.round(inches % 12);
            return `${feet}'${remainingInches}"`;
        } else {
            const cm = Math.floor(inches*2.54);
            return `${cm} cm`;
        }
        
    };

    const formatWeight = (lbs: number | null | undefined) => {
        if (!lbs) return 'Not Set';
        if(athleteProfile?.weight_unit === 'lbs'){
            return `${Math.round(lbs)} lbs`;
        } else {
            return `${Math.round(lbs/2.20462)} kg`
        }
        
    };

    const getGenderDisplay = (gender: string | null | undefined) => {
        if (!gender) return 'Not Set';
        return gender.charAt(0).toUpperCase() + gender.slice(1);
    };

    if (loading) {
        return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
            <YStack f={1} ai="center" jc="center">
            <Spinner size="large" color="#7c3aed" />
            <Text fontSize="$4" color="$gray10" mt="$4">
                Loading profile...
            </Text>
            </YStack>
        </SafeAreaView>
        );
    }

    return (
        <ProfileComponent 
            profile={profile}
            athleteProfile={athleteProfile}
            refreshing={refreshing}
            onRefresh={onRefresh}
            handleSettingsPress={handleSettingsPress}
            getExperienceLevelDisplay={getExperienceLevelDisplay}
            getGenderDisplay={getGenderDisplay}
            formatHeight={formatHeight}
            formatWeight={formatWeight}
            stats={stats}
            topPRs={topPRs}
        />
    )
}