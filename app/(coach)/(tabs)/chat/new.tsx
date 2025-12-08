// app/(coach)/(tabs)/chat/new.tsx
import { useAuth } from '@/providers/AuthContext';
import { chatService, ChatUser as ServiceChatUser } from '@/services/chat.service';
import { useRouter } from 'expo-router';
import { Search, UserPlus } from "lucide-react-native";
import { useEffect, useState } from 'react';
import { FlatList } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Input, Spinner, Text, XStack, YStack } from "tamagui";

type User = {
    id: string;
    name: string;
    avatar?: string;
    role: 'athlete' | 'coach' | 'trainer';
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
    const [startingChat, setStartingChat] = useState<string | null>(null);

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
                    role: 'athlete' as const, // default role
                    isOnline: false,
                    bio: undefined,
                }))
            );
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = async (userId: string) => {
        if (!currentUserId) return;
        setStartingChat(userId);
        try {
            const conversationId = await chatService.getOrCreateDirectConversation(
                currentUserId,
                userId
            );
            // Navigate back to chat index with the new conversation
            router.replace({
                pathname: '/(coach)/(tabs)/chat',
                params: { conversationId },
            });
        } catch (error) {
            console.error('Error starting chat:', error);
            setStartingChat(null);
        }
    };

    const renderUser = ({ item }: { item: User }) => (
        <XStack
            p="$4"
            gap="$3"
            ai="center"
            backgroundColor="white"
            borderBottomWidth={1}
            borderBottomColor="$gray3"
        >
            <YStack position="relative">
                <Avatar circular size="$5">
                    {item.avatar ? (
                        <Avatar.Image src={item.avatar} />
                    ) : (
                        <Avatar.Fallback
                            backgroundColor="#7c3aed"
                            ai="center"
                            jc="center"
                        >
                            <Text color="white" fontSize="$5" fontWeight="bold">
                                {item.name.charAt(0).toUpperCase()}
                            </Text>
                        </Avatar.Fallback>
                    )}
                </Avatar>
                {item.isOnline && (
                    <YStack
                        position="absolute"
                        bottom={0}
                        right={0}
                        w={14}
                        h={14}
                        backgroundColor="#16a34a"
                        borderRadius="$10"
                        borderWidth={2}
                        borderColor="white"
                    />
                )}
            </YStack>

            <YStack f={1} gap="$1">
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                    {item.name}
                </Text>
                {item.bio && (
                    <Text fontSize="$3" color="$gray10" numberOfLines={1}>
                        {item.bio}
                    </Text>
                )}
                <Text fontSize="$2" color="$gray10" textTransform="capitalize">
                    {item.role}
                </Text>
            </YStack>

            <Button
                size="$3"
                backgroundColor="#7c3aed"
                color="white"
                onPress={() => handleStartChat(item.id)}
                disabled={startingChat === item.id}
                pressStyle={{ backgroundColor: '#6d28d9' }}
            >
                {startingChat === item.id ? (
                    <Spinner size="small" color="white" />
                ) : (
                    <XStack ai="center" gap="$1">
                        <UserPlus size={16} color="white" />
                        <Text color="white" fontWeight="600">Chat</Text>
                    </XStack>
                )}
            </Button>
        </XStack>
    );

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
            edges={['left', 'right', 'bottom']}
        >
            <YStack f={1} backgroundColor="#f5f5f5">
                {/* Search Bar */}
                <YStack p="$4" backgroundColor="white" borderBottomWidth={1} borderBottomColor="$gray3">
                    <XStack
                        backgroundColor="$gray2"
                        borderRadius="$4"
                        px="$3"
                        py="$2"
                        ai="center"
                        gap="$2"
                    >
                        <Search size={20} color="#9ca3af" />
                        <Input
                            f={1}
                            placeholder="Search athletes by name..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            backgroundColor="transparent"
                            borderWidth={0}
                            fontSize="$4"
                            color="$gray12"
                            placeholderTextColor="#9ca3af"
                            autoFocus
                        />
                    </XStack>
                </YStack>

                {/* Results */}
                {loading ? (
                    <YStack f={1} ai="center" jc="center">
                        <Spinner size="large" color="#7c3aed" />
                        <Text mt="$3" fontSize="$3" color="$gray10">
                            Searching...
                        </Text>
                    </YStack>
                ) : users.length === 0 ? (
                    <YStack f={1} ai="center" jc="center" p="$8">
                        <YStack
                            w={80}
                            h={80}
                            borderRadius="$12"
                            backgroundColor="#faf5ff"
                            ai="center"
                            jc="center"
                            mb="$4"
                        >
                            <Search size={40} color="#7c3aed" />
                        </YStack>
                        <Text fontSize="$5" fontWeight="bold" color="$gray12" textAlign="center">
                            {searchQuery.trim()
                                ? 'No athletes found'
                                : 'Search for Athletes'}
                        </Text>
                        <Text fontSize="$3" color="$gray10" textAlign="center" mt="$2">
                            {searchQuery.trim()
                                ? 'Try a different search term'
                                : 'Enter a name to find athletes to message'}
                        </Text>
                    </YStack>
                ) : (
                    <FlatList
                        data={users}
                        renderItem={renderUser}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </YStack>
        </SafeAreaView>
    );
}