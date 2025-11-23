// components/athlete/programs/ProgramSearchBar.tsx
import { Search } from 'lucide-react-native';
import React from 'react';
import { Input, XStack } from 'tamagui';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function ProgramSearchBar({
  value,
  onChangeText,
  placeholder = 'Search programs...',
}: Props) {
  return (
    <XStack
      ai="center"
      bg="$backgroundStrong"
      px="$3"
      py="$2"
      br="$6"
      gap="$2"
    >
      <Search size={18} />
      <Input
        flex={1}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        borderWidth={0}
        bg="transparent"
        fontSize={14}
      />
    </XStack>
  );
}
