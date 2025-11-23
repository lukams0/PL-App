import { AuthProvider } from "@/providers/AuthContext";
import { WorkoutProvider } from "@/providers/WorkoutContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import config from '../tamagui.config';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config}>
        <AuthProvider>
          <WorkoutProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(athlete)" />
              <Stack.Screen
                name="workout"
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }}
              />
            </Stack>
          </WorkoutProvider>
        </AuthProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  )
}
