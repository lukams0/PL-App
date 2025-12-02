import AthletesListComponent from '@/components/coach/athletes/AthletesListComponent';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

// Fake athlete data
const fakeAthletes = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: null,
    currentProgram: 'Powerlifting Prep',
    weekInProgram: 4,
    totalWeeks: 12,
    lastWorkout: '2 hours ago',
    complianceRate: 95,
    joinedDate: '2024-01-15',
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: null,
    currentProgram: 'Strength Builder',
    weekInProgram: 2,
    totalWeeks: 8,
    lastWorkout: '1 day ago',
    complianceRate: 88,
    joinedDate: '2024-02-20',
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    avatar: null,
    currentProgram: 'Hypertrophy Focus',
    weekInProgram: 6,
    totalWeeks: 8,
    lastWorkout: '3 days ago',
    complianceRate: 92,
    joinedDate: '2023-11-10',
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    avatar: null,
    currentProgram: null,
    weekInProgram: 0,
    totalWeeks: 0,
    lastWorkout: '1 week ago',
    complianceRate: 0,
    joinedDate: '2024-03-01',
    status: 'inactive' as const,
  },
  {
    id: '5',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    avatar: null,
    currentProgram: 'Olympic Lifting',
    weekInProgram: 8,
    totalWeeks: 16,
    lastWorkout: 'Today',
    complianceRate: 98,
    joinedDate: '2023-09-05',
    status: 'active' as const,
  },
];

export default function AthletesPage() {
  const [athletes] = useState(fakeAthletes);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredAthletes = useMemo(() => {
    return athletes.filter(athlete => {
      const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            athlete.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || athlete.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [athletes, searchQuery, filterStatus]);

  const onRefresh = async () => {
    setRefreshing(true);
    // In real app, fetch athletes from service
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleAthletePress = (athleteId: string) => {
    console.log("test")
    router.push({
      pathname: '/(coach)/(tabs)/athletes/[athleteId]',
      params: { athleteId }
    });
  };

  const handleAddAthlete = () => {
    router.push('/(coach)/(tabs)/athletes/invite');
  };

  const handleMessageAthlete = (athleteId: string) => {
    router.push({
      pathname: '/(coach)/(tabs)/messages',
      params: { athleteId }
    });
  };

  const handleViewProgram = (athleteId: string) => {
    router.push({
      pathname: '/(coach)/(tabs)/programs',
      params: { athleteId }
    });
  };

  return (
    <AthletesListComponent
      athletes={filteredAthletes}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      refreshing={refreshing}
      onRefresh={onRefresh}
      handleAthletePress={handleAthletePress}
      handleAddAthlete={handleAddAthlete}
      handleMessageAthlete={handleMessageAthlete}
      handleViewProgram={handleViewProgram}
    />
  );
}