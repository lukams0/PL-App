import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

import ProgramCard from '@/components/athlete/programs/ProgramCard';
import ProgramSearchBar from '@/components/athlete/programs/ProgramSearchBar';
import { useAuth } from '@/providers/AuthContext';
import {
  AthleteProgramWithProgram,
  Program,
  programService,
} from '@/services/program.service';

type TabKey = 'current' | 'past' | 'browse';

export default function ProgramsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [tab, setTab] = useState<TabKey>('current');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentAssignments, setCurrentAssignments] = useState<AthleteProgramWithProgram[]>([]);
  const [pastAssignments, setPastAssignments] = useState<AthleteProgramWithProgram[]>([]);
  const [libraryPrograms, setLibraryPrograms] = useState<Program[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadPrograms();
  }, [user]);

  const loadPrograms = async () => {
    try {
      setLoading(true);

      const [athletePrograms, publicPrograms] = await Promise.all([
        programService.getAthletePrograms(),
        programService.getPublicPrograms(),
      ]);

      const current = athletePrograms.filter(
        (ap) => ap.status === 'active' || ap.status === 'upcoming'
      );

      const past = athletePrograms.filter(
        (ap) => ap.status === 'completed' || ap.status === 'cancelled'
      );

      setCurrentAssignments(current);
      setPastAssignments(past);
      setLibraryPrograms(publicPrograms);
    } catch (err) {
      console.error('Error loading programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrograms();
    setRefreshing(false);
  };

  const filteredLibraryPrograms = libraryPrograms.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handlePressProgram = (programId: string) => {
    router.push({
      pathname: '/(athlete)/(tabs)/programs/[programId]',
      params: { programId },
    });
  };

  const renderList = () => {
    if (loading && !refreshing) {
      return (
        <YStack ai="center" mt="$4">
          <Spinner size="large" />
        </YStack>
      );
    }

    if (tab === 'browse') {
      if (filteredLibraryPrograms.length === 0) {
        return <EmptyState tab={tab} />;
      }

      return filteredLibraryPrograms.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onPress={() => handlePressProgram(program.id)}
        />
      ));
    }

    const list = tab === 'current' ? currentAssignments : pastAssignments;

    if (list.length === 0) {
      return <EmptyState tab={tab} />;
    }

    return list.map((ap) => (
      <ProgramCard
        key={ap.id}
        program={ap.program}
        onPress={() => handlePressProgram(ap.program.id)}
      />
    ));
  };

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={['top', 'left', 'right']} // 👈 no bottom inset, so it sits flush on the tab bar
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 0, // 👈 remove bottom padding so no visible gap
          gap: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <YStack gap="$1">
          <Text fontSize={24} fontWeight="700">
            Programs
          </Text>
          <Text fontSize="$2" color="$gray11">
            View your current, past, and pre-made training programs.
          </Text>
        </YStack>

        {/* Segment control */}
        <SegmentedTabs tab={tab} onChange={setTab} />

        {/* Search only for Browse tab */}
        {tab === 'browse' && (
          <ProgramSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search pre-made programs"
          />
        )}

        <Separator />

        {/* List */}
        <YStack gap="$3">
          {renderList()}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

type SegmentedTabsProps = {
  tab: TabKey;
  onChange: (tab: TabKey) => void;
};

function SegmentedTabs({ tab, onChange }: SegmentedTabsProps) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'current', label: 'Current' },
    { key: 'past', label: 'Past' },
    { key: 'browse', label: 'Browse' },
  ];

  return (
    <XStack bg="$gray3" p="$1" br="$6" gap="$1">
      {tabs.map((t) => {
        const isActive = t.key === tab;
        return (
          <Button
            key={t.key}
            flex={1}
            size="$2"
            br="$4"
            onPress={() => onChange(t.key)}
            bg={isActive ? '$background' : 'transparent'}
            color={isActive ? '$color' : '$gray11'}
          >
            {t.label}
          </Button>
        );
      })}
    </XStack>
  );
}

function EmptyState({ tab }: { tab: TabKey }) {
  if (tab === 'browse') {
    return (
      <YStack ai="center" gap="$1" mt="$4">
        <Text fontSize={16} fontWeight="600">
          No programs match that search.
        </Text>
        <Text fontSize="$2" color="$gray11">
          Try a different keyword (e.g. “beginner”, “strength”, “meet prep”).
        </Text>
      </YStack>
    );
  }

  const label =
    tab === 'current'
      ? 'You have no active programs yet.'
      : 'You have no past programs recorded.';

  return (
    <YStack ai="center" gap="$1" mt="$4">
      <Text fontSize={16} fontWeight="600">
        {label}
      </Text>
      <Text fontSize="$2" color="$gray11">
        Start a new program from the Browse tab when you’re ready.
      </Text>
    </YStack>
  );
}
