
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Users, Music, Star, CheckCircle, ArrowRight, Headphones, Mic, Video, Camera } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: '50K+', label: 'Active Professionals' },
    { number: '100K+', label: 'Songs Uploaded' },
    { number: '25K+', label: 'Collaborations Made' },
    { number: '500+', label: 'Success Stories' }
  ];

  const roles = [
    { icon: Mic, title: 'Singers', count: '15K+' },
    { icon: Music, title: 'Music Directors', count: '8K+' },
    { icon: Video, title: 'Video Editors', count: '12K+' },
    { icon: Headphones, title: 'Sound Engineers', count: '6K+' },
    { icon: Camera, title: 'Models & Actors', count: '20K+' },
    { icon: Star, title: 'Producers', count: '4K+' }
  ];

  const testimonials = [
    {
      name: 'Armaan Singh',
      role: 'Punjabi Singer',
      content: 'SoundConnect helped me collaborate with amazing producers. My latest track got 2M+ views!',
      avatar: '👨‍🎤'
    },
    {
      name: 'Priya Kaur',
      role: 'Music Director',
      content: 'Found the perfect team for my album project. The platform is a game-changer for music professionals.',
      avatar: '👩‍🎼'
    },
    {
      name: 'Ravi Sharma',
      role: 'Video Editor',
      content: 'Getting consistent work through SoundConnect. The quality of projects and professionals is outstanding.',
      avatar: '🎬'
    }
  ];

  return (
    <div className="min-h-screen bg-purple-cosmic relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gold-shimmer rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">SoundConnect</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#community" className="text-white/80 hover:text-white transition-colors">Community</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button 
                className="btn-cosmic"
                onClick={() => navigate('/auth?mode=signup')}
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 section-padding">
        <div className="container mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="hero-text text-white mb-6">
              Connect. Create. <span className="text-gradient">Collaborate.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
              Where Music Professionals Unite - The Premier Platform for Punjabi Music Industry and Beyond
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="btn-cosmic text-lg px-8 py-4"
                onClick={() => navigate('/auth?role=artist')}
              >
                Join as Artist
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                className="btn-gold text-lg px-8 py-4"
                onClick={() => navigate('/discover')}
              >
                Find Talent
                <Users className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
                onClick={() => navigate('/explore')}
              >
                Explore Music
                <Play className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`text-center animate-fade-in-up stagger-${index + 1}`}
                >
                  <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three Main Pillars */}
      <section id="features" className="relative z-10 section-padding">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Three Pillars of <span className="text-gradient">Success</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="floating-card group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-cosmic-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Showcase Your Work</h3>
                <p className="text-white/70 leading-relaxed">
                  Upload and showcase your music, videos, and creative projects with our professional portfolio system. Get discovered by industry professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="floating-card group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-purple-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Network with Professionals</h3>
                <p className="text-white/70 leading-relaxed">
                  Connect with singers, producers, directors, and other music industry professionals. Build meaningful relationships that advance your career.
                </p>
              </CardContent>
            </Card>

            <Card className="floating-card group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gold-shimmer rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Discover Opportunities</h3>
                <p className="text-white/70 leading-relaxed">
                  Find collaboration opportunities, job postings, and project invitations. Turn your passion into a thriving professional career.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional Roles */}
      <section className="relative z-10 section-padding">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            For Every <span className="text-gold-gradient">Music Professional</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {roles.map((role, index) => (
              <Card key={index} className="floating-card text-center group cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cosmic-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{role.title}</h3>
                  <p className="text-gold-400 text-sm font-medium">{role.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="community" className="relative z-10 section-padding">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Success <span className="text-gradient">Stories</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="floating-card">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center text-2xl mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gold-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 section-padding">
        <div className="container mx-auto text-center">
          <Card className="glass-card max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to <span className="text-gradient">Transform</span> Your Music Career?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of music professionals who are building their careers on SoundConnect. Your next big collaboration is just a click away.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="btn-cosmic text-lg px-8 py-4"
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
                  onClick={() => navigate('/demo')}
                >
                  Watch Demo
                  <Play className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 glass">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gold-shimmer rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">SoundConnect</span>
              </div>
              <p className="text-white/70 leading-relaxed">
                The premier platform connecting music professionals worldwide, with a special focus on Punjabi music industry.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60">
              © 2024 SoundConnect. Made with ❤️ for the music community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
