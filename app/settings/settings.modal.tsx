import SettingsModalComponent from "@/components/athlete/settings/SettingsModalComponent";
import { useAuth } from "@/providers/AuthContext";
import { router } from "expo-router";
import { Alert } from "react-native";

export default function SettingsModal() {
    const {signOut, loading} = useAuth();

    const handleBack = () => {
        router.back();
    }

    const handleLogout = () => {
        Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
            {
            text: 'Cancel',
            style: 'cancel',
            },
            {
            text: 'Log Out',
            style: 'destructive',
            onPress: async () => {
                try {
                await signOut();
                router.replace('/(auth)/sign-in');
                } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Error', 'Failed to log out. Please try again.');
                }
            },
            },
        ]
        );
    };

    return(
        <SettingsModalComponent 
            handleBack={handleBack}
            handleLogout={handleLogout}
            loading={loading}
        />
    )
}