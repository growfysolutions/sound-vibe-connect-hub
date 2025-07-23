
import { cn } from './utils';

// Modern music platform design system utilities
export const culturalStyles = {
  // Modern Music Platform Color System
  colors: {
    // Primary Purple - Creativity, premium feel, music industry standard
    primary: 'text-music-purple',
    primaryBg: 'bg-music-purple',
    primaryGradient: 'bg-music-gradient',
    primaryLight: 'text-music-purple-light',
    primaryDark: 'text-music-purple-dark',
    
    // Secondary Blue - Trust, technology, professional networking
    secondary: 'text-electric-blue',
    secondaryBg: 'bg-electric-blue',
    secondaryGradient: 'bg-electric-gradient',
    secondaryLight: 'text-electric-blue-light',
    secondaryDark: 'text-electric-blue-dark',
    
    // Accent Green - Success, growth, positive interactions
    accent: 'text-vibrant-green',
    accentBg: 'bg-vibrant-green',
    accentGradient: 'bg-success-gradient',
    accentLight: 'text-vibrant-green-light',
    accentDark: 'text-vibrant-green-dark',
    
    // Success Green - Growth, completed actions
    success: 'text-vibrant-green',
    successBg: 'bg-vibrant-green',
    successGradient: 'bg-success-gradient',
    successLight: 'text-vibrant-green-light',
    successDark: 'text-vibrant-green-dark',
    
    // Warning Orange - Attention, warnings
    warning: 'text-modern-orange',
    warningBg: 'bg-modern-orange',
    warningGradient: 'bg-warning-gradient',
    warningLight: 'text-modern-orange-light',
    warningDark: 'text-modern-orange-dark',
    
    // Error Red - Destructive actions, errors
    error: 'text-modern-red',
    errorBg: 'bg-modern-red',
    errorGradient: 'bg-error-gradient',
    errorLight: 'text-modern-red-light',
    errorDark: 'text-modern-red-dark',
    
    // Modern backgrounds
    modernBg: 'bg-modern-bg-primary',
    modernBgSecondary: 'bg-modern-bg-secondary',
    modernBgTertiary: 'bg-modern-bg-tertiary',
    modernNeutral: 'bg-modern-neutral',
    modernNeutralLight: 'bg-modern-neutral-light',
    modernNeutralDark: 'bg-modern-neutral-dark',
  },

  // Typography system for modern music platform
  typography: {
    header: 'font-bold tracking-wide',
    subheader: 'font-semibold text-lg',
    body: 'font-medium leading-relaxed',
    label: 'font-medium text-sm text-foreground',
    button: 'font-medium tracking-wide',
    caption: 'text-sm text-muted-foreground',
    modern: 'font-sans tracking-tight', // Clean, modern typography
  },

  // Modern patterns for contemporary design
  patterns: {
    card: 'relative overflow-hidden backdrop-blur-sm',
    modern: 'bg-gradient-to-br from-music-purple/5 to-electric-blue/5',
    glass: 'backdrop-blur-md bg-white/10 border border-white/20',
    modernFrame: 'border border-music-purple/30 shadow-modern-purple',
    tech: 'bg-gradient-to-br from-electric-blue/5 to-vibrant-green/5',
    premium: 'bg-modern-primary',
  },

  // Component styles with modern aesthetics
  components: {
    // Form elements
    input: 'border-2 border-music-purple/20 hover:border-music-purple/40 focus:border-music-purple rounded-lg transition-all duration-200',
    inputError: 'border-modern-red focus:border-modern-red',
    inputSuccess: 'border-vibrant-green focus:border-vibrant-green',
    
    // Buttons with modern gradients
    primaryButton: 'bg-music-gradient text-white shadow-modern-purple hover:shadow-modern-glow hover:scale-[1.02] transition-all duration-300',
    secondaryButton: 'border-2 border-electric-blue text-electric-blue hover:bg-electric-blue/10 transition-all duration-200',
    accentButton: 'bg-success-gradient text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
    successButton: 'bg-success-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300',
    warningButton: 'bg-warning-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300',
    errorButton: 'bg-error-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300',
    
    // Cards with modern depth
    card: 'bg-white rounded-xl border border-music-purple/20 shadow-modern-purple hover:shadow-modern-glow transition-all duration-300',
    profileCard: 'bg-white rounded-xl border border-music-purple/20 p-4 relative overflow-hidden',
    premiumCard: 'bg-modern-primary rounded-xl border border-electric-blue/30 shadow-lg',
    glassCard: 'backdrop-blur-md bg-white/10 border border-white/20 rounded-xl',
    
    // Navigation with modern trust elements
    navItem: 'rounded-xl transition-all duration-300 hover:scale-105',
    navActive: 'bg-gradient-to-r from-music-purple/20 to-electric-blue/20 text-music-purple border border-music-purple/30 shadow-modern-trust',
    
    // Loading states with modern aesthetics
    loader: 'animate-spin text-music-purple',
    progress: 'bg-music-gradient',
    
    // Trust indicators
    verified: 'bg-electric-blue/10 text-electric-blue border border-electric-blue/30',
    premium: 'bg-music-gradient text-white shadow-modern-glow',
  },

  // Modern elements and symbols
  elements: {
    separator: '🎵', // Musical note
    success: '✅', // Success checkmark
    music: '🎶', // Musical notes
    star: '⭐', // Star rating
    premium: '👑', // Premium crown
    verified: '✓', // Verified checkmark
    collaboration: '🤝', // Handshake
    creative: '🎨', // Art palette
    tech: '⚡', // Lightning bolt
    community: '👥', // Community
  },

  // Modern gradients for specific use cases
  gradients: {
    primary: 'bg-music-gradient', // Purple gradient
    secondary: 'bg-electric-gradient', // Blue gradient
    success: 'bg-success-gradient', // Green gradient
    warning: 'bg-warning-gradient', // Orange gradient
    error: 'bg-error-gradient', // Red gradient
    modern: 'bg-modern-primary', // Multi-color modern gradient
    neutral: 'bg-modern-neutral', // Neutral gradient
    glass: 'backdrop-blur-md bg-white/10', // Glass effect
  },
};

// Helper functions for consistent modern styling
export const getCulturalCardStyle = (variant: 'default' | 'profile' | 'project' | 'testimonial' | 'premium' | 'glass' = 'default') => {
  const baseStyles = culturalStyles.patterns.card + ' ' + culturalStyles.components.card;
  
  switch (variant) {
    case 'profile':
      return cn(baseStyles, culturalStyles.components.profileCard);
    case 'project':
      return cn(baseStyles, 'hover:-translate-y-1');
    case 'testimonial':
      return cn(baseStyles, 'relative before:absolute before:top-2 before:left-2 before:content-["""] before:text-6xl before:text-music-purple/20 before:font-serif');
    case 'premium':
      return cn(baseStyles, culturalStyles.components.premiumCard);
    case 'glass':
      return cn(culturalStyles.components.glassCard);
    default:
      return baseStyles;
  }
};

export const getCulturalButtonStyle = (variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'destructive' = 'primary') => {
  const baseStyles = culturalStyles.typography.button + ' rounded-lg px-6 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-music-purple/50';
  
  switch (variant) {
    case 'primary':
      return cn(baseStyles, culturalStyles.components.primaryButton);
    case 'secondary':
      return cn(baseStyles, culturalStyles.components.secondaryButton);
    case 'accent':
      return cn(baseStyles, culturalStyles.components.accentButton);
    case 'success':
      return cn(baseStyles, culturalStyles.components.successButton);
    case 'warning':
      return cn(baseStyles, culturalStyles.components.warningButton);
    case 'destructive':
      return cn(baseStyles, culturalStyles.components.errorButton);
    default:
      return cn(baseStyles, culturalStyles.components.primaryButton);
  }
};

export const getCulturalInputStyle = (state: 'default' | 'error' | 'success' = 'default') => {
  const baseStyles = culturalStyles.components.input + ' px-4 py-3 bg-white';
  
  switch (state) {
    case 'error':
      return cn(baseStyles, culturalStyles.components.inputError);
    case 'success':
      return cn(baseStyles, culturalStyles.components.inputSuccess);
    default:
      return baseStyles;
  }
};

export const getCulturalNavigationStyle = (isActive: boolean = false) => {
  const baseStyles = culturalStyles.components.navItem + ' px-4 py-3 flex items-center';
  
  if (isActive) {
    return cn(baseStyles, culturalStyles.components.navActive);
  }
  
  return cn(baseStyles, 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30');
};

// Modern color palette accessibility helper
export const getCulturalColorContrast = (colorName: string) => {
  const contrastMap = {
    'music-purple': { light: 'text-white', dark: 'text-gray-900' },
    'electric-blue': { light: 'text-white', dark: 'text-gray-100' },
    'vibrant-green': { light: 'text-white', dark: 'text-gray-100' },
    'modern-orange': { light: 'text-white', dark: 'text-gray-900' },
    'modern-red': { light: 'text-white', dark: 'text-gray-100' },
  };
  
  return contrastMap[colorName as keyof typeof contrastMap] || { light: 'text-white', dark: 'text-gray-900' };
};
