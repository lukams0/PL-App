import { ChevronRight } from "lucide-react-native";
import { Text, XStack, YStack } from "tamagui";

type SettingRowProps = {
    icon: any; 
    title: string; 
    value?: string; 
    onPress?: () => void;
    showArrow?: boolean;
    rightElement?: React.ReactNode;
}

export default function SettingRow({
    icon: Icon, 
    title, 
    value, 
    onPress, 
    showArrow = true,
    rightElement
} : SettingRowProps) {
    return (
        <XStack
        ai="center"
        jc="space-between"
        py="$4"
        px="$4"
        pressStyle={{ opacity: 0.7, backgroundColor: '#fafafa' }}
        onPress={onPress}
        disabled={!onPress && !rightElement}
        >
        <XStack ai="center" gap="$3" f={1}>
            <Icon size={22} color="#7c3aed" />
            <YStack f={1}>
            <Text fontSize="$4" color="$gray12" fontWeight="500">
                {title}
            </Text>
            {value && (
                <Text fontSize="$3" color="$gray10">
                {value}
                </Text>
            )}
            </YStack>
        </XStack>
        {rightElement || (showArrow && onPress && (
            <ChevronRight size={20} color="#9ca3af" />
        ))}
        </XStack>
    );
}