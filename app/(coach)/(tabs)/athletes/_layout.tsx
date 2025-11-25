import { Stack } from 'expo-router';

export default function AthletesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Athletes' }}
      />
      <Stack.Screen
        name="[athleteid]"
        options={{ title: 'Athlete Details' }}
      />
      <Stack.Screen
        name="invite"
        options={{ title: 'Invite Athlete' }}
      />
    </Stack>
  );
}