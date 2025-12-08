// app/(coach)/(tabs)/chat/index.tsx
import ChatConversationComponent from '@/components/coach/chat/ChatConversationComponent';
import ChatListComponent from '@/components/coach/chat/ChatListComponent';
import { useAuth } from '@/providers/AuthContext';
import { chatService, MessageRow, ChatPreview as ServiceChatPreview } from '@/services/chat.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

// Match shapes used by components
type ChatPreview = {
    id: string;            // conversation id
    recipientId: string;   // the other user's id (athlete)
    recipientName: string;
    recipientAvatar?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
};

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

export default function CoachChatPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { conversationId: initialConversationId } = useLocalSearchParams<{
        conversationId?: string;
    }>();

    const currentUserId = user?.id ?? '';

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [onlineIds, setOnlineIds] = useState<string[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    // Conversation state
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [currentChatPeer, setCurrentChatPeer] = useState<ChatUser | null>(null);

    // -------------- Presence --------------
    useEffect(() => {
        if (!currentUserId) return;
        const cleanup = chatService.setupPresence(currentUserId, setOnlineIds);
        return cleanup;
    }, [currentUserId]);

    // -------------- Load chat preview list --------------
    useEffect(() => {
        if (!currentUserId) return;
        loadChats();
    }, [currentUserId]);

    const loadChats = async () => {
        if (!currentUserId) return;
        setLoading(true);
        try {
            const previews = await chatService.getUserConversations(currentUserId);
            setChats(
                previews.map((p: ServiceChatPreview): ChatPreview => ({
                    id: p.id,
                    recipientId: p.userId,
                    recipientName: p.userName,
                    recipientAvatar: p.userAvatar ?? undefined,
                    lastMessage: p.lastMessage,
                    lastMessageTime: p.lastMessageTime,
                    unreadCount: p.unreadCount,
                    isOnline: false, // patched below with presence
                }))
            );
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadChats();
        setRefreshing(false);
    };

    // -------------- Search filter --------------
    const filteredChats: ChatPreview[] = useMemo(() => {
        const q = searchQuery.toLowerCase();
        const withPresence = chats.map((chat) => ({
            ...chat,
            isOnline: onlineIds.includes(chat.recipientId),
        }));

        if (!q) return withPresence;

        return withPresence.filter(
            (chat) =>
                chat.recipientName.toLowerCase().includes(q) ||
                chat.lastMessage.toLowerCase().includes(q)
        );
    }, [chats, searchQuery, onlineIds]);

    // -------------- Open conversation from param --------------
    useEffect(() => {
        if (!initialConversationId || !chats.length) return;
        const exists = chats.find((c) => c.id === initialConversationId);
        if (exists) {
            handleChatPress(initialConversationId);
        }
    }, [initialConversationId, chats.length]);

    // -------------- Handle chat press --------------
    const handleChatPress = async (chatId: string) => {
        if (!currentUserId) return;

        setSelectedChatId(chatId);
        setLoadingMessages(true);

        const selectedChat = chats.find((chat) => chat.id === chatId);
        if (selectedChat) {
            const isOnline = onlineIds.includes(selectedChat.recipientId);
            setCurrentChatPeer({
                id: selectedChat.recipientId,
                name: selectedChat.recipientName,
                avatar: selectedChat.recipientAvatar,
                isOnline,
                lastSeen: isOnline ? undefined : 'recently',
            });
        }

        let unsubscribe: (() => void) | undefined;

        try {
            // Load initial messages
            const initialRows = await chatService.getMessages(chatId);
            setMessages(
                initialRows.map((m: MessageRow): Message => ({
                    id: m.id,
                    text: m.content,
                    senderId: m.sender_id ?? '',
                    timestamp: m.created_at,
                    status: 'sent',
                    isCurrentUser: m.sender_id === currentUserId,
                }))
            );

            // Mark as read in DB
            await chatService.markConversationRead(chatId, currentUserId);

            // Optimistically zero unread in local list state
            setChats((prev) =>
                prev.map((c) =>
                    c.id === chatId ? { ...c, unreadCount: 0 } : c
                )
            );

            // Subscribe to new messages
            unsubscribe = chatService.subscribeToConversation(chatId, (m) => {
                setMessages((prev) => [
                    {
                        id: m.id,
                        text: m.content,
                        senderId: m.sender_id ?? '',
                        timestamp: m.created_at,
                        status: 'delivered',
                        isCurrentUser: m.sender_id === currentUserId,
                    },
                    ...prev,
                ]);
            });
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoadingMessages(false);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    };

    // -------------- Send message --------------
    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedChatId || !currentChatPeer || !currentUserId) return;

        const tempId = Date.now().toString();
        const text = messageText.trim();

        const optimistic: Message = {
            id: tempId,
            text,
            senderId: currentUserId,
            timestamp: new Date().toISOString(),
            status: 'sending',
            isCurrentUser: true,
        };

        setMessages((prev) => [optimistic, ...prev]);
        setMessageText('');

        try {
            const saved = await chatService.sendMessage(selectedChatId, currentUserId, text);

            setMessages((prev) =>
                prev.map((m) =>
                    m.id === tempId
                        ? {
                            ...m,
                            id: saved.id,
                            timestamp: saved.created_at,
                            status: 'sent',
                        }
                        : m
                )
            );
        } catch (error) {
            console.error('Error sending message:', error);
            // Optional: mark as failed
        }
    };

    // -------------- Navigation handlers --------------
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleNewChat = () => {
        router.push('/(coach)/(tabs)/chat/new');
    };

    const handleBack = () => {
        setSelectedChatId(null);
        setMessages([]);
        setMessageText('');
        setCurrentChatPeer(null);
    };

    const handleUserProfile = () => {
        if (currentChatPeer) {
            // Navigate to athlete profile
            router.push({
                pathname: '/(coach)/(tabs)/athletes/[athleteId]',
                params: { athleteId: currentChatPeer.id }
            });
        }
    };

    const loadMoreMessages = () => {
        // TODO: pagination – call chatService.getMessages with `before` parameter
        console.log('Load more messages (pagination not implemented yet)');
    };

    // If a chat is selected, show conversation
    if (selectedChatId && currentChatPeer) {
        return (
            <ChatConversationComponent
                user={currentChatPeer}
                messages={messages}
                currentUserId={currentUserId}
                messageText={messageText}
                onMessageTextChange={setMessageText}
                handleSendMessage={handleSendMessage}
                handleBack={handleBack}
                handleUserProfile={handleUserProfile}
                isTyping={isTyping}
                loadingMessages={loadingMessages}
                loadMoreMessages={loadMoreMessages}
            />
        );
    }

    // Otherwise, show chat list
    return (
        <ChatListComponent
            refreshing={refreshing}
            onRefresh={handleRefresh}
            chats={filteredChats}
            loading={loading}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            handleChatPress={handleChatPress}
            handleNewChat={handleNewChat}
        />
    );
}