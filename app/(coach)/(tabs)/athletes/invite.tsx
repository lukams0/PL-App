import { useRouter } from 'expo-router';
import { ArrowLeft, Send, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, TextArea, XStack, YStack } from 'tamagui';

export default function InviteAthletePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(
    "Hi! I'd like to invite you to join my coaching program. Let's work together to achieve your fitness goals!"
  );
  const [sending, setSending] = useState(false);

  const handleSendInvite = async () => {
    if (!email || !name) return;

    setSending(true);
    try {
      // In production, send invite through service
      console.log('Sending invite to:', { email, name, message });
      
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate back to athletes page
      router.back();
    } catch (error) {
      console.error('Error sending invite:', error);
    } finally {
      setSending(false);
    }
  };

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
            Invite Athlete
          </Text>
        </XStack>

        {/* Invite Form */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$4">
            <YStack ai="center" gap="$2">
              <YStack
                w={60}
                h={60}
                borderRadius="$10"
                backgroundColor="#faf5ff"
                ai="center"
                jc="center"
              >
                <UserPlus size={32} color="#7c3aed" />
              </YStack>
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Send Coaching Invitation
              </Text>
              <Text fontSize="$3" color="$gray11" textAlign="center">
                Invite a new athlete to join your coaching program
              </Text>
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$3" color="$gray11">
                Athlete's Name *
              </Text>
              <Input
                size="$4"
                placeholder="John Smith"
                value={name}
                onChangeText={setName}
                backgroundColor="$gray2"
                borderColor="$gray4"
                placeholderTextColor="$gray9"
                focusStyle={{ borderColor: '#7c3aed' }}
              />
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$3" color="$gray11">
                Email Address *
              </Text>
              <Input
                size="$4"
                placeholder="athlete@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                backgroundColor="$gray2"
                borderColor="$gray4"
                placeholderTextColor="$gray9"
                focusStyle={{ borderColor: '#7c3aed' }}
              />
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$3" color="$gray11">
                Personal Message
              </Text>
              <TextArea
                size="$4"
                placeholder="Add a personal message..."
                value={message}
                onChangeText={setMessage}
                backgroundColor="$gray2"
                borderColor="$gray4"
                placeholderTextColor="$gray9"
                focusStyle={{ borderColor: '#7c3aed' }}
                numberOfLines={4}
                minHeight={100}
              />
            </YStack>
          </YStack>
        </Card>

        {/* Pricing Info */}
        <Card elevate size="$4" p="$4" backgroundColor="#faf5ff">
          <YStack gap="$2">
            <Text fontSize="$4" fontWeight="600" color="$gray12">
              Program Details
            </Text>
            <XStack jc="space-between">
              <Text fontSize="$3" color="$gray11">
                Monthly Rate:
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$gray12">
                $150/month
              </Text>
            </XStack>
            <XStack jc="space-between">
              <Text fontSize="$3" color="$gray11">
                Commitment:
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$gray12">
                Month-to-month
              </Text>
            </XStack>
            <XStack jc="space-between">
              <Text fontSize="$3" color="$gray11">
                Format:
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$gray12">
                Online & In-Person
              </Text>
            </XStack>
          </YStack>
        </Card>

        {/* What Happens Next */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <Text fontSize="$4" fontWeight="600" color="$gray12">
              What Happens Next?
            </Text>
            <YStack gap="$2">
              <XStack gap="$2">
                <Text fontSize="$3" color="#7c3aed">1.</Text>
                <Text fontSize="$3" color="$gray11">
                  The athlete receives an email invitation
                </Text>
              </XStack>
              <XStack gap="$2">
                <Text fontSize="$3" color="#7c3aed">2.</Text>
                <Text fontSize="$3" color="$gray11">
                  They create an account and complete onboarding
                </Text>
              </XStack>
              <XStack gap="$2">
                <Text fontSize="$3" color="#7c3aed">3.</Text>
                <Text fontSize="$3" color="$gray11">
                  You'll be notified when they join
                </Text>
              </XStack>
              <XStack gap="$2">
                <Text fontSize="$3" color="#7c3aed">4.</Text>
                <Text fontSize="$3" color="$gray11">
                  Assign them a program to get started
                </Text>
              </XStack>
            </YStack>
          </YStack>
        </Card>

        {/* Action Buttons */}
        <YStack gap="$3">
          <Button
            size="$4"
            backgroundColor="#7c3aed"
            color="white"
            fontWeight="600"
            icon={sending ? undefined : Send}
            disabled={!email || !name || sending}
            opacity={!email || !name || sending ? 0.5 : 1}
            onPress={handleSendInvite}
          >
            {sending ? 'Sending Invitation...' : 'Send Invitation'}
          </Button>

          <Button
            size="$4"
            backgroundColor="white"
            borderColor="$gray4"
            borderWidth={1}
            color="$gray11"
            fontWeight="600"
            onPress={() => router.back()}
            disabled={sending}
          >
            Cancel
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}