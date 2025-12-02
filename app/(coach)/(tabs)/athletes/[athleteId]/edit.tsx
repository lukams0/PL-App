import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Input, Spinner, Text, TextArea, XStack, YStack } from 'tamagui';

interface AthleteData {
  name: string;
  email: string;
  age: string;
  weight: string;
  height: string;
  goals: string;
  notes: string;
}

export default function EditAthletePage() {
  const { athleteId } = useLocalSearchParams<{ athleteId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [athlete, setAthlete] = useState<AthleteData>({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    goals: '',
    notes: '',
  });

  useEffect(() => {
    loadAthleteData();
  }, [athleteId]);

  const loadAthleteData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fake data - in production, fetch from service
      setAthlete({
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        age: '28',
        weight: '145',
        height: '66',
        goals: 'Build Strength, Improve Form, Compete',
        notes: 'Focus on squat depth and bracing. Has some knee sensitivity.',
      });
    } catch (error) {
      console.error('Error loading athlete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!athlete.name.trim()) {
      Alert.alert('Missing Name', 'Please enter the athlete\'s name.');
      return;
    }

    setSaving(true);
    Keyboard.dismiss();
    
    try {
      // In production, save to service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Changes Saved',
        'Athlete information has been updated.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving athlete:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof AthleteData, value: string) => {
    setAthlete(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading athlete data...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
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
          <XStack ai="center" jc="space-between" mb="$4">
            <XStack ai="center" gap="$3">
              <Pressable onPress={handleBack}>
                <ArrowLeft size={24} color="#6b7280" />
              </Pressable>
              <Text fontSize={24} fontWeight="700" color="$gray12">
                Edit Athlete
              </Text>
            </XStack>
            <Button
              size="$3"
              backgroundColor="#7c3aed"
              color="white"
              icon={Save}
              onPress={handleSave}
              disabled={saving}
              pressStyle={{ backgroundColor: '#6d28d9' }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </XStack>

          {/* Avatar */}
          <YStack ai="center" mb="$4">
            <Avatar circular size="$8">
              <Avatar.Fallback backgroundColor="#7c3aed">
                <Text fontSize="$8" fontWeight="bold" color="white">
                  {athlete.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </Avatar.Fallback>
            </Avatar>
            <Button
              size="$3"
              chromeless
              mt="$2"
              onPress={() => {
                // In production, open image picker
                Alert.alert('Coming Soon', 'Photo upload will be available soon.');
              }}
            >
              <Text color="#7c3aed" fontWeight="500">
                Change Photo
              </Text>
            </Button>
          </YStack>

          {/* Basic Info */}
          <Card elevate size="$4" p="$4" backgroundColor="white" mb="$4">
            <YStack gap="$4">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Basic Information
              </Text>

              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500" color="$gray12">
                  Full Name
                </Text>
                <Input
                  size="$4"
                  placeholder="Enter full name"
                  value={athlete.name}
                  onChangeText={(v) => updateField('name', v)}
                  backgroundColor="$gray1"
                  borderColor="$gray4"
                  focusStyle={{ borderColor: '#7c3aed' }}
                  autoCapitalize="words"
                  editable={!saving}
                />
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500" color="$gray12">
                  Email
                </Text>
                <Input
                  size="$4"
                  placeholder="athlete@example.com"
                  value={athlete.email}
                  onChangeText={(v) => updateField('email', v)}
                  backgroundColor="$gray1"
                  borderColor="$gray4"
                  focusStyle={{ borderColor: '#7c3aed' }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!saving}
                />
              </YStack>
            </YStack>
          </Card>

          {/* Physical Info */}
          <Card elevate size="$4" p="$4" backgroundColor="white" mb="$4">
            <YStack gap="$4">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Physical Information
              </Text>

              <XStack gap="$3">
                <YStack gap="$2" f={1}>
                  <Text fontSize="$3" fontWeight="500" color="$gray12">
                    Age
                  </Text>
                  <Input
                    size="$4"
                    placeholder="Years"
                    value={athlete.age}
                    onChangeText={(v) => updateField('age', v)}
                    backgroundColor="$gray1"
                    borderColor="$gray4"
                    focusStyle={{ borderColor: '#7c3aed' }}
                    keyboardType="number-pad"
                    editable={!saving}
                  />
                </YStack>

                <YStack gap="$2" f={1}>
                  <Text fontSize="$3" fontWeight="500" color="$gray12">
                    Weight (lbs)
                  </Text>
                  <Input
                    size="$4"
                    placeholder="lbs"
                    value={athlete.weight}
                    onChangeText={(v) => updateField('weight', v)}
                    backgroundColor="$gray1"
                    borderColor="$gray4"
                    focusStyle={{ borderColor: '#7c3aed' }}
                    keyboardType="number-pad"
                    editable={!saving}
                  />
                </YStack>

                <YStack gap="$2" f={1}>
                  <Text fontSize="$3" fontWeight="500" color="$gray12">
                    Height (in)
                  </Text>
                  <Input
                    size="$4"
                    placeholder="inches"
                    value={athlete.height}
                    onChangeText={(v) => updateField('height', v)}
                    backgroundColor="$gray1"
                    borderColor="$gray4"
                    focusStyle={{ borderColor: '#7c3aed' }}
                    keyboardType="number-pad"
                    editable={!saving}
                  />
                </YStack>
              </XStack>
            </YStack>
          </Card>

          {/* Goals & Notes */}
          <Card elevate size="$4" p="$4" backgroundColor="white">
            <YStack gap="$4">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Goals & Notes
              </Text>

              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500" color="$gray12">
                  Goals
                </Text>
                <TextArea
                  size="$4"
                  placeholder="Enter athlete's goals (comma separated)"
                  value={athlete.goals}
                  onChangeText={(v) => updateField('goals', v)}
                  backgroundColor="$gray1"
                  borderColor="$gray4"
                  focusStyle={{ borderColor: '#7c3aed' }}
                  numberOfLines={3}
                  editable={!saving}
                />
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500" color="$gray12">
                  Coaching Notes
                </Text>
                <TextArea
                  size="$4"
                  placeholder="Add notes about this athlete..."
                  value={athlete.notes}
                  onChangeText={(v) => updateField('notes', v)}
                  backgroundColor="$gray1"
                  borderColor="$gray4"
                  focusStyle={{ borderColor: '#7c3aed' }}
                  numberOfLines={4}
                  editable={!saving}
                />
              </YStack>
            </YStack>
          </Card>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}