// Chat-related type definitions

export interface ChatPreview {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    isCurrentUser: boolean;
    replyTo?: string; // ID of message being replied to
    attachments?: MessageAttachment[];
}

export interface MessageAttachment {
    id: string;
    type: 'image' | 'video' | 'file';
    url: string;
    thumbnailUrl?: string;
    fileName?: string;
    fileSize?: number;
}

export interface ChatUser {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
    role?: 'athlete' | 'coach' | 'trainer';
    bio?: string;
}

export interface Chat {
    id: string;
    participants: ChatUser[];
    lastMessage?: Message;
    createdAt: string;
    updatedAt: string;
    isGroup: boolean;
    groupName?: string;
    groupAvatar?: string;
    unreadCount: number;
}

export interface TypingIndicator {
    chatId: string;
    userId: string;
    userName: string;
    isTyping: boolean;
}

// Service interfaces
export interface ChatService {
    connect(userId: string): Promise<void>;
    disconnect(): void;
    
    // Chat operations
    getChats(): Promise<ChatPreview[]>;
    getChat(chatId: string): Promise<Chat>;
    createChat(participantIds: string[]): Promise<Chat>;
    deleteChat(chatId: string): Promise<void>;
    
    // Message operations
    getMessages(chatId: string, limit?: number, before?: string): Promise<Message[]>;
    sendMessage(chatId: string, text: string, attachments?: File[]): Promise<Message>;
    editMessage(messageId: string, newText: string): Promise<Message>;
    deleteMessage(messageId: string): Promise<void>;
    markAsRead(chatId: string, messageIds: string[]): Promise<void>;
    
    // Real-time subscriptions
    subscribeToMessages(chatId: string, callback: (message: Message) => void): () => void;
    subscribeToTyping(chatId: string, callback: (typing: TypingIndicator) => void): () => void;
    subscribeToPresence(userIds: string[], callback: (updates: Record<string, boolean>) => void): () => void;
    
    // Typing indicators
    startTyping(chatId: string): void;
    stopTyping(chatId: string): void;
    
    // User operations
    getAvailableUsers(): Promise<ChatUser[]>;
    getUserProfile(userId: string): Promise<ChatUser>;
    blockUser(userId: string): Promise<void>;
    unblockUser(userId: string): Promise<void>;
}

// WebSocket event types
export interface ChatWebSocketMessage {
    type: 'message' | 'typing' | 'presence' | 'read' | 'deleted';
    payload: any;
}

export interface MessageEvent {
    chatId: string;
    message: Message;
}

export interface TypingEvent {
    chatId: string;
    userId: string;
    isTyping: boolean;
}

export interface PresenceEvent {
    userId: string;
    isOnline: boolean;
    lastSeen?: string;
}

export interface ReadEvent {
    chatId: string;
    messageIds: string[];
    userId: string;
    readAt: string;
}