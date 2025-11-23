import { useRouter } from 'expo-router';
import { Search, UserPlus } from "lucide-react-native";
import { useEffect, useState } from 'react';
import { FlatList } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Input, Spinner, Text, XStack, YStack } from "tamagui";

import { useAuth } from '@/providers/AuthContext';
import { chatService, ChatUser as ServiceChatUser } from '@/services/chat.service';

type User = {
  id: string;
  name: string;
  avatar?: string;
  role: 'athlete' | 'coach' | 'trainer'; // for now we can default / fake this
  isOnline: boolean;
  bio?: string;
};

export default function NewChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const currentUserId = user?.id ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Load users when query changes
  useEffect(() => {
    if (!currentUserId) return;
    const q = searchQuery.trim();
    if (!q) {
      setUsers([]);
      return;
    }
    loadUsers(q);
  }, [searchQuery, currentUserId]);

  const loadUsers = async (query: string) => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const result: ServiceChatUser[] = await chatService.searchUsers(query, currentUserId);
      setUsers(
        result.map((u) => ({
          id: u.id,
          name: u.name,
          avatar: u.avatar ?? undefined,
          role: 'athlete', // you can wire real role from your profiles later
          isOnline: false, // presence can be added later
          bio: '',         // extend with profile.bio if you add it
        }))
      );
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (item: User) => {
    if (!currentUserId) return;
    try {
      const conversationId = await chatService.getOrCreateDirectConversation(
        currentUserId,
        item.id
      );

      router.replace({
        pathname: '/(athlete)/(tabs)/chat',
        params: { conversationId },
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };


  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'coach':
        return '#16a34a';
      case 'trainer':
        return '#7c3aed';
      case 'athlete':
      default:
        return '#3b82f6';
    }
  };

  const getRoleLabel = (role: User['role']) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const filteredUsers = users; // server-side filtered by search

  const renderUser = ({ item }: { item: User }) => (
    <XStack
      onPress={() => handleUserSelect(item)}
      pressStyle={{ backgroundColor: '#f3f4f6', opacity: 0.95, scale: 0.99 }}
      p="$4"
      ai="center"
      gap="$3"
      borderRadius="$6"
      backgroundColor="white"
      mb="$3"
      cursor="pointer"
    >
      {/* Avatar with online indicator */}
      <YStack position="relative">
        <Avatar circular size="$6">
          {item.avatar ? (
            <Avatar.Image src={item.avatar} />
          ) : (
            <Avatar.Fallback
              backgroundColor="#7c3aed"
              ai="center"
              jc="center"
            >
              <Text color="white" fontSize="$6" fontWeight="bold">
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </Avatar.Fallback>
          )}
        </Avatar>
        {item.isOnline && (
          <YStack
            position="absolute"
            bottom={2}
            right={2}
            w={16}
            h={16}
            backgroundColor="#16a34a"
            borderRadius="$10"
            borderWidth={3}
            borderColor="white"
          />
        )}
      </YStack>

      {/* User info */}
      <YStack f={1} gap="$1.5">
        <YStack gap="$1">
          <Text fontSize="$5" fontWeight="600" color="#111827">
            {item.name}
          </Text>
          <XStack ai="center" gap="$2">
            <XStack
              backgroundColor={getRoleColor(item.role)}
              px="$2"
              py="$1"
              borderRadius="$3"
            >
              <Text fontSize="$1" color="white" fontWeight="600">
                {getRoleLabel(item.role)}
              </Text>
            </XStack>
            <Text
              fontSize="$2"
              color={item.isOnline ? '#16a34a' : '#9ca3af'}
              fontWeight="500"
            >
              {item.isOnline ? '● Active now' : 'Offline'}
            </Text>
          </XStack>
        </YStack>
        {item.bio && (
          <Text fontSize="$3" color="#6b7280" numberOfLines={2}>
            {item.bio}
          </Text>
        )}
      </YStack>

      {/* Message button */}
      <Button
        size="$3"
        backgroundColor="#7c3aed"
        color="white"
        borderRadius="$4"
        fontWeight="600"
        pressStyle={{ backgroundColor: '#6d28d9', scale: 0.97 }}
        onPress={() => handleUserSelect(item)}
      >
        Message
      </Button>
    </XStack>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      edges={['top', 'left', 'right']}
    >
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <YStack backgroundColor="#f5f5f5" borderBottomWidth={1} borderBottomColor="$gray5">
          <XStack p="$4" ai="center" jc="space-between">
            <Text fontSize="$8" fontWeight="bold" color="#111827">
              Start a Conversation
            </Text>
            <Button
              size="$3"
              chromeless
              onPress={() => router.back()}
              pressStyle={{ opacity: 0.7 }}
            >
              <Text fontSize="$4" color="#7c3aed" fontWeight="600">
                Cancel
              </Text>
            </Button>
          </XStack>

          {/* Search Bar */}
          <XStack px="$4" pb="$4" ai="center" gap="$2">
            <XStack
              f={1}
              backgroundColor="$gray3"
              borderRadius="$4"
              px="$3"
              py="$2.5"
              ai="center"
              gap="$2"
            >
              <Search size={18} color="#9ca3af" />
              <Input
                f={1}
                placeholder="Search by name..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                backgroundColor="transparent"
                borderWidth={0}
                fontSize="$4"
                color="#111827"
                placeholderTextColor="#9ca3af"
              />
            </XStack>
          </XStack>
        </YStack>

        {/* Users List */}
        {loading ? (
          <YStack f={1} ai="center" jc="center">
            <Spinner size="large" color="#7c3aed" />
            <Text mt="$3" fontSize="$3" color="#6b7280">
              Loading users...
            </Text>
          </YStack>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 32,
            }}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <YStack py="$12" ai="center" gap="$4">
                <YStack
                  w={80}
                  h={80}
                  borderRadius="$12"
                  backgroundColor="#faf5ff"
                  ai="center"
                  jc="center"
                >
                  <UserPlus size={40} color="#7c3aed" />
                </YStack>
                <YStack ai="center" gap="$2">
                  <Text fontSize="$5" fontWeight="bold" color="#111827">
                    No users found
                  </Text>
                  <Text
                    fontSize="$3"
                    color="#6b7280"
                    textAlign="center"
                    px="$6"
                  >
                    Try adjusting your search or check back later
                  </Text>
                </YStack>
              </YStack>
            }
          />
        )}
      </YStack>
    </SafeAreaView>
  );
}
