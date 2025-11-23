import { router } from "expo-router";
import { ArrowLeft, Globe, HelpCircle, Lock, LogOut, Ruler, Scale, User } from "lucide-react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Separator, Text, XStack, YStack } from "tamagui";
import SettingRow from "./SettingRow";

type SettingsModalProps = {
    handleBack: () => void;
    handleLogout: () => void;
    loading: boolean;
}

export default function SettingsModalComponent({
    handleBack,
    handleLogout,
    loading,
} : SettingsModalProps) {
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <XStack
          backgroundColor="#f5f5f5"
          p="$4"
          ai="center"
          gap="$3"
        >
          <Button
            size="$3"
            chromeless
            onPress={handleBack}
            pressStyle={{ opacity: 0.7 }}
          >
            <ArrowLeft size={24} color="#6b7280" />
          </Button>
          <Text fontSize="$7" fontWeight="bold" color="$gray12">
            Settings
          </Text>
        </XStack>

        <ScrollView>
          <YStack p="$4" gap="$4">
            {/* Account Section */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                ACCOUNT
              </Text>
              <Card elevate backgroundColor="white" overflow="hidden">
                <YStack>
                  <SettingRow
                    icon={User}
                    title="Profile Information"
                    value="Name, email, and more"
                    onPress={() => router.push('../../settings/profile')}
                  />
                  <Separator />
                  <SettingRow
                    icon={Lock}
                    title="Password & Security"
                    value="Change your password"
                    onPress={() => router.push('../../settings/security')}
                  />
                </YStack>
              </Card>
            </YStack>

            {/* Preferences Section */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                PREFERENCES
              </Text>
              <Card elevate backgroundColor="white" overflow="hidden">
                <YStack>
                  {/* <SettingRow
                    icon={Bell}
                    title="Notifications"
                    showArrow={false}
                    rightElement={
                      <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                        thumbColor={notificationsEnabled ? '#7c3aed' : '#f3f4f6'}
                      />
                    }
                  /> */}
                  <Separator />
                  {/* <SettingRow
                    icon={Moon}
                    title="Dark Mode"
                    showArrow={false}
                    rightElement={
                      <Switch
                        value={darkModeEnabled}
                        onValueChange={setDarkModeEnabled}
                        trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
                        thumbColor={darkModeEnabled ? '#7c3aed' : '#f3f4f6'}
                      />
                    }
                  /> */}
                  <Separator />
                  <SettingRow
                    icon={Globe}
                    title="Language"
                    value="English"
                    onPress={() => console.log('Language')}
                  />
                </YStack>
              </Card>
            </YStack>

            {/* Units Section */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                UNITS
              </Text>
              <Card elevate backgroundColor="white" overflow="hidden">
                <YStack>
                  <SettingRow
                    icon={Scale}
                    title="Weight Units"
                    value="Select lbs or kg"
                    onPress={() => router.push('../../settings/units')}
                  />
                  <Separator />
                  <SettingRow
                    icon={Ruler}
                    title="Distance Units"
                    value="Select (ft/in) or (cm/m)"
                    onPress={() => router.push('../../settings/units')}
                  />
                </YStack>
              </Card>
            </YStack>

            {/* Support Section */}
            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                SUPPORT
              </Text>
              <Card elevate backgroundColor="white" overflow="hidden">
                <YStack>
                  <SettingRow
                    icon={HelpCircle}
                    title="Help & Support"
                    onPress={() => router.push('../../settings/help')}
                  />
                  <Separator />
                  <XStack
                    ai="center"
                    jc="space-between"
                    py="$4"
                    px="$4"
                  >
                    <XStack ai="center" gap="$3">
                      <Text fontSize="$4" color="$gray11" fontWeight="500">
                        Version
                      </Text>
                    </XStack>
                    <Text fontSize="$4" color="$gray10">
                      1.0.0
                    </Text>
                  </XStack>
                </YStack>
              </Card>
            </YStack>

            {/* Logout Button */}
            <Button
              size="$5"
              backgroundColor="white"
              borderColor="#fee2e2"
              borderWidth={2}
              onPress={handleLogout}
              disabled={loading}
              opacity={loading ? 0.5 : 1}
              pressStyle={{ backgroundColor: '#fef2f2' }}
              mt="$2"
            >
              <XStack ai="center" gap="$2">
                <LogOut size={20} color="#ef4444" />
                <Text fontSize="$5" fontWeight="600" color="#ef4444">
                  {loading ? 'Logging Out...' : 'Log Out'}
                </Text>
              </XStack>
            </Button>

            {/* Bottom Spacing */}
            <YStack h={40} />
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}