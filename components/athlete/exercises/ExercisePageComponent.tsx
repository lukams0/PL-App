import { Exercise, ExerciseCategory, PersonalRecord } from '@/types/datebase.types';
import { Award, Plus, Search } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';

type ExerciseProps = {
    handleCreateExercise: () => void;
    searchQuery: string;
    setSearchQuery: (s: string) => void;
    categories: ('All' | ExerciseCategory)[];
    selectedCategory: string;
    loading: boolean;
    filteredExercises: Exercise[];
    handleExercisePress: (e: string) => void;
    formatCategory: (c: ExerciseCategory) => string;
    setSelectedCategory: (s: string) => void;
    personalRecords: Map<string, PersonalRecord>;
}

export default function ExercisePageComponent({
    handleCreateExercise,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    loading,
    filteredExercises,
    handleExercisePress,
    formatCategory,
    setSelectedCategory,
    personalRecords
}: ExerciseProps) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
            <YStack f={1} backgroundColor="#f5f5f5">
                <ScrollView>
                    <YStack p="$4" gap="$4">
                        {/* Header */}
                        <XStack ai="center" jc="space-between">
                            <Text fontSize="$8" fontWeight="bold" color="$gray12">
                                Exercises
                            </Text>
                            <Button
                                size="$3"
                                chromeless
                                color="#7c3aed"
                                fontWeight="600"
                                onPress={handleCreateExercise}
                                pressStyle={{ opacity: 0.7 }}
                            >
                                <XStack ai="center" gap="$1">
                                    <Plus size={20} color="#7c3aed" />
                                    <Text color="#7c3aed" fontWeight="600">New</Text>
                                </XStack>
                            </Button>
                        </XStack>

                        {/* Search Bar */}
                        <XStack
                            backgroundColor="white"
                            borderRadius="$4"
                            ai="center"
                            px="$3"
                            py="$2"
                            gap="$2"
                            borderWidth={1}
                            borderColor="#e5e7eb"
                        >
                            <Search size={20} color="#9ca3af" />
                            <Input
                                f={1}
                                placeholder="Search exercises..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                unstyled
                                fontSize="$4"
                            />
                        </XStack>

                        {/* Category Filter */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <XStack gap="$2">
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        size="$3"
                                        backgroundColor={selectedCategory === category ? '#7c3aed' : 'white'}
                                        color={selectedCategory === category ? 'white' : '$gray11'}
                                        borderColor="#e9d5ff"
                                        borderWidth={1}
                                        onPress={() => setSelectedCategory(category)}
                                        pressStyle={{ opacity: 0.8 }}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </XStack>
                        </ScrollView>

                        {/* Exercise List */}
                        <YStack gap="$3">
                            <Text fontSize="$5" fontWeight="bold" color="$gray12">
                                Your Exercises
                            </Text>

                            {loading ? (
                                <YStack ai="center" jc="center" py="$8">
                                    <ActivityIndicator size="large" color="#7c3aed" />
                                    <Text fontSize="$4" color="$gray10" mt="$4">
                                        Loading exercises...
                                    </Text>
                                </YStack>
                            ) : filteredExercises.length === 0 ? (
                                <Card elevate size="$4" p="$6" backgroundColor="white">
                                    <YStack ai="center" gap="$3">
                                        <Text fontSize="$4" color="$gray10" textAlign="center">
                                            {searchQuery || selectedCategory !== 'All'
                                                ? 'No exercises found matching your filters.'
                                                : 'No exercises available. Create your first custom exercise!'}
                                        </Text>
                                        {!searchQuery && selectedCategory === 'All' && (
                                            <Button
                                                size="$4"
                                                backgroundColor="#7c3aed"
                                                color="white"
                                                onPress={handleCreateExercise}
                                                pressStyle={{ backgroundColor: '#6d28d9' }}
                                            >
                                                Create Exercise
                                            </Button>
                                        )}
                                    </YStack>
                                </Card>
                            ) : (
                                filteredExercises.map((exercise) => {
                                    const pr = personalRecords.get(exercise.id);
                                    return (
                                        <Card
                                            key={exercise.id}
                                            elevate
                                            size="$4"
                                            p="$4"
                                            backgroundColor="white"
                                            pressStyle={{ opacity: 0.7, scale: 0.98 }}
                                            onPress={() => handleExercisePress(exercise.id)}
                                        >
                                            <XStack ai="center" jc="space-between">
                                                <YStack gap="$2" f={1}>
                                                    <XStack ai="center" gap="$2">
                                                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                                                            {exercise.name}
                                                        </Text>
                                                        {pr && (
                                                            <XStack
                                                                backgroundColor="#fef3c7"
                                                                px="$2"
                                                                py="$1"
                                                                borderRadius="$2"
                                                                ai="center"
                                                                gap="$1"
                                                            >
                                                                <Award size={12} color="#f59e0b" />
                                                                <Text fontSize="$1" fontWeight="600" color="#f59e0b">
                                                                    PR
                                                                </Text>
                                                            </XStack>
                                                        )}
                                                    </XStack>
                                                    <XStack ai="center" gap="$2">
                                                        <XStack
                                                            backgroundColor="#faf5ff"
                                                            px="$2"
                                                            py="$1"
                                                            borderRadius="$2"
                                                        >
                                                            <Text fontSize="$1" fontWeight="600" color="#7c3aed">
                                                                {formatCategory(exercise.category)}
                                                            </Text>
                                                        </XStack>
                                                        {pr && (
                                                            <Text fontSize="$2" color="$gray10">
                                                                {pr.weight_lbs}lbs × {pr.reps}
                                                            </Text>
                                                        )}
                                                    </XStack>
                                                </YStack>
                                            </XStack>
                                        </Card>
                                    );
                                })
                            )}
                        </YStack>
                    </YStack>
                </ScrollView>

            </YStack>
        </SafeAreaView>
    );
}