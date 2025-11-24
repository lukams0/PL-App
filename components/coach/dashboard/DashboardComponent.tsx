import { CoachProfile } from '@/types/datebase.types';
import {
    Award,
    BarChart3,
    Calendar,
    ChevronRight,
    MessageSquare,
    Plus,
    TrendingUp,
    Users
} from 'lucide-react-native';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, XStack, YStack } from 'tamagui';

type RecentActivity = {
  id: string;
  athleteName: string;
  activity: string;
  programName: string;
  time: string;
  type: 'workout' | 'program' | 'pr' | 'message';
};

type UpcomingProgram = {
  id: string;
  athleteName: string;
  programName: string;
  nextWorkout: string;
  week: number;
  totalWeeks: number;
};

type Props = {
  coachProfile: CoachProfile | null;
  stats: {
    totalAthletes: number;
    activePrograms: number;
    completedWorkouts: number;
    averageComplianceRate: number;
    newAthletesThisMonth: number;
    messagesUnread: number;
  };
  recentActivities: RecentActivity[];
  upcomingPrograms: UpcomingProgram[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  handleViewAthletes: () => void;
  handleViewPrograms: () => void;
  handleViewMessages: () => void;
  handleCreateProgram: () => void;
};

export default function CoachDashboardComponent({
  coachProfile,
  stats,
  recentActivities,
  upcomingPrograms,
  loading,
  refreshing,
  onRefresh,
  handleViewAthletes,
  handleViewPrograms,
  handleViewMessages,
  handleCreateProgram,
}: Props) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <BarChart3 size={16} color="#10b981" />;
      case 'program':
        return <Calendar size={16} color="#7c3aed" />;
      case 'pr':
        return <Award size={16} color="#f59e0b" />;
      case 'message':
        return <MessageSquare size={16} color="#3b82f6" />;
      default:
        return null;
    }
  };

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
              <Text fontSize="$8" fontWeight="bold" color="$gray12">
                Dashboard
              </Text>
              <Text fontSize="$3" color="$gray10">
                Welcome back, Coach
              </Text>
            </YStack>

            {/* Stats Overview */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Overview
              </Text>
              <XStack gap="$3" flexWrap="wrap">
                <Card 
                  elevate 
                  size="$4" 
                  p="$3" 
                  backgroundColor="white"
                  f={1}
                  minWidth={150}
                >
                  <YStack gap="$2">
                    <XStack ai="center" gap="$2">
                      <Users size={20} color="#7c3aed" />
                      <Text fontSize="$3" color="$gray10">Athletes</Text>
                    </XStack>
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">
                      {stats.totalAthletes}
                    </Text>
                    <Text fontSize="$2" color="#10b981">
                      +{stats.newAthletesThisMonth} this month
                    </Text>
                  </YStack>
                </Card>

                <Card 
                  elevate 
                  size="$4" 
                  p="$3" 
                  backgroundColor="white"
                  f={1}
                  minWidth={150}
                >
                  <YStack gap="$2">
                    <XStack ai="center" gap="$2">
                      <BarChart3 size={20} color="#7c3aed" />
                      <Text fontSize="$3" color="$gray10">Programs</Text>
                    </XStack>
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">
                      {stats.activePrograms}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Active</Text>
                  </YStack>
                </Card>
              </XStack>

              <XStack gap="$3" flexWrap="wrap">
                <Card 
                  elevate 
                  size="$4" 
                  p="$3" 
                  backgroundColor="white"
                  f={1}
                  minWidth={150}
                >
                  <YStack gap="$2">
                    <XStack ai="center" gap="$2">
                      <TrendingUp size={20} color="#7c3aed" />
                      <Text fontSize="$3" color="$gray10">Compliance</Text>
                    </XStack>
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">
                      {stats.averageComplianceRate}%
                    </Text>
                    <Text fontSize="$2" color="$gray10">Average rate</Text>
                  </YStack>
                </Card>

                <Card 
                  elevate 
                  size="$4" 
                  p="$3" 
                  backgroundColor="white"
                  f={1}
                  minWidth={150}
                >
                  <YStack gap="$2">
                    <XStack ai="center" gap="$2">
                      <MessageSquare size={20} color="#7c3aed" />
                      <Text fontSize="$3" color="$gray10">Messages</Text>
                    </XStack>
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">
                      {stats.messagesUnread}
                    </Text>
                    <Text fontSize="$2" color="#ef4444">Unread</Text>
                  </YStack>
                </Card>
              </XStack>
            </YStack>

            {/* Quick Actions */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Quick Actions
              </Text>
              <XStack gap="$3" flexWrap="wrap">
                <Button
                  size="$4"
                  backgroundColor="#7c3aed"
                  color="white"
                  onPress={handleCreateProgram}
                  f={1}
                  minWidth={150}
                  pressStyle={{ backgroundColor: '#6d28d9' }}
                >
                  <XStack ai="center" gap="$2">
                    <Plus size={20} color="white" />
                    <Text color="white" fontWeight="600">New Program</Text>
                  </XStack>
                </Button>
                <Button
                  size="$4"
                  backgroundColor="white"
                  borderWidth={1}
                  borderColor="#e5e7eb"
                  onPress={handleViewAthletes}
                  f={1}
                  minWidth={150}
                  pressStyle={{ backgroundColor: '#f9fafb' }}
                >
                  <XStack ai="center" gap="$2">
                    <Users size={20} color="#7c3aed" />
                    <Text color="$gray12" fontWeight="600">View Athletes</Text>
                  </XStack>
                </Button>
              </XStack>
            </YStack>

            {/* Recent Activity */}
            <YStack gap="$3">
              <XStack ai="center" jc="space-between">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Recent Activity
                </Text>
                <Button
                  size="$2"
                  chromeless
                  color="$gray10"
                  onPress={() => {}}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Text fontSize="$3" color="#7c3aed">View All</Text>
                </Button>
              </XStack>
              
              <Card elevate size="$4" p="$4" backgroundColor="white">
                <YStack gap="$3">
                  {recentActivities.map((activity, index) => (
                    <XStack
                      key={activity.id}
                      ai="center"
                      gap="$3"
                      pb="$3"
                      borderBottomWidth={index < recentActivities.length - 1 ? 1 : 0}
                      borderBottomColor="$gray5"
                    >
                      <YStack
                        w={32}
                        h={32}
                        borderRadius="$10"
                        backgroundColor="#faf5ff"
                        ai="center"
                        jc="center"
                      >
                        {getActivityIcon(activity.type)}
                      </YStack>
                      <YStack f={1} gap="$1">
                        <Text fontSize="$3" fontWeight="600" color="$gray12">
                          {activity.athleteName}
                        </Text>
                        <Text fontSize="$2" color="$gray10">
                          {activity.activity}: {activity.programName}
                        </Text>
                      </YStack>
                      <Text fontSize="$2" color="$gray10">
                        {activity.time}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </Card>
            </YStack>

            {/* Upcoming Programs */}
            <YStack gap="$3">
              <XStack ai="center" jc="space-between">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Active Programs
                </Text>
                <Button
                  size="$2"
                  chromeless
                  color="$gray10"
                  onPress={handleViewPrograms}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <XStack ai="center" gap="$1">
                    <Text fontSize="$3" color="#7c3aed">See All</Text>
                    <ChevronRight size={16} color="#7c3aed" />
                  </XStack>
                </Button>
              </XStack>
              
              {upcomingPrograms.map((program) => (
                <Card 
                  key={program.id}
                  elevate 
                  size="$4" 
                  p="$4" 
                  backgroundColor="white"
                  pressStyle={{ scale: 0.98 }}
                >
                  <XStack ai="center" jc="space-between">
                    <YStack f={1} gap="$1">
                      <Text fontSize="$4" fontWeight="600" color="$gray12">
                        {program.athleteName}
                      </Text>
                      <Text fontSize="$3" color="$gray10">
                        {program.programName}
                      </Text>
                      <XStack ai="center" gap="$2" mt="$1">
                        <Text fontSize="$2" color="#7c3aed">
                          Week {program.week}/{program.totalWeeks}
                        </Text>
                        <Text fontSize="$2" color="$gray10">
                          • Next: {program.nextWorkout}
                        </Text>
                      </XStack>
                    </YStack>
                    <ChevronRight size={20} color="#9ca3af" />
                  </XStack>
                </Card>
              ))}
            </YStack>

            {/* Bottom Spacing */}
            <YStack h={20} />
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}