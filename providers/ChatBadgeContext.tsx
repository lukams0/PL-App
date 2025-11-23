// providers/ChatBadgeContext.tsx
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthContext";
import { ChatPreview, chatService } from "@/services/chat.service";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

type ChatBadgeContextValue = {
  unreadTotal: number;              // raw total unread messages
  displayCount: string;             // "0", "1", ..., "10+"
  conversations: ChatPreview[];     // optional, if others want it
  refreshUnread: () => Promise<void>;
};

const ChatBadgeContext = createContext<ChatBadgeContextValue | undefined>(
  undefined
);

export function useChatBadge() {
  const ctx = useContext(ChatBadgeContext);
  if (!ctx) {
    throw new Error("useChatBadge must be used within ChatBadgeProvider");
  }
  return ctx;
}

export function ChatBadgeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? "";

  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(0);

  const computeTotals = useCallback((convos: ChatPreview[]) => {
    const total = convos.reduce((sum, c) => sum + c.unreadCount, 0);
    setUnreadTotal(total);
  }, []);

  const refreshUnread = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const convos = await chatService.getUserConversations(currentUserId);
      setConversations(convos);
      computeTotals(convos);
    } catch (err) {
      console.error("Error refreshing chat unread:", err);
    }
  }, [currentUserId, computeTotals]);

  // Initial load + when user changes
  useEffect(() => {
    if (!currentUserId) return;
    refreshUnread();
  }, [currentUserId, refreshUnread]);

  // Realtime: whenever any new message is inserted, just refresh counts
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel("chat-unread-badge")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          // New message somewhere → just recompute
          refreshUnread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, refreshUnread]);

  const displayCount =
    unreadTotal > 10 ? "10+" : unreadTotal.toString();

  const value: ChatBadgeContextValue = {
    unreadTotal,
    displayCount,
    conversations,
    refreshUnread,
  };

  return (
    <ChatBadgeContext.Provider value={value}>
      {children}
    </ChatBadgeContext.Provider>
  );
}
