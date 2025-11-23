// app/(athlete)/(tabs)/_layout.tsx OR wherever TabBar lives
import { useChatBadge } from '@/providers/ChatBadgeContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Tabs } from "expo-router";
import { Dumbbell, History, Home, MoreHorizontal, User } from "lucide-react-native";
import { Platform, Text as RNText, View } from "react-native";
import { YStack } from "tamagui";
import { ActiveWorkoutBar } from "../workout/ActiveWorkoutBar";

type TabBarProps = {
  isWorkoutActive: boolean;
  activeSession: {
    id: string;
    name: string;
    start_time: string;
    exerciseCount: number;
  } | null;
  handlePress: () => void;
};

export default function TabBar({ isWorkoutActive, activeSession, handlePress }: TabBarProps) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { unreadTotal, displayCount } = useChatBadge();

  return (
    <YStack f={1}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#7c3aed',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 88 : 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="exercises"
          options={{
            title: 'Exercises',
            tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="chat/new"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="programs"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="programs/[programId]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color, size }) => (
              <View style={{ position: 'relative' }}>
                <MoreHorizontal size={size} color={color} />
                {unreadTotal > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -10,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: '#ef4444',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 3,
                    }}
                  >
                    <RNText
                      style={{
                        color: 'white',
                        fontSize: 10,
                        fontWeight: '700',
                      }}
                    >
                      {displayCount}
                    </RNText>
                  </View>
                )}
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();      // stop navigation
              navigation.openDrawer(); // open the drawer
            },
          }}
        />
      </Tabs>

      {isWorkoutActive && activeSession && (
        <ActiveWorkoutBar
          workoutName={activeSession.name}
          startTime={activeSession.start_time}
          exerciseCount={activeSession.exerciseCount ?? 0}
          onPress={handlePress}
        />
      )}
    </YStack>
  );
}
