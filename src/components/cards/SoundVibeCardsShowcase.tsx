
import React from 'react';
import { ArtistProfileCard } from './ArtistProfileCard';
import { ProjectCollaborationCard } from './ProjectCollaborationCard';
import { TestimonialCard } from './TestimonialCard';

export const SoundVibeCardsShowcase: React.FC = () => {
  // Real Punjabi artist data
  const sampleArtist = {
    id: '1',
    name: 'Jasbir Singh Khalsa',
    role: 'Vocalist & Lyricist',
    location: 'Chandigarh, Punjab',
    experience: '8 years professional',
    rating: 4.8,
    reviewCount: 127,
    recentWork: "Collaborated on 'Mitti Da Ghar' - 2.3M views",
    skills: ['Bhangra', 'Folk', 'Modern Punjabi', 'Live Performance', 'Harmonium', 'Tabla'],
    avatar: '/api/placeholder/400/400',
    isVerified: true,
    collaborations: 43
  };

  const sampleProject = {
    id: '1',
    title: 'Modern Bhangra Fusion Album',
    seeking: ['Dhol Player', 'Music Producer'],
    budget: '₹15,000 - ₹25,000',
    timeline: '2 months',
    description: 'Creating 6-track album blending traditional Punjabi folk with contemporary beats. Looking for skilled dhol player and experienced music producer to join our creative team.',
    postedBy: {
      name: 'Simran Kaur',
      avatar: '/api/placeholder/400/400',
      isVerified: true
    },
    applications: 14,
    urgency: 'Auditions this weekend',
    skills: ['Dhol', 'Music Production', 'Folk Music', 'Digital Audio'],
    location: 'Ludhiana, Punjab',
    postedDate: '2 days ago'
  };

  const sampleTestimonial = {
    id: '1',
    quote: 'Jasbir brought incredible energy and authenticity to our fusion project. His traditional knowledge combined with modern sensibilities created something truly special.',
    author: {
      name: 'Harpreet Singh',
      avatar: '/api/placeholder/400/400',
      role: 'Music Producer'
    },
    project: {
      title: 'Mitti Da Ghar Fusion Track',
      link: '/projects/mitti-da-ghar'
    },
    rating: 5,
    date: 'March 2024'
  };

  const handleConnect = (artistId: string) => {
    console.log('Connecting to artist:', artistId);
  };

  const handleApply = (projectId: string) => {
    console.log('Applying to project:', projectId);
  };

  const handleSave = (id: string) => {
    console.log('Saving item:', id);
  };

  const handleShare = (id: string) => {
    console.log('Sharing item:', id);
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-background to-muted/20">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">SoundVibe Card System</h2>
        <p className="text-muted-foreground">
          Artist profiles, project collaborations, and testimonials with cultural design elements
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-foreground">Artist Profile Cards</h3>
          <div className="flex flex-wrap gap-6">
            <ArtistProfileCard
              artist={sampleArtist}
              onConnect={handleConnect}
              onViewProfile={(id) => console.log('View profile:', id)}
              onSave={handleSave}
              onShare={handleShare}
            />
            <ArtistProfileCard
              artist={{
                ...sampleArtist,
                id: '2',
                name: 'Manpreet Kaur',
                role: 'Dhol Player & Percussionist',
                location: 'Amritsar, Punjab',
                experience: '12 years professional',
                rating: 4.9,
                reviewCount: 89,
                recentWork: "Featured in 'Punjabi Virsa' live concert series",
                skills: ['Dhol', 'Tabla', 'Dholki', 'Live Performance'],
                collaborations: 67
              }}
              onConnect={handleConnect}
              onViewProfile={(id) => console.log('View profile:', id)}
              onSave={handleSave}
              onShare={handleShare}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-foreground">Project Collaboration Cards</h3>
          <div className="flex flex-wrap gap-6">
            <ProjectCollaborationCard
              project={sampleProject}
              onApply={handleApply}
              onSave={handleSave}
              onShare={handleShare}
              onViewDetails={(id) => console.log('View details:', id)}
            />
            <ProjectCollaborationCard
              project={{
                ...sampleProject,
                id: '2',
                title: 'Traditional Gurbani Recording',
                seeking: ['Harmonium Player', 'Classical Vocalist'],
                budget: '₹8,000 - ₹12,000',
                timeline: '3 weeks',
                description: 'Recording traditional Gurbani shabads with classical instrumentation. Seeking skilled harmonium player and classical Punjabi vocalist.',
                urgency: undefined,
                skills: ['Harmonium', 'Classical Vocals', 'Gurbani', 'Traditional Music'],
                applications: 7
              }}
              onApply={handleApply}
              onSave={handleSave}
              onShare={handleShare}
              onViewDetails={(id) => console.log('View details:', id)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-foreground">Testimonial Cards</h3>
          <div className="flex flex-wrap gap-6">
            <TestimonialCard
              testimonial={sampleTestimonial}
              onProjectClick={(link) => console.log('Project clicked:', link)}
            />
            <TestimonialCard
              testimonial={{
                ...sampleTestimonial,
                id: '2',
                quote: 'Working with Manpreet was a dream come true. Her dhol skills elevated our fusion album to another level. Truly professional and passionate about her craft.',
                author: {
                  name: 'Rajdeep Singh',
                  avatar: '/api/placeholder/400/400',
                  role: 'Album Producer'
                },
                project: {
                  title: 'Urban Punjabi Fusion EP',
                  link: '/projects/urban-fusion'
                },
                rating: 5,
                date: 'February 2024'
              }}
              onProjectClick={(link) => console.log('Project clicked:', link)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Export individual components for use throughout the app
export { ArtistProfileCard, ProjectCollaborationCard, TestimonialCard };
