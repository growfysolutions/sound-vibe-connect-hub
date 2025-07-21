import { supabase } from '@/integrations/supabase/client';

// --- Configuration ---
export const XP_AMOUNTS = {
  NEW_CONNECTION: 50,
  NEW_PROJECT: 100,
  FIRST_COLLABORATION: 200,
};

export const LEVEL_THRESHOLDS = {
  1: 0,
  2: 1000,
  3: 2500,
  4: 5000,
  5: 10000,
};

export const LEVEL_NAMES: { [key: number]: string } = {
  1: 'Rising Star',
  2: 'Local Virtuoso',
  3: 'Established Artist',
  4: 'Regional Icon',
  5: 'Global Sensation',
};

export const getLevelFromXp = (xp: number): number => {
  let level = 1;
  for (const lvl in LEVEL_THRESHOLDS) {
    if (xp >= LEVEL_THRESHOLDS[lvl as unknown as keyof typeof LEVEL_THRESHOLDS]) {
      level = parseInt(lvl, 10);
    } else {
      break;
    }
  }
  return level;
};

export const getLevelName = (level: number): string => {
  return LEVEL_NAMES[level] || 'Aspirant';
};

export const getNextLevelXp = (level: number): number => {
    const nextLevel = level + 1;
    return LEVEL_THRESHOLDS[nextLevel as keyof typeof LEVEL_THRESHOLDS] || LEVEL_THRESHOLDS[5];
}

/**
 * Adds XP to a user's profile and handles level-ups.
 * @param userId - The ID of the user to grant XP to.
 * @param amount - The amount of XP to add.
 * @returns The updated profile data or null on error.
 */
export const addXp = async (userId: string, amount: number) => {
  try {
    // 1. Fetch current user XP and level
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('xp, level')
      .eq('id', userId)
      .single();

    if (fetchError || !currentProfile) {
      throw new Error(fetchError?.message || 'Could not find user profile to add XP.');
    }

    // 2. Calculate new XP and level
    const newXp = ((currentProfile as any).xp || 0) + amount;
    const newLevel = getLevelFromXp(newXp);

    // 3. Update the profile in the database
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ xp: newXp, level: newLevel })
      .eq('id', userId)
      .select('xp, level')
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return updatedProfile;
  } catch (error) {
    console.error('Error in addXp:', error);
    return null;
  }
};
