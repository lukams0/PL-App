// app/(athlete)/programs/[programId].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Dumbbell, Target } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Paragraph, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

import BlockCard from '@/components/athlete/programs/BlockCard';
import {
  AthleteProgramWithProgram,
  programService,
  ProgramWithDetails,
} from '@/services/program.service';
import type { Workout } from '@/types/datebase.types';

type ProgramStatus = 'current' | 'upcoming' | 'completed' | 'library';

function mapDbStatusToUiStatus(dbStatus?: string | null): ProgramStatus {
  if (!dbStatus) return 'library';
  if (dbStatus === 'active') return 'current';
  if (dbStatus === 'completed') return 'completed';
  if (dbStatus === 'upcoming') return 'upcoming';
  return 'library';
}

export default function ProgramDetailScreen() {
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const router = useRouter();

  const [program, setProgram] = useState<ProgramWithDetails | null>(null);
  const [assignment, setAssignment] = useState<AthleteProgramWithProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!programId) return;
    const load = async () => {
      try {
        setLoading(true);

        const [details, athletePrograms] = await Promise.all([
          programService.getProgramDetails(programId),
          programService.getAthletePrograms(),
        ]);

        setProgram(details);

        const ap = athletePrograms.find((p) => p.program.id === programId) ?? null;
        setAssignment(ap);
      } catch (err) {
        console.error('Error loading program details:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [programId]);

  const uiStatus: ProgramStatus = useMemo(
    () => mapDbStatusToUiStatus(assignment?.status),
    [assignment]
  );

  const primaryActionLabel = useMemo(() => {
    if (uiStatus === 'current') return 'Resume Program';
    if (uiStatus === 'completed') return 'View Program History';
    return 'Start This Program';
  }, [uiStatus]);

  const handlePressWorkout = (workout: Workout) => {
    console.log(workout.id)
    router.push({
      pathname: '/(athlete)/(tabs)/programs/workouts/[workoutId]',
      params: { workoutId: workout.id },
    });
  };

  if (loading && !program) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <Spinner size="large" />
        </YStack>
      </SafeAreaView>
    );
  }

  if (!program) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <YStack f={1} ai="center" jc="center" p="$4">
          <Text fontSize="$6" fontWeight="700" color="$gray12">
            Program not found
          </Text>
          <Text fontSize="$3" color="$gray10" mt="$2" textAlign="center">
            This program may have been removed or is not available.
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  // Placeholder labels until you add goal/level fields to the DB or metadata table
  const goalLabel = 'Strength';
  const levelLabel = 'All levels';
  const durationLabel = `${program.duration_weeks ?? 0} weeks`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <YStack p="$4" gap="$4">
          {/* Header */}
          {/* Back button */}
        <Pressable onPress={() => router.back()}>
          <XStack ai="center" gap="$1.5" mb="$1">
            <ArrowLeft size={18} color="#4b5563" />
            <Text fontSize="$2" color="$gray10">
              Back to programs
            </Text>
          </XStack>
        </Pressable>
          <YStack gap="$2">
            <Text fontSize="$7" fontWeight="bold" color="$gray12">
              {program.name}
            </Text>
            {program.description ? (
              <Paragraph fontSize="$3" color="$gray11">
                {program.description}
              </Paragraph>
            ) : null}
            <XStack gap="$1.5" fw="wrap" mt="$1">
              <HeaderTag icon={Dumbbell} label={goalLabel} />
              <HeaderTag icon={Target} label={levelLabel} />
              <HeaderTag icon={Calendar} label={durationLabel} />
            </XStack>
          </YStack>

          {/* Primary CTA */}
          <Button
            size="$4"
            br="$6"
            backgroundColor="#7c3aed"
            color="white"
            onPress={() => {
              // TODO: hook into backend (assign/start/resume program)
              console.log(primaryActionLabel, program.id);
              // e.g. programService.assignProgramToCurrentAthlete({ programId: program.id })
            }}
          >
            {primaryActionLabel}
          </Button>

          {/* Meta */}
          <ProgramMeta
            program={program}
            assignment={assignment}
            status={uiStatus}
          />

          <Separator />

          {/* Blocks */}
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="bold" color="$gray12">
              Blocks & Workouts
            </Text>
            <YStack gap="$3">
              {program.blocks.map((block) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onPressWorkout={handlePressWorkout}
                />
              ))}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

type HeaderTagProps = {
  icon: React.ComponentType<any>;
  label: string;
};

function HeaderTag({ icon: Icon, label }: HeaderTagProps) {
  return (
    <XStack
      ai="center"
      gap="$1"
      px="$2"
      py="$1"
      borderRadius="$4"
      backgroundColor="#eef2ff"
    >
      <Icon size={14} color="#4f46e5" />
      <Text fontSize="$2" color="#4f46e5" textTransform="capitalize">
        {label}
      </Text>
    </XStack>
  );
}

function ProgramMeta({
  program,
  assignment,
  status,
}: {
  program: ProgramWithDetails;
  assignment: AthleteProgramWithProgram | null;
  status: ProgramStatus;
}) {
  const start = assignment?.start_date
    ? new Date(assignment.start_date).toLocaleDateString()
    : 'N/A';
  const end = assignment?.end_date
    ? new Date(assignment.end_date).toLocaleDateString()
    : status === 'current'
    ? 'In progress'
    : 'N/A';

  const totalWorkouts = program.blocks.reduce(
    (sum, b) => sum + (b.workouts?.length ?? 0),
    0
  );

  let overviewText = '';
  if (status === 'current') {
    overviewText =
      'You are currently running this program. Progress tracking will hook into your sessions once the backend is wired up.';
  } else if (status === 'completed') {
    overviewText =
      'You completed this program. You’ll be able to review how your lifts changed across blocks from your workout history.';
  } else if (status === 'library') {
    overviewText =
      'This is a pre-made template. Starting it will copy the structure into your own programs.';
  } else if (status === 'upcoming') {
    overviewText =
      'This program is scheduled to start soon. Once it begins, your workouts will be tracked against it.';
  }

  return (
    <YStack gap="$1.5">
      <Text fontSize="$4" fontWeight="600" color="$gray12">
        Overview
      </Text>
      <Text fontSize="$3" color="$gray11">
        {overviewText}
      </Text>

      <YStack gap="$0.5" mt="$1">
        <Text fontSize="$3" color="$gray10">
          Start: {start}
        </Text>
        <Text fontSize="$3" color="$gray10">
          End: {end}
        </Text>
        <Text fontSize="$3" color="$gray10">
          Blocks: {program.blocks.length} • Workouts: {totalWorkouts}
        </Text>
      </YStack>
    </YStack>
  );
}
