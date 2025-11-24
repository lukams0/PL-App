import AnalyticsComponent from "@/components/coach/analytics/AnalyticsComponent";
import { useState } from "react";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Fake analytics data
  const analyticsData = {
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
      { name: 'Powerlifting', athletes: 4, avgProgress: 65 },
      { name: 'Hypertrophy', athletes: 3, avgProgress: 45 },
      { name: 'Strength Focus', athletes: 2, avgProgress: 80 },
      { name: 'General Fitness', athletes: 3, avgProgress: 55 },
    ],
    athleteEngagement: {
      highly_engaged: 6,
      moderately_engaged: 4,
      low_engagement: 2,
    },
    topPerformers: [
      { name: 'Sarah Johnson', compliance: 95, prs: 8, avatar: '' },
      { name: 'Mike Chen', compliance: 92, prs: 6, avatar: '' },
      { name: 'Emily Davis', compliance: 88, prs: 5, avatar: '' },
    ],
    recentPRs: [
      { athlete: 'Sarah Johnson', exercise: 'Squat', weight: '225 lbs', reps: 5, date: '2 days ago' },
      { athlete: 'Mike Chen', exercise: 'Bench Press', weight: '185 lbs', reps: 3, date: '3 days ago' },
      { athlete: 'John Smith', exercise: 'Deadlift', weight: '405 lbs', reps: 1, date: '1 week ago' },
    ],
    stats: {
      totalWorkouts: 48,
      avgSessionDuration: 65,
      totalVolume: '152,450 lbs',
      avgComplianceRate: 85,
    }
  };

  return (
    <AnalyticsComponent
      dateRange={dateRange}
      setDateRange={setDateRange}
      analyticsData={analyticsData}
    />
  );
}