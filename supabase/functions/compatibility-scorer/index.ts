// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define the structure of a user profile for scoring
interface Profile {
  professional_roles: string[] | null;
  skills: string[] | null;
  software_proficiencies: string[] | null;
  collaboration_styles: string[] | null;
  location: string | null;
}

// --- Scoring Logic ---

// 1. Role Complementarity (Max 30 points)
const complementaryRoles: { [key: string]: string[] } = {
  'singer': ['music-director', 'sound-engineer', 'lyricist'],
  'music-director': ['singer', 'sound-engineer', 'lyricist'],
  'video-editor': ['producer', 'actor-model', 'choreographer'],
  'sound-engineer': ['singer', 'music-director'],
  'actor-model': ['video-editor', 'producer'],
  'producer': ['video-editor', 'actor-model', 'music-director'],
  'lyricist': ['singer', 'music-director'],
  'choreographer': ['video-editor', 'actor-model'],
};

function calculateRoleScore(profile1: Profile, profile2: Profile): number {
  let score = 0;
  const roles1 = profile1.professional_roles || [];
  const roles2 = profile2.professional_roles || [];

  for (const role1 of roles1) {
    for (const role2 of roles2) {
      if (complementaryRoles[role1]?.includes(role2)) {
        score += 15; // Add points for each complementary pair
      }
    }
  }
  return Math.min(score, 30); // Cap at 30
}

// 2. Shared Skills (Max 30 points)
function calculateSharedItemsScore(items1: string[] | null, items2: string[] | null, maxScore: number, pointsPerItem: number): number {
  if (!items1 || !items2) return 0;
  const set1 = new Set(items1.map(s => s.toLowerCase().trim()));
  const set2 = new Set(items2.map(s => s.toLowerCase().trim()));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const score = intersection.size * pointsPerItem;
  return Math.min(score, maxScore);
}

// 3. Location Match (Max 10 points)
function calculateLocationScore(profile1: Profile, profile2: Profile): number {
  if (!profile1.location || !profile2.location) return 0;
  const location1 = profile1.location.toLowerCase().trim();
  const location2 = profile2.location.toLowerCase().trim();
  return location1 === location2 ? 10 : 0;
}

// --- Main Server Logic ---

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }

  try {
    const { profile1, profile2 } = await req.json();

    if (!profile1 || !profile2) {
      throw new Error('Both profile1 and profile2 must be provided.');
    }

    // Calculate individual scores
    const roleScore = calculateRoleScore(profile1, profile2);
    const skillsScore = calculateSharedItemsScore(profile1.skills, profile2.skills, 30, 5);
    const softwareScore = calculateSharedItemsScore(profile1.software_proficiencies, profile2.software_proficiencies, 20, 5);
    const collaborationScore = calculateSharedItemsScore(profile1.collaboration_styles, profile2.collaboration_styles, 10, 10);
    const locationScore = calculateLocationScore(profile1, profile2);

    // Calculate total compatibility score
    const totalScore = roleScore + skillsScore + softwareScore + collaborationScore + locationScore;

    const responseData = {
      totalScore: Math.min(totalScore, 100), // Ensure score doesn't exceed 100
      breakdown: {
        roleComplementarity: roleScore,
        skillOverlap: skillsScore,
        softwareOverlap: softwareScore,
        collaborationStyleMatch: collaborationScore,
        locationMatch: locationScore,
      },
    };

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 400,
    });
  }
});
