import { ArrowLeft, ExternalLink, FileText, Mail, MessageCircle, Shield } from "lucide-react-native";
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, XStack, YStack } from "tamagui";
import HelpSupportComponent from "./HelpSupportComponent";

type HelpProps = {
    handleBack: () => void;
    handleContactSupport: () => void;
    handleOpenFAQ: () => void;
    handleOpenTerms: () => void;
    handleOpenPrivacy: () => void;
}

export default function HelpComponent({ 
    handleBack,
    handleContactSupport,
    handleOpenFAQ,
    handleOpenPrivacy,
    handleOpenTerms
} : HelpProps) {
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
                        Help & Support
                    </Text>
                </XStack>

                <ScrollView>
                    <YStack p="$4" gap="$4">
                        {/* Get Help Section */}
                        <YStack gap="$2">
                            <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                                GET HELP
                            </Text>
                            <YStack gap="$3">
                                <HelpSupportComponent
                                    icon={MessageCircle}
                                    title="Live Chat"
                                    description="Chat with our support team"
                                    onPress={() => console.log('Open chat')}
                                />
                                <HelpSupportComponent
                                    icon={Mail}
                                    title="Email Support"
                                    description="Send us an email"
                                    onPress={handleContactSupport}
                                />
                                <HelpSupportComponent
                                    icon={FileText}
                                    title="FAQ"
                                    description="Find answers to common questions"
                                    onPress={handleOpenFAQ}
                                />
                            </YStack>
                        </YStack>

                        {/* Legal Section */}
                        <YStack gap="$2">
                            <Text fontSize="$3" fontWeight="600" color="$gray11" px="$2">
                                LEGAL
                            </Text>
                            <YStack gap="$3">
                                <Card
                                    elevate
                                    size="$4"
                                    p="$4"
                                    backgroundColor="white"
                                    pressStyle={{ opacity: 0.7, scale: 0.98 }}
                                    onPress={handleOpenTerms}
                                >
                                    <XStack ai="center" jc="space-between">
                                        <XStack ai="center" gap="$3">
                                            <FileText size={20} color="#7c3aed" />
                                            <Text fontSize="$4" fontWeight="500" color="$gray12">
                                                Terms of Service
                                            </Text>
                                        </XStack>
                                        <ExternalLink size={18} color="#9ca3af" />
                                    </XStack>
                                </Card>

                                <Card
                                    elevate
                                    size="$4"
                                    p="$4"
                                    backgroundColor="white"
                                    pressStyle={{ opacity: 0.7, scale: 0.98 }}
                                    onPress={handleOpenPrivacy}
                                >
                                    <XStack ai="center" jc="space-between">
                                        <XStack ai="center" gap="$3">
                                            <Shield size={20} color="#7c3aed" />
                                            <Text fontSize="$4" fontWeight="500" color="$gray12">
                                                Privacy Policy
                                            </Text>
                                        </XStack>
                                        <ExternalLink size={18} color="#9ca3af" />
                                    </XStack>
                                </Card>
                            </YStack>
                        </YStack>

                        {/* App Info */}
                        <Card elevate size="$4" p="$4" backgroundColor="white">
                            <YStack gap="$3" ai="center">
                                <Text fontSize="$6" fontWeight="bold" color="$gray12">
                                    PowerLift Pro
                                </Text>
                                <Text fontSize="$3" color="$gray10">
                                    Version 1.0.0
                                </Text>
                                <Text fontSize="$2" color="$gray9" textAlign="center">
                                    © 2025 PowerLift Pro. All rights reserved.
                                </Text>
                            </YStack>
                        </Card>
                    </YStack>
                </ScrollView>
            </YStack>
        </SafeAreaView>
    );
}