import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, Calendar, DollarSign, Globe, Lock, Moon, Smartphone, User } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Separator, Switch, Text, XStack, YStack } from "tamagui";

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  
  // Settings state
  const [notifications, setNotifications] = useState({
    newAthlete: true,
    workoutCompleted: true,
    prAchieved: true,
    lowCompliance: false,
    messages: true,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    showEmail: false,
    allowAthleteSearch: true,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactView: false,
    autoAcceptAthletes: false,
    weekStartsMonday: true,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onValueChange 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <XStack ai="center" jc="space-between" py="$3">
      <XStack ai="center" gap="$3" f={1}>
        {icon}
        <YStack f={1} gap="$0.5">
          <Text fontSize="$3" fontWeight="500" color="$gray12">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="$2" color="$gray11">
              {subtitle}
            </Text>
          )}
        </YStack>
      </XStack>
      <Switch
        size="$3"
        checked={value}
        onCheckedChange={onValueChange}
      />
    </XStack>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 20,
          gap: 16,
        }}
      >
        {/* Header */}
        <XStack ai="center" gap="$3">
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color="#6b7280" />
          </Pressable>
          <Text fontSize={24} fontWeight="700" color="$gray12">
            Settings
          </Text>
        </XStack>

        {/* Coaching Settings */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$gray12" mb="$2">
              Coaching Settings
            </Text>
            
            <XStack ai="center" jc="space-between" py="$3">
              <XStack ai="center" gap="$3" f={1}>
                <DollarSign size={20} color="#7c3aed" />
                <YStack f={1} gap="$0.5">
                  <Text fontSize="$3" fontWeight="500" color="$gray12">
                    Monthly Rate
                  </Text>
                  <Text fontSize="$2" color="$gray11">
                    $150/month
                  </Text>
                </YStack>
              </XStack>
              <Button size="$2" backgroundColor="$gray2" color="$gray11">
                Edit
              </Button>
            </XStack>

            <Separator />

            <XStack ai="center" jc="space-between" py="$3">
              <XStack ai="center" gap="$3" f={1}>
                <User size={20} color="#7c3aed" />
                <YStack f={1} gap="$0.5">
                  <Text fontSize="$3" fontWeight="500" color="$gray12">
                    Max Athletes
                  </Text>
                  <Text fontSize="$2" color="$gray11">
                    20 athletes maximum
                  </Text>
                </YStack>
              </XStack>
              <Button size="$2" backgroundColor="$gray2" color="$gray11">
                Edit
              </Button>
            </XStack>

            <Separator />

            <SettingItem
              icon={<Globe size={20} color="#7c3aed" />}
              title="Accepting New Athletes"
              subtitle="Allow new athletes to request coaching"
              value={preferences.autoAcceptAthletes}
              onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, autoAcceptAthletes: value }))
              }
            />
          </YStack>
        </Card>

        {/* Notifications */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$2">
            <XStack ai="center" gap="$2" mb="$2">
              <Bell size={20} color="#7c3aed" />
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Notifications
              </Text>
            </XStack>

            <SettingItem
              icon={<User size={18} color="#6b7280" />}
              title="New Athlete Requests"
              value={notifications.newAthlete}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, newAthlete: value }))
              }
            />

            <Separator />

            <SettingItem
              icon={<CheckCircle size={18} color="#6b7280" />}
              title="Workout Completed"
              value={notifications.workoutCompleted}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, workoutCompleted: value }))
              }
            />

            <Separator />

            <SettingItem
              icon={<Award size={18} color="#6b7280" />}
              title="PR Achieved"
              value={notifications.prAchieved}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, prAchieved: value }))
              }
            />

            <Separator />

            <SettingItem
              icon={<TrendingDown size={18} color="#6b7280" />}
              title="Low Compliance Alert"
              subtitle="When athlete misses multiple workouts"
              value={notifications.lowCompliance}
              onValueChange={(value) => 
                setNotifications(prev => ({ ...prev, lowCompliance: value }))
              }
            />
          </YStack>
        </Card>

        {/* Privacy */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$2">
            <XStack ai="center" gap="$2" mb="$2">
              <Lock size={20} color="#7c3aed" />
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Privacy
              </Text>
            </XStack>

            <SettingItem
              icon={<Globe size={18} color="#6b7280" />}
              title="Public Coach Profile"
              subtitle="Allow anyone to view your coach profile"
              value={privacy.publicProfile}
              onValueChange={(value) => 
                setPrivacy(prev => ({ ...prev, publicProfile: value }))
              }
            />

            <Separator />

            <SettingItem
              icon={<Mail size={18} color="#6b7280" />}
              title="Show Email"
              subtitle="Display email on public profile"
              value={privacy.showEmail}
              onValueChange={(value) => 
                setPrivacy(prev => ({ ...prev, showEmail: value }))
              }
            />

            <Separator />

            <SettingItem
              icon={<Search size={18} color="#6b7280" />}
              title="Discoverable"
              subtitle="Allow athletes to find you in coach search"
              value={privacy.allowAthleteSearch}
              onValueChange={(value) => 
                setPrivacy(prev => ({ ...prev, allowAthleteSearch: value }))
              }
            />
          </YStack>
        </Card>

        {/* Preferences */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$2">
            <XStack ai="center" gap="$2" mb="$2">
              <Smartphone size={20} color="#7c3aed" />
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Preferences
              </Text>
            </XStack>

            <SettingItem
              icon={<Moon size={18} color="#6b7280" />}
              title="Dark Mode"
              value={preferences.darkMode}
              onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, darkMode: value }))
              }
            />

            <Separator />

            <SettingItem
              icon={<Calendar size={18} color="#6b7280" />}
              title="Week Starts Monday"
              value={preferences.weekStartsMonday}
              onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, weekStartsMonday: value }))
              }
            />
          </YStack>
        </Card>

        {/* Account Actions */}
        <YStack gap="$3">
          <Button
            size="$4"
            backgroundColor="white"
            borderColor="$gray4"
            borderWidth={1}
            color="$gray11"
            fontWeight="600"
          >
            Export Data
          </Button>

          <Button
            size="$4"
            backgroundColor="white"
            borderColor="$red9"
            borderWidth={1}
            color="$red9"
            fontWeight="600"
            onPress={handleSignOut}
          >
            Sign Out
          </Button>

          <Button
            size="$4"
            backgroundColor="white"
            borderColor="$red9"
            borderWidth={1}
            color="$red9"
            fontWeight="600"
            opacity={0.6}
            disabled
          >
            Delete Account
          </Button>
        </YStack>

        {/* Version Info */}
        <YStack ai="center" py="$4">
          <Text fontSize="$2" color="$gray10">
            Version 1.0.0
          </Text>
          <Text fontSize="$2" color="$gray10">
            © 2024 Strength Coach Pro
          </Text>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

// Add missing imports
import { Award, CheckCircle, Mail, Search, TrendingDown } from "lucide-react-native";
