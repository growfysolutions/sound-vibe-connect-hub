import { ArrowRight, Music, Mic, Video, Star, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/landing/Hero';
import ExpandableCardDemo from '@/components/ui/expandable-card-demo-standard';



const Index = () => {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black/50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold tracking-tighter">SoundVibe</h1>
        <Button onClick={() => navigate('/auth')} variant="outline" className="bg-transparent border-neutral-600 hover:bg-neutral-800">
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <main>
        <Hero />
        <section className="py-20 text-center">
          <h3 className="text-4xl font-bold tracking-tighter">A New Era of Collaboration</h3>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-full">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h4 className="mt-4 text-xl font-semibold">Create Your Portfolio</h4>
              <p className="mt-2 text-neutral-400 max-w-xs mx-auto">Showcase your skills, past work, and creative vision to the industry.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="mt-4 text-xl font-semibold">Discover Connections</h4>
              <p className="mt-2 text-neutral-400 max-w-xs mx-auto">Find the perfect collaborators for your projects, from vocalists to video directors.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-full">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h4 className="mt-4 text-xl font-semibold">Launch Your Project</h4>
              <p className="mt-2 text-neutral-400 max-w-xs mx-auto">Bring your vision to life with a talented team you can trust.</p>
            </div>
          </div>
        </section>

        {/* Top Songs Section */}
        <section className="py-20">
          <h3 className="text-center text-4xl font-bold tracking-tighter">Top Songs</h3>
          <p className="mt-2 text-center text-neutral-400 max-w-2xl mx-auto">Discover the tracks topping the charts, uploaded by the talented artists on our platform.</p>
          <div className="mt-12">
            <ExpandableCardDemo />
          </div>
        </section>

        {/* Featured Professionals Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="mt-32"
        >
          <h3 className="text-center text-4xl font-bold tracking-tighter">The Industry's Top Talent</h3>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Mic, label: 'Vocalists' },
              { icon: Music, label: 'Producers' },
              { icon: Video, label: 'Directors' },
              { icon: Users, label: 'Band Members' },
              { icon: Star, label: 'Songwriters' },
              { icon: Briefcase, label: 'Managers' },
            ].map((prof, i) => (
              <div key={i} className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg flex flex-col items-center justify-center aspect-square">
                <prof.icon className="h-10 w-10 text-neutral-300" />
                <p className="mt-4 text-lg font-semibold">{prof.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="mt-32 text-center flex flex-col items-center"
        >
          <h3 className="text-5xl font-bold tracking-tighter max-w-3xl">Ready to Create Your Next Hit?</h3>
          <Button onClick={() => navigate('/auth')} size="lg" className="mt-8 bg-white text-black hover:bg-neutral-200">
            Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-neutral-800 text-center text-neutral-500">
        <p>&copy; {new Date().getFullYear()} SoundVibe. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
