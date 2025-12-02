import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Copy,
  Link,
  Send,
  Share2,
  UserPlus
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, Share, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Spinner, Text, TextArea, XStack, YStack } from 'tamagui';

export default function InviteAthletePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(
    "Hi! I'd like to invite you to join my coaching program. Let's work together to achieve your fitness goals!"
  );
  const [sending, setSending] = useState(false);
  const [inviteLink] = useState('https://fitcoach.app/invite/abc123xyz');
  const [linkCopied, setLinkCopied] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendInvite = async () => {
    if (!email || !name) {
      Alert.alert('Missing Information', 'Please enter both name and email address.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setSending(true);
    Keyboard.dismiss();
    
    try {
      // In production, send invite through service
      console.log('Sending invite to:', { email, name, message });
      
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Invite Sent!',
        `An invitation has been sent to ${name} at ${email}.`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error sending invite:', error);
      Alert.alert('Error', 'Failed to send invite. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      // In production, use Clipboard API
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Join my coaching program on FitCoach! ${inviteLink}`,
        url: inviteLink,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <XStack ai="center" gap="$3" mb="$4">
            <Pressable onPress={handleBack}>
              <ArrowLeft size={24} color="#6b7280" />
            </Pressable>
            <Text fontSize={24} fontWeight="700" color="$gray12">
              Invite Athlete
            </Text>
          </XStack>

          {/* Invite Form Card */}
          <Card elevate size="$4" p="$4" backgroundColor="white" mb="$4">
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
                  Send Email Invitation
                </Text>
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  Enter the athlete&apos;s details to send them an invite
                </Text>
              </YStack>

              {/* Name Input */}
              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500" color="$gray12">
                  Athlete&apos;s Name
                </Text>
                <Input
                  size="$4"
                  placeholder="Enter full name"
                  value={name}
                  onChangeText={setName}
                  backgroundColor="$gray1"
                  borderColor="$gray4"
                  focusStyle={{ borderColor: '#7c3aed' }}
                  autoCapitalize="words"
                  editable={!sending}
                />
              </YStack>

              {/* Email Input */}
              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500" color="$gray12">
                  Email Address
                </Text>
                <XStack ai="center" gap="$2">
                  <Input
                    f={1}
                    size="$4"
                    placeholder="athlete@example.com"
                    value={email}
                    onChangeText={setEmail}
                    backgroundColor="$gray1"
                    borderColor="$gray4"
                    focusStyle={{ borderColor: '#7c3aed' }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!sending}
                  />
                </XStack>
              </YStack>

              {/* Custom Message */}
              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500" color="$gray12">
                  Personal Message (Optional)
                </Text>
                <TextArea
                  size="$4"
                  placeholder="Add a personal message..."
                  value={message}
                  onChangeText={setMessage}
                  backgroundColor="$gray1"
                  borderColor="$gray4"
                  focusStyle={{ borderColor: '#7c3aed' }}
                  numberOfLines={4}
                  editable={!sending}
                />
              </YStack>

              {/* Send Button */}
              <Button
                size="$5"
                backgroundColor="#7c3aed"
                color="white"
                onPress={handleSendInvite}
                disabled={sending || !email || !name}
                pressStyle={{ backgroundColor: '#6d28d9' }}
                opacity={sending || !email || !name ? 0.6 : 1}
                icon={sending ? undefined : Send}
              >
                {sending ? (
                  <XStack ai="center" gap="$2">
                    <Spinner size="small" color="white" />
                    <Text color="white" fontWeight="600">
                      Sending...
                    </Text>
                  </XStack>
                ) : (
                  'Send Invitation'
                )}
              </Button>
            </YStack>
          </Card>

          {/* Divider */}
          <XStack ai="center" gap="$3" my="$2">
            <YStack f={1} h={1} backgroundColor="$gray4" />
            <Text fontSize="$3" color="$gray10">
              or
            </Text>
            <YStack f={1} h={1} backgroundColor="$gray4" />
          </XStack>

          {/* Share Link Card */}
          <Card elevate size="$4" p="$4" backgroundColor="white">
            <YStack gap="$4">
              <YStack ai="center" gap="$2">
                <YStack
                  w={60}
                  h={60}
                  borderRadius="$10"
                  backgroundColor="#f0fdf4"
                  ai="center"
                  jc="center"
                >
                  <Link size={32} color="#10b981" />
                </YStack>
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  Share Invite Link
                </Text>
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  Share this link directly with athletes
                </Text>
              </YStack>

              {/* Link Display */}
              <XStack
                backgroundColor="$gray2"
                borderRadius="$3"
                p="$3"
                ai="center"
                gap="$2"
              >
                <Text 
                  f={1} 
                  fontSize="$3" 
                  color="$gray11"
                  numberOfLines={1}
                >
                  {inviteLink}
                </Text>
              </XStack>

              {/* Action Buttons */}
              <XStack gap="$3">
                <Button
                  f={1}
                  size="$4"
                  backgroundColor={linkCopied ? '#10b981' : 'white'}
                  borderColor={linkCopied ? '#10b981' : '$gray4'}
                  borderWidth={1}
                  color={linkCopied ? 'white' : '$gray11'}
                  icon={linkCopied ? Check : Copy}
                  onPress={handleCopyLink}
                  pressStyle={{ backgroundColor: linkCopied ? '#059669' : '$gray2' }}
                >
                  {linkCopied ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button
                  f={1}
                  size="$4"
                  backgroundColor="#7c3aed"
                  color="white"
                  icon={Share2}
                  onPress={handleShareLink}
                  pressStyle={{ backgroundColor: '#6d28d9' }}
                >
                  Share
                </Button>
              </XStack>
            </YStack>
          </Card>

          {/* Info Text */}
          <YStack mt="$4" px="$2">
            <Text fontSize="$2" color="$gray10" textAlign="center">
              Athletes will receive instructions to download the app and create an account. 
              Once they sign up, they&apos;ll automatically be added to your roster.
            </Text>
          </YStack>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}