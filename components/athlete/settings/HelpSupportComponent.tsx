import { ChevronRight } from "lucide-react-native";
import { Card, Text, XStack, YStack } from "tamagui";

type SupportProps = {
    icon: any;
    title: string;
    description: string;
    onPress: () => void;
}

export default function HelpSupportComponent({
    icon: Icon,
    title,
    description,
    onPress
} : SupportProps) {
    return (
        <Card
        elevate
        size="$4"
        p="$4"
        backgroundColor="white"
        pressStyle={{ opacity: 0.7, scale: 0.98 }}
        onPress={onPress}
        >
        <XStack ai="center" jc="space-between">
            <XStack ai="center" gap="$3" f={1}>
            <YStack
                w={48}
                h={48}
                borderRadius="$10"
                backgroundColor="#faf5ff"
                ai="center"
                jc="center"
            >
                <Icon size={24} color="#7c3aed" />
            </YStack>
            <YStack f={1} gap="$1">
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                {title}
                </Text>
                <Text fontSize="$3" color="$gray10">
                {description}
                </Text>
            </YStack>
            </XStack>
            <ChevronRight size={20} color="#9ca3af" />
        </XStack>
        </Card>
    );
}