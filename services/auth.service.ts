import { UserRole } from '@/types/datebase.types';
import { supabase } from '../lib/supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface OnboardingData {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number;
  weightUnit: 'lbs' | 'kg';
  height: number;
  heightUnit: 'in' | 'cm';
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  goals: string[];
}
export type CoachingFormat = 'online' | 'in_person' | 'hybrid';
export type CoachSpecialtyId =
  | 'powerlifting'
  | 'strength'
  | 'hypertrophy'
  | 'weightlifting'
  | 'general_fitness';
export type CoachAthleteLevelId =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';

export type CoachOnboardingData = {
  yearsCoaching: number;
  coachingFormat: CoachingFormat;
  acceptingNewAthletes: boolean;
  specialties: CoachSpecialtyId[];
  athleteLevels: CoachAthleteLevelId[];
  bio: string;
  location: string | null;
  monthlyRate: number | null;
  instagram: string | null;
};

class AuthService {
  /**
   * Sign up a new user
   */
  async signUp({ email, password, fullName, role }: SignUpData) {
    try {
      console.log(fullName);
      console.log(role)
      console.log('Starting sign up for:', email);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        console.error('Auth error JSON:', JSON.stringify(authError, null, 2));
        throw authError;
      }


      if (!authData.user) {
        throw new Error('User creation failed');
      }

      console.log('User created:', authData.user.id);

      // Wait for trigger to complete (it's very fast but async)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verify profile was created
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.log('Profile not found, creating manually...');
        // Fallback: create profile manually if trigger failed
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            full_name: fullName,
            role: role,
          });


        if (insertError && insertError.code !== '23505') {
          console.error('Manual profile creation error:', insertError);
          throw new Error(`Failed to create profile: ${insertError.message}`);
        }
      } else {
        console.log('Profile created by trigger successfully');
      }

      return { user: authData.user, session: authData.session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn({ email, password }: SignInData) {
    try {
      console.log('Signing in user:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful');
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get the current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Get session error:', error);
        throw error;
      }
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null; // Return null instead of throwing
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  /**
   * Complete athlete onboarding
   */
  async completeAthleteOnboarding(userId: string, data: OnboardingData) {
    try {
      console.log('Completing athlete onboarding for:', userId);

      // Convert units if needed
      const weightLbs = data.weightUnit === 'kg' ? data.weight * 2.20462 : data.weight;
      const heightInches = data.heightUnit === 'cm' ? data.height / 2.54 : data.height;
      const distance_unit = data.heightUnit === 'cm' ? 'metric' : 'imperial';

      const { error } = await supabase.from('athlete_profiles').update({
        age: data.age,
        gender: data.gender,
        weight_lbs: weightLbs,
        height_inches: heightInches,
        experience_level: data.experience,
        goals: data.goals,
        weight_unit: data.weightUnit,
        distance_unit: distance_unit
      }).eq('user_id', userId);;

      if (error) {
        console.error('Onboarding insert error:', error);
        throw error;
      }

      console.log('Athlete profile created successfully');
    } catch (error) {
      console.error('Complete onboarding error:', error);
      throw error;
    }
  }

  async completeCoachOnboarding(userId: string, data: CoachOnboardingData) {
    const { error } = await supabase.from('coach_profiles').upsert(
      {
        user_id: userId,
        bio: data.bio,
        years_coaching: data.yearsCoaching,
        specialties: data.specialties,
        coaching_format: data.coachingFormat,
        accepting_new_athletes: data.acceptingNewAthletes,
        athlete_levels: data.athleteLevels,
        location: data.location,
        monthly_rate: data.monthlyRate,
        instagram: data.instagram,
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      console.error('Error completing coach onboarding:', error);
      throw error;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) {
        console.error('profiles fetch error:', profileErr);
        return false;
      }
      if (!profile) return false;

      if (profile.role === 'athlete') {
        const { data: athlete, error: athErr } = await supabase
          .from('athlete_profiles')
          .select('age, gender, weight_lbs, height_inches, experience_level, goals')
          .eq('user_id', userId)
          .maybeSingle();
        if (athErr) {
          console.error('athlete_profiles fetch error:', athErr);
          return false;
        }
        if (!athlete) return false;

        // 3) Validate required fields
        const validGender = ['Male', 'Female', 'Other'].includes(
          (athlete.gender ?? '')
        );
        const validExperience = ['beginner', 'intermediate', 'advanced', 'expert'].includes(
          (athlete.experience_level ?? '').toLowerCase()
        );

        const goalsOk = Array.isArray(athlete.goals) && athlete.goals.length > 0;

        const complete =
          typeof athlete.age === 'number' && athlete.age > 0 &&
          validGender &&
          typeof athlete.weight_lbs === 'number' && athlete.weight_lbs > 0 &&
          typeof athlete.height_inches === 'number' && athlete.height_inches > 0 &&
          validExperience &&
          goalsOk;

        return complete;
      } else {
        // Coach logic — adjust if you have required fields for coaches.
        const { data: coach, error: coachErr } = await supabase
          .from('coach_profiles')
          .select('id') // add required columns and validate like athlete if needed
          .eq('user_id', userId)
          .maybeSingle();

        if (coachErr) {
          console.error('coach_profiles fetch error:', coachErr);
          return false;
        }
        // For now: coach exists == complete. Tighten this if you add required fields.
        return !!coach;
      }
    } catch (error) {
      console.error('Check onboarding error:', error);
      return false;
    }
  }

}

export const authService = new AuthService();