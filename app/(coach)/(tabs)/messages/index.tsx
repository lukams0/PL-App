import MessagesComponent from '@/components/coach/messages/MessagesComponent';
import { useState } from 'react';

// Fake message data
const fakeConversations = [
  {
    id: '1',
    athleteId: '1',
    athleteName: 'John Smith',
    lastMessage: 'Thanks for the form check! I\'ll work on that.',
    lastMessageTime: '2 hours ago',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '2',
    athleteId: '2',
    athleteName: 'Sarah Johnson',
    lastMessage: 'Can we adjust the program for next week?',
    lastMessageTime: '5 hours ago',
    unreadCount: 2,
    isOnline: false,
  },
  {
    id: '3',
    athleteId: '3',
    athleteName: 'Mike Wilson',
    lastMessage: 'Hit a new PR today! 405 on squat!',
    lastMessageTime: '1 day ago',
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: '4',
    athleteId: '5',
    athleteName: 'Alex Chen',
    lastMessage: 'You: Great work on the snatch today!',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    isOnline: true,
  },
];

export default function MessagesPage() {
  const [conversations] = useState(fakeConversations);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.athleteName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    // In real app, fetch messages from service
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleConversationPress = (conversationId: string) => {
    //router.push(`/(coach)/(tabs)/messages/${conversationId}`);
  };

  const handleNewMessage = () => {
    //router.push('/(coach)/(tabs)/messages/new');
  };

  return (
    <MessagesComponent
      conversations={filteredConversations}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      refreshing={refreshing}
      onRefresh={onRefresh}
      handleConversationPress={handleConversationPress}
      handleNewMessage={handleNewMessage}
    />
  );
}