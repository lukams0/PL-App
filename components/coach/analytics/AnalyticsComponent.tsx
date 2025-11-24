import { Award, BarChart3, Clock, TrendingUp, Weight } from "lucide-react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Progress, Separator, Text, XStack, YStack } from "tamagui";

interface Props {
  dateRange: 'week' | 'month' | 'year';
  setDateRange: (range: 'week' | 'month' | 'year') => void;
  analyticsData: any;
}

export default function AnalyticsComponent({ dateRange, setDateRange, analyticsData }: Props) {
  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'highly_engaged': return '#10b981';
      case 'moderately_engaged': return '#f59e0b';
      case 'low_engagement': return '#ef4444';
      default: return '#9ca3af';
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
              <Text fontSize={24} fontWeight="bold" color="$gray12">
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
                const rawPercent =
                  day.scheduled > 0 ? (day.completed / day.scheduled) * 100 : 0;
                const completionPercent = Math.round(rawPercent);

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
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              Program Progress
            </Text>
            <YStack gap="$3">
              {analyticsData.programProgress.map((program: any) => {
                const progressPercent = Math.round(program.avgProgress ?? 0);

                return (
                  <YStack key={program.name} gap="$2">
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
                <XStack key={athlete.name} ai="center" gap="$3">
                  <Text fontSize="$3" fontWeight="600" color="$gray11" width={20}>
                    #{index + 1}
                  </Text>
                  <Avatar circular size="$3">
                    <Avatar.Fallback backgroundColor="$gray5">
                      {athlete.name.split(' ').map((n: string) => n[0]).join('')}
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
                      <Text fontSize="$2" color="$gray11">
                        {athlete.prs} PRs
                      </Text>
                    </XStack>
                  </YStack>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </Card>

        {/* Recent PRs */}
        <Card elevate size="$4" p="$4" backgroundColor="white">
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              Recent Personal Records
            </Text>
            <YStack gap="$3">
              {analyticsData.recentPRs.map((pr: any, index: number) => (
                <YStack key={index}>
                  <XStack ai="center" jc="space-between">
                    <YStack gap="$0.5">
                      <Text fontSize="$3" fontWeight="600" color="$gray12">
                        {pr.athlete}
                      </Text>
                      <Text fontSize="$2" color="$gray11">
                        {pr.exercise}: {pr.weight} × {pr.reps}
                      </Text>
                    </YStack>
                    <Text fontSize="$2" color="$gray10">
                      {pr.date}
                    </Text>
                  </XStack>
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