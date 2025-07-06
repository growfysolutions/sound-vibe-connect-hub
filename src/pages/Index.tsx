
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Users, Music, Star, CheckCircle, ArrowRight, Headphones, Mic, Video, Camera, Bell, Heart, TrendingUp, Award, Zap, Sparkles } from 'lucide-react';
import { ImagesSlider } from '@/components/ui/images-slider';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const heroImages = [
    "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const cosmicStats = [
    { number: '50K+', label: 'Creators', gradient: 'from-space-stellar-blue to-space-aurora-cyan' },
    { number: '2M+', label: 'Songs', gradient: 'from-space-nebula-pink to-space-cosmic-purple' },
    { number: '100K+', label: 'Collabs', gradient: 'from-space-aurora-cyan to-space-electric-blue' },
    { number: '500+', label: 'Success Stories', gradient: 'from-space-electric-blue to-space-stellar-blue' }
  ];

  const creatorRoles = [
    { icon: Mic, title: 'Singers', count: '15K+', gradient: 'from-space-stellar-blue to-space-aurora-cyan', description: 'Vocal artists & performers' },
    { icon: Music, title: 'Producers', count: '8K+', gradient: 'from-space-aurora-cyan to-space-electric-blue', description: 'Beat makers & composers' },
    { icon: Video, title: 'Directors', count: '12K+', gradient: 'from-space-nebula-pink to-space-cosmic-purple', description: 'Video creators & editors' },
    { icon: Headphones, title: 'Engineers', count: '6K+', gradient: 'from-space-electric-blue to-space-stellar-blue', description: 'Sound & mixing pros' },
    { icon: Camera, title: 'Performers', count: '20K+', gradient: 'from-space-cosmic-purple to-space-nebula-pink', description: 'Models & actors' },
    { icon: Star, title: 'Labels', count: '4K+', gradient: 'from-space-aurora-cyan to-space-stellar-blue', description: 'Music labels & agencies' }
  ];

  const creatorSpotlight = [
    {
      name: 'Armaan Singh',
      role: 'Punjabi Singer',
      subscribers: '2.1M',
      content: 'Went from bedroom recordings to 2M+ subscribers! SoundConnect connected me with the best producers in Punjab. 🎤',
      avatar: '👨‍🎤',
      verified: true,
      views: '25M'
    },
    {
      name: 'Priya Beats',
      role: 'Music Producer',  
      subscribers: '890K',
      content: 'Found my dream team here! Produced 15 chart-toppers this year through SoundConnect collaborations. 🔥',
      avatar: '👩‍🎼',
      verified: true,
      views: '12M'
    },
    {
      name: 'Video Raj',
      role: 'Director',
      subscribers: '1.5M',
      content: 'Every music video I direct now comes from SoundConnect connections. The network effect is INSANE! 📹',
      avatar: '🎬',
      verified: true,
      views: '30M'
    }
  ];

  const trendingHashtags = [
    '#CosmicVibes', '#NewTalent', '#Collaboration', '#MusicVideo', '#Producer', '#Singer'
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
                <Play className="w-6 h-6 text-space-aurora-cyan" />
              </div>
              <span className="text-3xl font-bold text-stellar-glow">SoundConnect</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#trending" className="text-space-cosmic-gray hover-glow font-medium">Trending</a>
              <a href="#creators" className="text-space-cosmic-gray hover-glow font-medium">Creators</a>
              <a href="#features" className="text-space-cosmic-gray hover-glow font-medium">Features</a>
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
                <Bell className="w-5 h-5 mr-2" />
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Deep Space Theme */}
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
            {/* Cosmic trending badge */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 glass-cosmic text-space-stellar-white px-6 py-3 rounded-full font-semibold mb-8 shadow-cosmic-glow"
            >
              <TrendingUp className="w-5 h-5 text-space-aurora-cyan" />
              #1 Cosmic Creator Platform
            </motion.div>

            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 1 }}
              className="text-nebula mb-8 leading-tight animate-cosmic-glow"
            >
              Create. Connect. 
              <motion.span 
                animate={{ 
                  scale: [1, 1.05, 1],
                  filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
                }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                className="block text-cosmic-glow"
              >
                Go STELLAR!
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-space-stellar-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Join the <strong className="text-stellar-glow">cosmic music platform</strong> where creators become legends! 
              ✨ Build your stellar fanbase, find collaborators, and make music that echoes across the universe.
            </motion.p>

            {/* Cosmic CTA Buttons */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Button 
                size="lg" 
                className="btn-cosmic text-xl px-12 py-6"
                onClick={() => navigate('/auth?role=creator')}
              >
                <Zap className="mr-3 w-6 h-6" />
                Start Creating
              </Button>
              <Button 
                size="lg" 
                className="glass-cosmic text-space-stellar-white hover:scale-105 text-xl px-12 py-6 transition-all duration-300"
                onClick={() => navigate('/discover')}
              >
                <Sparkles className="mr-3 w-6 h-6" />
                Discover Talent
              </Button>
            </motion.div>

            {/* Trending Hashtags */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {trendingHashtags.map((tag, index) => (
                <motion.span 
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + (index * 0.1), duration: 0.6 }}
                  className="glass-cosmic px-4 py-2 rounded-full text-space-stellar-white font-medium hover-cosmic cursor-pointer"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </ImagesSlider>
      </section>

      {/* Cosmic Stats Section */}
      <section className="relative z-10 py-20 px-4 bg-cosmic-glow">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {cosmicStats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="cosmic-stat animate-fade-glow"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
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

      {/* Creator Spotlight Section */}
      <section id="creators" className="relative z-10 py-20 px-4 bg-nebula-gradient">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-space-stellar-white mb-6"
            >
              Meet Our <span className="text-stellar-glow">Stellar Creators</span> ⭐
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl text-space-stellar-white/80 max-w-3xl mx-auto"
            >
              Real creators, cosmic success stories, stellar results! See how SoundConnect launched their careers into orbit.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {creatorSpotlight.map((creator, index) => (
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
                    {creator.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-space-stellar-white font-bold text-lg hover-glow">{creator.name}</h4>
                      {creator.verified && <CheckCircle className="w-5 h-5 text-space-aurora-cyan" />}
                    </div>
                    <p className="text-space-cosmic-gray text-sm">{creator.role}</p>
                    <div className="flex items-center gap-4 text-xs text-space-cosmic-gray mt-1">
                      <span className="font-medium">{creator.subscribers} subscribers</span>
                      <span>{creator.views} views</span>
                    </div>
                  </div>
                </div>
                <p className="text-space-stellar-white/90 leading-relaxed mb-4">
                  {creator.content}
                </p>
                <Button className="btn-stellar w-full hover-cosmic">
                  <Heart className="w-4 h-4 mr-2" />
                  Follow Creator
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Roles Section */}
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
              Every <span className="text-stellar-glow">Creator Type</span> Welcome! 🎯
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl text-space-stellar-white/80 max-w-3xl mx-auto"
            >
              Whatever your cosmic creative power, we've got your stellar community waiting!
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creatorRoles.map((role, index) => (
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
                  Join {role.title} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 bg-cosmic-glow">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-space-stellar-white mb-6"
            >
              Why Creators <span className="text-stellar-glow">✨ Love</span> Our Universe
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card text-center hover-lift-cosmic animate-fade-glow"
            >
              <div className="icon-cosmic mx-auto mb-6 bg-stellar-gradient animate-cosmic-glow">
                <Star className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-space-stellar-white mb-4 hover-glow">Showcase & Shine</h3>
              <p className="text-space-stellar-white/80 leading-relaxed text-lg">
                Upload your best work and get discovered across the cosmos! Our stellar algorithm promotes quality content. 🌟
              </p>
            </motion.div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card text-center hover-lift-cosmic animate-fade-glow delay-cosmic-200"
            >
              <div className="icon-cosmic mx-auto mb-6 bg-aurora-gradient animate-cosmic-float">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-space-stellar-white mb-4 hover-glow">Network & Collaborate</h3>
              <p className="text-space-stellar-white/80 leading-relaxed text-lg">
                Connect with creators across galaxies! Find your perfect collab partner and create cosmic magic together. ✨
              </p>
            </motion.div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card text-center hover-lift-cosmic animate-fade-glow delay-cosmic-400"
            >
              <div className="icon-cosmic mx-auto mb-6 bg-nebula-gradient animate-cosmic-float delay-cosmic-200">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-space-stellar-white mb-4 hover-glow">Grow & Monetize</h3>
              <p className="text-space-stellar-white/80 leading-relaxed text-lg">
                Turn your cosmic passion into stellar profit! Access exclusive opportunities and brand partnerships. 💫
              </p>
            </motion.div>
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
              Ready to Become the Next <span className="text-stellar-glow">COSMIC LEGEND?</span> 🚀
            </h2>
            <p className="text-xl text-space-stellar-white/90 mb-8 max-w-2xl mx-auto font-medium">
              Join 50,000+ creators who are already building their stellar empire on SoundConnect. 
              Your cosmic moment is NOW!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                size="lg" 
                className="btn-cosmic text-xl px-12 py-6"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <Play className="mr-3 w-6 h-6" />
                Start Your Journey
              </Button>
              <Button 
                size="lg" 
                className="glass-cosmic text-space-stellar-white hover:scale-105 text-xl px-12 py-6 font-medium transition-all duration-300"
              >
                <Video className="mr-3 w-6 h-6" />
                Watch Success Stories
              </Button>
            </div>

            <p className="text-space-stellar-white/70 text-sm">
              ✨ Join free • No credit card required • Start creating in 60 seconds
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cosmic Footer */}
      <footer className="relative z-10 bg-space-black border-t border-space-cosmic-purple/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="icon-cosmic !w-10 !h-10 !bg-aurora-gradient">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-stellar-glow">SoundConnect</span>
              </div>
              <p className="text-space-cosmic-gray leading-relaxed">
                The cosmic music creator platform. Where stellar talent meets infinite opportunity. 🎵
              </p>
            </div>

            <div>
              <h4 className="text-space-stellar-white font-bold mb-4">Creators</h4>
              <ul className="space-y-2 text-space-cosmic-gray">
                <li><a href="#" className="hover-glow transition-colors">For Artists</a></li>
                <li><a href="#" className="hover-glow transition-colors">For Producers</a></li>
                <li><a href="#" className="hover-glow transition-colors">For Directors</a></li>
                <li><a href="#" className="hover-glow transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-space-stellar-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-space-cosmic-gray">
                <li><a href="#" className="hover-glow transition-colors">Features</a></li>
                <li><a href="#" className="hover-glow transition-colors">Pricing</a></li>
                <li><a href="#" className="hover-glow transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover-glow transition-colors">Creator Tools</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-space-stellar-white font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-space-cosmic-gray">
                <li><a href="#" className="hover-glow transition-colors">Discord</a></li>
                <li><a href="#" className="hover-glow transition-colors">Events</a></li>
                <li><a href="#" className="hover-glow transition-colors">Blog</a></li>
                <li><a href="#" className="hover-glow transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-space-cosmic-purple/30 mt-12 pt-8 text-center">
            <p className="text-space-cosmic-gray">
              © 2024 SoundConnect. Made with ✨ for creators across the cosmos. 🌌
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
