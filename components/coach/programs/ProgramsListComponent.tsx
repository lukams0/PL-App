import {
    Calendar,
    ChevronRight,
    Clock,
    Copy,
    Edit,
    MoreVertical,
    Plus,
    Search,
    Trash2,
    Users
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Popover, Text, XStack, YStack } from 'tamagui';

type Program = {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  athleteCount: number;
  createdDate: string;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  tags: string[];
};

type Props = {
  programs: Program[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: 'all' | 'active' | 'draft' | 'archived';
  setFilterStatus: (status: 'all' | 'active' | 'draft' | 'archived') => void;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  handleCreateProgram: () => void;
  handleProgramPress: (programId: string) => void;
  handleEditProgram: (programId: string) => void;
  handleDuplicateProgram: (programId: string) => void;
  handleDeleteProgram: (programId: string) => void;
};

export default function ProgramsListComponent({
  programs,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  refreshing,
  onRefresh,
  handleCreateProgram,
  handleProgramPress,
  handleEditProgram,
  handleDuplicateProgram,
  handleDeleteProgram,
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'draft':
        return '#f59e0b';
      case 'archived':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active':
        return '#dcfce7';
      case 'draft':
        return '#fef3c7';
      case 'archived':
        return '#f3f4f6';
      default:
        return '#f3f4f6';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <YStack p="$4" gap="$3" backgroundColor="#f5f5f5">
          <XStack ai="center" jc="space-between">
            <Text fontSize="$8" fontWeight="bold" color="$gray12">
              Programs
            </Text>
            <Button
              size="$3"
              backgroundColor="#7c3aed"
              color="white"
              onPress={handleCreateProgram}
              pressStyle={{ backgroundColor: '#6d28d9' }}
              icon={Plus}
            >
              Create
            </Button>
          </XStack>

          {/* Search Bar */}
          <XStack ai="center" gap="$2">
            <Input
              f={1}
              size="$4"
              placeholder="Search programs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              backgroundColor="white"
              borderColor="#e5e7eb"
              focusStyle={{ borderColor: '#7c3aed' }}
            />
            <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: 12 }} />
          </XStack>

          {/* Filter Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2">
              <Button
                size="$3"
                backgroundColor={filterStatus === 'all' ? '#7c3aed' : 'white'}
                color={filterStatus === 'all' ? 'white' : '$gray11'}
                borderWidth={1}
                borderColor={filterStatus === 'all' ? '#7c3aed' : '#e5e7eb'}
                onPress={() => setFilterStatus('all')}
                pressStyle={{ opacity: 0.8 }}
              >
                All ({programs.length})
              </Button>
              <Button
                size="$3"
                backgroundColor={filterStatus === 'active' ? '#7c3aed' : 'white'}
                color={filterStatus === 'active' ? 'white' : '$gray11'}
                borderWidth={1}
                borderColor={filterStatus === 'active' ? '#7c3aed' : '#e5e7eb'}
                onPress={() => setFilterStatus('active')}
                pressStyle={{ opacity: 0.8 }}
              >
                Active
              </Button>
              <Button
                size="$3"
                backgroundColor={filterStatus === 'draft' ? '#7c3aed' : 'white'}
                color={filterStatus === 'draft' ? 'white' : '$gray11'}
                borderWidth={1}
                borderColor={filterStatus === 'draft' ? '#7c3aed' : '#e5e7eb'}
                onPress={() => setFilterStatus('draft')}
                pressStyle={{ opacity: 0.8 }}
              >
                Drafts
              </Button>
              <Button
                size="$3"
                backgroundColor={filterStatus === 'archived' ? '#7c3aed' : 'white'}
                color={filterStatus === 'archived' ? 'white' : '$gray11'}
                borderWidth={1}
                borderColor={filterStatus === 'archived' ? '#7c3aed' : '#e5e7eb'}
                onPress={() => setFilterStatus('archived')}
                pressStyle={{ opacity: 0.8 }}
              >
                Archived
              </Button>
            </XStack>
          </ScrollView>
        </YStack>

        {/* Programs List */}
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <YStack p="$4" gap="$3">
            {programs.length === 0 ? (
              <Card elevate size="$4" p="$5" backgroundColor="white">
                <YStack ai="center" gap="$3">
                  <Calendar size={40} color="#9ca3af" />
                  <YStack ai="center" gap="$1">
                    <Text fontSize="$4" fontWeight="bold" color="$gray12">
                      No Programs Found
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      {searchQuery 
                        ? 'Try adjusting your search criteria'
                        : 'Create your first training program'}
                    </Text>
                  </YStack>
                  {!searchQuery && (
                    <Button
                      size="$4"
                      backgroundColor="#7c3aed"
                      color="white"
                      onPress={handleCreateProgram}
                      pressStyle={{ backgroundColor: '#6d28d9' }}
                      icon={Plus}
                    >
                      Create Program
                    </Button>
                  )}
                </YStack>
              </Card>
            ) : (
              programs.map((program) => (
                <Pressable key={program.id} onPress={() => handleProgramPress(program.id)}>
                  <Card
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor="white"
                    pressStyle={{ scale: 0.98 }}
                  >
                    <YStack gap="$3">
                      {/* Program Header */}
                      <XStack ai="flex-start" jc="space-between">
                        <YStack f={1} gap="$1">
                          <XStack ai="center" gap="$2">
                            <Text fontSize="$5" fontWeight="700" color="$gray12">
                              {program.name}
                            </Text>
                            <XStack
                              backgroundColor={getStatusBg(program.status)}
                              px="$2"
                              py="$1"
                              borderRadius="$2"
                            >
                              <Text fontSize="$2" color={getStatusColor(program.status)} fontWeight="600">
                                {program.status.toUpperCase()}
                              </Text>
                            </XStack>
                          </XStack>
                          <Text fontSize="$3" color="$gray10" numberOfLines={2}>
                            {program.description}
                          </Text>
                        </YStack>
                        
                        {/* Menu */}
                        <Popover
                          open={openMenuId === program.id}
                          onOpenChange={(open) => setOpenMenuId(open ? program.id : null)}
                        >
                          <Popover.Trigger asChild>
                            <Button
                              size="$2"
                              chromeless
                              onPress={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === program.id ? null : program.id);
                              }}
                              pressStyle={{ opacity: 0.7 }}
                            >
                              <MoreVertical size={20} color="#6b7280" />
                            </Button>
                          </Popover.Trigger>
                          
                          <Popover.Content
                            borderWidth={1}
                            borderColor="$borderColor"
                            enterStyle={{ y: -10, opacity: 0 }}
                            exitStyle={{ y: -10, opacity: 0 }}
                            elevate
                            animation={[
                              'quick',
                              {
                                opacity: {
                                  overshootClamping: true,
                                },
                              },
                            ]}
                          >
                            <YStack gap="$0">
                              <Button
                                size="$3"
                                chromeless
                                jc="flex-start"
                                onPress={() => {
                                  setOpenMenuId(null);
                                  handleEditProgram(program.id);
                                }}
                                icon={Edit}
                              >
                                Edit Program
                              </Button>
                              <Button
                                size="$3"
                                chromeless
                                jc="flex-start"
                                onPress={() => {
                                  setOpenMenuId(null);
                                  handleDuplicateProgram(program.id);
                                }}
                                icon={Copy}
                              >
                                Duplicate
                              </Button>
                              <Button
                                size="$3"
                                chromeless
                                jc="flex-start"
                                onPress={() => {
                                  setOpenMenuId(null);
                                  handleDeleteProgram(program.id);
                                }}
                                icon={Trash2}
                                color="$red10"
                              >
                                Delete
                              </Button>
                            </YStack>
                          </Popover.Content>
                        </Popover>
                      </XStack>

                      {/* Program Info */}
                      <XStack gap="$4" flexWrap="wrap">
                        <XStack ai="center" gap="$1">
                          <Calendar size={14} color="#7c3aed" />
                          <Text fontSize="$2" color="$gray11">
                            {program.duration_weeks} weeks
                          </Text>
                        </XStack>
                        <XStack ai="center" gap="$1">
                          <Users size={14} color="#7c3aed" />
                          <Text fontSize="$2" color="$gray11">
                            {program.athleteCount} {program.athleteCount === 1 ? 'athlete' : 'athletes'}
                          </Text>
                        </XStack>
                        <XStack ai="center" gap="$1">
                          <Clock size={14} color="#7c3aed" />
                          <Text fontSize="$2" color="$gray11">
                            Updated {new Date(program.lastUpdated).toLocaleDateString()}
                          </Text>
                        </XStack>
                      </XStack>

                      {/* Tags */}
                      {program.tags.length > 0 && (
                        <XStack gap="$2" flexWrap="wrap">
                          {program.tags.map((tag, index) => (
                            <XStack
                              key={index}
                              backgroundColor="#faf5ff"
                              px="$2"
                              py="$1"
                              borderRadius="$2"
                            >
                              <Text fontSize="$2" color="#7c3aed">
                                #{tag}
                              </Text>
                            </XStack>
                          ))}
                        </XStack>
                      )}

                      {/* View Details */}
                      <XStack ai="center" jc="flex-end">
                        <XStack ai="center" gap="$1">
                          <Text fontSize="$3" color="#7c3aed" fontWeight="600">
                            View Details
                          </Text>
                          <ChevronRight size={16} color="#7c3aed" />
                        </XStack>
                      </XStack>
                    </YStack>
                  </Card>
                </Pressable>
              ))
            )}

            {/* Bottom Spacing */}
            <YStack h={20} />
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}