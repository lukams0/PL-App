// components/coach/programs/ProgramsListComponent.tsx
import {
  Calendar,
  ChevronRight,
  Clock,
  Plus,
  Search,
  Users
} from 'lucide-react-native';
import { Alert, Pressable, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';

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

  // Show action menu using Alert instead of Popover (avoids PortalProvider requirement)
  const showProgramMenu = (program: Program) => {
    Alert.alert(
      program.name,
      'What would you like to do?',
      [
        {
          text: 'Edit Program',
          onPress: () => handleEditProgram(program.id),
        },
        {
          text: 'Duplicate',
          onPress: () => handleDuplicateProgram(program.id),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Program',
              'Are you sure you want to delete this program? This cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => handleDeleteProgram(program.id),
                },
              ]
            );
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
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
            <XStack f={1} position="relative">
              <Input
                f={1}
                size="$4"
                placeholder="Search programs..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                backgroundColor="white"
                borderColor="#e5e7eb"
                focusStyle={{ borderColor: '#7c3aed' }}
                pl="$10"
              />
              <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: 12, top: 12 }} />
            </XStack>
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
                <Pressable 
                  key={program.id} 
                  
                >
                  <Card
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor="white"
                    pressStyle={{ scale: 0.98 }}
                    onPress={() => handleProgramPress(program.id)}
                    onLongPress={() => showProgramMenu(program)}
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
                      <XStack ai="center" jc="space-between">
                        <Text fontSize="$2" color="$gray10">
                          Long press for options
                        </Text>
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