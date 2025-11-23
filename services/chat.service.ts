// services/chat.service.ts
import { supabase } from "@/lib/supabase";

// This is the "message row" from the DB
export type MessageRow = {
    id: string;
    conversation_id: string;
    sender_id: string | null;
    content: string;
    created_at: string;
};

export type ChatPreview = {
    id: string;                 // conversation id
    userId: string;             // other participant id
    userName: string;
    userAvatar?: string | null;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
};

export type ChatUser = {
    id: string;
    name: string;
    avatar?: string | null;
};

/**
 * Search for other users by name.
 * Excludes the current user.
 */
async function searchUsers(query: string, currentUserId: string): Promise<ChatUser[]> {
    const q = query.trim();
    if (!q) {
        // optional: you can decide whether to return empty or some default list
        return [];
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .neq("id", currentUserId)
        .ilike("full_name", `%${q}%`)
        .limit(20);

    if (error) throw error;

    return (data ?? []).map((row) => ({
        id: row.id,
        name: row.full_name ?? "Unknown",
        avatar: row.avatar_url,
    }));
}

/**
 * Get or create a 1–1 conversation between current user and another user.
 */
async function getOrCreateDirectConversation(
    currentUserId: string,
    otherUserId: string
): Promise<string> {
    if (currentUserId === otherUserId) {
        throw new Error("Cannot start a conversation with yourself");
    }

    // All conversations where current user participates
    const { data: myConvos, error: convErr } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", currentUserId);

    if (convErr) throw convErr;

    const convoIds = (myConvos ?? []).map((c) => c.conversation_id);

    if (convoIds.length > 0) {
        // Does the other user share any of these conversations?
        const { data: shared, error: sharedErr } = await supabase
            .from("conversation_participants")
            .select("conversation_id")
            .eq("user_id", otherUserId)
            .in("conversation_id", convoIds)
            .maybeSingle();

        if (sharedErr && (sharedErr as any).code !== "PGRST116") throw sharedErr;
        if (shared) {
            return shared.conversation_id;
        }
    }

    // None found → create new conversation + participants
    const { data: convo, error: createConvErr } = await supabase
        .from("conversations")
        .insert({ is_group: false })
        .select("id")
        .single();

    if (createConvErr || !convo) throw createConvErr;

    const { error: partErr } = await supabase
        .from("conversation_participants")
        .insert([
            { conversation_id: convo.id, user_id: currentUserId },
            { conversation_id: convo.id, user_id: otherUserId },
        ]);

    if (partErr) throw partErr;

    return convo.id;
}

/**
 * Get all conversations for current user, with last message + other participant.
 * (v1: unreadCount is always 0 – you can extend this later with last_read_at)
 */
async function getUserConversations(currentUserId: string): Promise<ChatPreview[]> {
    const { data, error } = await supabase
        .from("conversation_participants")
        .select(`
      conversation_id,
      last_read_at,
      conversation:conversations (
        id,
        created_at,
        participants:conversation_participants (
          user_id,
          user:profiles (
            id,
            full_name,
            avatar_url
          )
        ),
        messages:messages (
          id,
          sender_id,
          content,
          created_at
        )
      )
    `)
        .eq("user_id", currentUserId);

    if (error) throw error;

    const rows = (data ?? []) as any[];

    const previews: ChatPreview[] = rows.map((row) => {
        const conv = row.conversation;
        const participants = conv.participants ?? [];
        const messages = (conv.messages ?? []) as any[];
        const lastReadAt = row.last_read_at ? new Date(row.last_read_at).getTime() : 0;

        // "Other" participant – for 1–1 chats
        const other = participants.find((p: any) => p.user_id !== currentUserId)?.user;

        // Last message in the conversation
        const sortedMessages = messages
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        const lastMsg = sortedMessages[0];

        // Unread = messages newer than last_read_at, from someone else
        const unreadCount = messages.filter((m) => {
            const created = new Date(m.created_at).getTime();
            return (
                created > lastReadAt &&
                m.sender_id &&
                m.sender_id !== currentUserId
            );
        }).length;

        return {
            id: conv.id,
            userId: other?.id ?? "",
            userName: other?.full_name ?? "Unknown",
            userAvatar: other?.avatar_url ?? null,
            lastMessage: lastMsg?.content ?? "",
            lastMessageTime: lastMsg?.created_at ?? conv.created_at,
            unreadCount,
            isOnline: false, // patched by presence in ChatPage
        };
    });

    // Sort by latest activity
    previews.sort(
        (a, b) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
    );

    return previews;
}

/**
 * Load messages for a conversation (latest first).
 */
async function getMessages(
    conversationId: string,
    limit = 30,
    before?: string
): Promise<MessageRow[]> {
    let query = supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (before) {
        query = query.lt("created_at", before);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
}

/**
 * Send a message.
 */
async function sendMessage(
    conversationId: string,
    senderId: string,
    content: string
): Promise<MessageRow> {
    const { data, error } = await supabase
        .from("messages")
        .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            content,
        })
        .select("*")
        .single();

    if (error) throw error;
    return data!;
}

/**
 * Mark conversation as read for this user.
 */
async function markConversationRead(
    conversationId: string,
    userId: string
): Promise<void> {
    const { error } = await supabase
        .from("conversation_participants")
        .update({ last_read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("user_id", userId);

    if (error) throw error;
}

/**
 * Subscribe to new messages in a conversation.
 * Returns an unsubscribe function.
 */
function subscribeToConversation(
    conversationId: string,
    onNewMessage: (msg: MessageRow) => void
) {
    const channel = supabase
        .channel(`conversation:${conversationId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `conversation_id=eq.${conversationId}`,
            },
            (payload) => {
                onNewMessage(payload.new as MessageRow);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

/**
 * Presence: track which user IDs are online in "online-users" channel.
 */
function setupPresence(
    currentUserId: string,
    onOnlineUsersChange: (ids: string[]) => void
) {
    const channel = supabase.channel("online-users", {
        config: {
            presence: {
                key: currentUserId,
            },
        },
    });

    channel
        .on("presence", { event: "sync" }, () => {
            const state = channel.presenceState() as Record<string, any[]>;
            const onlineIds = Object.keys(state);
            onOnlineUsersChange(onlineIds);
        })
        .subscribe((status) => {
            if (status === "SUBSCRIBED") {
                channel.track({
                    user_id: currentUserId,
                    online_at: new Date().toISOString(),
                });
            }
        });

    return () => {
        supabase.removeChannel(channel);
    };
}

export const chatService = {
    searchUsers,
    getOrCreateDirectConversation,
    getUserConversations,
    getMessages,
    sendMessage,
    markConversationRead,
    subscribeToConversation,
    setupPresence,
};
