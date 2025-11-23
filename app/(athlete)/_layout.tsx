// app/(athlete)/_layout.tsx
import { ChatBadgeProvider, useChatBadge } from '@/providers/ChatBadgeContext';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { BookOpen, MessageCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

function CustomDrawerContent(props: any) {
  const { displayCount, unreadTotal } = useChatBadge();

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingTop: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            paddingHorizontal: 20,
            paddingBottom: 20,
            color: '#7c3aed',
          }}
        >
          Menu
        </Text>

        <DrawerItem
          label="Chat"
          icon={({ color, size }) => (
            <View style={{ position: 'relative' }}>
              <MessageCircle size={size} color={color} />
              {unreadTotal > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: '#ef4444',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      fontWeight: '700',
                    }}
                  >
                    {displayCount}
                  </Text>
                </View>
              )}
            </View>
          )}
          onPress={() => router.push('/(athlete)/(tabs)/chat')}
          activeTintColor="#7c3aed"
          inactiveTintColor="#6b7280"
        />

        <DrawerItem
          label="Programs"
          icon={({ color, size }) => <BookOpen size={size} color={color} />}
          onPress={() => router.push('/(athlete)/(tabs)/programs')}
          activeTintColor="#7c3aed"
          inactiveTintColor="#6b7280"
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function AthleteLayout() {
  return (
    <ChatBadgeProvider>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#ffffff',
            width: 280,
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="chat"
          options={{
            drawerLabel: 'Chat',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="programs"
          options={{
            drawerLabel: 'Programs',
            headerShown: false,
          }}
        />
      </Drawer>
    </ChatBadgeProvider>
  );
}
