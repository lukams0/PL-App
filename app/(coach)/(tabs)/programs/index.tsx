import ProgramsListComponent from '@/components/coach/programs/ProgramsListComponent';
import { router } from 'expo-router';
import { useState } from 'react';

// Fake program data
const fakePrograms = [
  {
    id: '1',
    name: 'Powerlifting Prep',
    description: '12-week comprehensive powerlifting program focusing on the big three lifts',
    duration_weeks: 12,
    athleteCount: 3,
    createdDate: '2024-01-10',
    lastUpdated: '2024-03-15',
    status: 'active' as const,
    tags: ['strength', 'powerlifting'],
  },
  {
    id: '2',
    name: 'Strength Builder',
    description: '8-week progressive overload program for intermediate lifters',
    duration_weeks: 8,
    athleteCount: 5,
    createdDate: '2024-02-01',
    lastUpdated: '2024-03-20',
    status: 'active' as const,
    tags: ['strength', 'general'],
  },
  {
    id: '3',
    name: 'Hypertrophy Focus',
    description: 'High volume training program for muscle growth',
    duration_weeks: 8,
    athleteCount: 2,
    createdDate: '2023-12-15',
    lastUpdated: '2024-02-28',
    status: 'active' as const,
    tags: ['hypertrophy', 'bodybuilding'],
  },
  {
    id: '4',
    name: 'Olympic Lifting',
    description: 'Technical focus on snatch and clean & jerk with accessory work',
    duration_weeks: 16,
    athleteCount: 1,
    createdDate: '2023-11-01',
    lastUpdated: '2024-01-15',
    status: 'draft' as const,
    tags: ['weightlifting', 'olympic'],
  },
  {
    id: '5',
    name: 'Beginner Foundation',
    description: 'Introduction to barbell training for new lifters',
    duration_weeks: 6,
    athleteCount: 0,
    createdDate: '2024-03-01',
    lastUpdated: '2024-03-01',
    status: 'draft' as const,
    tags: ['beginner', 'foundation'],
  },
];

export default function ProgramsPage() {
  const [programs] = useState(fakePrograms);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || program.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // In real app, fetch programs from service
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCreateProgram = () => {
    router.push('/(coach)/(tabs)/programs/create');
  };

  const handleProgramPress = (programId: string) => {
    //router.push(`/(coach)/programs/${programId}`);
  };

  const handleEditProgram = (programId: string) => {
    //router.push(`/(coach)/programs/${programId}/edit`);
  };

  const handleDuplicateProgram = (programId: string) => {
    console.log('Duplicate program:', programId);
    // In real app, duplicate program logic
  };

  const handleDeleteProgram = (programId: string) => {
    console.log('Delete program:', programId);
    // In real app, delete program logic
  };

  return (
    <ProgramsListComponent
      programs={filteredPrograms}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      refreshing={refreshing}
      onRefresh={onRefresh}
      handleCreateProgram={handleCreateProgram}
      handleProgramPress={handleProgramPress}
      handleEditProgram={handleEditProgram}
      handleDuplicateProgram={handleDuplicateProgram}
      handleDeleteProgram={handleDeleteProgram}
    />
  );
}