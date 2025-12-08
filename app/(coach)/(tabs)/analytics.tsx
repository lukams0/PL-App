// app/(coach)/(tabs)/analytics.tsx
import AnalyticsComponent from "@/components/coach/analytics/AnalyticsComponent";
import { router } from "expo-router";
import { useState } from "react";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  const [refreshing, setRefreshing] = useState(false);
  
  // Fake analytics data - in production, this would come from services
  const getAnalyticsData = (range: 'week' | 'month' | 'year') => {
    // Different data based on date range
    const multiplier = range === 'week' ? 1 : range === 'month' ? 4 : 52;
    
    return {
      workoutCompletion: [
        { day: 'Mon', completed: 8, scheduled: 10 },
        { day: 'Tue', completed: 9, scheduled: 10 },
        { day: 'Wed', completed: 7, scheduled: 9 },
        { day: 'Thu', completed: 10, scheduled: 10 },
        { day: 'Fri', completed: 6, scheduled: 8 },
        { day: 'Sat', completed: 5, scheduled: 6 },
        { day: 'Sun', completed: 3, scheduled: 4 },
      ],
      programProgress: [
        { id: '1', name: 'Powerlifting Prep', athletes: 4, avgProgress: 65 },
        { id: '2', name: 'Hypertrophy Focus', athletes: 3, avgProgress: 45 },
        { id: '3', name: 'Strength Builder', athletes: 2, avgProgress: 80 },
        { id: '4', name: 'General Fitness', athletes: 3, avgProgress: 55 },
      ],
      athleteEngagement: {
        highly_engaged: 6,
        moderately_engaged: 4,
        low_engagement: 2,
      },
      topPerformers: [
        { id: '1', name: 'Sarah Johnson', compliance: 95, prs: 8 },
        { id: '2', name: 'Mike Chen', compliance: 92, prs: 6 },
        { id: '3', name: 'Emily Davis', compliance: 88, prs: 5 },
      ],
      recentPRs: [
        { athleteId: '1', athlete: 'Sarah Johnson', exercise: 'Squat', weight: '225 lbs', reps: 5, date: '2 days ago' },
        { athleteId: '2', athlete: 'Mike Chen', exercise: 'Bench Press', weight: '185 lbs', reps: 3, date: '3 days ago' },
        { athleteId: '3', athlete: 'John Smith', exercise: 'Deadlift', weight: '405 lbs', reps: 1, date: '1 week ago' },
      ],
      stats: {
        totalWorkouts: 48 * multiplier,
        avgSessionDuration: 65,
        totalVolume: range === 'week' ? '152,450 lbs' : range === 'month' ? '609,800 lbs' : '7.9M lbs',
        avgComplianceRate: 85,
      }
    };
  };

  const [analyticsData, setAnalyticsData] = useState(getAnalyticsData('week'));

  const handleDateRangeChange = (range: 'week' | 'month' | 'year') => {
    setDateRange(range);
    setAnalyticsData(getAnalyticsData(range));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // In production, fetch fresh data from services
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnalyticsData(getAnalyticsData(dateRange));
    setRefreshing(false);
  };

  const handleAthletePress = (athleteId: string) => {
    // Navigate to athlete detail page
    router.push({
      pathname: '/(coach)/(tabs)/athletes/[athleteId]',
      params: { athleteId }
    });
  };

  const handleProgramPress = (programId: string) => {
    if (programId === 'all') {
      // Navigate to programs list
      router.push('/(coach)/(tabs)/programs');
    } else {
      // Navigate to specific program
      router.push({
        pathname: '/(coach)/(tabs)/programs/[programid]',
        params: { programid: programId }
      });
    }
  };

  return (
    <AnalyticsComponent
      dateRange={dateRange}
      setDateRange={handleDateRangeChange}
      analyticsData={analyticsData}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onAthletePress={handleAthletePress}
      onProgramPress={handleProgramPress}
    />
  );
}