import CoachProfileComponent from '@/components/coach/profile/ProfileComponent';
import { CoachProfile, Profile } from '@/types/datebase.types';
import { router } from 'expo-router';
import { useState } from 'react';

// Fake coach data
const fakeProfile: Profile = {
  id: '1',
  email: 'coach@example.com',
  full_name: 'John Coach',
  role: 'coach',
  avatar_url: null,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const fakeCoachProfile: CoachProfile = {
  id: '1',
  user_id: '1',
  bio: 'Certified strength coach with 8 years of experience. Specializing in powerlifting and Olympic weightlifting. Former competitive powerlifter with a 1500+ total.',
  years_coaching: 8,
  specialties: ['powerlifting', 'strength', 'weightlifting'],
  coaching_format: 'hybrid',
  accepting_new_athletes: true,
  athlete_levels: ['intermediate', 'advanced'],
  location: 'New York, NY',
  monthly_rate: 250,
  instagram: '@coachhandle',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const fakeStats = {
  totalAthletes: 12,
  activePrograms: 8,
  totalProgramsCreated: 15,
  averageAthleteRetention: '18 months',
  totalWorkoutsCoached: 1250,
  successStories: 24,
};

const fakeAchievements = [
  {
    id: '1',
    title: 'Elite Coach',
    description: 'Coached 10+ athletes',
    icon: 'trophy',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'Program Master',
    description: 'Created 15+ programs',
    icon: 'award',
    date: '2024-02-20',
  },
  {
    id: '3',
    title: 'High Retention',
    description: '90%+ athlete retention',
    icon: 'star',
    date: '2024-03-10',
  },
];

export default function CoachProfilePage() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // In real app, fetch profile data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleEditProfile = () => {
    //router.push('/(coach)/profile/edit');
  };

  const handleSettingsPress = () => {
    router.push('/(coach)/(tabs)/settings');
  };

  const handleViewAchievements = () => {
    //router.push('/(coach)/(tabs)/achievements');
  };

  return (
    <CoachProfileComponent
      profile={fakeProfile}
      coachProfile={fakeCoachProfile}
      stats={fakeStats}
      achievements={fakeAchievements}
      refreshing={refreshing}
      onRefresh={onRefresh}
      handleEditProfile={handleEditProfile}
      handleSettingsPress={handleSettingsPress}
      handleViewAchievements={handleViewAchievements}
    />
  );
}