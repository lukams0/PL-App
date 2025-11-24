import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, ArrowLeft, Award, Calendar, MessageCircle, TrendingUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
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
            id: '1',
            name: 'Upper Power',
            date: 'Today',
            duration: 72,
            exercises: 6,
            volume: '15,230 lbs',
          },
          {
            id: '2',
            name: 'Lower Volume',
            date: 'Yesterday',
            duration: 68,
            exercises: 5,
            volume: '18,450 lbs',
          },
          {
            id: '3',
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

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="$purple10" />
        </YStack>
      </SafeAreaView>
    );
  }

  if (!athlete) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <Text>Athlete not found</Text>
        </YStack>
      </SafeAreaView>
    );
  }

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
            Athlete Profile
          </Text>
        </XStack>

        {/* Athlete Info Card */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <XStack gap="$4" ai="center">
            <Avatar circular size="$6">
              <Avatar.Fallback backgroundColor="$gray5">
                {athlete.name.split(' ').map(n => n[0]).join('')}
              </Avatar.Fallback>
            </Avatar>
            <YStack f={1} gap="$1">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                {athlete.name}
              </Text>
              <Text fontSize="$3" color="$gray11">
                {athlete.email}
              </Text>
              <XStack gap="$3" mt="$1">
                <Text fontSize="$2" color="$gray10">
                  Joined {athlete.joinedDate}
                </Text>
                {athlete.age && (
                  <>
                    <Text fontSize="$2" color="$gray10">•</Text>
                    <Text fontSize="$2" color="$gray10">
                      {athlete.age} years old
                    </Text>
                  </>
                )}
              </XStack>
            </YStack>
          </XStack>
          <XStack gap="$2" mt="$3">
            <Button
              f={1}
              size="$3"
              backgroundColor="#7c3aed"
              color="white"
              icon={MessageCircle}
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
            >
              View History
            </Button>
          </XStack>
        </Card>

        {/* Current Program */}
        {athlete.currentProgram && (
          <Card elevate size="$4" p="$4" backgroundColor="white">
            <YStack gap="$3">
              <XStack ai="center" gap="$2">
                <Calendar size={20} color="#7c3aed" />
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  Current Program
                </Text>
              </XStack>
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                  {athlete.currentProgram.name}
                </Text>
                <Text fontSize="$3" color="$gray11">
                  Week {athlete.currentProgram.weekNumber} of {athlete.currentProgram.totalWeeks}
                </Text>
                <Progress
                  value={(athlete.currentProgram.weekNumber / athlete.currentProgram.totalWeeks) * 100}
                  backgroundColor="$gray3"
                  h={10}
                >
                  <Progress.Indicator
                    backgroundColor="#7c3aed"
                    //animation="gentle"
                  />
                </Progress>
                <Text fontSize="$2" color="$gray10">
                  Started {athlete.currentProgram.startDate}
                </Text>
              </YStack>
            </YStack>
          </Card>
        )}

        {/* Performance Stats */}
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$gray12">
            Performance Stats
          </Text>
          <XStack gap="$3" flexWrap="wrap">
            <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
              <YStack gap="$1">
                <XStack ai="center" gap="$2">
                  <TrendingUp size={16} color="#10b981" />
                  <Text fontSize="$2" color="$gray11">Compliance</Text>
                </XStack>
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  {athlete.stats.complianceRate}%
                </Text>
              </YStack>
            </Card>
            <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
              <YStack gap="$1">
                <XStack ai="center" gap="$2">
                  <Activity size={16} color="#7c3aed" />
                  <Text fontSize="$2" color="$gray11">Weekly Avg</Text>
                </XStack>
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  {athlete.stats.weeklyAverage}
                </Text>
              </YStack>
            </Card>
            <Card elevate size="$3" f={1} minWidth="45%" p="$3" backgroundColor="white">
              <YStack gap="$1">
                <Text fontSize="$2" color="$gray11">Current Streak</Text>
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  {athlete.stats.currentStreak} days
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
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              Recent Workouts
            </Text>
            <YStack gap="$3">
              {athlete.recentWorkouts.map((workout, index) => (
                <YStack key={workout.id}>
                  <XStack ai="center" jc="space-between">
                    <YStack gap="$1">
                      <Text fontSize="$3" fontWeight="600" color="$gray12">
                        {workout.name}
                      </Text>
                      <XStack gap="$2">
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
                    <Text fontSize="$2" color="$gray10">
                      {workout.date}
                    </Text>
                  </XStack>
                  {index < athlete.recentWorkouts.length - 1 && <Separator my="$2" />}
                </YStack>
              ))}
            </YStack>
          </YStack>
        </Card>

        {/* Personal Records */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <XStack ai="center" gap="$2">
              <Award size={20} color="#f59e0b" />
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Personal Records
              </Text>
            </XStack>
            <YStack gap="$3">
              {athlete.personalRecords.map((pr, index) => (
                <YStack key={index}>
                  <XStack ai="center" jc="space-between">
                    <YStack gap="$0.5">
                      <Text fontSize="$3" fontWeight="600" color="$gray12">
                        {pr.exercise}
                      </Text>
                      <Text fontSize="$2" color="$gray11">
                        {pr.weight} lbs × {pr.reps} reps
                      </Text>
                    </YStack>
                    <Text fontSize="$2" color="$gray10">
                      {pr.date}
                    </Text>
                  </XStack>
                  {index < athlete.personalRecords.length - 1 && <Separator my="$2" />}
                </YStack>
              ))}
            </YStack>
          </YStack>
        </Card>

        {/* Goals */}
        {athlete.goals && athlete.goals.length > 0 && (
          <Card elevate size="$4" p="$4" backgroundColor="white">
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Training Goals
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {athlete.goals.map((goal, index) => (
                  <YStack
                    key={index}
                    backgroundColor="$purple2"
                    px="$3"
                    py="$2"
                    borderRadius="$3"
                  >
                    <Text fontSize="$2" color="#7c3aed" fontWeight="600">
                      {goal}
                    </Text>
                  </YStack>
                ))}
              </XStack>
            </YStack>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}