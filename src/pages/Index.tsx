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
  const [playingDemo, setPlayingDemo] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const heroImages = [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const bubbleStats = [
    { number: '50K+', label: 'Creators', color: 'bg-youtube-red' },
    { number: '2M+', label: 'Songs', color: 'bg-vibrant-cyan' },
    { number: '100K+', label: 'Collabs', color: 'bg-vibrant-lime' },
    { number: '500+', label: 'Success Stories', color: 'bg-vibrant-gold' }
  ];

  const creatorRoles = [
    { icon: Mic, title: 'Singers', count: '15K+', color: 'bg-youtube-red', description: 'Vocal artists & performers' },
    { icon: Music, title: 'Producers', count: '8K+', color: 'bg-vibrant-cyan', description: 'Beat makers & composers' },
    { icon: Video, title: 'Directors', count: '12K+', color: 'bg-vibrant-lime', description: 'Video creators & editors' },
    { icon: Headphones, title: 'Engineers', count: '6K+', color: 'bg-vibrant-gold', description: 'Sound & mixing pros' },
    { icon: Camera, title: 'Performers', count: '20K+', color: 'bg-vibrant-pink', description: 'Models & actors' },
    { icon: Star, title: 'Labels', count: '4K+', color: 'bg-vibrant-coral', description: 'Music labels & agencies' }
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
    '#PunjabiVibes', '#NewTalent', '#Collaboration', '#MusicVideo', '#Producer', '#Singer'
  ];

  return (
    <div className="min-h-screen bg-lively-bg relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-vibrant-pink/20 blob animate-float-gentle"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-vibrant-cyan/20 blob animate-float-gentle delay-200"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-vibrant-lime/20 blob animate-float-gentle delay-400"></div>
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-vibrant-gold/20 blob animate-float-gentle delay-600"></div>
      </div>

      {/* YouTube-style Navigation */}
      <nav className="nav-youtube sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="play-button-giant !w-12 !h-12 !animate-none">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
              <span className="text-3xl font-black text-youtube">SoundConnect</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#trending" className="text-youtube-gray hover:text-youtube-red transition-colors font-semibold">Trending</a>
              <a href="#creators" className="text-youtube-gray hover:text-youtube-red transition-colors font-semibold">Creators</a>
              <a href="#features" className="text-youtube-gray hover:text-youtube-red transition-colors font-semibold">Features</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-youtube-gray hover:bg-youtube-red/10 hover:text-youtube-red font-semibold"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button 
                className="btn-youtube"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <Bell className="w-5 h-5 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with ImagesSlider */}
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
              duration: 0.6,
            }}
            className="z-50 flex flex-col justify-center items-center text-center px-4"
          >
            {/* Trending badge */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-youtube-red text-white px-6 py-2 rounded-full font-bold mb-8"
            >
              <TrendingUp className="w-5 h-5" />
              #1 Music Creator Platform
            </motion.div>

            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-tight"
            >
              Create. Connect. 
              <motion.span 
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                className="text-vibrant-gold block"
              >
                Go VIRAL!
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Join the <strong className="text-vibrant-gold">hottest music platform</strong> where creators become superstars! 
              🌟 Build your fanbase, find collaborators, and make music that matters.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Button 
                size="lg" 
                className="btn-youtube text-xl px-12 py-6 hover:scale-110 transition-transform"
                onClick={() => navigate('/auth?role=creator')}
              >
                <Zap className="mr-3 w-6 h-6" />
                Start Creating
              </Button>
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 text-xl px-12 py-6 hover:scale-105 transition-all"
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
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {trendingHashtags.map((tag, index) => (
                <motion.span 
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + (index * 0.1), duration: 0.4 }}
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </ImagesSlider>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {bubbleStats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`bubble-stat ${stat.color} text-white`}
              >
                <div className="text-3xl md:text-4xl font-black mb-1">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-divider h-20 bg-vibrant-coral/20 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-vibrant-pink/30 to-vibrant-cyan/30"></div>
      </div>

      {/* Creator Spotlight Section */}
      <section id="creators" className="relative z-10 py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-chunky text-youtube-gray-dark mb-6">
              Meet Our <span className="text-youtube">Creator Stars</span> ⭐
            </h2>
            <p className="text-xl text-youtube-gray max-w-3xl mx-auto">
              Real creators, real success stories, real results! See how SoundConnect transformed their careers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {creatorSpotlight.map((creator, index) => (
              <div key={index} className="creator-card animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-cheerful-gradient rounded-full flex items-center justify-center text-3xl mr-4">
                    {creator.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-youtube-gray-dark font-bold text-lg">{creator.name}</h4>
                      {creator.verified && <CheckCircle className="w-5 h-5 text-youtube-blue" />}
                    </div>
                    <p className="text-youtube-gray text-sm">{creator.role}</p>
                    <div className="flex items-center gap-4 text-xs text-youtube-gray mt-1">
                      <span className="font-semibold">{creator.subscribers} subscribers</span>
                      <span>{creator.views} views</span>
                    </div>
                  </div>
                </div>
                <p className="text-youtube-gray-dark leading-relaxed mb-4">
                  {creator.content}
                </p>
                <Button className="btn-subscribe w-full">
                  <Heart className="w-4 h-4" />
                  Follow Creator
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Roles Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-br from-youtube-red-bg to-vibrant-lavender">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-chunky text-youtube-gray-dark mb-6">
              Every <span className="text-lively">Creator Type</span> Welcome! 🎯
            </h2>
            <p className="text-xl text-youtube-gray max-w-3xl mx-auto">
              Whatever your creative superpower, we've got your community waiting!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creatorRoles.map((role, index) => (
              <div 
                key={index} 
                className={`mega-card hover-lift animate-pop-in delay-${index * 100} tilt-${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className={`w-20 h-20 ${role.color} rounded-4xl flex items-center justify-center mx-auto mb-6 animate-pulse-grow`}>
                  <role.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-youtube-gray-dark mb-2 text-center">{role.title}</h3>
                <p className="text-youtube-gray text-center mb-4">{role.description}</p>
                <div className={`text-3xl font-black text-center mb-4 ${role.color.replace('bg-', 'text-')}`}>
                  {role.count}
                </div>
                <Button className="btn-lively w-full hover-bounce">
                  Join {role.title} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-chunky text-youtube-gray-dark mb-6">
              Why Creators <span className="text-youtube">❤️ Love</span> Us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="chunky-card text-center hover-lift animate-slide-up">
              <div className="w-24 h-24 bg-youtube-gradient rounded-full flex items-center justify-center mx-auto mb-6 animate-wiggle">
                <Star className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-youtube-gray-dark mb-4">Showcase & Shine</h3>
              <p className="text-youtube-gray leading-relaxed text-lg">
                Upload your best work and get discovered by millions! Our algorithm promotes quality content. 🌟
              </p>
            </div>

            <div className="chunky-card text-center hover-lift animate-slide-up delay-200">
              <div className="w-24 h-24 bg-cheerful-gradient rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-grow">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-youtube-gray-dark mb-4">Network & Collaborate</h3>
              <p className="text-youtube-gray leading-relaxed text-lg">
                Connect with creators worldwide! Find your perfect collab partner and create magic together. ✨
              </p>
            </div>

            <div className="chunky-card text-center hover-lift animate-slide-up delay-400">
              <div className="w-24 h-24 bg-energy-burst rounded-full flex items-center justify-center mx-auto mb-6 animate-float-gentle">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-youtube-gray-dark mb-4">Grow & Monetize</h3>
              <p className="text-youtube-gray leading-relaxed text-lg">
                Turn your passion into profit! Access exclusive opportunities and brand partnerships. 💰
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-br from-youtube-red to-vibrant-coral">
        <div className="container mx-auto text-center">
          <div className="glass-youtube max-w-4xl mx-auto p-12">
            <h2 className="text-chunky text-youtube-gray-dark mb-6">
              Ready to Become the Next <span className="text-youtube">BIG THING?</span> 🚀
            </h2>
            <p className="text-xl text-youtube-gray mb-8 max-w-2xl mx-auto font-medium">
              Join 50,000+ creators who are already building their empire on SoundConnect. 
              Your moment is NOW!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                size="lg" 
                className="btn-youtube text-xl px-12 py-6"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <Play className="mr-3 w-6 h-6" />
                Start Your Journey
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-youtube-red text-youtube-red hover:bg-youtube-red hover:text-white text-xl px-12 py-6 font-bold"
                onClick={() => setPlayingDemo(true)}
              >
                <Video className="mr-3 w-6 h-6" />
                Watch Success Stories
              </Button>
            </div>

            <p className="text-youtube-gray text-sm">
              🎉 Join free • No credit card required • Start creating in 60 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Footer with YouTube vibes */}
      <footer className="relative z-10 bg-youtube-gray-dark text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="play-button-giant !w-10 !h-10 !bg-youtube-red !animate-none">
                  <Play className="w-5 h-5 text-white ml-1" />
                </div>
                <span className="text-2xl font-black text-white">SoundConnect</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The world's biggest music creator platform. Where talent meets opportunity. 🎵
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Creators</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-youtube-red transition-colors">For Artists</a></li>
                <li><a href="#" className="hover:text-youtube-red transition-colors">For Producers</a></li>
                <li><a href="#" className="hover:text-youtube-red transition-colors">For Directors</a></li>
                <li><a href="#" className="hover:text-youtube-red transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-youtube-red transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-youtube-red transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-youtube-red transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-youtube-red transition-colors">Creator Tools</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-youtube-red transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-youtube-red transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-youtube-red transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-youtube-red transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 SoundConnect. Made with ❤️ for creators worldwide. 🌍
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
