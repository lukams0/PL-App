// components/coach/analytics/AnalyticsComponent.tsx
import { Award, BarChart3, ChevronRight, Clock, TrendingUp, Weight } from "lucide-react-native";
import { Pressable, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Progress, Separator, Text, XStack, YStack } from "tamagui";

interface Props {
  dateRange: 'week' | 'month' | 'year';
  setDateRange: (range: 'week' | 'month' | 'year') => void;
  analyticsData: any;
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
  onAthletePress?: (athleteId: string) => void;
  onProgramPress?: (programId: string) => void;
}

export default function AnalyticsComponent({ 
  dateRange, 
  setDateRange, 
  analyticsData,
  refreshing = false,
  onRefresh,
  onAthletePress,
  onProgramPress,
}: Props) {
  // Helper function to safely round progress values (prevents Fabric precision errors)
  const safeRound = (value: number | undefined | null): number => {
    if (value === undefined || value === null || isNaN(value)) return 0;
    return Math.min(100, Math.max(0, Math.round(value)));
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'highly_engaged': return '#10b981';
      case 'moderately_engaged': return '#f59e0b';
      case 'low_engagement': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
          gap: 16,
        }}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          ) : undefined
        }
      >
        {/* Header */}
        <YStack gap="$1">
          <Text fontSize={28} fontWeight="700" color="$gray12">
            Analytics
          </Text>
          <Text fontSize="$3" color="$gray11">
            Track performance and engagement metrics
          </Text>
        </YStack>

        {/* Date Range Selector */}
        <XStack gap="$2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <Button
              key={range}
              size="$3"
              f={1}
              backgroundColor={dateRange === range ? '#7c3aed' : 'white'}
              borderColor={dateRange === range ? '#7c3aed' : '$gray4'}
              borderWidth={1}
              onPress={() => setDateRange(range)}
              pressStyle={{ opacity: 0.8 }}
            >
              <Text
                color={dateRange === range ? 'white' : '$gray11'}
                fontSize="$2"
                fontWeight="600"
                textTransform="capitalize"
              >
                {range}
              </Text>
            </Button>
          ))}
        </XStack>

        {/* Key Metrics */}
        <XStack gap="$3" flexWrap="wrap">
          <Card elevate size="$4" f={1} minWidth="45%" p="$3" backgroundColor="white">
            <YStack gap="$2">
              <XStack ai="center" gap="$2">
                <BarChart3 size={20} color="#7c3aed" />
                <Text fontSize="$2" color="$gray11">Total Workouts</Text>
              </XStack>
              <Text fontSize={24} fontWeight="bold" color="$gray12">
                {analyticsData.stats.totalWorkouts}
              </Text>
              <Text fontSize="$2" color="$gray10">This {dateRange}</Text>
            </YStack>
          </Card>

          <Card elevate size="$4" f={1} minWidth="45%" p="$3" backgroundColor="white">
            <YStack gap="$2">
              <XStack ai="center" gap="$2">
                <Clock size={20} color="#7c3aed" />
                <Text fontSize="$2" color="$gray11">Avg Duration</Text>
              </XStack>
              <Text fontSize={24} fontWeight="bold" color="$gray12">
                {analyticsData.stats.avgSessionDuration}
              </Text>
              <Text fontSize="$2" color="$gray10">Minutes</Text>
            </YStack>
          </Card>

          <Card elevate size="$4" f={1} minWidth="45%" p="$3" backgroundColor="white">
            <YStack gap="$2">
              <XStack ai="center" gap="$2">
                <Weight size={20} color="#7c3aed" />
                <Text fontSize="$2" color="$gray11">Total Volume</Text>
              </XStack>
              <Text fontSize={20} fontWeight="bold" color="$gray12">
                {analyticsData.stats.totalVolume}
              </Text>
              <Text fontSize="$2" color="$gray10">Lifted</Text>
            </YStack>
          </Card>

          <Card elevate size="$4" f={1} minWidth="45%" p="$3" backgroundColor="white">
            <YStack gap="$2">
              <XStack ai="center" gap="$2">
                <TrendingUp size={20} color="#10b981" />
                <Text fontSize="$2" color="$gray11">Compliance</Text>
              </XStack>
              <Text fontSize={24} fontWeight="bold" color="#10b981">
                {analyticsData.stats.avgComplianceRate}%
              </Text>
              <Text fontSize="$2" color="$gray10">Average</Text>
            </YStack>
          </Card>
        </XStack>

        {/* Workout Completion Chart */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              Workout Completion Rate
            </Text>
            <YStack gap="$2">
              {analyticsData.workoutCompletion.map((day: any) => {
                const rawPercent = day.scheduled > 0 
                  ? (day.completed / day.scheduled) * 100 
                  : 0;
                const completionPercent = safeRound(rawPercent);

                return (
                  <XStack key={day.day} ai="center" gap="$3">
                    <Text fontSize="$2" color="$gray11" width={40}>
                      {day.day}
                    </Text>
                    <YStack f={1} gap="$1">
                      <Progress
                        value={completionPercent}
                        max={100}
                        backgroundColor="$gray3"
                        h={20}
                      >
                        <Progress.Indicator backgroundColor="#7c3aed" />
                      </Progress>
                      <Text fontSize="$1" color="$gray10">
                        {day.completed}/{day.scheduled} completed
                      </Text>
                    </YStack>
                    <Text fontSize="$2" fontWeight="600" color="$gray12">
                      {completionPercent}%
                    </Text>
                  </XStack>
                );
              })}
            </YStack>
          </YStack>
        </Card>

        {/* Program Progress */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <XStack ai="center" jc="space-between">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Program Progress
              </Text>
              {onProgramPress && (
                <Pressable onPress={() => onProgramPress('all')}>
                  <XStack ai="center" gap="$1">
                    <Text fontSize="$2" color="#7c3aed" fontWeight="600">
                      View All
                    </Text>
                    <ChevronRight size={14} color="#7c3aed" />
                  </XStack>
                </Pressable>
              )}
            </XStack>
            <YStack gap="$3">
              {analyticsData.programProgress.map((program: any) => {
                const progressPercent = safeRound(program.avgProgress);

                return (
                  <Pressable 
                    key={program.name}
                    onPress={() => onProgramPress && onProgramPress(program.id || program.name)}
                  >
                    <YStack gap="$2">
                      <XStack ai="center" jc="space-between">
                        <YStack gap="$0.5">
                          <Text fontSize="$3" fontWeight="600" color="$gray12">
                            {program.name}
                          </Text>
                          <Text fontSize="$2" color="$gray11">
                            {program.athletes} athletes
                          </Text>
                        </YStack>
                        <Text fontSize="$3" fontWeight="600" color="#7c3aed">
                          {progressPercent}%
                        </Text>
                      </XStack>
                      <Progress
                        value={progressPercent}
                        max={100}
                        backgroundColor="$gray3"
                        h={8}
                      >
                        <Progress.Indicator backgroundColor="#7c3aed" />
                      </Progress>
                    </YStack>
                  </Pressable>
                );
              })}
            </YStack>
          </YStack>
        </Card>

        {/* Athlete Engagement */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              Athlete Engagement
            </Text>
            <XStack gap="$3" jc="space-between">
              <YStack ai="center" f={1} gap="$2">
                <YStack
                  w={60}
                  h={60}
                  borderRadius="$10"
                  backgroundColor="#10b98120"
                  ai="center"
                  jc="center"
                >
                  <Text fontSize="$5" fontWeight="bold" color="#10b981">
                    {analyticsData.athleteEngagement.highly_engaged}
                  </Text>
                </YStack>
                <Text fontSize="$2" color="$gray11" textAlign="center">
                  Highly Engaged
                </Text>
              </YStack>
              <YStack ai="center" f={1} gap="$2">
                <YStack
                  w={60}
                  h={60}
                  borderRadius="$10"
                  backgroundColor="#f59e0b20"
                  ai="center"
                  jc="center"
                >
                  <Text fontSize="$5" fontWeight="bold" color="#f59e0b">
                    {analyticsData.athleteEngagement.moderately_engaged}
                  </Text>
                </YStack>
                <Text fontSize="$2" color="$gray11" textAlign="center">
                  Moderate
                </Text>
              </YStack>
              <YStack ai="center" f={1} gap="$2">
                <YStack
                  w={60}
                  h={60}
                  borderRadius="$10"
                  backgroundColor="#ef444420"
                  ai="center"
                  jc="center"
                >
                  <Text fontSize="$5" fontWeight="bold" color="#ef4444">
                    {analyticsData.athleteEngagement.low_engagement}
                  </Text>
                </YStack>
                <Text fontSize="$2" color="$gray11" textAlign="center">
                  Low Engagement
                </Text>
              </YStack>
            </XStack>
            
            {/* Engagement Summary */}
            <YStack backgroundColor="$gray2" p="$3" borderRadius="$3" mt="$2">
              <Text fontSize="$2" color="$gray11" textAlign="center">
                {analyticsData.athleteEngagement.highly_engaged + 
                 analyticsData.athleteEngagement.moderately_engaged + 
                 analyticsData.athleteEngagement.low_engagement} total athletes tracked
              </Text>
            </YStack>
          </YStack>
        </Card>

        {/* Top Performers */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <XStack ai="center" gap="$2">
              <Award size={20} color="#f59e0b" />
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Top Performers
              </Text>
            </XStack>
            <YStack gap="$3">
              {analyticsData.topPerformers.map((athlete: any, index: number) => (
                <Pressable 
                  key={athlete.name}
                  onPress={() => onAthletePress && onAthletePress(athlete.id || athlete.name)}
                >
                  <XStack ai="center" gap="$3">
                    <YStack 
                      w={24} 
                      h={24} 
                      borderRadius="$10" 
                      backgroundColor={index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : '#cd7c32'}
                      ai="center"
                      jc="center"
                    >
                      <Text fontSize="$2" fontWeight="bold" color="white">
                        {index + 1}
                      </Text>
                    </YStack>
                    <Avatar circular size="$3">
                      <Avatar.Fallback backgroundColor="$gray5">
                        <Text color="$gray11" fontWeight="600" fontSize="$2">
                          {athlete.name.split(' ').map((n: string) => n[0]).join('')}
                        </Text>
                      </Avatar.Fallback>
                    </Avatar>
                    <YStack f={1} gap="$0.5">
                      <Text fontSize="$3" fontWeight="600" color="$gray12">
                        {athlete.name}
                      </Text>
                      <XStack gap="$2">
                        <Text fontSize="$2" color="$gray11">
                          {athlete.compliance}% compliance
                        </Text>
                        <Text fontSize="$2" color="$gray11">•</Text>
                        <Text fontSize="$2" color="#f59e0b" fontWeight="600">
                          {athlete.prs} PRs
                        </Text>
                      </XStack>
                    </YStack>
                    <ChevronRight size={16} color="$gray8" />
                  </XStack>
                </Pressable>
              ))}
            </YStack>
          </YStack>
        </Card>

        {/* Recent PRs */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <XStack ai="center" jc="space-between">
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                Recent Personal Records
              </Text>
              <XStack backgroundColor="#fef3c7" px="$2" py="$1" borderRadius="$2">
                <Text fontSize="$2" color="#f59e0b" fontWeight="600">
                  🏆 {analyticsData.recentPRs.length} this {dateRange}
                </Text>
              </XStack>
            </XStack>
            <YStack gap="$3">
              {analyticsData.recentPRs.map((pr: any, index: number) => (
                <YStack key={index}>
                  <Pressable onPress={() => onAthletePress && onAthletePress(pr.athleteId || pr.athlete)}>
                    <XStack ai="center" jc="space-between">
                      <YStack gap="$0.5">
                        <Text fontSize="$3" fontWeight="600" color="$gray12">
                          {pr.athlete}
                        </Text>
                        <XStack ai="center" gap="$2">
                          <Text fontSize="$2" color="#7c3aed" fontWeight="600">
                            {pr.exercise}
                          </Text>
                          <Text fontSize="$2" color="$gray11">
                            {pr.weight} × {pr.reps}
                          </Text>
                        </XStack>
                      </YStack>
                      <Text fontSize="$2" color="$gray10">
                        {pr.date}
                      </Text>
                    </XStack>
                  </Pressable>
                  {index < analyticsData.recentPRs.length - 1 && <Separator my="$2" />}
                </YStack>
              ))}
            </YStack>
          </YStack>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}