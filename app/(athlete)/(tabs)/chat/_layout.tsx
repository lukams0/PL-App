import { Stack } from 'expo-router';

export default function ChatLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen 
                name="index" 
                options={{
                    headerShown: false,
                    title: 'Messages'
                }}
            />
            <Stack.Screen 
                name="new" 
                options={{
                    presentation: 'modal',
                    headerShown: true,
                    title: 'New Message',
                    headerStyle: {
                        backgroundColor: '#7c3aed',
                    },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen 
                name="[chatId]" 
                options={{
                    headerShown: false,
                    title: 'Conversation'
                }}
            />
        </Stack>
    );
}