
'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/components/ui/gaming-login';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, session, loading } = useAuth();
  const [variant, setVariant] = useState<'login' | 'signup'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (session && !loading) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [session, loading, navigate]);

  const toggleVariant = () => {
    setVariant(prev => (prev === 'login' ? 'signup' : 'login'));
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (variant === 'login') {
        console.log('Submitting login form');
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          console.error('Login error:', error);
          toast({ 
            variant: 'destructive', 
            title: 'Login Failed', 
            description: error.message || 'Failed to sign in. Please try again.' 
          });
          setIsSubmitting(false);
          return;
        }
        
        toast({ description: 'Signed in successfully!' });
        // Navigation will happen via useEffect when session updates
        
      } else {
        console.log('Submitting signup form');
        const { error } = await signUp(formData.email, formData.password, formData.full_name);
        
        if (error) {
          console.error('Signup error:', error);
          toast({ 
            variant: 'destructive', 
            title: 'Registration Failed', 
            description: error.message || 'Failed to create account. Please try again.' 
          });
          setIsSubmitting(false);
          return;
        }
        
        toast({ description: 'Account created! Check your email for verification.' });
        navigate('/profile-setup', { replace: true });
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'An unexpected error occurred. Please try again.' 
      });
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if already authenticated (prevents flash)
  if (session) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <LoginPage.VideoBackground videoUrl="/videos/background.mp4" />

      <div className="relative z-20 w-full max-w-md animate-fade-in-glow">
        <LoginPage.LoginForm 
          onSubmit={handleSubmit} 
          variant={variant} 
          onVariantChange={toggleVariant}
          isSubmitting={isSubmitting}
        />
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm z-20">
        &copy; 2025 SoundVibe. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
