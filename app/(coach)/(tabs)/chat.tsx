import { useAuth } from "@/providers/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MessageCircle, Search, Send } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Input, Text, XStack, YStack } from "tamagui";

interface Conversation {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isCoach: boolean;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    params.athleteId as string || null
  );
  const [messageInput, setMessageInput] = useState('');

  // Fake conversations
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      athleteId: '1',
      athleteName: 'Sarah Johnson',
      lastMessage: 'Thanks for the form check!',
      lastMessageTime: '2 hours ago',
      unreadCount: 0,
    },
    {
      id: '2',
      athleteId: '2',
      athleteName: 'Mike Chen',
      lastMessage: 'Can we adjust the volume for next week?',
      lastMessageTime: '5 hours ago',
      unreadCount: 2,
    },
    {
      id: '3',
      athleteId: '3',
      athleteName: 'Emily Davis',
      lastMessage: 'Got it, I\'ll focus on that cue',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
    },
    {
      id: '4',
      athleteId: '4',
      athleteName: 'John Smith',
      lastMessage: 'When should I test my maxes?',
      lastMessageTime: '2 days ago',
      unreadCount: 1,
    },
  ]);

  // Fake messages for selected conversation
  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      text: 'Hey coach, I completed today\'s workout!',
      timestamp: '10:30 AM',
      isCoach: false,
    },
    {
      id: '2',
      senderId: 'coach',
      text: 'Great job! How did the squats feel?',
      timestamp: '10:32 AM',
      isCoach: true,
    },
    {
      id: '3',
      senderId: '1',
      text: 'They felt really good. I think I had 2-3 reps in reserve on the last set',
      timestamp: '10:35 AM',
      isCoach: false,
    },
    {
      id: '4',
      senderId: 'coach',
      text: 'Perfect! That means we\'re right on track with the programming. Keep it up!',
      timestamp: '10:36 AM',
      isCoach: true,
    },
    {
      id: '5',
      senderId: '1',
      text: 'Thanks for the form check!',
      timestamp: '10:40 AM',
      isCoach: false,
    },
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.athleteName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In production, send message to database
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const ConversationList = () => (
    <YStack f={1} backgroundColor="white">
      <YStack p="$4" gap="$3">
        <Text fontSize={24} fontWeight="700" color="$gray12">
          Messages
        </Text>
        <XStack gap="$2">
          <Input
            f={1}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            size="$4"
            backgroundColor="$gray2"
            borderColor="$gray4"
            placeholderTextColor="$gray9"
          />
          <Button
            size="$4"
            backgroundColor="$gray2"
            borderColor="$gray4"
            borderWidth={1}
          >
            <Search size={20} color="#6b7280" />
          </Button>
        </XStack>
      </YStack>

      <ScrollView>
        <YStack>
          {filteredConversations.map((conversation) => (
            <Pressable
              key={conversation.id}
              onPress={() => setSelectedConversation(conversation.athleteId)}
            >
              <XStack
                p="$4"
                gap="$3"
                ai="center"
                backgroundColor={
                  selectedConversation === conversation.athleteId ? '$gray2' : 'white'
                }
                borderBottomWidth={1}
                borderBottomColor="$gray3"
              >
                <Avatar circular size="$4">
                  <Avatar.Fallback backgroundColor="$gray5">
                    {conversation.athleteName.split(' ').map(n => n[0]).join('')}
                  </Avatar.Fallback>
                </Avatar>
                <YStack f={1} gap="$0.5">
                  <XStack ai="center" jc="space-between">
                    <Text fontSize="$3" fontWeight="600" color="$gray12">
                      {conversation.athleteName}
                    </Text>
                    <Text fontSize="$1" color="$gray10">
                      {conversation.lastMessageTime}
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="$gray11" numberOfLines={1}>
                    {conversation.lastMessage}
                  </Text>
                </YStack>
                {conversation.unreadCount > 0 && (
                  <YStack
                    w={24}
                    h={24}
                    borderRadius="$10"
                    backgroundColor="#7c3aed"
                    ai="center"
                    jc="center"
                  >
                    <Text fontSize="$1" color="white" fontWeight="600">
                      {conversation.unreadCount}
                    </Text>
                  </YStack>
                )}
              </XStack>
            </Pressable>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );

  const MessageView = () => {
    const conversation = conversations.find(c => c.athleteId === selectedConversation);
    if (!conversation) return null;

    return (
      <YStack f={1} backgroundColor="white">
        {/* Header */}
        <XStack
          p="$4"
          ai="center"
          gap="$3"
          borderBottomWidth={1}
          borderBottomColor="$gray3"
          backgroundColor="white"
        >
          <Avatar circular size="$3">
            <Avatar.Fallback backgroundColor="$gray5">
              {conversation.athleteName.split(' ').map(n => n[0]).join('')}
            </Avatar.Fallback>
          </Avatar>
          <YStack f={1}>
            <Text fontSize="$4" fontWeight="600" color="$gray12">
              {conversation.athleteName}
            </Text>
            <Text fontSize="$2" color="$gray11">
              Active 2 hours ago
            </Text>
          </YStack>
          <Button
            size="$3"
            circular
            backgroundColor="$gray2"
            onPress={() => router.push(`/(coach)/(tabs)/athletes/${conversation.athleteId}`)}
          >
            <User size={20} color="#6b7280" />
          </Button>
        </XStack>

        {/* Messages */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
        >
          <YStack gap="$3">
            {messages.map((message) => (
              <XStack
                key={message.id}
                jc={message.isCoach ? 'flex-end' : 'flex-start'}
              >
                <Card
                  size="$2"
                  p="$3"
                  backgroundColor={message.isCoach ? '#7c3aed' : '$gray2'}
                  maxWidth="70%"
                >
                  <YStack gap="$1">
                    <Text
                      fontSize="$3"
                      color={message.isCoach ? 'white' : '$gray12'}
                    >
                      {message.text}
                    </Text>
                    <Text
                      fontSize="$1"
                      color={message.isCoach ? '$purple3' : '$gray10'}
                    >
                      {message.timestamp}
                    </Text>
                  </YStack>
                </Card>
              </XStack>
            ))}
          </YStack>
        </ScrollView>

        {/* Input */}
        <XStack
          p="$3"
          gap="$2"
          ai="center"
          borderTopWidth={1}
          borderTopColor="$gray3"
          backgroundColor="white"
        >
          <Input
            f={1}
            placeholder="Type a message..."
            value={messageInput}
            onChangeText={setMessageInput}
            size="$4"
            backgroundColor="$gray2"
            borderColor="$gray4"
            placeholderTextColor="$gray9"
          />
          <Button
            size="$4"
            backgroundColor="#7c3aed"
            onPress={handleSendMessage}
            disabled={!messageInput.trim()}
            opacity={messageInput.trim() ? 1 : 0.5}
          >
            <Send size={20} color="white" />
          </Button>
        </XStack>
      </YStack>
    );
  };

  // Mobile layout
  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {selectedConversation ? <MessageView /> : <ConversationList />}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Web/Desktop layout - side by side
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <XStack f={1}>
        <YStack width={350} borderRightWidth={1} borderRightColor="$gray3">
          <ConversationList />
        </YStack>
        <YStack f={1}>
          {selectedConversation ? (
            <MessageView />
          ) : (
            <YStack f={1} ai="center" jc="center" p="$4">
              <MessageCircle size={48} color="#9ca3af" />
              <Text fontSize="$4" color="$gray11" mt="$3">
                Select a conversation to start messaging
              </Text>
            </YStack>
          )}
        </YStack>
      </XStack>
    </SafeAreaView>
  );
}

// Add missing import
import { User } from "lucide-react-native";
