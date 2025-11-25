import CoachDashboardComponent from '@/components/coach/dashboard/DashboardComponent';
import { CoachProfile } from '@/types/datebase.types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

// Fake data for demonstration
const fakeCoachProfile: CoachProfile = {
  id: '1',
  user_id: '1',
  bio: 'Experienced strength coach specializing in powerlifting and Olympic weightlifting.',
  years_coaching: 8,
  specialties: ['powerlifting', 'strength', 'weightlifting'],
  coaching_format: 'hybrid',
  accepting_new_athletes: true,
  athlete_levels: ['intermediate', 'advanced'],
  location: 'New York, NY',
  monthly_rate: 250,
  instagram: '@coachhandle',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const fakeStats = {
  totalAthletes: 12,
  activePrograms: 8,
  completedWorkouts: 156,
  averageComplianceRate: 92,
  newAthletesThisMonth: 2,
  messagesUnread: 3,
};

const fakeRecentActivities = [
  {
    id: '1',
    athleteName: 'John Smith',
    activity: 'Completed workout',
    programName: 'Powerlifting Program',
    time: '2 hours ago',
    type: 'workout' as const,
  },
  {
    id: '2',
    athleteName: 'Sarah Johnson',
    activity: 'Started new program',
    programName: 'Strength Builder',
    time: '5 hours ago',
    type: 'program' as const,
  },
  {
    id: '3',
    athleteName: 'Mike Wilson',
    activity: 'Hit new PR',
    programName: 'Bench Press - 315 lbs',
    time: '1 day ago',
    type: 'pr' as const,
  },
  {
    id: '4',
    athleteName: 'Emma Davis',
    activity: 'Sent message',
    programName: 'Question about form',
    time: '1 day ago',
    type: 'message' as const,
  },
];

const fakeUpcomingPrograms = [
  {
    id: '1',
    athleteName: 'John Smith',
    programName: 'Powerlifting Prep',
    nextWorkout: 'Tomorrow',
    week: 4,
    totalWeeks: 12,
  },
  {
    id: '2',
    athleteName: 'Sarah Johnson',
    programName: 'Strength Builder',
    nextWorkout: 'Today',
    week: 2,
    totalWeeks: 8,
  },
];

export default function CoachDashboard() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    // In real app, fetch data from services
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleViewAthletes = () => {
    router.push('/(coach)/(tabs)/athletes');
  };

  const handleViewPrograms = () => {
    router.push('/(coach)/(tabs)/programs');
  };

  const handleViewMessages = () => {
    router.push('/(coach)/(tabs)/messages');
  };

  const handleCreateProgram = () => {
    router.push('/(coach)/(tabs)/programs/create');
  };

  return (
    <CoachDashboardComponent
      coachProfile={fakeCoachProfile}
      stats={fakeStats}
      recentActivities={fakeRecentActivities}
      upcomingPrograms={fakeUpcomingPrograms}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      handleViewAthletes={handleViewAthletes}
      handleViewPrograms={handleViewPrograms}
      handleViewMessages={handleViewMessages}
      handleCreateProgram={handleCreateProgram}
    />
  );
}