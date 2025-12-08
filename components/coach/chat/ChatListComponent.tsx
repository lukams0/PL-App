// components/coach/chat/ChatListComponent.tsx
import { MessageCircle, Search, Users } from "lucide-react-native";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Input, Spinner, Text, XStack, YStack } from "tamagui";

type ChatPreview = {
    id: string;
    recipientId: string;
    recipientName: string;
    recipientAvatar?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
};

type ChatListProps = {
    refreshing: boolean;
    onRefresh: () => Promise<void>;
    chats: ChatPreview[];
    loading: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    handleChatPress: (chatId: string) => void;
    handleNewChat: () => void;
};

export default function ChatListComponent({
    refreshing,
    onRefresh,
    chats,
    loading,
    searchQuery,
    onSearchChange,
    handleChatPress,
    handleNewChat,
}: ChatListProps) {
    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else if (diffInHours < 168) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
            edges={['top', 'left', 'right']}
        >
            <YStack f={1} backgroundColor="#f5f5f5">
                {/* Header */}
                <YStack
                    backgroundColor="#f5f5f5"
                    borderBottomWidth={1}
                    borderBottomColor="$gray5"
                >
                    <XStack p="$4" ai="center" jc="space-between">
                        <Text fontSize="$8" fontWeight="bold" color="#111827">
                            Messages
                        </Text>
                        <Button
                            size="$3"
                            chromeless
                            onPress={handleNewChat}
                            pressStyle={{ opacity: 0.7 }}
                            padding="$2"
                        >
                            <Users size={24} color="#7c3aed" />
                        </Button>
                    </XStack>

                    {/* Search Bar */}
                    <XStack px="$4" pb="$4" ai="center" gap="$2">
                        <XStack
                            f={1}
                            backgroundColor="$gray3"
                            borderRadius="$4"
                            px="$3"
                            py="$1"
                            ai="center"
                            gap="$2"
                        >
                            <Search size={18} color="#9ca3af" />
                            <Input
                                f={1}
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChangeText={onSearchChange}
                                backgroundColor="transparent"
                                borderWidth={0}
                                fontSize="$4"
                                color="#111827"
                                placeholderTextColor="#9ca3af"
                            />
                        </XStack>
                    </XStack>
                </YStack>

                <ScrollView
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingTop: 16,
                        paddingBottom: 0,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <YStack gap="$3">
                        {loading ? (
                            <YStack py="$12" ai="center" jc="center">
                                <Spinner size="large" color="#7c3aed" />
                                <Text mt="$3" fontSize="$3" color="#6b7280">
                                    Loading conversations...
                                </Text>
                            </YStack>
                        ) : chats.length === 0 ? (
                            <YStack py="$12" ai="center" gap="$4">
                                <YStack
                                    w={80}
                                    h={80}
                                    borderRadius="$12"
                                    backgroundColor="#faf5ff"
                                    ai="center"
                                    jc="center"
                                >
                                    <MessageCircle size={40} color="#7c3aed" />
                                </YStack>
                                <YStack ai="center" gap="$2">
                                    <Text fontSize="$5" fontWeight="bold" color="#111827">
                                        No messages yet
                                    </Text>
                                    <Text
                                        fontSize="$3"
                                        color="#6b7280"
                                        textAlign="center"
                                        px="$6"
                                    >
                                        Start a conversation with your athletes
                                    </Text>
                                </YStack>
                                <Button
                                    size="$4"
                                    backgroundColor="#7c3aed"
                                    color="white"
                                    onPress={handleNewChat}
                                    borderRadius="$4"
                                    fontWeight="600"
                                    mt="$2"
                                    pressStyle={{ backgroundColor: '#6d28d9', scale: 0.98 }}
                                >
                                    Start New Chat
                                </Button>
                            </YStack>
                        ) : (
                            chats.map((chat) => (
                                <XStack
                                    key={chat.id}
                                    backgroundColor="white"
                                    borderRadius="$4"
                                    p="$3"
                                    gap="$3"
                                    ai="center"
                                    pressStyle={{ opacity: 0.9, scale: 0.99 }}
                                    onPress={() => handleChatPress(chat.id)}
                                >
                                    {/* Avatar with online indicator */}
                                    <YStack position="relative">
                                        <Avatar circular size="$5">
                                            {chat.recipientAvatar ? (
                                                <Avatar.Image src={chat.recipientAvatar} />
                                            ) : (
                                                <Avatar.Fallback
                                                    backgroundColor="#7c3aed"
                                                    ai="center"
                                                    jc="center"
                                                >
                                                    <Text
                                                        color="white"
                                                        fontSize="$5"
                                                        fontWeight="bold"
                                                    >
                                                        {chat.recipientName.charAt(0).toUpperCase()}
                                                    </Text>
                                                </Avatar.Fallback>
                                            )}
                                        </Avatar>
                                        {chat.isOnline && (
                                            <YStack
                                                position="absolute"
                                                bottom={0}
                                                right={0}
                                                w={16}
                                                h={16}
                                                backgroundColor="#16a34a"
                                                borderRadius="$10"
                                                borderWidth={3}
                                                borderColor="white"
                                            />
                                        )}
                                    </YStack>

                                    {/* Message content */}
                                    <YStack f={1} gap="$1.5">
                                        <XStack ai="center" jc="space-between">
                                            <Text
                                                fontSize="$5"
                                                fontWeight="600"
                                                color="#111827"
                                            >
                                                {chat.recipientName}
                                            </Text>
                                            <Text
                                                fontSize="$2"
                                                color="#9ca3af"
                                                fontWeight="500"
                                            >
                                                {formatMessageTime(chat.lastMessageTime)}
                                            </Text>
                                        </XStack>
                                        <XStack ai="center" jc="space-between" gap="$2">
                                            <Text
                                                fontSize="$3"
                                                color="#6b7280"
                                                numberOfLines={1}
                                                f={1}
                                            >
                                                {chat.lastMessage}
                                            </Text>
                                            {chat.unreadCount > 0 && (
                                                <XStack
                                                    backgroundColor="#7c3aed"
                                                    borderRadius="$10"
                                                    minWidth={24}
                                                    h={24}
                                                    px="$2"
                                                    ai="center"
                                                    jc="center"
                                                >
                                                    <Text fontSize="$2" color="white" fontWeight="bold">
                                                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                                                    </Text>
                                                </XStack>
                                            )}
                                        </XStack>
                                    </YStack>
                                </XStack>
                            ))
                        )}
                    </YStack>
                </ScrollView>
            </YStack>
        </SafeAreaView>
    );
}