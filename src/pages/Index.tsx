import { Music, Mic, Video, Star, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import { Hero } from '@/components/landing/Hero';
import ExpandableCardDemo from '@/components/ui/expandable-card-demo-standard';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Music, title: 'Music Production', description: 'Collaborate on tracks in real-time.' },
    { icon: Mic, title: 'Vocal Recording', description: 'Find vocalists or record your own parts.' },
    { icon: Video, title: 'Music Videos', description: 'Connect with directors and editors.' },
    { icon: Star, title: 'Artist Promotion', description: 'Get your music discovered by industry pros.' },
    { icon: Users, title: 'Community', description: 'Join a network of passionate creators.' },
    { icon: Briefcase, title: 'Project Management', description: 'Keep your collaborations organized.' },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black/50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold tracking-tighter">SoundVibe</h1>
        <InteractiveHoverButton onClick={() => navigate('/auth')} text="Sign In" className="bg-transparent border-neutral-600 hover:bg-neutral-800" />
      </header>

      {/* Hero Section */}
      <main className="pt-12 px-6">
        <Hero />

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-32"
        >
          <h2 className="text-center text-4xl font-bold tracking-tighter">All-in-One Platform for Music Creators</h2>
          <p className="text-center text-neutral-400 mt-2 max-w-2xl mx-auto">From bedroom producers to established artists, SoundVibe provides the tools you need to bring your musical ideas to life.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-fuchsia-500 transition-colors">
                <feature.icon className="h-8 w-8 text-fuchsia-500" />
                <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
                <p className="text-neutral-400 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* How it works Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-32"
        >
          <h2 className="text-center text-4xl font-bold tracking-tighter">How It Works</h2>
          <div className="mt-12 flex justify-center">
            <ExpandableCardDemo />
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-32 text-center flex flex-col items-center"
        >
          <h3 className="text-5xl font-bold tracking-tighter max-w-3xl">Ready to Create Your Next Hit?</h3>
          <InteractiveHoverButton onClick={() => navigate('/auth')} text="Get Started for Free" className="mt-8" />
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 mt-32 border-t border-neutral-800">
        <p className="text-neutral-500">&copy; 2025 SoundVibe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
