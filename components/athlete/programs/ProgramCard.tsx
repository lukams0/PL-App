// components/athlete/programs/ProgramCard.tsx
import { Program } from '@/types/datebase.types';
import { ArrowRight, Calendar, Dumbbell, Target } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';
import { Card, Paragraph, Text, XStack, YStack } from 'tamagui';

type ProgramStatus = 'current' | 'upcoming' | 'completed' | 'library';

type Props = {
  program: Program;             // DB shape: id, name, description, duration_weeks, ...
  onPress: () => void;

  // UI / derived fields (not stored on Program row itself)
  status?: ProgramStatus;
  progressPercent?: number;
  goalLabel?: string;
  levelLabel?: string;
};

const statusLabel: Record<ProgramStatus, string> = {
  current: 'Current Program',
  upcoming: 'Upcoming',
  completed: 'Completed',
  library: 'Pre-made Program',
};

export default function ProgramCard({
  program,
  onPress,
  status = 'library',
  progressPercent,
  goalLabel,
  levelLabel,
}: Props) {
  const progress =
    typeof progressPercent === 'number'
      ? Math.round(progressPercent)
      : status === 'completed'
      ? 100
      : 0;

  const isLibrary = status === 'library';

  const goalText = goalLabel ?? 'General';
  const levelText = levelLabel ?? 'All levels';
  const durationText = `${program.duration_weeks ?? 0} weeks`;

  return (
    <Pressable onPress={onPress}>
      <Card
        bordered
        elevate
        p="$3.5"
        br="$6"
        bg="$backgroundStrong"
        hoverStyle={{ scale: 0.99 }}
      >
        <XStack gap="$3" ai="center">
          {/* Left: basic info */}
          <YStack flex={1} gap="$1.5">
            <Text fontSize={16} fontWeight="700">
              {program.name}
            </Text>

            <XStack gap="$1.5" f={1} fw="wrap">
              <TagChip icon={Dumbbell} label={goalText} />
              <TagChip icon={Target} label={levelText} />
              <TagChip icon={Calendar} label={durationText} />
            </XStack>

            {program.description ? (
              <Paragraph
                size="$2"
                color="$gray11"
                numberOfLines={2}
              >
                {program.description}
              </Paragraph>
            ) : null}

            <Text fontSize="$1" color="$gray10">
              {statusLabel[status]}
            </Text>
          </YStack>

          {/* Right: progress / chevron */}
          <YStack ai="center" gap="$2" w={72}>
            {!isLibrary ? (
              <YStack
                w={64}
                h={64}
                br="$10"
                ai="center"
                jc="center"
                bg="$background"
                borderWidth={1}
                borderColor="$gray5"
              >
                <Text fontSize={18} fontWeight="700">
                  {progress}%
                </Text>
                <Text fontSize="$1" color="$gray11">
                  done
                </Text>
              </YStack>
            ) : (
              <YStack
                px="$2.5"
                py="$1"
                br="$4"
                bg="$accentBg"
              >
                <Text fontSize="$1" color="$accentColor" fontWeight="600">
                  Library
                </Text>
              </YStack>
            )}
            <ArrowRight size={18} />
          </YStack>
        </XStack>
      </Card>
    </Pressable>
  );
}

type TagChipProps = {
  icon: React.ComponentType<any>;
  label: string;
};

function TagChip({ icon: Icon, label }: TagChipProps) {
  return (
    <XStack
      ai="center"
      gap="$1"
      px="$2"
      py="$1"
      br="$4"
      bg="$gray3"
    >
      <Icon size={14} />
      <Text fontSize="$1" textTransform="capitalize">
        {label}
      </Text>
    </XStack>
  );
}
