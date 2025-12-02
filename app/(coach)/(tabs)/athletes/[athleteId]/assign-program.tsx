import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    Search,
    Users
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Spinner, Text, XStack, YStack } from 'tamagui';

interface Program {
  id: string;
  name: string;
  description: string;
  duration: number;
  assignedCount: number;
  status: 'active' | 'draft';
}

export default function AssignProgramPage() {
  const { athleteId } = useLocalSearchParams<{ athleteId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fake program data
      const fakePrograms: Program[] = [
        {
          id: 'prog-1',
          name: '12-Week Powerlifting',
          description: 'Competition prep program focusing on squat, bench, and deadlift.',
          duration: 12,
          assignedCount: 4,
          status: 'active',
        },
        {
          id: 'prog-2',
          name: 'Strength Builder',
          description: 'General strength program for intermediate lifters.',
          duration: 8,
          assignedCount: 3,
          status: 'active',
        },
        {
          id: 'prog-3',
          name: 'Hypertrophy Focus',
          description: 'Muscle building program with high volume training.',
          duration: 8,
          assignedCount: 2,
          status: 'active',
        },
        {
          id: 'prog-4',
          name: 'Olympic Lifting',
          description: 'Snatch and clean & jerk focused program.',
          duration: 16,
          assignedCount: 1,
          status: 'active',
        },
        {
          id: 'prog-5',
          name: 'Beginner Foundations',
          description: 'Introduction to strength training for new lifters.',
          duration: 6,
          assignedCount: 0,
          status: 'draft',
        },
      ];
      
      setPrograms(fakePrograms);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSelectProgram = (programId: string) => {
    setSelectedProgramId(programId === selectedProgramId ? null : programId);
  };

  const handleAssignProgram = async () => {
    if (!selectedProgramId) {
      Alert.alert('No Program Selected', 'Please select a program to assign.');
      return;
    }

    const selectedProgram = programs.find(p => p.id === selectedProgramId);
    
    setAssigning(true);
    try {
      // In production, call service to assign program
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Program Assigned',
        `${selectedProgram?.name} has been assigned to this athlete.`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error assigning program:', error);
      Alert.alert('Error', 'Failed to assign program. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const handleCreateProgram = () => {
    router.push('/(coach)/(tabs)/programs/create');
  };

  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePrograms = filteredPrograms.filter(p => p.status === 'active');

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading programs...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1}>
        {/* Header */}
        <YStack p="$4" backgroundColor="#f5f5f5" gap="$3">
          <XStack ai="center" gap="$3">
            <Pressable onPress={handleBack}>
              <ArrowLeft size={24} color="#6b7280" />
            </Pressable>
            <Text fontSize={24} fontWeight="700" color="$gray12">
              Assign Program
            </Text>
          </XStack>

          {/* Search Bar */}
          <XStack
            ai="center"
            gap="$2"
            backgroundColor="white"
            borderRadius="$4"
            borderWidth={1}
            borderColor="#e5e7eb"
            px="$3"
            py="$2"
          >
            <Search size={20} color="#9ca3af" />
            <Input
              f={1}
              size="$4"
              placeholder="Search programs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              backgroundColor="transparent"
              borderWidth={0}
              focusStyle={{ borderWidth: 0 }}
              placeholderTextColor="#9ca3af"
            />
          </XStack>
        </YStack>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
          }}
        >
          {activePrograms.length === 0 ? (
            <Card elevate size="$4" p="$5" backgroundColor="white">
              <YStack ai="center" gap="$3">
                <Calendar size={48} color="#d1d5db" />
                <YStack ai="center" gap="$1">
                  <Text fontSize="$4" fontWeight="bold" color="$gray12">
                    No Programs Found
                  </Text>
                  <Text fontSize="$3" color="$gray10" textAlign="center">
                    {searchQuery 
                      ? 'Try adjusting your search' 
                      : 'Create a program to get started'}
                  </Text>
                </YStack>
                {!searchQuery && (
                  <Button
                    size="$4"
                    backgroundColor="#7c3aed"
                    color="white"
                    onPress={handleCreateProgram}
                    pressStyle={{ backgroundColor: '#6d28d9' }}
                  >
                    Create Program
                  </Button>
                )}
              </YStack>
            </Card>
          ) : (
            <YStack gap="$3">
              {activePrograms.map((program) => (
                <Pressable 
                  key={program.id} 
                  onPress={() => handleSelectProgram(program.id)}
                >
                  <Card
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor="white"
                    borderWidth={2}
                    borderColor={selectedProgramId === program.id ? '#7c3aed' : 'transparent'}
                    pressStyle={{ opacity: 0.7, scale: 0.98 }}
                  >
                    <XStack ai="flex-start" gap="$3">
                      <YStack f={1} gap="$2">
                        <XStack ai="center" jc="space-between">
                          <Text fontSize="$4" fontWeight="600" color="$gray12">
                            {program.name}
                          </Text>
                          {selectedProgramId === program.id && (
                            <YStack
                              w={24}
                              h={24}
                              borderRadius="$10"
                              backgroundColor="#7c3aed"
                              ai="center"
                              jc="center"
                            >
                              <Check size={16} color="white" />
                            </YStack>
                          )}
                        </XStack>
                        <Text fontSize="$3" color="$gray11" numberOfLines={2}>
                          {program.description}
                        </Text>
                        <XStack gap="$4" mt="$1">
                          <XStack ai="center" gap="$1">
                            <Clock size={14} color="#6b7280" />
                            <Text fontSize="$2" color="$gray10">
                              {program.duration} weeks
                            </Text>
                          </XStack>
                          <XStack ai="center" gap="$1">
                            <Users size={14} color="#6b7280" />
                            <Text fontSize="$2" color="$gray10">
                              {program.assignedCount} athletes
                            </Text>
                          </XStack>
                        </XStack>
                      </YStack>
                    </XStack>
                  </Card>
                </Pressable>
              ))}
            </YStack>
          )}
        </ScrollView>

        {/* Fixed Bottom Button */}
        <YStack 
          position="absolute" 
          bottom={0} 
          left={0} 
          right={0}
          p="$4"
          backgroundColor="white"
          borderTopWidth={1}
          borderTopColor="$gray4"
        >
          <Button
            size="$5"
            backgroundColor="#7c3aed"
            color="white"
            onPress={handleAssignProgram}
            disabled={!selectedProgramId || assigning}
            pressStyle={{ backgroundColor: '#6d28d9' }}
            opacity={!selectedProgramId || assigning ? 0.6 : 1}
          >
            {assigning ? (
              <XStack ai="center" gap="$2">
                <Spinner size="small" color="white" />
                <Text color="white" fontWeight="600">
                  Assigning...
                </Text>
              </XStack>
            ) : (
              'Assign Selected Program'
            )}
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}