import { Stack } from 'expo-router';

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name="[conversationId]"
        options={{ title: 'Conversation' }}
      />
    </Stack>
  );
}