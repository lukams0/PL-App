// app/(athlete)/programs/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function ProgramsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Programs' }}
      />
      <Stack.Screen
        name="[programId]"
        options={{ title: 'Program Details' }}
      />
    </Stack>
  );
}
