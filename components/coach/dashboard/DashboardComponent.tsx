// components/coach/dashboard/DashboardComponent.tsx
import { CoachProfile } from '@/types/datebase.types';
import {
  Award,
  BarChart3,
  Calendar,
  ChevronRight,
  MessageSquare,
  PieChart,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react-native';
import { Pressable, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, XStack, YStack } from 'tamagui';

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
  handleViewAnalytics: () => void;
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
  handleViewAnalytics,
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

            {/* Quick Actions */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Quick Actions
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$3">
                  <Pressable>
                    <Card
                      elevate
                      size="$4"
                      p="$3"
                      backgroundColor="#7c3aed"
                      w={120}
                      pressStyle={{ scale: 0.95 }}
                      onPress={handleCreateProgram}
                    >
                      <YStack ai="center" gap="$2">
                        <Plus size={24} color="white" />
                        <Text fontSize="$2" fontWeight="600" color="white" textAlign="center">
                          New Program
                        </Text>
                      </YStack>
                    </Card>
                  </Pressable>
                  
                  <Pressable>
                    <Card
                      elevate
                      size="$4"
                      p="$3"
                      backgroundColor="white"
                      w={120}
                      pressStyle={{ scale: 0.95 }}
                      onPress={handleViewAnalytics}
                    >
                      <YStack ai="center" gap="$2">
                        <PieChart size={24} color="#7c3aed" />
                        <Text fontSize="$2" fontWeight="600" color="$gray12" textAlign="center">
                          Analytics
                        </Text>
                      </YStack>
                    </Card>
                  </Pressable>

                  <Pressable>
                    <Card
                      elevate
                      size="$4"
                      p="$3"
                      backgroundColor="white"
                      w={120}
                      pressStyle={{ scale: 0.95 }}
                      onPress={handleViewMessages}
                    >
                      <YStack ai="center" gap="$2" position="relative">
                        <MessageSquare size={24} color="#7c3aed" />
                        {stats.messagesUnread > 0 && (
                          <XStack
                            position="absolute"
                            top={-4}
                            right={20}
                            backgroundColor="#ef4444"
                            borderRadius="$10"
                            w={18}
                            h={18}
                            ai="center"
                            jc="center"
                          >
                            <Text fontSize={10} fontWeight="bold" color="white">
                              {stats.messagesUnread}
                            </Text>
                          </XStack>
                        )}
                        <Text fontSize="$2" fontWeight="600" color="$gray12" textAlign="center">
                          Messages
                        </Text>
                      </YStack>
                    </Card>
                  </Pressable>

                  <Pressable>
                    <Card
                      elevate
                      size="$4"
                      p="$3"
                      backgroundColor="white"
                      w={120}
                      pressStyle={{ scale: 0.95 }}
                      onPress={handleViewAthletes}
                    >
                      <YStack ai="center" gap="$2">
                        <Users size={24} color="#7c3aed" />
                        <Text fontSize="$2" fontWeight="600" color="$gray12" textAlign="center">
                          Athletes
                        </Text>
                      </YStack>
                    </Card>
                  </Pressable>
                </XStack>
              </ScrollView>
            </YStack>

            {/* Stats Overview */}
            <YStack gap="$3">
              <XStack ai="center" jc="space-between">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Overview
                </Text>
                <Pressable onPress={handleViewAnalytics}>
                  <XStack ai="center" gap="$1">
                    <Text fontSize="$3" color="#7c3aed" fontWeight="600">
                      View Analytics
                    </Text>
                    <ChevronRight size={16} color="#7c3aed" />
                  </XStack>
                </Pressable>
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
                    <Text fontSize="$2" color="$gray10">
                      Active
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
                      <Calendar size={20} color="#7c3aed" />
                      <Text fontSize="$3" color="$gray10">Workouts</Text>
                    </XStack>
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">
                      {stats.completedWorkouts}
                    </Text>
                    <Text fontSize="$2" color="$gray10">
                      This week
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
                      <TrendingUp size={20} color="#10b981" />
                      <Text fontSize="$3" color="$gray10">Compliance</Text>
                    </XStack>
                    <Text fontSize="$7" fontWeight="bold" color="#10b981">
                      {stats.averageComplianceRate}%
                    </Text>
                    <Text fontSize="$2" color="$gray10">
                      Average
                    </Text>
                  </YStack>
                </Card>
              </XStack>
            </YStack>

            {/* Recent Activity */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Recent Activity
              </Text>
              <Card elevate size="$4" p="$3" backgroundColor="white">
                <YStack gap="$3">
                  {recentActivities.length === 0 ? (
                    <Text fontSize="$3" color="$gray10" textAlign="center" py="$3">
                      No recent activity
                    </Text>
                  ) : (
                    recentActivities.map((activity, index) => (
                      <YStack key={activity.id}>
                        <XStack ai="flex-start" gap="$3">
                          <YStack pt="$1">
                            {getActivityIcon(activity.type)}
                          </YStack>
                          <YStack f={1} gap="$0.5">
                            <Text fontSize="$3" fontWeight="600" color="$gray12">
                              {activity.athleteName}
                            </Text>
                            <Text fontSize="$2" color="$gray11">
                              {activity.activity}
                            </Text>
                            <Text fontSize="$2" color="$gray10">
                              {activity.programName}
                            </Text>
                          </YStack>
                          <Text fontSize="$2" color="$gray10">
                            {activity.time}
                          </Text>
                        </XStack>
                        {index < recentActivities.length - 1 && (
                          <YStack h={1} backgroundColor="$gray3" my="$2" />
                        )}
                      </YStack>
                    ))
                  )}
                </YStack>
              </Card>
            </YStack>

            {/* Upcoming Programs */}
            <YStack gap="$3">
              <XStack ai="center" jc="space-between">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Athlete Progress
                </Text>
                <Pressable onPress={handleViewPrograms}>
                  <XStack ai="center" gap="$1">
                    <Text fontSize="$3" color="#7c3aed" fontWeight="600">
                      View All
                    </Text>
                    <ChevronRight size={16} color="#7c3aed" />
                  </XStack>
                </Pressable>
              </XStack>
              <YStack gap="$2">
                {upcomingPrograms.length === 0 ? (
                  <Card elevate size="$4" p="$4" backgroundColor="white">
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      No active programs
                    </Text>
                  </Card>
                ) : (
                  upcomingPrograms.map((program) => (
                    <Card key={program.id} elevate size="$4" p="$3" backgroundColor="white">
                      <XStack ai="center" jc="space-between">
                        <YStack f={1} gap="$1">
                          <Text fontSize="$3" fontWeight="600" color="$gray12">
                            {program.athleteName}
                          </Text>
                          <Text fontSize="$2" color="$gray11">
                            {program.programName}
                          </Text>
                          <Text fontSize="$2" color="$gray10">
                            Week {program.week} of {program.totalWeeks}
                          </Text>
                        </YStack>
                        <YStack ai="flex-end" gap="$1">
                          <Text fontSize="$2" color="#7c3aed" fontWeight="600">
                            {program.nextWorkout}
                          </Text>
                          <Text fontSize="$2" color="$gray10">
                            {Math.round((program.week / program.totalWeeks) * 100)}% complete
                          </Text>
                        </YStack>
                      </XStack>
                    </Card>
                  ))
                )}
              </YStack>
            </YStack>

            {/* Bottom spacing */}
            <YStack h={20} />
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}