import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    Clock,
    Dumbbell,
    TrendingUp
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Spinner, Text, XStack, YStack } from 'tamagui';

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: number;
  volume: string;
  completed: boolean;
}

export default function AthleteHistoryPage() {
  const { athleteId } = useLocalSearchParams<{ athleteId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    loadWorkouts();
  }, [athleteId, filter]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fake workout data
      const fakeWorkouts: Workout[] = [
        {
          id: 'w1',
          name: 'Upper Power',
          date: 'Today',
          duration: 72,
          exercises: 6,
          volume: '15,230 lbs',
          completed: true,
        },
        {
          id: 'w2',
          name: 'Lower Volume',
          date: 'Yesterday',
          duration: 68,
          exercises: 5,
          volume: '18,450 lbs',
          completed: true,
        },
        {
          id: 'w3',
          name: 'Upper Volume',
          date: '3 days ago',
          duration: 65,
          exercises: 7,
          volume: '12,890 lbs',
          completed: true,
        },
        {
          id: 'w4',
          name: 'Lower Power',
          date: '5 days ago',
          duration: 75,
          exercises: 5,
          volume: '22,100 lbs',
          completed: true,
        },
        {
          id: 'w5',
          name: 'Full Body',
          date: '1 week ago',
          duration: 80,
          exercises: 8,
          volume: '19,500 lbs',
          completed: true,
        },
        {
          id: 'w6',
          name: 'Upper Power',
          date: '1 week ago',
          duration: 70,
          exercises: 6,
          volume: '14,800 lbs',
          completed: true,
        },
      ];
      
      setWorkouts(fakeWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleWorkoutPress = (workoutId: string) => {
    // router.push({
    //   pathname: '/(coach)/(tabs)/athletes/[athleteId]/workouts/[workoutId]',
    //   params: { athleteId, workoutId }
    // });
  };

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, w) => {
    const vol = parseInt(w.volume.replace(/,/g, '').replace(' lbs', ''));
    return sum + vol;
  }, 0);
  const avgDuration = Math.round(
    workouts.reduce((sum, w) => sum + w.duration, 0) / totalWorkouts
  );

  if (loading && workouts.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        <YStack f={1} ai="center" jc="center">
          <Spinner size="large" color="#7c3aed" />
          <Text fontSize="$3" color="$gray10" mt="$3">
            Loading workout history...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1}>
        {/* Header */}
        <YStack p="$4" backgroundColor="#f5f5f5">
          <XStack ai="center" gap="$3" mb="$4">
            <Pressable onPress={handleBack}>
              <ArrowLeft size={24} color="#6b7280" />
            </Pressable>
            <Text fontSize={24} fontWeight="700" color="$gray12">
              Workout History
            </Text>
          </XStack>

          {/* Filter Buttons */}
          <XStack gap="$2">
            <Button
              size="$3"
              backgroundColor={filter === 'all' ? '#7c3aed' : 'white'}
              color={filter === 'all' ? 'white' : '$gray11'}
              borderWidth={1}
              borderColor={filter === 'all' ? '#7c3aed' : '#e5e7eb'}
              onPress={() => setFilter('all')}
              pressStyle={{ opacity: 0.8 }}
            >
              All Time
            </Button>
            <Button
              size="$3"
              backgroundColor={filter === 'week' ? '#7c3aed' : 'white'}
              color={filter === 'week' ? 'white' : '$gray11'}
              borderWidth={1}
              borderColor={filter === 'week' ? '#7c3aed' : '#e5e7eb'}
              onPress={() => setFilter('week')}
              pressStyle={{ opacity: 0.8 }}
            >
              This Week
            </Button>
            <Button
              size="$3"
              backgroundColor={filter === 'month' ? '#7c3aed' : 'white'}
              color={filter === 'month' ? 'white' : '$gray11'}
              borderWidth={1}
              borderColor={filter === 'month' ? '#7c3aed' : '#e5e7eb'}
              onPress={() => setFilter('month')}
              pressStyle={{ opacity: 0.8 }}
            >
              This Month
            </Button>
          </XStack>
        </YStack>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 32,
          }}
        >
          {/* Stats Summary */}
          <Card elevate size="$4" p="$4" backgroundColor="white" mb="$4">
            <XStack jc="space-around">
              <YStack ai="center" gap="$1">
                <XStack ai="center" gap="$1">
                  <Dumbbell size={16} color="#7c3aed" />
                  <Text fontSize="$2" color="$gray10">
                    Workouts
                  </Text>
                </XStack>
                <Text fontSize="$6" fontWeight="bold" color="$gray12">
                  {totalWorkouts}
                </Text>
              </YStack>
              <YStack ai="center" gap="$1">
                <XStack ai="center" gap="$1">
                  <TrendingUp size={16} color="#7c3aed" />
                  <Text fontSize="$2" color="$gray10">
                    Total Volume
                  </Text>
                </XStack>
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  {(totalVolume / 1000).toFixed(0)}k lbs
                </Text>
              </YStack>
              <YStack ai="center" gap="$1">
                <XStack ai="center" gap="$1">
                  <Clock size={16} color="#7c3aed" />
                  <Text fontSize="$2" color="$gray10">
                    Avg Duration
                  </Text>
                </XStack>
                <Text fontSize="$6" fontWeight="bold" color="$gray12">
                  {avgDuration} min
                </Text>
              </YStack>
            </XStack>
          </Card>

          {/* Workout List */}
          {workouts.length === 0 ? (
            <Card elevate size="$4" p="$5" backgroundColor="white">
              <YStack ai="center" gap="$3">
                <Calendar size={48} color="#d1d5db" />
                <YStack ai="center" gap="$1">
                  <Text fontSize="$4" fontWeight="bold" color="$gray12">
                    No Workouts Yet
                  </Text>
                  <Text fontSize="$3" color="$gray10" textAlign="center">
                    This athlete hasn&apos;t completed any workouts yet.
                  </Text>
                </YStack>
              </YStack>
            </Card>
          ) : (
            <YStack gap="$3">
              {workouts.map((workout) => (
                <Pressable key={workout.id} onPress={() => handleWorkoutPress(workout.id)}>
                  <Card
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor="white"
                    pressStyle={{ opacity: 0.7, scale: 0.98 }}
                  >
                    <XStack ai="center" jc="space-between">
                      <YStack gap="$2" f={1}>
                        <XStack ai="center" jc="space-between">
                          <Text fontSize="$4" fontWeight="600" color="$gray12">
                            {workout.name}
                          </Text>
                          <Text fontSize="$2" color="$gray10">
                            {workout.date}
                          </Text>
                        </XStack>
                        <XStack gap="$4">
                          <XStack ai="center" gap="$1">
                            <Clock size={14} color="#6b7280" />
                            <Text fontSize="$2" color="$gray11">
                              {workout.duration} min
                            </Text>
                          </XStack>
                          <XStack ai="center" gap="$1">
                            <Dumbbell size={14} color="#6b7280" />
                            <Text fontSize="$2" color="$gray11">
                              {workout.exercises} exercises
                            </Text>
                          </XStack>
                          <XStack ai="center" gap="$1">
                            <TrendingUp size={14} color="#6b7280" />
                            <Text fontSize="$2" color="$gray11">
                              {workout.volume}
                            </Text>
                          </XStack>
                        </XStack>
                      </YStack>
                      <ChevronRight size={20} color="#9ca3af" />
                    </XStack>
                  </Card>
                </Pressable>
              ))}
            </YStack>
          )}
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}