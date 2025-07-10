'use client';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import LoginPage from '@/components/ui/gaming-login';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [variant, setVariant] = useState<'login' | 'signup'>('login');

  const toggleVariant = () => {
    setVariant(prev => (prev === 'login' ? 'signup' : 'login'));
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      if (variant === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast({ description: 'Signed in successfully!' });
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
            },
          },
        });
        if (error) throw error;
        toast({ description: 'Check your email for the verification link!' });
      }
      if (variant === 'login') {
        navigate('/dashboard');
      } else {
        navigate('/profile-setup');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: error.message });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <LoginPage.VideoBackground videoUrl="/videos/background.mp4" />

      <div className="relative z-20 w-full max-w-md animate-fade-in-glow">
        <LoginPage.LoginForm 
          onSubmit={handleSubmit} 
          variant={variant} 
          onVariantChange={toggleVariant} 
        />
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm z-20">
        &copy; 2025 SoundVibe. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
