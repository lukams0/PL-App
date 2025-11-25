import { Stack } from 'expo-router';

export default function ProgramsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Programs' }}
      />
      <Stack.Screen
        name="create"
        options={{ title: 'Create Program' }}
      />
      <Stack.Screen
        name="[programid]"
        options={{ title: 'Program Details' }}
      />
      <Stack.Screen
        name="edit/[programId]"
        options={{ title: 'Edit Program' }}
      />
    </Stack>
  );
}