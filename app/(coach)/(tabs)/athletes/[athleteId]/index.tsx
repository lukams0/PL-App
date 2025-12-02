import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  Award,
  Calendar,
  ChevronRight,
  Clock,
  Dumbbell,
  Edit,
  MessageCircle,
  Target,
  Trash2,
  User
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Progress, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

interface AthleteDetail {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  age?: number;
  weight?: number;
  height?: number;
  goals?: string[];
  currentProgram?: {
    id: string;
    name: string;
    weekNumber: number;
    totalWeeks: number;
    startDate: string;
  };
  stats: {
    totalWorkouts: number;
    weeklyAverage: number;
    totalVolume: string;
    avgSessionDuration: number;
    complianceRate: number;
    currentStreak: number;
  };
  recentWorkouts: Array<{
    id: string;
    name: string;
    date: string;
    duration: number;
    exercises: number;
    volume: string;
  }>;
  personalRecords: Array<{
    exercise: string;
    weight: number;
    reps: number;
    date: string;
  }>;
}

export default function AthleteDetailPage() {
  const { athleteId } = useLocalSearchParams<{ athleteId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [athlete, setAthlete] = useState<AthleteDetail | null>(null);

  useEffect(() => {
    loadAthleteData();
  }, [athleteId]);

  const loadAthleteData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Fake data for now
      const fakeAthlete: AthleteDetail = {
        id: athleteId as string,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        joinedDate: 'Jan 15, 2024',
        age: 28,
        weight: 145,
        height: 66,
        goals: ['Build Strength', 'Improve Form', 'Compete'],
        currentProgram: {
          id: 'prog-1',
          name: '12-Week Powerlifting',
          weekNumber: 4,
          totalWeeks: 12,
          startDate: 'Feb 1, 2024',
        },
        stats: {
          totalWorkouts: 48,
          weeklyAverage: 4.2,
          totalVolume: '125,450 lbs',
          avgSessionDuration: 65,
          complianceRate: 92,
          currentStreak: 12,
        },
        recentWorkouts: [
          {
            id: 'w1',
            name: 'Upper Power',
            date: 'Today',
            duration: 72,
            exercises: 6,
            volume: '15,230 lbs',
          },
          {
            id: 'w2',
            name: 'Lower Volume',
            date: 'Yesterday',
            duration: 68,
            exercises: 5,
            volume: '18,450 lbs',
          },
          {
            id: 'w3',
            name: 'Upper Volume',
            date: '3 days ago',
            duration: 65,
            exercises: 7,
            volume: '12,890 lbs',
          },
        ],
        personalRecords: [
          { exercise: 'Squat', weight: 225, reps: 5, date: '1 week ago' },
          { exercise: 'Bench Press', weight: 135, reps: 3, date: '2 weeks ago' },
          { exercise: 'Deadlift', weight: 275, reps: 1, date: '3 weeks ago' },
        ],
      };
      setAthlete(fakeAthlete);
    } catch (error) {
      console.error('Error loading athlete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleMessage = () => {
    router.push({
      pathname: '/(coach)/(tabs)/messages',
      params: { athleteId: athlete?.id }
    });
  };

  const handleViewHistory = () => {
    router.push({
      pathname: './history',
      params: { athleteId: athlete?.id }
    });
  };

  const handleViewProgram = () => {
    if (athlete?.currentProgram) {
      router.push({
        pathname: '/(coach)/(tabs)/programs/[programid]',
        params: { programid: athlete.currentProgram.id }
      });
    }
  };

  const handleAssignProgram = () => {
    router.push({
      pathname: './assign-program',
      params: { athleteId: athlete?.id }
    });
  };

  const handleEditAthlete = () => {
    if (!athlete) return;
    router.push({
      pathname: '/(coach)/(tabs)/athletes/[athleteId]/edit',
      params: { athleteId: athlete.id },
    });
  };

  const handleRemoveAthlete = () => {
    Alert.alert(
      'Remove Athlete',
      `Are you sure you want to remove ${athlete?.name} from your roster?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // In real app, call service to remove athlete
            router.back();
          }
        },
      ]
    );
  };

  const handleViewWorkout = (workoutId: string) => {
    // router.push({
    //   pathname: '/(coach)/(tabs)/athletes/[athleteId]/workouts/[workoutId]',
    //   params: { athleteId: athlete?.id, workoutId }
    // });
  };

  const getProgramProgress = (weekNumber: number, totalWeeks: number) => {
    if (!totalWeeks || totalWeeks <= 0) return 0;

    const raw = (weekNumber / totalWeeks) * 100;
    // clamp between 0 and 100, and make sure it's an integer
    return Math.min(100, Math.max(0, Math.round(raw)));
  };


  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top', 'left', 'right']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading athlete...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!athlete) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top', 'left', 'right']}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <User size={48} color="#9ca3af" />
          <Text fontSize="$5" fontWeight="bold" color="$gray12" mt="$3">
            Athlete not found
          </Text>
          <Text fontSize="$3" color="$gray10" textAlign="center" mt="$2">
            This athlete may have been removed or does not exist.
          </Text>
          <Button
            size="$4"
            backgroundColor="#7c3aed"
            color="white"
            onPress={handleBack}
            mt="$4"
          >
            Go Back
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <XStack ai="center" jc="space-between" mb="$4">
          <Pressable onPress={handleBack}>
            <XStack ai="center" gap="$2">
              <ArrowLeft size={24} color="#6b7280" />
              <Text fontSize="$3" color="$gray10">
                Back
              </Text>
            </XStack>
          </Pressable>
          <XStack gap="$2">
            <Pressable onPress={handleEditAthlete}>
              <YStack
                w={40}
                h={40}
                borderRadius="$4"
                backgroundColor="white"
                ai="center"
                jc="center"
              >
                <Edit size={20} color="#6b7280" />
              </YStack>
            </Pressable>
            <Pressable onPress={handleRemoveAthlete}>
              <YStack
                w={40}
                h={40}
                borderRadius="$4"
                backgroundColor="white"
                ai="center"
                jc="center"
              >
                <Trash2 size={20} color="#ef4444" />
              </YStack>
            </Pressable>
          </XStack>
        </XStack>

        {/* Athlete Info Card */}
        <Card elevate size="$4" p="$4" backgroundColor="white" mb="$4">
          <XStack gap="$4" ai="center">
            <Avatar circular size="$6">
              {athlete.avatar ? (
                <Avatar.Image source={{ uri: athlete.avatar }} />
              ) : (
                <Avatar.Fallback backgroundColor="#7c3aed">
                  <Text fontSize="$6" fontWeight="bold" color="white">
                    {athlete.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </Avatar.Fallback>
              )}
            </Avatar>
            <YStack f={1} gap="$1">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                {athlete.name}
              </Text>
              <Text fontSize="$3" color="$gray11">
                {athlete.email}
              </Text>
              <XStack gap="$3" mt="$1" flexWrap="wrap">
                <Text fontSize="$2" color="$gray10">
                  Joined {athlete.joinedDate}
                </Text>
                {athlete.age && (
                  <XStack gap="$1">
                    <Text fontSize="$2" color="$gray10">•</Text>
                    <Text fontSize="$2" color="$gray10">
                      {athlete.age} years old
                    </Text>
                  </XStack>
                )}
              </XStack>
            </YStack>
          </XStack>
          <XStack gap="$2" mt="$4">
            <Button
              f={1}
              size="$3"
              backgroundColor="#7c3aed"
              color="white"
              icon={MessageCircle}
              onPress={handleMessage}
              pressStyle={{ backgroundColor: '#6d28d9' }}
            >
              Message
            </Button>
            <Button
              f={1}
              size="$3"
              backgroundColor="white"
              borderColor="$gray4"
              borderWidth={1}
              color="$gray11"
              icon={Clock}
              onPress={handleViewHistory}
              pressStyle={{ backgroundColor: '$gray2' }}
            >
              History
            </Button>
          </XStack>
        </Card>

        {/* Current Program */}
        {athlete.currentProgram ? (
          <Card elevate size="$4" p="$4" backgroundColor="white" mb="$4">
            <YStack gap="$3">
              <XStack ai="center" jc="space-between">
                <XStack ai="center" gap="$2">
                  <Calendar size={20} color="#7c3aed" />
                  <Text fontSize="$5" fontWeight="600" color="$gray12">
                    Current Program
                  </Text>
                </XStack>
                <Pressable onPress={handleViewProgram}>
                  <Text fontSize="$3" color="#7c3aed" fontWeight="500">
                    View
                  </Text>
                </Pressable>
              </XStack>
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                  {athlete.currentProgram.name}
                </Text>
                <Text fontSize="$3" color="$gray11">
                  Week {athlete.currentProgram.weekNumber} of {athlete.currentProgram.totalWeeks}
                </Text>
                <Progress
                  value={getProgramProgress(
                    athlete.currentProgram.weekNumber,
                    athlete.currentProgram.totalWeeks
                  )}
                  backgroundColor="$gray4"
                >
                  <Progress.Indicator animation="bouncy" backgroundColor="#7c3aed" />
                </Progress>

                <Text fontSize="$2" color="$gray10">
                  Started {athlete.currentProgram.startDate}
                </Text>
              </YStack>
            </YStack>
          </Card>
        ) : (
          <Card elevate size="$4" p="$4" backgroundColor="white" mb="$4">
            <YStack gap="$3" ai="center">
              <YStack
                w={60}
                h={60}
                borderRadius="$10"
                backgroundColor="#faf5ff"
                ai="center"
                jc="center"
              >
                <Calendar size={30} color="#7c3aed" />
              </YStack>
              <YStack ai="center" gap="$1">
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                  No Active Program
                </Text>
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  Assign a program to this athlete to get started
                </Text>
              </YStack>
              <Button
                size="$4"
                backgroundColor="#7c3aed"
                color="white"
                onPress={handleAssignProgram}
                pressStyle={{ backgroundColor: '#6d28d9' }}
              >
                Assign Program
              </Button>
            </YStack>
          </Card>
        )}

        {/* Goals */}
        {athlete.goals && athlete.goals.length > 0 && (
          <Card elevate size="$4" p="$4" backgroundColor="white" mb="$4">
            <YStack gap="$3">
              <XStack ai="center" gap="$2">
                <Target size={20} color="#7c3aed" />
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  Goals
                </Text>
              </XStack>
              <XStack gap="$2" flexWrap="wrap">
                {athlete.goals.map((goal, index) => (
                  <YStack
                    key={index}
                    backgroundColor="#faf5ff"
                    px="$3"
                    py="$2"
                    borderRadius="$3"
                  >
                    <Text fontSize="$3" color="#7c3aed" fontWeight="500">
                      {goal}
                    </Text>
                  </YStack>
                ))}
              </XStack>
            </YStack>
          </Card>
        )}

        {/* Stats */}
        <YStack gap="$3" mb="$4">
          <XStack ai="center" gap="$2">
            <Activity size={20} color="#7c3aed" />
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              Stats
            </Text>
          </XStack>
          <XStack gap="$3" flexWrap="wrap">
            <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
              <YStack gap="$1">
                <Text fontSize="$2" color="$gray11">Workouts</Text>
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  {athlete.stats.totalWorkouts}
                </Text>
              </YStack>
            </Card>
            <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
              <YStack gap="$1">
                <Text fontSize="$2" color="$gray11">Weekly Avg</Text>
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  {athlete.stats.weeklyAverage}
                </Text>
              </YStack>
            </Card>
            <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
              <YStack gap="$1">
                <Text fontSize="$2" color="$gray11">Compliance</Text>
                <Text fontSize="$5" fontWeight="600" color="#10b981">
                  {athlete.stats.complianceRate}%
                </Text>
              </YStack>
            </Card>
            <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
              <YStack gap="$1">
                <Text fontSize="$2" color="$gray11">Total Volume</Text>
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                  {athlete.stats.totalVolume}
                </Text>
              </YStack>
            </Card>
          </XStack>
        </YStack>

        {/* Recent Workouts */}
        <Card elevate size="$4" p="$4" backgroundColor="white" mb="$4">
          <YStack gap="$3">
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap="$2">
                <Dumbbell size={20} color="#7c3aed" />
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  Recent Workouts
                </Text>
              </XStack>
              <Pressable onPress={handleViewHistory}>
                <Text fontSize="$3" color="#7c3aed" fontWeight="500">
                  View All
                </Text>
              </Pressable>
            </XStack>
            <YStack gap="$3">
              {athlete.recentWorkouts.map((workout, index) => (
                <Pressable key={workout.id} onPress={() => handleViewWorkout(workout.id)}>
                  <YStack>
                    <XStack ai="center" jc="space-between">
                      <YStack gap="$1" f={1}>
                        <Text fontSize="$3" fontWeight="600" color="$gray12">
                          {workout.name}
                        </Text>
                        <XStack gap="$2" flexWrap="wrap">
                          <Text fontSize="$2" color="$gray11">
                            {workout.exercises} exercises
                          </Text>
                          <Text fontSize="$2" color="$gray11">•</Text>
                          <Text fontSize="$2" color="$gray11">
                            {workout.duration} min
                          </Text>
                          <Text fontSize="$2" color="$gray11">•</Text>
                          <Text fontSize="$2" color="$gray11">
                            {workout.volume}
                          </Text>
                        </XStack>
                      </YStack>
                      <XStack ai="center" gap="$2">
                        <Text fontSize="$2" color="$gray10">
                          {workout.date}
                        </Text>
                        <ChevronRight size={16} color="#9ca3af" />
                      </XStack>
                    </XStack>
                    {index < athlete.recentWorkouts.length - 1 && <Separator my="$3" />}
                  </YStack>
                </Pressable>
              ))}
            </YStack>
          </YStack>
        </Card>

        {/* Personal Records */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <XStack ai="center" gap="$2">
              <Award size={20} color="#7c3aed" />
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Personal Records
              </Text>
            </XStack>
            <YStack gap="$3">
              {athlete.personalRecords.map((pr, index) => (
                <YStack key={index}>
                  <XStack ai="center" jc="space-between">
                    <YStack gap="$1">
                      <Text fontSize="$3" fontWeight="600" color="$gray12">
                        {pr.exercise}
                      </Text>
                      <Text fontSize="$2" color="$gray10">
                        {pr.date}
                      </Text>
                    </YStack>
                    <YStack ai="flex-end">
                      <Text fontSize="$4" fontWeight="bold" color="#7c3aed">
                        {pr.weight} lbs
                      </Text>
                      <Text fontSize="$2" color="$gray10">
                        {pr.reps} rep{pr.reps !== 1 ? 's' : ''}
                      </Text>
                    </YStack>
                  </XStack>
                  {index < athlete.personalRecords.length - 1 && <Separator my="$3" />}
                </YStack>
              ))}
            </YStack>
          </YStack>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}