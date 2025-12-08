// components/coach/chat/ChatConversationComponent.tsx
import { ArrowLeft, MoreVertical, Send } from "lucide-react-native";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Input, Spinner, Text, XStack, YStack } from "tamagui";

type Message = {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    isCurrentUser: boolean;
};

type ChatUser = {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
};

type ChatConversationProps = {
    user: ChatUser;
    messages: Message[];
    currentUserId: string;
    messageText: string;
    onMessageTextChange: (text: string) => void;
    handleSendMessage: () => void;
    handleBack: () => void;
    handleUserProfile: () => void;
    isTyping: boolean;
    loadingMessages: boolean;
    loadMoreMessages: () => void;
    refreshing?: boolean;
};

export default function ChatConversationComponent({
    user,
    messages,
    currentUserId,
    messageText,
    onMessageTextChange,
    handleSendMessage,
    handleBack,
    handleUserProfile,
    isTyping,
    loadingMessages,
    loadMoreMessages,
    refreshing = false,
}: ChatConversationProps) {
    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getStatusDisplay = (status: Message['status']) => {
        switch (status) {
            case 'sending':
                return '○';
            case 'sent':
                return '✓';
            case 'delivered':
                return '✓✓';
            case 'read':
                return '✓✓';
            default:
                return '';
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isCurrentUser = item.senderId === currentUserId;

        return (
            <XStack
                px="$4"
                py="$1"
                jc={isCurrentUser ? 'flex-end' : 'flex-start'}
            >
                <XStack
                    maxWidth="80%"
                    gap="$2"
                    flexDirection={isCurrentUser ? 'row-reverse' : 'row'}
                >
                    {!isCurrentUser && (
                        <Avatar circular size="$2">
                            {user.avatar ? (
                                <Avatar.Image src={user.avatar} />
                            ) : (
                                <Avatar.Fallback
                                    backgroundColor="#7c3aed"
                                    ai="center"
                                    jc="center"
                                >
                                    <Text color="white" fontSize="$1" fontWeight="bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </Text>
                                </Avatar.Fallback>
                            )}
                        </Avatar>
                    )}

                    <YStack gap="$1" ai={isCurrentUser ? 'flex-end' : 'flex-start'}>
                        <XStack
                            backgroundColor={isCurrentUser ? '#7c3aed' : 'white'}
                            borderRadius="$3"
                            px="$3"
                            py="$2"
                            borderWidth={isCurrentUser ? 0 : 1}
                            borderColor="$gray5"
                        >
                            <Text
                                fontSize="$4"
                                color={isCurrentUser ? 'white' : '$gray12'}
                            >
                                {item.text}
                            </Text>
                        </XStack>

                        <XStack ai="center" gap="$1">
                            <Text fontSize="$1" color="$gray10">
                                {formatMessageTime(item.timestamp)}
                            </Text>
                            {isCurrentUser && (
                                <Text
                                    fontSize="$1"
                                    color={item.status === 'read' ? '#7c3aed' : '$gray10'}
                                >
                                    {getStatusDisplay(item.status)}
                                </Text>
                            )}
                        </XStack>
                    </YStack>
                </XStack>
            </XStack>
        );
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
            edges={['top', 'left', 'right']}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <YStack f={1} backgroundColor="#f5f5f5">
                    {/* Header */}
                    <XStack
                        backgroundColor="#f5f5f5"
                        p="$3"
                        ai="center"
                        gap="$3"
                        borderBottomWidth={1}
                        borderBottomColor="$gray5"
                    >
                        <Button
                            size="$3"
                            chromeless
                            icon={ArrowLeft}
                            onPress={handleBack}
                            pressStyle={{ opacity: 0.7 }}
                        />

                        <Button
                            f={1}
                            chromeless
                            onPress={handleUserProfile}
                            pressStyle={{ opacity: 0.9 }}
                            p="$0"
                        >
                            <XStack f={1} ai="center" gap="$3">
                                <YStack position="relative">
                                    <Avatar circular size="$4">
                                        {user.avatar ? (
                                            <Avatar.Image src={user.avatar} />
                                        ) : (
                                            <Avatar.Fallback
                                                backgroundColor="#7c3aed"
                                                ai="center"
                                                jc="center"
                                            >
                                                <Text
                                                    color="white"
                                                    fontSize="$4"
                                                    fontWeight="bold"
                                                >
                                                    {user.name.charAt(0).toUpperCase()}
                                                </Text>
                                            </Avatar.Fallback>
                                        )}
                                    </Avatar>
                                    {user.isOnline && (
                                        <YStack
                                            position="absolute"
                                            bottom={0}
                                            right={0}
                                            w={12}
                                            h={12}
                                            backgroundColor="#16a34a"
                                            borderRadius="$10"
                                            borderWidth={2}
                                            borderColor="white"
                                        />
                                    )}
                                </YStack>

                                <YStack f={1}>
                                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                                        {user.name}
                                    </Text>
                                    <Text fontSize="$2" color="$gray10">
                                        {isTyping
                                            ? 'Typing...'
                                            : user.isOnline
                                            ? 'Active now'
                                            : user.lastSeen
                                            ? `Last seen ${user.lastSeen}`
                                            : 'Offline'}
                                    </Text>
                                </YStack>
                            </XStack>
                        </Button>

                        <Button
                            size="$3"
                            chromeless
                            icon={MoreVertical}
                            pressStyle={{ opacity: 0.7 }}
                        />
                    </XStack>

                    {/* Messages List */}
                    {loadingMessages ? (
                        <YStack f={1} ai="center" jc="center">
                            <Spinner size="large" color="#7c3aed" />
                            <Text mt="$3" fontSize="$4" color="$gray10">
                                Loading messages...
                            </Text>
                        </YStack>
                    ) : (
                        <FlatList
                            data={messages}
                            renderItem={renderMessage}
                            keyExtractor={(item) => item.id}
                            inverted
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingVertical: 16,
                            }}
                            onEndReached={loadMoreMessages}
                            onEndReachedThreshold={0.1}
                            refreshing={refreshing}
                            ListEmptyComponent={
                                <YStack f={1} ai="center" jc="center" p="$8">
                                    <Text fontSize="$4" color="$gray10" textAlign="center">
                                        No messages yet. Say hello!
                                    </Text>
                                </YStack>
                            }
                        />
                    )}

                    {/* Input Area */}
                    <XStack
                        p="$3"
                        gap="$2"
                        ai="center"
                        borderTopWidth={1}
                        borderTopColor="$gray5"
                        backgroundColor="white"
                    >
                        <Input
                            f={1}
                            placeholder="Type a message..."
                            value={messageText}
                            onChangeText={onMessageTextChange}
                            size="$4"
                            backgroundColor="$gray2"
                            borderColor="$gray4"
                            borderRadius="$4"
                            placeholderTextColor="$gray9"
                            onSubmitEditing={handleSendMessage}
                            returnKeyType="send"
                        />
                        <Button
                            size="$4"
                            backgroundColor="#7c3aed"
                            borderRadius="$4"
                            onPress={handleSendMessage}
                            disabled={!messageText.trim()}
                            opacity={messageText.trim() ? 1 : 0.5}
                            pressStyle={{ backgroundColor: '#6d28d9' }}
                        >
                            <Send size={20} color="white" />
                        </Button>
                    </XStack>
                </YStack>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}