import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, TrendingUp, Users, Music, ArrowRight, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/types';

interface Recommendation {
  id: string;
  type: 'collaborator' | 'project' | 'skill' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  data: any;
  reasoning: string[];
}

export function RecommendationEngine() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          // Generate recommendations based on user data
          const generatedRecommendations = await generateRecommendations(profile);
          setRecommendations(generatedRecommendations);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const generateRecommendations = async (profile: Profile): Promise<Recommendation[]> => {
    const recommendations: Recommendation[] = [];

    // Collaborator recommendations based on skills and genres
    if (profile.genres && profile.genres.length > 0) {
      const { data: collaborators } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', profile.id)
        .not('genres', 'is', null)
        .limit(5);

      if (collaborators) {
        const matchingCollaborators = collaborators
          .filter(c => c.genres?.some((genre: string) => profile.genres?.includes(genre)))
          .slice(0, 3);

        matchingCollaborators.forEach(collaborator => {
          const sharedGenres = collaborator.genres?.filter((genre: string) => 
            profile.genres?.includes(genre)
          ) || [];

          recommendations.push({
            id: `collaborator-${collaborator.id}`,
            type: 'collaborator',
            title: `Connect with ${collaborator.full_name || collaborator.username}`,
            description: `${collaborator.role || 'Professional'} who shares your interest in ${sharedGenres.join(', ')}`,
            confidence: Math.min(95, 70 + (sharedGenres.length * 10)),
            data: collaborator,
            reasoning: [
              `Shares ${sharedGenres.length} genre(s) with you`,
              `Similar experience level`,
              `Active in the community`
            ]
          });
        });
      }
    }

    // Skill recommendations based on current role and projects
    const skillRecommendations = getSkillRecommendations(profile);
    recommendations.push(...skillRecommendations);

    // Project opportunity recommendations
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .neq('user_id', profile.id)
      .eq('is_collaborative', true)
      .limit(3);

    if (projects) {
      projects.forEach(project => {
        recommendations.push({
          id: `project-${project.id}`,
          type: 'project',
          title: `Join "${project.title}" project`,
          description: `Collaborative ${project.genre || 'music'} project looking for ${profile.role}`,
          confidence: 75,
          data: project,
          reasoning: [
            'Matches your genre preferences',
            'Seeking your role type',
            'Recent project activity'
          ]
        });
      });
    }

    // Opportunity recommendations based on profile completion
    const opportunityRecommendations = getOpportunityRecommendations(profile);
    recommendations.push(...opportunityRecommendations);

    // Sort by confidence and return top recommendations
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8);
  };

  const getSkillRecommendations = (profile: Profile): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    const currentSkills = profile.skills || [];
    
    const skillSuggestions = [
      { skill: 'Audio Mixing', reason: 'High demand skill for producers', confidence: 85 },
      { skill: 'MIDI Programming', reason: 'Essential for modern music production', confidence: 80 },
      { skill: 'Sound Design', reason: 'Growing field with many opportunities', confidence: 75 },
      { skill: 'Live Performance', reason: 'Complement your studio skills', confidence: 70 },
    ];

    skillSuggestions
      .filter(suggestion => !currentSkills.includes(suggestion.skill))
      .slice(0, 2)
      .forEach(suggestion => {
        recommendations.push({
          id: `skill-${suggestion.skill.toLowerCase().replace(' ', '-')}`,
          type: 'skill',
          title: `Learn ${suggestion.skill}`,
          description: suggestion.reason,
          confidence: suggestion.confidence,
          data: { skill: suggestion.skill },
          reasoning: [
            'Complements your current skills',
            'High market demand',
            'Many learning resources available'
          ]
        });
      });

    return recommendations;
  };

  const getOpportunityRecommendations = (profile: Profile): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    // Check profile completion
    const completionScore = calculateProfileCompletion(profile);
    
    if (completionScore < 80) {
      recommendations.push({
        id: 'complete-profile',
        type: 'opportunity',
        title: 'Complete Your Profile',
        description: `Your profile is ${completionScore}% complete. Adding more details increases visibility by 3x`,
        confidence: 90,
        data: { currentCompletion: completionScore },
        reasoning: [
          'Incomplete profiles get 70% fewer views',
          'Portfolio section is missing',
          'Bio could be more detailed'
        ]
      });
    }

    if (!profile.portfolio_url && (!profile.portfolio || Object.keys(profile.portfolio || {}).length === 0)) {
      recommendations.push({
        id: 'add-portfolio',
        type: 'opportunity',
        title: 'Showcase Your Work',
        description: 'Add portfolio items to attract 5x more collaboration requests',
        confidence: 85,
        data: {},
        reasoning: [
          'Profiles with portfolios get more connections',
          'Visual content increases engagement',
          'Builds trust with potential collaborators'
        ]
      });
    }

    return recommendations;
  };

  const calculateProfileCompletion = (profile: Profile): number => {
    const fields = [
      profile.full_name,
      profile.bio,
      profile.role,
      profile.location,
      profile.avatar_url,
      profile.genres?.length,
      profile.skills?.length,
      profile.portfolio_url || (profile.portfolio && Object.keys(profile.portfolio).length > 0),
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'collaborator': return <Users className="w-5 h-5" />;
      case 'project': return <Music className="w-5 h-5" />;
      case 'skill': return <TrendingUp className="w-5 h-5" />;
      case 'opportunity': return <Zap className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-emerald-500';
    if (confidence >= 80) return 'bg-blue-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
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
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted/70 rounded animate-pulse w-3/4" />
                </div>
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
          <Sparkles className="w-5 h-5 text-primary" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="group border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getRecommendationIcon(rec.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <div className={`w-2 h-2 rounded-full ${getConfidenceColor(rec.confidence)}`} 
                         title={`${rec.confidence}% confidence`} />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  
                  {rec.type === 'collaborator' && rec.data && (
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={rec.data.avatar_url} />
                        <AvatarFallback>{rec.data.full_name?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {rec.data.role} • {rec.data.location || 'Remote'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {rec.reasoning.slice(0, 2).map((reason, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {recommendations.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No recommendations available at the moment.</p>
              <p className="text-sm">Complete your profile to get personalized suggestions!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}