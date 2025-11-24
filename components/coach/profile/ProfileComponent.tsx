import { CoachProfile, Profile } from '@/types/datebase.types';
import {
    Award,
    BarChart3,
    Calendar,
    Edit,
    Instagram,
    MapPin,
    Settings,
    Star,
    Trophy,
    Users
} from 'lucide-react-native';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, XStack, YStack } from 'tamagui';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
};

type Props = {
  profile: Profile | null;
  coachProfile: CoachProfile | null;
  stats: {
    totalAthletes: number;
    activePrograms: number;
    totalProgramsCreated: number;
    averageAthleteRetention: string;
    totalWorkoutsCoached: number;
    successStories: number;
  };
  achievements: Achievement[];
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  handleEditProfile: () => void;
  handleSettingsPress: () => void;
  handleViewAchievements: () => void;
};

export default function CoachProfileComponent({
  profile,
  coachProfile,
  stats,
  achievements,
  refreshing,
  onRefresh,
  handleEditProfile,
  handleSettingsPress,
  handleViewAchievements,
}: Props) {
  const getSpecialtyDisplay = (specialty: string) => {
    const specialtyMap: Record<string, string> = {
      powerlifting: 'Powerlifting',
      strength: 'Strength Training',
      hypertrophy: 'Hypertrophy',
      weightlifting: 'Olympic Weightlifting',
      general_fitness: 'General Fitness',
    };
    return specialtyMap[specialty] || specialty;
  };

  const getFormatDisplay = (format: string) => {
    const formatMap: Record<string, string> = {
      online: 'Online Only',
      in_person: 'In-Person Only',
      hybrid: 'Online & In-Person',
    };
    return formatMap[format] || format;
  };

  const getAchievementIcon = (iconType: string) => {
    switch (iconType) {
      case 'trophy':
        return <Trophy size={16} color="#f59e0b" />;
      case 'award':
        return <Award size={16} color="#7c3aed" />;
      case 'star':
        return <Star size={16} color="#3b82f6" />;
      default:
        return <Award size={16} color="#7c3aed" />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <YStack f={1} backgroundColor="#f5f5f5">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <YStack p="$4" gap="$4">
            {/* Header */}
            <XStack ai="center" jc="space-between">
              <Text fontSize="$8" fontWeight="bold" color="$gray12">
                Coach Profile
              </Text>
              <Button
                size="$3"
                chromeless
                color="$gray11"
                onPress={handleSettingsPress}
                pressStyle={{ opacity: 0.7 }}
              >
                <Settings size={24} color="#6b7280" />
              </Button>
            </XStack>

            {/* Profile Card */}
            <Card elevate size="$4" p="$5" backgroundColor="white">
              <YStack gap="$4">
                <XStack ai="center" gap="$3">
                  <YStack
                    w={80}
                    h={80}
                    borderRadius="$12"
                    backgroundColor="#7c3aed"
                    ai="center"
                    jc="center"
                  >
                    <Text fontSize="$8" fontWeight="bold" color="white">
                      {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'C'}
                    </Text>
                  </YStack>
                  <YStack f={1} gap="$1">
                    <Text fontSize="$6" fontWeight="bold" color="$gray12">
                      {profile?.full_name || 'Coach Name'}
                    </Text>
                    <Text fontSize="$3" color="$gray10">
                      {profile?.email}
                    </Text>
                    {coachProfile?.location && (
                      <XStack ai="center" gap="$1">
                        <MapPin size={14} color="#6b7280" />
                        <Text fontSize="$3" color="$gray10">
                          {coachProfile.location}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </XStack>

                {/* Bio */}
                {coachProfile?.bio && (
                  <Text fontSize="$4" color="$gray11" lineHeight="$4">
                    {coachProfile.bio}
                  </Text>
                )}

                {/* Edit Profile Button */}
                <Button
                  size="$4"
                  backgroundColor="#7c3aed"
                  color="white"
                  onPress={handleEditProfile}
                  pressStyle={{ backgroundColor: '#6d28d9' }}
                  icon={Edit}
                >
                  Edit Profile
                </Button>
              </YStack>
            </Card>

            {/* Coach Stats */}
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                Coaching Stats
              </Text>
              <XStack gap="$3" flexWrap="wrap">
                <Card elevate size="$4" p="$3" backgroundColor="white" f={1} minWidth={150}>
                  <YStack gap="$2">
                    <XStack ai="center" gap="$2">
                      <Users size={20} color="#7c3aed" />
                      <Text fontSize="$3" color="$gray10">Athletes</Text>
                    </XStack>
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">
                      {stats.totalAthletes}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Active</Text>
                  </YStack>
                </Card>

                <Card elevate size="$4" p="$3" backgroundColor="white" f={1} minWidth={150}>
                  <YStack gap="$2">
                    <XStack ai="center" gap="$2">
                      <BarChart3 size={20} color="#7c3aed" />
                      <Text fontSize="$3" color="$gray10">Programs</Text>
                    </XStack>
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">
                      {stats.totalProgramsCreated}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Created</Text>
                  </YStack>
                </Card>
              </XStack>

              <XStack gap="$3" flexWrap="wrap">
                <Card elevate size="$4" p="$3" backgroundColor="white" f={1} minWidth={150}>
                  <YStack gap="$2">
                    <XStack ai="center" gap="$2">
                      <Calendar size={20} color="#7c3aed" />
                      <Text fontSize="$3" color="$gray10">Retention</Text>
                    </XStack>
                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                      {stats.averageAthleteRetention}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Average</Text>
                  </YStack>
                </Card>

                <Card elevate size="$4" p="$3" backgroundColor="white" f={1} minWidth={150}>
                  <YStack gap="$2">
                    <XStack ai="center" gap="$2">
                      <Trophy size={20} color="#7c3aed" />
                      <Text fontSize="$3" color="$gray10">Success</Text>
                    </XStack>
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">
                      {stats.successStories}
                    </Text>
                    <Text fontSize="$2" color="$gray10">Stories</Text>
                  </YStack>
                </Card>
              </XStack>
            </YStack>

            {/* Coaching Details */}
            {coachProfile && (
              <YStack gap="$3">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Coaching Details
                </Text>
                <Card elevate size="$4" p="$4" backgroundColor="white">
                  <YStack gap="$3">
                    <XStack ai="center" jc="space-between">
                      <Text fontSize="$4" color="$gray11">Experience</Text>
                      <Text fontSize="$4" fontWeight="500" color="$gray12">
                        {coachProfile.years_coaching} years
                      </Text>
                    </XStack>

                    <XStack ai="center" jc="space-between">
                      <Text fontSize="$4" color="$gray11">Format</Text>
                      <Text fontSize="$4" fontWeight="500" color="$gray12">
                        {getFormatDisplay(coachProfile.coaching_format)}
                      </Text>
                    </XStack>

                    <XStack ai="center" jc="space-between">
                      <Text fontSize="$4" color="$gray11">Monthly Rate</Text>
                      <Text fontSize="$4" fontWeight="500" color="$gray12">
                        ${coachProfile.monthly_rate}/month
                      </Text>
                    </XStack>

                    <XStack ai="center" jc="space-between">
                      <Text fontSize="$4" color="$gray11">Accepting Athletes</Text>
                      <Text 
                        fontSize="$4" 
                        fontWeight="500" 
                        color={coachProfile.accepting_new_athletes ? '#10b981' : '#ef4444'}
                      >
                        {coachProfile.accepting_new_athletes ? 'Yes' : 'No'}
                      </Text>
                    </XStack>

                    {coachProfile.instagram && (
                      <XStack ai="center" jc="space-between">
                        <Text fontSize="$4" color="$gray11">Instagram</Text>
                        <XStack ai="center" gap="$1">
                          <Instagram size={16} color="#7c3aed" />
                          <Text fontSize="$4" fontWeight="500" color="#7c3aed">
                            {coachProfile.instagram}
                          </Text>
                        </XStack>
                      </XStack>
                    )}
                  </YStack>
                </Card>
              </YStack>
            )}

            {/* Specialties */}
            {coachProfile?.specialties && coachProfile.specialties.length > 0 && (
              <YStack gap="$3">
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                  Specialties
                </Text>
                <Card elevate size="$4" p="$4" backgroundColor="white">
                  <XStack gap="$2" flexWrap="wrap">
                    {coachProfile.specialties.map((specialty, index) => (
                      <XStack
                        key={index}
                        backgroundColor="#faf5ff"
                        px="$3"
                        py="$2"
                        borderRadius="$3"
                      >
                        <Text fontSize="$3" color="#7c3aed" fontWeight="600">
                          {getSpecialtyDisplay(specialty)}
                        </Text>
                      </XStack>
                    ))}
                  </XStack>
                </Card>
              </YStack>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <YStack gap="$3">
                <XStack ai="center" jc="space-between">
                  <Text fontSize="$5" fontWeight="bold" color="$gray12">
                    Achievements
                  </Text>
                  <Button
                    size="$2"
                    chromeless
                    onPress={handleViewAchievements}
                    pressStyle={{ opacity: 0.7 }}
                  >
                    <Text fontSize="$3" color="#7c3aed">View All</Text>
                  </Button>
                </XStack>
                <Card elevate size="$4" p="$4" backgroundColor="white">
                  <YStack gap="$3">
                    {achievements.slice(0, 3).map((achievement, index) => (
                      <XStack
                        key={achievement.id}
                        ai="center"
                        gap="$3"
                        pb="$3"
                        borderBottomWidth={index < Math.min(achievements.length - 1, 2) ? 1 : 0}
                        borderBottomColor="$gray5"
                      >
                        <YStack
                          w={36}
                          h={36}
                          borderRadius="$10"
                          backgroundColor="#fef3c7"
                          ai="center"
                          jc="center"
                        >
                          {getAchievementIcon(achievement.icon)}
                        </YStack>
                        <YStack f={1} gap="$1">
                          <Text fontSize="$4" fontWeight="600" color="$gray12">
                            {achievement.title}
                          </Text>
                          <Text fontSize="$2" color="$gray10">
                            {achievement.description}
                          </Text>
                        </YStack>
                      </XStack>
                    ))}
                  </YStack>
                </Card>
              </YStack>
            )}

            {/* Bottom Spacing */}
            <YStack h={20} />
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}