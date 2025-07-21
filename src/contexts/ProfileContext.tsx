import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Omit<Database['public']['Tables']['profiles']['Row'], 'professional_roles'>;

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  refetchProfile: () => void;
  setProfileDirectly: (profile: Profile | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, bio, location, website, skills, software_proficiencies, collaboration_styles, portfolio')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else if (data) {
        // Profile exists, update the state
        if (data.avatar_url) {
          if (!data.avatar_url.startsWith('http')) {
            const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(data.avatar_url);
            data.avatar_url = publicUrlData.publicUrl;
          }
          // Bust the cache by adding a timestamp
          data.avatar_url = `${data.avatar_url}?t=${new Date().getTime()}`;
        }
        setProfile(data as any);
      } else {
        // Profile does not exist, so create it
        console.log('No profile found for user, attempting to create one.');
        const fullName = user.user_metadata?.full_name || user.email || 'New User';
        const username = user.user_metadata?.user_name || user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`;
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: user.id, 
            full_name: fullName,
            username: username,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          setProfile(null);
        } else {
          console.log('Successfully created new profile:', newProfile);
          setProfile(newProfile);
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const value = {
    profile,
    loading,
    refetchProfile: fetchProfile,
    setProfileDirectly: setProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
