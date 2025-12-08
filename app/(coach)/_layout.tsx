// app/(coach)/_layout.tsx
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { BarChart3, Home, MessageSquare, Settings, Users } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const pathname = usePathname();
  
  return (
    <DrawerContentScrollView {...props}>
      {/* Coach Profile Header */}
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <YStack gap="$2">
          <XStack 
            w={60} 
            h={60} 
            borderRadius="$10" 
            backgroundColor="#7c3aed"
            ai="center"
            jc="center"
          >
            <Text fontSize="$8" fontWeight="bold" color="white">
              C
            </Text>
          </XStack>
          <Text fontSize="$5" fontWeight="bold" color="$gray12">
            Coach Dashboard
          </Text>
          <Text fontSize="$3" color="$gray10">
            Manage your athletes
          </Text>
        </YStack>
      </View>

      {/* Navigation Items */}
      <View style={{ flex: 1, paddingTop: 10 }}>
        <DrawerItem
          label="Dashboard"
          onPress={() => router.push('/(coach)/(tabs)')}
          activeTintColor="#7c3aed"
          inactiveTintColor="#6b7280"
          icon={({ color, size }) => <Home size={size} color={color} />}
          focused={pathname === '/(tabs)' || pathname === '/(coach)/(tabs)'}
        />
        <DrawerItem
          label="Athletes"
          onPress={() => router.push('/(coach)/(tabs)/athletes')}
          activeTintColor="#7c3aed"
          inactiveTintColor="#6b7280"
          icon={({ color, size }) => <Users size={size} color={color} />}
          focused={pathname?.includes('/athletes') ?? false}
        />
        <DrawerItem
          label="Programs"
          onPress={() => router.push('/(coach)/(tabs)/programs')}
          activeTintColor="#7c3aed"
          inactiveTintColor="#6b7280"
          icon={({ color, size }) => <BarChart3 size={size} color={color} />}
          focused={pathname?.includes('/programs') ?? false}
        />
        <DrawerItem
          label="Messages"
          onPress={() => router.push('/(coach)/(tabs)/chat')}
          activeTintColor="#7c3aed"
          inactiveTintColor="#6b7280"
          icon={({ color, size }) => <MessageSquare size={size} color={color} />}
          focused={pathname?.includes('/chat') ?? false}
        />
        <DrawerItem
          label="Settings"
          onPress={() => router.push('/(coach)/(tabs)/settings')}
          activeTintColor="#7c3aed"
          inactiveTintColor="#6b7280"
          icon={({ color, size }) => <Settings size={size} color={color} />}
          focused={pathname?.includes('/settings') ?? false}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function CoachLayout() {
  return (
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
          drawerLabel: 'Dashboard',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          headerShown: false,
        }}
      />
    </Drawer>
  );
}