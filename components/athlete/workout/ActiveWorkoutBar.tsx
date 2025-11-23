import { router } from 'expo-router';
import { ChevronRight, Clock, Dumbbell } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, XStack, YStack } from 'tamagui';

type Props = {
  workoutName: string;
  startTime: number | string;   // ms timestamp or ISO
  exerciseCount: number;
  onPress?: () => void;         // optional override
};

export function ActiveWorkoutBar({
  workoutName,
  startTime,
  exerciseCount,
  onPress,
}: Props) {
  const [elapsed, setElapsed] = useState('00:00:00');
  const insets = useSafeAreaInsets();

  const startMs = useMemo(
    () => (typeof startTime === 'number' ? startTime : new Date(startTime).getTime()),
    [startTime]
  );

  useEffect(() => {
    const tick = () => {
      const secs = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      const h = String(Math.floor(secs / 3600)).padStart(2, '0');
      const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
      const s = String(secs % 60).padStart(2, '0');
      setElapsed(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startMs]);

  const handlePress = () => (onPress ? onPress() : router.push('../../workout'));

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom, 12) + 56, // sits just above a typical tab bar (~56)
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          paddingVertical: 12,
          paddingHorizontal: 14,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 8,
          borderWidth: 1,
          borderColor: '#eee',
        }}
      >
        <XStack ai="center" jc="space-between" gap="$3">
          {/* left: title + meta */}
          <XStack ai="center" gap="$3" f={1}>
            {/* purple accent dot */}
            <YStack
              w={10}
              h={10}
              borderRadius={10}
              backgroundColor="#7c3aed"
              mt={2}
            />
            <YStack f={1} gap="$1">
              <Text fontSize="$5" fontWeight="700" color="$gray12" numberOfLines={1}>
                {workoutName || 'Active workout'}
              </Text>

              <XStack ai="center" gap="$3">
                <XStack ai="center" gap="$1.5">
                  <Clock size={16} color="#7c3aed" />
                  <Text fontSize="$2" color="$gray11" fontWeight="600">
                    {elapsed}
                  </Text>
                </XStack>

                <XStack ai="center" gap="$1.5">
                  <Dumbbell size={16} color="#9ca3af" />
                  <Text fontSize="$2" color="$gray10">
                    {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
                  </Text>
                </XStack>
              </XStack>
            </YStack>
          </XStack>

          {/* right: call-to-action chip */}
          <XStack
            ai="center"
            gap="$2"
            px="$3"
            py="$2"
            borderRadius="$3"
            backgroundColor="#7c3aed10"
            borderWidth={1}
            borderColor="#7c3aed30"
          >
            <Text fontSize="$2" fontWeight="700" color="#7c3aed">
              Resume
            </Text>
            <ChevronRight size={16} color="#7c3aed" />
          </XStack>
        </XStack>
      </TouchableOpacity>
    </View>
  );
}
