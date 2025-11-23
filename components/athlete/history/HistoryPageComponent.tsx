import { Workout } from '@/services/workout.service';
import { Calendar, Clock, TrendingUp } from 'lucide-react-native';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Spinner, Text, XStack, YStack } from 'tamagui';

type HistoryProps = {
    refreshing: boolean;
    onRefresh: () => Promise<void>
    workouts: Workout[];
    thisWeekWorkouts: Workout[];
    totalVolume: number;
    loading: boolean;
    formatDuration: (n:number | null) => string;
    formatDate: (d: string) => string;
    handleWorkoutPress: (s: string) => void;
}

export default function HistoryPageComponent({
    refreshing,
    onRefresh,
    workouts,
    thisWeekWorkouts,
    totalVolume,
    loading,
    handleWorkoutPress,
    formatDate,
    formatDuration,
} : HistoryProps) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
            <YStack f={1} backgroundColor="#f5f5f5">
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <YStack p="$4" gap="$4">
                        {/* Header */}
                        <YStack gap="$2">
                            <Text fontSize="$8" fontWeight="bold" color="#111827">
                                History
                            </Text>
                            <Text fontSize="$4" color="#6b7280">
                                Your workout history
                            </Text>
                        </YStack>

                        {/* Stats Card */}
                        <Card elevate size="$4" p="$4" backgroundColor="white">
                            <XStack gap="$4" jc="space-around">
                                <YStack ai="center" gap="$1">
                                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                                        {workouts.length}
                                    </Text>
                                    <Text fontSize="$2" color="#6b7280">
                                        Workouts
                                    </Text>
                                </YStack>
                                <YStack ai="center" gap="$1">
                                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                                        {thisWeekWorkouts.length}
                                    </Text>
                                    <Text fontSize="$2" color="#6b7280">
                                        This Week
                                    </Text>
                                </YStack>
                                <YStack ai="center" gap="$1">
                                    <Text fontSize="$7" fontWeight="bold" color="#7c3aed">
                                        {totalVolume}k
                                    </Text>
                                    <Text fontSize="$2" color="#6b7280">
                                        Total lbs
                                    </Text>
                                </YStack>
                            </XStack>
                        </Card>

                        {/* Loading State */}
                        {loading && (
                            <YStack ai="center" py="$8">
                                <Spinner size="large" color="#7c3aed" />
                                <Text fontSize="$3" color="#6b7280" mt="$3">
                                    Loading your workouts...
                                </Text>
                            </YStack>
                        )}

                        {/* Empty State */}
                        {!loading && workouts.length === 0 && (
                            <Card elevate size="$4" p="$6" backgroundColor="white">
                                <YStack ai="center" gap="$3">
                                    <Calendar size={48} color="#d1d5db" />
                                    <YStack ai="center" gap="$2">
                                        <Text fontSize="$5" fontWeight="bold" color="#111827" textAlign="center">
                                            No Workouts Yet
                                        </Text>
                                        <Text fontSize="$3" color="#6b7280" textAlign="center">
                                            Start your first workout from the Home tab to see your history here.
                                        </Text>
                                    </YStack>
                                </YStack>
                            </Card>
                        )}

                        {/* Workout List */}
                        {!loading && workouts.length > 0 && (
                            <YStack gap="$3">
                                {workouts.map((workout) => (
                                    <Card
                                        key={workout.id}
                                        elevate
                                        size="$4"
                                        p="$4"
                                        backgroundColor="white"
                                        pressStyle={{ opacity: 0.7, scale: 0.98 }}
                                        onPress={() => handleWorkoutPress(workout.id)}
                                    >
                                        <YStack gap="$3">
                                            <XStack ai="center" jc="space-between">
                                                <YStack gap="$1">
                                                    <Text fontSize="$2" color="#6b7280">
                                                        {formatDate(workout.start_time)}
                                                    </Text>
                                                    <Text fontSize="$5" fontWeight="bold" color="#111827">
                                                        {workout.name}
                                                    </Text>
                                                </YStack>
                                                {workout.end_time && (
                                                    <XStack
                                                        backgroundColor="#dcfce7"
                                                        px="$2"
                                                        py="$1"
                                                        borderRadius="$2"
                                                    >
                                                        <Text fontSize="$1" fontWeight="600" color="#16a34a">
                                                            COMPLETED
                                                        </Text>
                                                    </XStack>
                                                )}
                                            </XStack>

                                            <XStack gap="$4">
                                                <XStack ai="center" gap="$2">
                                                    <Clock size={16} color="#6b7280" />
                                                    <Text fontSize="$3" color="#6b7280">
                                                        {formatDuration(workout.duration_minutes)}
                                                    </Text>
                                                </XStack>
                                                {(workout.volume ?? 0) > 0 && (
                                                    <XStack ai="center" gap="$2">
                                                        <TrendingUp size={16} color="#6b7280" />
                                                        <Text fontSize="$3" color="#6b7280">
                                                            {workout.volume?.toLocaleString()} lbs
                                                        </Text>
                                                    </XStack>
                                                )}
                                            </XStack>

                                            {workout.notes && (
                                                <Text fontSize="$3" color="#6b7280" numberOfLines={2}>
                                                    {workout.notes}
                                                </Text>
                                            )}
                                        </YStack>
                                    </Card>
                                ))}
                            </YStack>
                        )}
                    </YStack>
                </ScrollView>
            </YStack>
        </SafeAreaView>
    );
}