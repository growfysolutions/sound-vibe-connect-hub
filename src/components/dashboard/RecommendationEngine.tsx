import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, TrendingUp, UserPlus, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  type: 'collaborator' | 'project' | 'skill';
  title: string;
  description: string;
  score: number;
  metadata: any;
  reasoning: string;
}

interface RecommendationEngineProps {
  userId: string;
  userProfile: any;
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  userId,
  userProfile
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, [userId, userProfile]);

  const generateRecommendations = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    
    try {
      // Get user's genres, skills, and collaboration history
      const userGenres = userProfile.genres || [];
      const userSkills = userProfile.skills || [];
      const userRoles = userProfile.professional_roles || [];
      
      // Fetch potential collaborators
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', userId);

      // Fetch user's projects to understand their style
      const { data: userProjects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      // Fetch popular/trending projects
      const { data: trendingProjects } = await supabase
        .from('projects')
        .select('*, profiles(full_name, avatar_url)')
        .order('likes', { ascending: false })
        .limit(10);

      const newRecommendations: Recommendation[] = [];

      // 1. Collaborator Recommendations
      if (profiles) {
        const collaboratorRecommendations = profiles
          .map(profile => {
            let score = 0;
            let reasoning = '';

            // Genre compatibility
            const genreOverlap = userGenres.filter(genre => 
              (profile.genres || []).includes(genre)
            ).length;
            if (genreOverlap > 0) {
              score += genreOverlap * 20;
              reasoning += `Shares ${genreOverlap} genre(s). `;
            }

            // Complementary skills
            const complementarySkills = (profile.skills || []).filter(skill => 
              !userSkills.includes(skill)
            ).length;
            if (complementarySkills > 0) {
              score += complementarySkills * 10;
              reasoning += `Has ${complementarySkills} complementary skill(s). `;
            }

            // Experience level compatibility
            if (profile.experience === userProfile.experience) {
              score += 15;
              reasoning += 'Similar experience level. ';
            }

            // High rating bonus
            if (profile.rating && profile.rating >= 4.0) {
              score += 25;
              reasoning += 'Highly rated professional. ';
            }

            // Online status
            if (profile.is_online) {
              score += 10;
              reasoning += 'Currently online. ';
            }

            return {
              id: `collab-${profile.id}`,
              type: 'collaborator' as const,
              title: profile.full_name || 'Unknown',
              description: profile.bio || 'No bio available',
              score,
              metadata: profile,
              reasoning: reasoning || 'Good potential match'
            };
          })
          .filter(rec => rec.score > 30)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        newRecommendations.push(...collaboratorRecommendations);
      }

      // 2. Project Inspiration Recommendations
      if (trendingProjects) {
        const projectRecommendations = trendingProjects
          .filter(project => {
            // Filter projects that match user's genres
            return userGenres.some(genre => 
              project.genre?.toLowerCase().includes(genre.toLowerCase())
            );
          })
          .map(project => ({
            id: `project-${project.id}`,
            type: 'project' as const,
            title: `"${project.title}" by ${project.profiles?.full_name}`,
            description: `Popular ${project.genre} project with ${project.likes} likes`,
            score: (project.likes || 0) + (project.plays || 0),
            metadata: project,
            reasoning: `Trending in your genre (${project.genre})`
          }))
          .slice(0, 2);

        newRecommendations.push(...projectRecommendations);
      }

      // 3. Skill Development Recommendations
      const skillRecommendations = [
        {
          id: 'skill-mixing',
          type: 'skill' as const,
          title: 'Learn Audio Mixing',
          description: 'Enhance your production skills with mixing techniques',
          score: 80,
          metadata: { skillType: 'production', difficulty: 'intermediate' },
          reasoning: 'High demand skill for producers'
        },
        {
          id: 'skill-collaboration',
          type: 'skill' as const,
          title: 'Remote Collaboration Tools',
          description: 'Master digital collaboration platforms',
          score: 75,
          metadata: { skillType: 'collaboration', difficulty: 'beginner' },
          reasoning: 'Essential for modern music production'
        }
      ];

      // Only recommend skills user doesn't already have
      const filteredSkillRecs = skillRecommendations.filter(rec => 
        !userSkills.some(skill => 
          skill.toLowerCase().includes(rec.title.toLowerCase())
        )
      );

      newRecommendations.push(...filteredSkillRecs);

      // Sort all recommendations by score and take top 5
      const finalRecommendations = newRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setRecommendations(finalRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationAction = async (recommendation: Recommendation) => {
    switch (recommendation.type) {
      case 'collaborator':
        // Send connection request
        try {
          const { error } = await supabase.from('connections').insert({
            requester_id: userId,
            addressee_id: recommendation.metadata.id,
            status: 'pending'
          });
          
          if (error) throw error;
          toast.success('Connection request sent!');
        } catch (error) {
          toast.error('Failed to send connection request');
        }
        break;
        
      case 'project':
        // Navigate to project or save to favorites
        toast.info('Project saved to your inspiration list!');
        break;
        
      case 'skill':
        // Open learning resources
        toast.info('Opening skill development resources...');
        break;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'collaborator': return <UserPlus className="w-4 h-4" />;
      case 'project': return <TrendingUp className="w-4 h-4" />;
      case 'skill': return <Sparkles className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'collaborator': return 'bg-blue-500';
      case 'project': return 'bg-green-500';
      case 'skill': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>
          Curated suggestions based on your profile and activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map(recommendation => (
            <div
              key={recommendation.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className={`w-8 h-8 ${getRecommendationColor(recommendation.type)} rounded-full flex items-center justify-center text-white`}>
                {getRecommendationIcon(recommendation.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{recommendation.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(recommendation.score)}% match
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {recommendation.description}
                </p>
                
                <p className="text-xs text-muted-foreground italic">
                  {recommendation.reasoning}
                </p>
                
                {recommendation.type === 'collaborator' && recommendation.metadata && (
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={recommendation.metadata.avatar_url} />
                      <AvatarFallback>{recommendation.metadata.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1">
                      {recommendation.metadata.rating && (
                        <>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{recommendation.metadata.rating}</span>
                        </>
                      )}
                      {recommendation.metadata.is_online && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRecommendationAction(recommendation)}
                className="shrink-0"
              >
                {recommendation.type === 'collaborator' ? 'Connect' : 
                 recommendation.type === 'project' ? 'View' : 'Learn'}
              </Button>
            </div>
          ))}
          
          {recommendations.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Complete your profile to get personalized recommendations!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};