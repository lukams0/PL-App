import { Stack } from 'expo-router';

export default function AthleteDetailLayout() {
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
          title: 'Athlete Details',
        }}
      />
      <Stack.Screen
        name="history"
        options={{ 
          title: 'Workout History',
        }}
      />
      <Stack.Screen
        name="assign-program"
        options={{ 
          title: 'Assign Program',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{ 
          title: 'Edit Athlete',
        }}
      />
    </Stack>
  );
}