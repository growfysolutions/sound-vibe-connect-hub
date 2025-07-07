
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Users, Music, Star, CheckCircle, ArrowRight, Headphones, Mic, Video, Camera, Bell, Heart, TrendingUp, Award, Zap, Sparkles, Upload, Globe, MonitorPlay, Disc3, Search } from 'lucide-react';
import { ImagesSlider } from '@/components/ui/images-slider';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const heroImages = [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1571974599782-87624638275c?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const platformStats = [
    { number: '15K+', label: 'Active Projects', gradient: 'from-space-stellar-blue to-space-aurora-cyan', icon: Video },
    { number: '50K+', label: 'Music Professionals', gradient: 'from-space-nebula-pink to-space-cosmic-purple', icon: Users },
    { number: '8K+', label: 'Successful Collabs', gradient: 'from-space-aurora-cyan to-space-electric-blue', icon: Star },
    { number: '₹2.5M+', label: 'Earnings Generated', gradient: 'from-space-electric-blue to-space-stellar-blue', icon: TrendingUp }
  ];

  const musicProfessionals = [
    { icon: Mic, title: 'Singers & Vocalists', count: '25K+', gradient: 'from-space-stellar-blue to-space-aurora-cyan', description: 'Playback singers, independent artists' },
    { icon: Music, title: 'Music Producers', count: '12K+', gradient: 'from-space-aurora-cyan to-space-electric-blue', description: 'Beat makers, composers' },
    { icon: Video, title: 'Music Video Directors', count: '8K+', gradient: 'from-space-nebula-pink to-space-cosmic-purple', description: 'Video creators, cinematographers' },
    { icon: Headphones, title: 'Sound Engineers', count: '6K+', gradient: 'from-space-electric-blue to-space-stellar-blue', description: 'Mixing, mastering engineers' },
    { icon: Camera, title: 'Performers & Models', count: '15K+', gradient: 'from-space-cosmic-purple to-space-nebula-pink', description: 'Dancers, models for music videos' },
    { icon: Star, title: 'Record Labels', count: '2K+', gradient: 'from-space-aurora-cyan to-space-stellar-blue', description: 'Music labels, talent agencies' }
  ];

  const featuredArtists = [
    {
      name: 'Priya Sharma',
      role: 'Bollywood Playback Singer',
      subscribers: '1.2M',
      content: 'Just dropped my latest music video! 🎤 Working with amazing directors through SoundConnect has been incredible.',
      avatar: '🎤',
      verified: true,
      views: '15M',
      genre: 'Bollywood'
    },
    {
      name: 'DJ Cosmic',
      role: 'Music Producer',  
      subscribers: '890K',
      content: 'Produced 20+ chart-toppers this year! The collaboration tools here are unmatched. 🔥',
      avatar: '🎧',
      verified: true,
      views: '12M',
      genre: 'Electronic'
    },
    {
      name: 'Rohan Films',
      role: 'Music Video Director',
      subscribers: '650K',
      content: 'Every music video tells a story. Found the most talented artists here! 📹✨',
      avatar: '🎬',
      verified: true,
      views: '25M',
      genre: 'Visual'
    }
  ];

  const trendingGenres = [
    '#Bollywood', '#Punjabi', '#HipHop', '#Classical', '#Electronic', '#IndieRock'
  ];

  const platformFeatures = [
    {
      icon: Users,
      title: 'Hire Music Professionals',
      description: 'Browse portfolios, check ratings, and hire verified singers, producers, engineers, and directors for your projects.',
      gradient: 'from-space-stellar-blue to-space-aurora-cyan'
    },
    {
      icon: Globe,
      title: 'Showcase Your Work',
      description: 'Build a professional profile, display your portfolio, set your rates, and get discovered by potential clients.',
      gradient: 'from-space-aurora-cyan to-space-electric-blue'
    },
    {
      icon: TrendingUp,
      title: 'Secure Project Management',
      description: 'Built-in contracts, milestone payments, file sharing, and communication tools for seamless collaboration.',
      gradient: 'from-space-nebula-pink to-space-cosmic-purple'
    }
  ];

  return (
    <div className="min-h-screen bg-space-dark relative overflow-hidden">
      {/* Floating cosmic orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cosmic-orb top-20 left-10 w-32 h-32 delay-cosmic-100"></div>
        <div className="cosmic-orb top-40 right-20 w-24 h-24 delay-cosmic-200"></div>
        <div className="cosmic-orb bottom-40 left-20 w-40 h-40 delay-cosmic-300"></div>
        <div className="cosmic-orb bottom-20 right-40 w-28 h-28 delay-cosmic-400"></div>
        <div className="cosmic-orb top-1/2 left-1/2 w-20 h-20 delay-cosmic-500"></div>
      </div>

      {/* Cosmic Navigation */}
      <nav className="nav-cosmic sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="icon-cosmic !w-12 !h-12">
                <Music className="w-6 h-6 text-space-aurora-cyan" />
              </div>
              <span className="text-3xl font-bold text-stellar-glow">SoundConnect</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#professionals" className="text-space-cosmic-gray hover-glow font-medium">Find Talent</a>
              <a href="#projects" className="text-space-cosmic-gray hover-glow font-medium">Browse Projects</a>
              <a href="#how-it-works" className="text-space-cosmic-gray hover-glow font-medium">How It Works</a>
              <a href="#success-stories" className="text-space-cosmic-gray hover-glow font-medium">Success Stories</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-space-cosmic-gray hover:bg-space-deep-blue/20 hover:text-space-aurora-cyan font-medium hover-glow"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button 
                className="btn-cosmic"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <Upload className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 h-screen">
        <ImagesSlider className="h-full" images={heroImages}>
          <motion.div
            initial={{
              opacity: 0,
              y: -80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut"
            }}
            className="z-50 flex flex-col justify-center items-center text-center px-4"
          >
            {/* Music platform badge */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 glass-cosmic text-space-stellar-white px-6 py-3 rounded-full font-semibold mb-8 shadow-cosmic-glow"
            >
              <TrendingUp className="w-5 h-5 text-space-aurora-cyan" />
              #1 Music Creator Platform
            </motion.div>

            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 1 }}
              className="text-nebula mb-8 leading-tight animate-cosmic-glow"
            >
              Music Industry
              <motion.span 
                animate={{ 
                  scale: [1, 1.05, 1],
                  filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
                }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                className="block text-cosmic-glow"
              >
                COLLABORATION HUB
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-space-stellar-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              The <strong className="text-stellar-glow">LinkedIn meets Fiverr</strong> for music professionals. 
              Find collaborators, hire experts, and build your dream team. 🎵✨
            </motion.p>

            {/* Music CTA Buttons */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Button 
                size="lg" 
                className="btn-cosmic text-xl px-12 py-6"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <Users className="mr-3 w-6 h-6" />
                Join as Professional
              </Button>
              <Button 
                size="lg" 
                className="glass-cosmic text-space-stellar-white hover:scale-105 text-xl px-12 py-6 transition-all duration-300"
                onClick={() => navigate('/discover')}
              >
                <Search className="mr-3 w-6 h-6" />
                Find Collaborators
              </Button>
            </motion.div>

            {/* Trending Genres */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {trendingGenres.map((genre, index) => (
                <motion.span 
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + (index * 0.1), duration: 0.6 }}
                  className="glass-cosmic px-4 py-2 rounded-full text-space-stellar-white font-medium hover-cosmic cursor-pointer"
                >
                  {genre}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </ImagesSlider>
      </section>

      {/* Platform Stats Section */}
      <section className="relative z-10 py-20 px-4 bg-cosmic-glow">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {platformStats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="cosmic-stat animate-fade-glow"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`icon-cosmic mx-auto mb-4 !w-16 !h-16 bg-gradient-to-r ${stat.gradient}`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-sm md:text-base font-medium text-space-stellar-white">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section id="artists" className="relative z-10 py-20 px-4 bg-nebula-gradient">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-space-stellar-white mb-6"
            >
              Featured <span className="text-stellar-glow">Music Artists</span> 🎵
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl text-space-stellar-white/80 max-w-3xl mx-auto"
            >
              Discover amazing artists who are creating stellar music and building their careers on our platform.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredArtists.map((artist, index) => (
              <motion.div 
                key={index} 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="creator-card-cosmic animate-cosmic-entrance"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-aurora-gradient rounded-full flex items-center justify-center text-3xl mr-4 shadow-cosmic-glow">
                    {artist.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-space-stellar-white font-bold text-lg hover-glow">{artist.name}</h4>
                      {artist.verified && <CheckCircle className="w-5 h-5 text-space-aurora-cyan" />}
                    </div>
                    <p className="text-space-cosmic-gray text-sm">{artist.role}</p>
                    <div className="flex items-center gap-4 text-xs text-space-cosmic-gray mt-1">
                      <span className="font-medium">{artist.subscribers} followers</span>
                      <span>{artist.views} plays</span>
                      <span className="text-space-aurora-cyan">{artist.genre}</span>
                    </div>
                  </div>
                </div>
                <p className="text-space-stellar-white/90 leading-relaxed mb-4">
                  {artist.content}
                </p>
                <div className="flex gap-2">
                  <Button className="btn-stellar flex-1 hover-cosmic">
                    <Play className="w-4 h-4 mr-2" />
                    Listen Now
                  </Button>
                  <Button variant="outline" className="glass-cosmic border-space-aurora-cyan/30">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Music Professional Roles Section */}
      <section className="relative z-10 py-20 px-4 bg-space-dark">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-space-stellar-white mb-6"
            >
              Music <span className="text-stellar-glow">Professionals</span> Welcome! 🎯
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl text-space-stellar-white/80 max-w-3xl mx-auto"
            >
              Whether you're a singer, producer, director, or any music professional - your community is here!
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {musicProfessionals.map((role, index) => (
              <motion.div 
                key={index} 
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-card hover-lift-cosmic animate-fade-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`icon-cosmic mx-auto mb-6 bg-gradient-to-r ${role.gradient}`}>
                  <role.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-space-stellar-white mb-2 text-center hover-glow">{role.title}</h3>
                <p className="text-space-cosmic-gray text-center mb-4">{role.description}</p>
                <div className={`text-3xl font-bold text-center mb-4 bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent`}>
                  {role.count}
                </div>
                <Button className="btn-cosmic w-full hover-cosmic">
                  Join Community <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="upload" className="relative z-10 py-20 px-4 bg-cosmic-glow">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-space-stellar-white mb-6"
            >
              Why Music Creators <span className="text-stellar-glow">✨ Choose</span> SoundConnect
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {platformFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-card text-center hover-lift-cosmic animate-fade-glow"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`icon-cosmic mx-auto mb-6 bg-gradient-to-r ${feature.gradient} animate-cosmic-glow`}>
                  <feature.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-space-stellar-white mb-4 hover-glow">{feature.title}</h3>
                <p className="text-space-stellar-white/80 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20 px-4 bg-nebula-gradient">
        <div className="container mx-auto text-center">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="glass-cosmic max-w-4xl mx-auto p-12 animate-fade-glow"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-space-stellar-white mb-6">
              Ready to Share Your <span className="text-stellar-glow">MUSIC</span> with the Universe? 🚀
            </h2>
            <p className="text-xl text-space-stellar-white/90 mb-8 max-w-2xl mx-auto font-medium">
              Join thousands of artists, producers, and music professionals who are building their careers on SoundConnect. 
              Your musical journey starts NOW!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                size="lg" 
                className="btn-cosmic text-xl px-12 py-6"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <Upload className="mr-3 w-6 h-6" />
                Upload Your First Track
              </Button>
              <Button 
                size="lg" 
                className="glass-cosmic text-space-stellar-white hover:scale-105 text-xl px-12 py-6 font-medium transition-all duration-300"
              >
                <Disc3 className="mr-3 w-6 h-6" />
                Explore Music Videos
              </Button>
            </div>

            <p className="text-space-stellar-white/70 text-sm">
              ✨ Upload free • Connect with professionals • Build your fanbase
            </p>
          </motion.div>
        </div>
      </section>

      {/* Music Platform Footer */}
      <footer className="relative z-10 bg-space-black border-t border-space-cosmic-purple/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="icon-cosmic !w-10 !h-10 !bg-aurora-gradient">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-stellar-glow">SoundConnect</span>
              </div>
              <p className="text-space-cosmic-gray leading-relaxed">
                Where music comes alive. Upload, discover, and connect in the ultimate music creator platform. 🎵
              </p>
            </div>

            <div>
              <h4 className="text-space-stellar-white font-bold mb-4">For Artists</h4>
              <ul className="space-y-2 text-space-cosmic-gray">
                <li><a href="#" className="hover-glow transition-colors">Upload Music</a></li>
                <li><a href="#" className="hover-glow transition-colors">Music Videos</a></li>
                <li><a href="#" className="hover-glow transition-colors">Artist Tools</a></li>
                <li><a href="#" className="hover-glow transition-colors">Analytics</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-space-stellar-white font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-space-cosmic-gray">
                <li><a href="#" className="hover-glow transition-colors">Find Collaborators</a></li>
                <li><a href="#" className="hover-glow transition-colors">Music Genres</a></li>
                <li><a href="#" className="hover-glow transition-colors">Live Events</a></li>
                <li><a href="#" className="hover-glow transition-colors">Artist Networking</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-space-stellar-white font-bold mb-4">Discover</h4>
              <ul className="space-y-2 text-space-cosmic-gray">
                <li><a href="#" className="hover-glow transition-colors">Trending Music</a></li>
                <li><a href="#" className="hover-glow transition-colors">New Releases</a></li>
                <li><a href="#" className="hover-glow transition-colors">Playlists</a></li>
                <li><a href="#" className="hover-glow transition-colors">Music Charts</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-space-cosmic-purple/30 mt-12 pt-8 text-center">
            <p className="text-space-cosmic-gray">
              © 2024 SoundConnect. Made with ✨ for music creators worldwide. 🌌
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
