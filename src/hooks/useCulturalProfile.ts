
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';

interface CulturalProfile {
  preferred_language: string;
  cultural_specialties: string[];
  cultural_themes: string[];
  verification_status: string;
}

export const useCulturalProfile = () => {
  const { profile } = useProfile();
  const [culturalProfile, setCulturalProfile] = useState<CulturalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchCulturalProfile();
    }
  }, [profile?.id]);

  const fetchCulturalProfile = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_cultural_profile', { user_id: profile.id });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setCulturalProfile(data[0]);
      }
    } catch (error) {
      console.error('Error fetching cultural profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCulturalProfile = async (updates: Partial<CulturalProfile>) => {
    if (!profile?.id) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;

      await fetchCulturalProfile();
      return true;
    } catch (error) {
      console.error('Error updating cultural profile:', error);
      return false;
    }
  };

  return {
    culturalProfile,
    loading,
    updateCulturalProfile,
    refetch: fetchCulturalProfile
  };
};
