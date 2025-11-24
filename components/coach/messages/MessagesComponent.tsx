import {
    MessageSquare,
    Plus,
    Search
} from 'lucide-react-native';
import { Pressable, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';

type Conversation = {
  id: string;
  athleteId: string;
  athleteName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
};

type Props = {
  conversations: Conversation[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  handleConversationPress: (conversationId: string) => void;
  handleNewMessage: () => void;
};

export default function MessagesComponent({
  conversations,
  searchQuery,
  setSearchQuery,
  refreshing,
  onRefresh,
  handleConversationPress,
  handleNewMessage,
}: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <YStack p="$4" gap="$3" backgroundColor="#f5f5f5">
          <XStack ai="center" jc="space-between">
            <Text fontSize="$8" fontWeight="bold" color="$gray12">
              Messages
            </Text>
            <Button
              size="$3"
              backgroundColor="#7c3aed"
              color="white"
              onPress={handleNewMessage}
              pressStyle={{ backgroundColor: '#6d28d9' }}
              icon={Plus}
            >
              New
            </Button>
          </XStack>

          {/* Search Bar */}
          <XStack ai="center" gap="$2">
            <Input
              f={1}
              size="$4"
              placeholder="Search conversations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              backgroundColor="white"
              borderColor="#e5e7eb"
              focusStyle={{ borderColor: '#7c3aed' }}
            />
            <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: 12 }} />
          </XStack>
        </YStack>

        {/* Conversations List */}
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <YStack p="$4" gap="$3">
            {conversations.length === 0 ? (
              <Card elevate size="$4" p="$5" backgroundColor="white">
                <YStack ai="center" gap="$3">
                  <MessageSquare size={40} color="#9ca3af" />
                  <YStack ai="center" gap="$1">
                    <Text fontSize="$4" fontWeight="bold" color="$gray12">
                      No Messages
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      {searchQuery 
                        ? 'No conversations match your search'
                        : 'Start a conversation with your athletes'}
                    </Text>
                  </YStack>
                </YStack>
              </Card>
            ) : (
              conversations.map((conversation) => (
                <Pressable 
                  key={conversation.id} 
                  onPress={() => handleConversationPress(conversation.id)}
                >
                  <Card
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor="white"
                    pressStyle={{ scale: 0.98 }}
                  >
                    <XStack gap="$3">
                      {/* Avatar */}
                      <YStack position="relative">
                        <YStack
                          w={48}
                          h={48}
                          borderRadius="$10"
                          backgroundColor="#7c3aed"
                          ai="center"
                          jc="center"
                        >
                          <Text fontSize="$5" fontWeight="bold" color="white">
                            {conversation.athleteName.split(' ').map(n => n[0]).join('')}
                          </Text>
                        </YStack>
                        {conversation.isOnline && (
                          <YStack
                            position="absolute"
                            bottom={0}
                            right={0}
                            w={12}
                            h={12}
                            borderRadius="$10"
                            backgroundColor="#10b981"
                            borderWidth={2}
                            borderColor="white"
                          />
                        )}
                      </YStack>

                      {/* Message Content */}
                      <YStack f={1} gap="$1">
                        <XStack ai="center" jc="space-between">
                          <Text fontSize="$4" fontWeight="600" color="$gray12">
                            {conversation.athleteName}
                          </Text>
                          <Text fontSize="$2" color="$gray10">
                            {conversation.lastMessageTime}
                          </Text>
                        </XStack>
                        <Text 
                          fontSize="$3" 
                          color="$gray10"
                          numberOfLines={1}
                        >
                          {conversation.lastMessage}
                        </Text>
                      </YStack>

                      {/* Unread Badge */}
                      {conversation.unreadCount > 0 && (
                        <YStack
                          w={24}
                          h={24}
                          borderRadius="$10"
                          backgroundColor="#7c3aed"
                          ai="center"
                          jc="center"
                        >
                          <Text fontSize="$2" fontWeight="bold" color="white">
                            {conversation.unreadCount}
                          </Text>
                        </YStack>
                      )}
                    </XStack>
                  </Card>
                </Pressable>
              ))
            )}

            {/* Bottom Spacing */}
            <YStack h={20} />
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}