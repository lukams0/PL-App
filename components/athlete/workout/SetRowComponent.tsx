import { ExerciseSet } from "@/services/workout.service";
import { Check, Trash2 } from "lucide-react-native";
import React, { useEffect } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Text, XStack, YStack } from "tamagui";

type setRowProps = {
    set: any;
    exerciseId: string;
    locked: boolean;
    saving: boolean;
    onDelete: () => void;
    onUpdate: (setId: string, exId: string, updates: Partial<ExerciseSet> | any) => Promise<void> | void;
}

export default function setRow({
    set,
    exerciseId,
    locked,
    saving,
    onDelete,
    onUpdate,
} : setRowProps) {
    const [weightText, setWeightText] = React.useState(
        set.weight === 0 || set.weight == null ? '' : String(set.weight)
    );
    const [repsText, setRepsText] = React.useState(
        set.reps === 0 || set.reps == null ? '' : String(set.reps)
    );
    const [rpeText, setRpeText] = React.useState(
        typeof set.rpe === 'number' && set.rpe > 0 ? String(set.rpe) : ''
    );

    // Sync from upstream when data changes (avoid clobbering while typing)
    useEffect(() => {
        setWeightText(set.weight === 0 || set.weight == null ? '' : String(set.weight));
        setRepsText(set.reps === 0 || set.reps == null ? '' : String(set.reps));
        setRpeText(typeof set.rpe === 'number' && set.rpe > 0 ? String(set.rpe) : '');
    }, [set.weight, set.reps, set.rpe]);

    const toNumberOrNull = (txt: string) => {
        const t = txt.trim();
        if (t === '') return null;
        const n = Number(t);
        return Number.isFinite(n) ? n : null;
    };

    return (
        <Swipeable
            renderRightActions={() => (
                <YStack
                    jc="center"
                    ai="center"
                    w={72}
                    h="100%"
                    backgroundColor="#ef4444"
                    borderTopRightRadius={8}
                    borderBottomRightRadius={8}
                >
                    <TouchableOpacity onPress={onDelete} accessibilityLabel="Delete set">
                        <Trash2 size={22} color="white" />
                    </TouchableOpacity>
                </YStack>
            )}
            overshootRight={false}
            enabled
            containerStyle={{ borderRadius: 8 }}
        >
            <XStack
                ai="center"
                gap="$2.5"
                backgroundColor={locked ? '#f0fdf4' : '#fafafa'}
                borderRadius="$3"
                p="$3"
                borderWidth={locked ? 2 : 1}
                borderColor={locked ? '#86efac' : '#e5e7eb'}
                opacity={locked ? 0.85 : 1}
            >
                {/* Set label */}
                <YStack minWidth={42} ai="center">
                    <Text fontSize="$1" color="$gray9" fontWeight="600" mb="$1">
                        SET
                    </Text>
                    <Text fontSize="$5" color={locked ? '#16a34a' : '#7c3aed'} fontWeight="bold">
                        {set.set_number}
                    </Text>
                </YStack>

                {/* Weight */}
                <YStack f={1}>
                    <Text fontSize="$1" color="$gray9" fontWeight="600" mb="$1.5" textTransform="uppercase">
                        Weight
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: locked ? '#f9fafb' : 'white',
                            borderWidth: 2,
                            borderColor: locked ? '#e5e7eb' : '#d1d5db',
                            borderRadius: 8,
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            fontSize: 16,
                            fontWeight: '600',
                            textAlign: 'center',
                            minWidth: 60,
                            color: locked ? '#9ca3af' : '#1f2937',
                        }}
                        placeholder="0"
                        placeholderTextColor="#d1d5db"
                        keyboardType="numeric"
                        value={weightText}
                        onChangeText={(t) => !locked && setWeightText(t)}
                        onEndEditing={async () => {
                            if (locked || saving) return;
                            const val = toNumberOrNull(weightText);
                            if (val === null) {
                                if (set.weight != null) await onUpdate(set.id, exerciseId, { weight: null });
                            } else if (val !== set.weight) {
                                await onUpdate(set.id, exerciseId, { weight: val });
                            }
                        }}
                        editable={!locked && !saving}
                    />
                    <Text fontSize="$1" color="$gray8" mt="$1" textAlign="center">
                        lbs
                    </Text>
                </YStack>

                {/* Reps */}
                <YStack f={1}>
                    <Text fontSize="$1" color="$gray9" fontWeight="600" mb="$1.5" textTransform="uppercase">
                        Reps
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: locked ? '#f9fafb' : 'white',
                            borderWidth: 2,
                            borderColor: locked ? '#e5e7eb' : '#d1d5db',
                            borderRadius: 8,
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            fontSize: 16,
                            fontWeight: '600',
                            textAlign: 'center',
                            color: locked ? '#9ca3af' : '#1f2937',
                        }}
                        placeholder="0"
                        placeholderTextColor="#d1d5db"
                        keyboardType="numeric"
                        value={repsText}
                        onChangeText={(t) => !locked && setRepsText(t)}
                        onEndEditing={async () => {
                            if (locked || saving) return;
                            const val = toNumberOrNull(repsText);
                            if (val === null) {
                                if (set.reps != null) await onUpdate(set.id, exerciseId, { reps: null });
                            } else if (val !== set.reps) {
                                await onUpdate(set.id, exerciseId, { reps: val });
                            }
                        }}
                        editable={!locked && !saving}
                    />
                    <Text fontSize="$1" color="$gray8" mt="$1" textAlign="center">
                        reps
                    </Text>
                </YStack>

                {/* RPE */}
                <YStack f={1}>
                    <Text fontSize="$1" color="$gray9" fontWeight="600" mb="$1.5" textTransform="uppercase">
                        RPE
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: locked ? '#f9fafb' : 'white',
                            borderWidth: 2,
                            borderColor: locked ? '#e5e7eb' : '#d1d5db',
                            borderRadius: 8,
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            fontSize: 16,
                            fontWeight: '600',
                            textAlign: 'center',
                            color: locked ? '#9ca3af' : '#1f2937',
                        }}
                        placeholder="8"
                        placeholderTextColor="#d1d5db"
                        keyboardType="numeric"
                        value={rpeText}
                        onChangeText={(t) => !locked && setRpeText(t)}
                        onEndEditing={async () => {
                            if (locked || saving) return;
                            const raw = toNumberOrNull(rpeText);
                            const clamped = raw == null ? null : Math.max(1, Math.min(10, raw));
                            if (clamped !== set.rpe) await onUpdate(set.id, exerciseId, { rpe: clamped });
                        }}
                        editable={!locked && !saving}
                    />
                    <Text fontSize="$1" color="$gray8" mt="$1" textAlign="center">
                        1-10
                    </Text>
                </YStack>

                {/* Complete toggle */}
                <YStack minWidth={48} ai="center">
                    <TouchableOpacity
                        onPress={() => onUpdate(set.id, exerciseId, { completed: !locked })}
                        disabled={saving}
                        accessibilityLabel={locked ? 'Mark set as not completed' : 'Mark set as completed'}
                        style={{
                            backgroundColor: locked ? '#16a34a' : '#f3f4f6',
                            borderRadius: 8,
                            padding: 10,
                            shadowColor: locked ? '#16a34a' : '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: locked ? 0.3 : 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}
                    >
                        <Check size={24} color={locked ? 'white' : '#9ca3af'} />
                    </TouchableOpacity>
                </YStack>
            </XStack>
        </Swipeable>
    );
}