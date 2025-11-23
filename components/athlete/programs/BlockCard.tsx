// components/athlete/programs/BlockCard.tsx
import { ChevronRight, Clock, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';
import { Card, Paragraph, Text, XStack, YStack } from 'tamagui';

import type { BlockWithWorkouts } from '@/services/program.service';
import type { Workout } from '@/types/datebase.types';

type Props = {
  block: BlockWithWorkouts;
  onPressWorkout?: (workout: Workout) => void;
};

export default function BlockCard({ block, onPressWorkout }: Props) {
  const weekRangeLabel =
    block.start_week && block.end_week
      ? `Week ${block.start_week}–${block.end_week}`
      : 'Week range not set';

  return (
    <Card
      elevate
      bordered
      p="$4"
      br="$6"
      backgroundColor="white"
    >
      <YStack gap="$3">
        {/* Block header */}
        <YStack gap="$1">
          <Text fontSize="$5" fontWeight="700" color="$gray12">
            {block.name}
          </Text>
          <Text fontSize="$2" color="$gray10">
            {weekRangeLabel}
          </Text>
          {block.focus ? (
            <Paragraph fontSize="$3" color="$gray11">
              {block.focus}
            </Paragraph>
          ) : null}
        </YStack>

        {/* Workouts */}
        <YStack gap="$1.5">
          {block.workouts.map((w, idx) => (
            <WorkoutRow
              key={w.id}
              index={idx}
              workout={w as Workout}
              onPress={() => onPressWorkout?.(w as Workout)}
            />
          ))}
        </YStack>
      </YStack>
    </Card>
  );
}

type WorkoutRowProps = {
  workout: Workout;
  index: number;
  onPress?: () => void;
};

function WorkoutRow({ workout, index, onPress }: WorkoutRowProps) {
  const formatDate = (iso?: string | null) => {
    if (!iso) return 'Planned';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Planned';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Pressable onPress={onPress}>
      <XStack
        ai="center"
        jc="space-between"
        py="$2"
        px="$2"
        borderRadius="$3"
        backgroundColor="#f9fafb"
      >
        <YStack gap="$1" f={1}>
          <Text fontSize="$2" color="$gray10">
            Day {index + 1}
          </Text>
          <Text fontSize="$4" fontWeight="600" color="$gray12">
            {workout.name}
          </Text>
          <Text fontSize="$2" color="$gray10">
            {formatDate(workout.start_time)} •{' '}
            {workout.duration_minutes ? `${workout.duration_minutes} min` : 'Duration TBD'}
          </Text>
        </YStack>

        <YStack ai="flex-end" gap="$1" w={90}>
          <XStack ai="center" gap="$1">
            <Clock size={14} color="#6b7280" />
            <Text fontSize="$2" color="#6b7280">
              {workout.duration_minutes ?? '--'}m
            </Text>
          </XStack>
          <XStack ai="center" gap="$1">
            <TrendingUp size={14} color="#7c3aed" />
            <Text fontSize="$2" color="#7c3aed">
              {workout.volume?.toLocaleString() ?? '--'} lbs
            </Text>
          </XStack>
        </YStack>

        <ChevronRight size={18} color="#9ca3af" />
      </XStack>
    </Pressable>
  );
}
