import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Copy, Edit3, Trash2, Users } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Progress, Text, XStack, YStack } from 'tamagui';

interface ProgramDetails {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  focus: 'powerlifting' | 'strength' | 'hypertrophy' | 'general';
  assignedAthletes: Array<{
    id: string;
    name: string;
    avatar?: string;
    currentWeek: number;
    compliance: number;
  }>;
  blocks: Array<{
    id: string;
    name: string;
    weeks: string;
    focus: string;
    workouts: number;
  }>;
  stats: {
    totalAssigned: number;
    activeAthletes: number;
    averageCompliance: number;
    completionRate: number;
  };
}

export default function ProgramDetailPage() {
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const router = useRouter();
  
  // Fake program data
  const [program] = useState<ProgramDetails>({
    id: programId as string,
    name: '12-Week Powerlifting',
    description: 'Progressive overload program focused on improving the big 3 lifts with proper periodization and peaking.',
    duration_weeks: 12,
    level: 'intermediate',
    focus: 'powerlifting',
    assignedAthletes: [
      { id: '1', name: 'Sarah Johnson', currentWeek: 4, compliance: 92 },
      { id: '2', name: 'Mike Chen', currentWeek: 8, compliance: 88 },
      { id: '3', name: 'John Smith', currentWeek: 2, compliance: 95 },
    ],
    blocks: [
      { id: '1', name: 'Volume Accumulation', weeks: 'Weeks 1-4', focus: 'High volume, moderate intensity', workouts: 16 },
      { id: '2', name: 'Intensity Phase', weeks: 'Weeks 5-8', focus: 'Reduced volume, increased intensity', workouts: 16 },
      { id: '3', name: 'Peak & Taper', weeks: 'Weeks 9-12', focus: 'Maximum intensity, minimal volume', workouts: 12 },
    ],
    stats: {
      totalAssigned: 8,
      activeAthletes: 3,
      averageCompliance: 91,
      completionRate: 75,
    },
  });

  const handleEditProgram = () => {
    router.push({
      pathname: '/(coach)/(tabs)/programs/edit/[programId]',
      params: { programId: program.id }
    });
  };

  const handleDuplicateProgram = () => {
    Alert.alert(
      'Duplicate Program',
      'Create a copy of this program?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Duplicate',
          onPress: () => {
            console.log('Duplicating program');
            // In production, duplicate program
          }
        },
      ]
    );
  };

  const handleDeleteProgram = () => {
    Alert.alert(
      'Delete Program',
      'Are you sure you want to delete this program? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting program');
            router.back();
          }
        },
      ]
    );
  };

  const handleAssignAthlete = () => {
    console.log('Assign athlete to program');
    // Navigate to athlete selection
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      case 'expert': return '#7c3aed';
      default: return '#6b7280';
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
          <YStack f={1}>
            <Text fontSize={24} fontWeight="700" color="$gray12">
              {program.name}
            </Text>
            <XStack gap="$2" mt="$1">
              <YStack
                backgroundColor={getLevelColor(program.level) + '20'}
                px="$2"
                py="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color={getLevelColor(program.level)} fontWeight="600">
                  {program.level.toUpperCase()}
                </Text>
              </YStack>
              <YStack
                backgroundColor="#7c3aed20"
                px="$2"
                py="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color="#7c3aed" fontWeight="600">
                  {program.focus.toUpperCase()}
                </Text>
              </YStack>
            </XStack>
          </YStack>
        </XStack>

        {/* Action Buttons */}
        <XStack gap="$2">
          <Button
            f={1}
            size="$3"
            backgroundColor="#7c3aed"
            color="white"
            icon={Edit3}
            onPress={handleEditProgram}
          >
            Edit
          </Button>
          <Button
            f={1}
            size="$3"
            backgroundColor="white"
            borderColor="$gray4"
            borderWidth={1}
            color="$gray11"
            icon={Copy}
            onPress={handleDuplicateProgram}
          >
            Duplicate
          </Button>
          <Button
            size="$3"
            backgroundColor="white"
            borderColor="$red9"
            borderWidth={1}
            color="$red9"
            icon={Trash2}
            onPress={handleDeleteProgram}
          >
          </Button>
        </XStack>

        {/* Program Info */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <Text fontSize="$3" color="$gray11">
              {program.description}
            </Text>
            <XStack gap="$4">
              <XStack ai="center" gap="$2">
                <Calendar size={16} color="#7c3aed" />
                <Text fontSize="$3" color="$gray11">
                  {program.duration_weeks} weeks
                </Text>
              </XStack>
              <XStack ai="center" gap="$2">
                <Users size={16} color="#7c3aed" />
                <Text fontSize="$3" color="$gray11">
                  {program.stats.totalAssigned} athletes
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </Card>

        {/* Stats */}
        <XStack gap="$3" flexWrap="wrap">
          <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
            <YStack gap="$1">
              <Text fontSize="$2" color="$gray11">Active Athletes</Text>
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                {program.stats.activeAthletes}
              </Text>
            </YStack>
          </Card>
          <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
            <YStack gap="$1">
              <Text fontSize="$2" color="$gray11">Avg Compliance</Text>
              <Text fontSize="$5" fontWeight="600" color="#10b981">
                {program.stats.averageCompliance}%
              </Text>
            </YStack>
          </Card>
          <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
            <YStack gap="$1">
              <Text fontSize="$2" color="$gray11">Completion Rate</Text>
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                {program.stats.completionRate}%
              </Text>
            </YStack>
          </Card>
          <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
            <YStack gap="$1">
              <Text fontSize="$2" color="$gray11">Total Blocks</Text>
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                {program.blocks.length}
              </Text>
            </YStack>
          </Card>
        </XStack>

        {/* Program Blocks */}
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$gray12">
            Program Structure
          </Text>
          {program.blocks.map((block, index) => (
            <Card
              key={block.id}
              elevate
              size="$4"
              p="$4"
              backgroundColor="white"
              pressStyle={{ scale: 0.98 }}
            >
              <YStack gap="$2">
                <XStack ai="center" jc="space-between">
                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                    {block.name}
                  </Text>
                  <Text fontSize="$2" color="$gray10">
                    {block.weeks}
                  </Text>
                </XStack>
                <Text fontSize="$3" color="$gray11">
                  {block.focus}
                </Text>
                <XStack ai="center" gap="$2">
                  <Clock size={14} color="#6b7280" />
                  <Text fontSize="$2" color="$gray10">
                    {block.workouts} workouts
                  </Text>
                </XStack>
              </YStack>
            </Card>
          ))}
        </YStack>

        {/* Assigned Athletes */}
        <YStack gap="$3">
          <XStack ai="center" jc="space-between">
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              Assigned Athletes
            </Text>
            <Button
              size="$2"
              backgroundColor="#7c3aed"
              color="white"
              onPress={handleAssignAthlete}
            >
              Assign
            </Button>
          </XStack>
          
          {program.assignedAthletes.length === 0 ? (
            <Card elevate size="$4" p="$4" backgroundColor="white">
              <YStack ai="center" gap="$2">
                <Text fontSize="$3" color="$gray11">
                  No athletes assigned to this program
                </Text>
                <Button
                  size="$3"
                  backgroundColor="#7c3aed"
                  color="white"
                  onPress={handleAssignAthlete}
                >
                  Assign Athletes
                </Button>
              </YStack>
            </Card>
          ) : (
            program.assignedAthletes.map((athlete) => (
              <Pressable
                key={athlete.id}
                onPress={() => router.push({
                  pathname: '/(coach)/(tabs)/athletes/[athleteid]',
                  params: { athleteid: athlete.id }
                })}
              >
                <Card
                  elevate
                  size="$4"
                  p="$3"
                  backgroundColor="white"
                  pressStyle={{ scale: 0.98 }}
                >
                  <XStack ai="center" gap="$3">
                    <Avatar circular size="$3">
                      <Avatar.Fallback backgroundColor="$gray5">
                        {athlete.name.split(' ').map(n => n[0]).join('')}
                      </Avatar.Fallback>
                    </Avatar>
                    <YStack f={1} gap="$1">
                      <Text fontSize="$3" fontWeight="600" color="$gray12">
                        {athlete.name}
                      </Text>
                      <XStack ai="center" gap="$2">
                        <Text fontSize="$2" color="$gray11">
                          Week {athlete.currentWeek}/{program.duration_weeks}
                        </Text>
                        <Text fontSize="$2" color="$gray11">•</Text>
                        <Text fontSize="$2" color="#10b981">
                          {athlete.compliance}% compliance
                        </Text>
                      </XStack>
                      <Progress
                        value={(athlete.currentWeek / program.duration_weeks) * 100}
                        backgroundColor="$gray3"
                        h={6}
                      >
                        <Progress.Indicator
                          backgroundColor="#7c3aed"
                          //animation="gentle"
                        />
                      </Progress>
                    </YStack>
                  </XStack>
                </Card>
              </Pressable>
            ))
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}