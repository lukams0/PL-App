import {
  Calendar,
  ChevronRight,
  Mail,
  Plus,
  Search,
  TrendingUp,
  User,
  UserPlus
} from 'lucide-react-native';
import { Pressable, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Input, Text, XStack, YStack } from 'tamagui';

type Athlete = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  currentProgram: string | null;
  weekInProgram: number;
  totalWeeks: number;
  lastWorkout: string;
  complianceRate: number;
  joinedDate: string;
  status: 'active' | 'inactive';
};

type Props = {
  athletes: Athlete[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: 'all' | 'active' | 'inactive';
  setFilterStatus: (status: 'all' | 'active' | 'inactive') => void;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  handleAthletePress: (athleteId: string) => void;
  handleAddAthlete: () => void;
  handleMessageAthlete: (athleteId: string) => void;
  handleViewProgram: (athleteId: string) => void;
};

export default function AthletesListComponent({
  athletes,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  refreshing,
  onRefresh,
  handleAthletePress,
  handleAddAthlete,
  handleMessageAthlete,
  handleViewProgram,
}: Props) {
  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return '#10b981';
    if (rate >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        {/* Header */}
        <YStack p="$4" gap="$3" backgroundColor="#f5f5f5">
          <XStack ai="center" jc="space-between">
            <Text fontSize="$8" fontWeight="bold" color="$gray12">
              Athletes
            </Text>
            <Button
              size="$3"
              backgroundColor="#7c3aed"
              color="white"
              onPress={handleAddAthlete}
              pressStyle={{ backgroundColor: '#6d28d9' }}
              icon={UserPlus}
            >
              <Text color="white" fontWeight="600">Add</Text>
            </Button>
          </XStack>

          {/* Search Bar - Fixed: added paddingLeft to Input for icon space */}
          <XStack ai="center" position="relative">
            <Search 
              size={20} 
              color="#9ca3af" 
              style={{ position: 'absolute', left: 12, zIndex: 1 }} 
            />
            <Input
              f={1}
              size="$4"
              placeholder="Search athletes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              backgroundColor="white"
              borderColor="#e5e7eb"
              focusStyle={{ borderColor: '#7c3aed' }}
              pl="$8"
            />
          </XStack>

          {/* Filter Buttons */}
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
              <Text color={filterStatus === 'all' ? 'white' : '$gray11'}>
                All ({athletes.length})
              </Text>
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
              <Text color={filterStatus === 'active' ? 'white' : '$gray11'}>
                Active
              </Text>
            </Button>
            <Button
              size="$3"
              backgroundColor={filterStatus === 'inactive' ? '#7c3aed' : 'white'}
              color={filterStatus === 'inactive' ? 'white' : '$gray11'}
              borderWidth={1}
              borderColor={filterStatus === 'inactive' ? '#7c3aed' : '#e5e7eb'}
              onPress={() => setFilterStatus('inactive')}
              pressStyle={{ opacity: 0.8 }}
            >
              <Text color={filterStatus === 'inactive' ? 'white' : '$gray11'}>
                Inactive
              </Text>
            </Button>
          </XStack>
        </YStack>

        {/* Athletes List */}
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <YStack p="$4" gap="$3">
            {athletes.length === 0 ? (
              <Card elevate size="$4" p="$5" backgroundColor="white">
                <YStack ai="center" gap="$3">
                  <User size={40} color="#9ca3af" />
                  <YStack ai="center" gap="$1">
                    <Text fontSize="$4" fontWeight="bold" color="$gray12">
                      No Athletes Found
                    </Text>
                    <Text fontSize="$3" color="$gray10" textAlign="center">
                      {searchQuery 
                        ? 'Try adjusting your search criteria'
                        : 'Add your first athlete to get started'}
                    </Text>
                  </YStack>
                  {!searchQuery && (
                    <Button
                      size="$4"
                      backgroundColor="#7c3aed"
                      color="white"
                      onPress={handleAddAthlete}
                      pressStyle={{ backgroundColor: '#6d28d9' }}
                      icon={Plus}
                    >
                      <Text color="white" fontWeight="600">Add Athlete</Text>
                    </Button>
                  )}
                </YStack>
              </Card>
            ) : (
              athletes.map((athlete) => (
                <Pressable 
                  key={athlete.id} 
                  onPress={() => handleAthletePress(athlete.id)}
                >
                  <Card
                    elevate
                    size="$4"
                    p="$4"
                    backgroundColor="white"
                    pressStyle={{ scale: 0.98 }}
                    onPress={() => handleAthletePress(athlete.id)}
                  >
                    <YStack gap="$3">
                      {/* Athlete Header */}
                      <XStack ai="center" jc="space-between">
                        <XStack ai="center" gap="$3" f={1}>
                          <YStack
                            w={48}
                            h={48}
                            borderRadius="$10"
                            backgroundColor="#7c3aed"
                            ai="center"
                            jc="center"
                          >
                            <Text fontSize="$6" fontWeight="bold" color="white">
                              {athlete.name.split(' ').map(n => n[0]).join('')}
                            </Text>
                          </YStack>
                          <YStack f={1} gap="$1">
                            <Text fontSize="$4" fontWeight="600" color="$gray12">
                              {athlete.name}
                            </Text>
                            <Text fontSize="$2" color="$gray10">
                              {athlete.email}
                            </Text>
                          </YStack>
                        </XStack>
                        <ChevronRight size={20} color="#9ca3af" />
                      </XStack>

                      {/* Program Info */}
                      {athlete.currentProgram ? (
                        <Card backgroundColor="#faf5ff" p="$3" borderRadius="$3">
                          <YStack gap="$2">
                            <Text fontSize="$3" fontWeight="600" color="$gray12">
                              {athlete.currentProgram}
                            </Text>
                            <XStack ai="center" gap="$3">
                              <XStack ai="center" gap="$1">
                                <Calendar size={14} color="#7c3aed" />
                                <Text fontSize="$2" color="#7c3aed">
                                  {`Week ${athlete.weekInProgram}/${athlete.totalWeeks}`}
                                </Text>
                              </XStack>
                              <XStack ai="center" gap="$1">
                                <TrendingUp size={14} color={getComplianceColor(athlete.complianceRate)} />
                                <Text fontSize="$2" color={getComplianceColor(athlete.complianceRate)}>
                                  {`${athlete.complianceRate}% compliance`}
                                </Text>
                              </XStack>
                            </XStack>
                          </YStack>
                        </Card>
                      ) : (
                        <Card backgroundColor="#f9fafb" p="$3" borderRadius="$3">
                          <Text fontSize="$3" color="$gray10" textAlign="center">
                            No active program
                          </Text>
                        </Card>
                      )}

                      {/* Actions and Info */}
                      <XStack ai="center" jc="space-between">
                        <Text fontSize="$2" color="$gray10">
                          {`Last workout: ${athlete.lastWorkout}`}
                        </Text>
                        <XStack gap="$2">
                          <Button
                            size="$2"
                            chromeless
                            onPress={(e) => {
                              e.stopPropagation();
                              handleMessageAthlete(athlete.id);
                            }}
                            pressStyle={{ opacity: 0.7 }}
                          >
                            <Mail size={18} color="#7c3aed" />
                          </Button>
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