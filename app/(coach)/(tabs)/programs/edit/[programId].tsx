import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Select, Text, TextArea, XStack, YStack } from 'tamagui';

export default function EditProgramPage() {
    const { programId } = useLocalSearchParams<{ programId: string }>();
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    // Load existing program data - fake for now
    const [programData, setProgramData] = useState({
        name: '12-Week Powerlifting',
        description: 'Progressive overload program focused on improving the big 3 lifts with proper periodization and peaking.',
        duration_weeks: '12',
        level: 'intermediate',
        focus: 'powerlifting',
    });

    const [blocks, setBlocks] = useState([
        { id: '1', name: 'Volume Accumulation', weeks: '1-4', focus: 'High volume, moderate intensity' },
        { id: '2', name: 'Intensity Phase', weeks: '5-8', focus: 'Reduced volume, increased intensity' },
        { id: '3', name: 'Peak & Taper', weeks: '9-12', focus: 'Maximum intensity, minimal volume' },
    ]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // In production, save to database
            console.log('Saving program:', { programData, blocks });
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.back();
        } catch (error) {
            console.error('Error saving program:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddBlock = () => {
        Alert.alert('Add Block', 'This would open a block creation modal');
    };

    const handleDeleteBlock = (blockId: string) => {
        Alert.alert(
            'Delete Block',
            'Are you sure you want to delete this block?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setBlocks(blocks.filter(b => b.id !== blockId));
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 20,
                    gap: 16,
                }}
            >
                {/* Header */}
                <XStack ai="center" jc="space-between">
                    <XStack ai="center" gap="$3">
                        <Pressable onPress={() => router.back()}>
                            <ArrowLeft size={24} color="#6b7280" />
                        </Pressable>
                        <Text fontSize={24} fontWeight="700" color="$gray12">
                            Edit Program
                        </Text>
                    </XStack>
                    <Button
                        size="$3"
                        backgroundColor="#7c3aed"
                        color="white"
                        icon={Save}
                        disabled={saving}
                        opacity={saving ? 0.5 : 1}
                        onPress={handleSave}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </XStack>

                {/* Basic Info */}
                <Card elevate size="$4" p="$4" backgroundColor="white">
                    <YStack gap="$3">
                        <Text fontSize="$5" fontWeight="600" color="$gray12">
                            Basic Information
                        </Text>

                        <YStack gap="$2">
                            <Text fontSize="$3" color="$gray11">Program Name</Text>
                            <Input
                                size="$4"
                                value={programData.name}
                                onChangeText={(text) => setProgramData({ ...programData, name: text })}
                                placeholder="Enter program name"
                                backgroundColor="$gray2"
                                borderColor="$gray4"
                                focusStyle={{ borderColor: '#7c3aed' }}
                            />
                        </YStack>

                        <YStack gap="$2">
                            <Text fontSize="$3" color="$gray11">Description</Text>
                            <TextArea
                                size="$4"
                                value={programData.description}
                                onChangeText={(text) => setProgramData({ ...programData, description: text })}
                                placeholder="Describe the program..."
                                backgroundColor="$gray2"
                                borderColor="$gray4"
                                focusStyle={{ borderColor: '#7c3aed' }}
                                numberOfLines={4}
                                minHeight={100}
                            />
                        </YStack>

                        <XStack gap="$3">
                            <YStack f={1} gap="$2">
                                <Text fontSize="$3" color="$gray11">Duration (weeks)</Text>
                                <Input
                                    size="$4"
                                    value={programData.duration_weeks}
                                    onChangeText={(text) => setProgramData({ ...programData, duration_weeks: text })}
                                    placeholder="12"
                                    keyboardType="number-pad"
                                    backgroundColor="$gray2"
                                    borderColor="$gray4"
                                    focusStyle={{ borderColor: '#7c3aed' }}
                                />
                            </YStack>

                            <YStack f={1} gap="$2">
                                <Text fontSize="$3" color="$gray11">Level</Text>
                                <Select
                                    value={programData.level}
                                    onValueChange={(value) => setProgramData({ ...programData, level: value })}
                                >
                                    <Select.Trigger
                                        size="$4"
                                        backgroundColor="$gray2"
                                        borderColor="$gray4"
                                    >
                                        <Select.Value placeholder="Select level" />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item value="beginner" index={0}>
                                            <Select.ItemText>Beginner</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item value="intermediate" index={1}>
                                            <Select.ItemText>Intermediate</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item value="advanced" index={2}>
                                            <Select.ItemText>Advanced</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item value="expert" index={3}>
                                            <Select.ItemText>Expert</Select.ItemText>
                                        </Select.Item>

                                    </Select.Content>
                                </Select>
                            </YStack>
                        </XStack>

                        <YStack gap="$2">
                            <Text fontSize="$3" color="$gray11">Focus</Text>
                            <Select
                                value={programData.focus}
                                onValueChange={(value) => setProgramData({ ...programData, focus: value })}
                            >
                                <Select.Trigger
                                    size="$4"
                                    backgroundColor="$gray2"
                                    borderColor="$gray4"
                                >
                                    <Select.Value placeholder="Select focus" />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="powerlifting" index={0}>Powerlifting</Select.Item>
                                    <Select.Item value="strength" index={1}>Strength</Select.Item>
                                    <Select.Item value="hypertrophy" index={2}>Hypertrophy</Select.Item>
                                    <Select.Item value="general" index={3}>General Fitness</Select.Item>
                                </Select.Content>
                            </Select>
                        </YStack>
                    </YStack>
                </Card>

                {/* Program Blocks */}
                <YStack gap="$3">
                    <XStack ai="center" jc="space-between">
                        <Text fontSize="$5" fontWeight="600" color="$gray12">
                            Program Blocks
                        </Text>
                        <Button
                            size="$2"
                            backgroundColor="#7c3aed"
                            color="white"
                            icon={Plus}
                            onPress={handleAddBlock}
                        >
                            Add Block
                        </Button>
                    </XStack>

                    {blocks.map((block) => (
                        <Card
                            key={block.id}
                            elevate
                            size="$4"
                            p="$4"
                            backgroundColor="white"
                        >
                            <YStack gap="$2">
                                <XStack ai="center" jc="space-between">
                                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                                        {block.name}
                                    </Text>
                                    <Button
                                        size="$2"
                                        circular
                                        backgroundColor="$red2"
                                        icon={Trash2}
                                        onPress={() => handleDeleteBlock(block.id)}
                                    >
                                    </Button>
                                </XStack>
                                <Text fontSize="$3" color="$gray11">
                                    Weeks {block.weeks}
                                </Text>
                                <Text fontSize="$3" color="$gray10">
                                    {block.focus}
                                </Text>
                                <Button
                                    size="$3"
                                    backgroundColor="$gray2"
                                    color="$gray11"
                                    onPress={() => Alert.alert('Edit Block', 'This would open block editor')}
                                >
                                    Edit Block
                                </Button>
                            </YStack>
                        </Card>
                    ))}
                </YStack>

                {/* Actions */}
                <YStack gap="$3">
                    <Button
                        size="$4"
                        backgroundColor="#7c3aed"
                        color="white"
                        fontWeight="600"
                        icon={Save}
                        disabled={saving}
                        opacity={saving ? 0.5 : 1}
                        onPress={handleSave}
                    >
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </Button>

                    <Button
                        size="$4"
                        backgroundColor="white"
                        borderColor="$gray4"
                        borderWidth={1}
                        color="$gray11"
                        fontWeight="600"
                        onPress={() => router.back()}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                </YStack>
            </ScrollView>
        </SafeAreaView>
    );
}