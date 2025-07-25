import { cn } from './utils';

// Modern Ocean Blue music platform design system utilities
export const culturalStyles = {
  // Modern Ocean Blue Color System
  colors: {
    // Primary Ocean Blue - Trust, professionalism, creativity
    primary: 'text-ocean-blue',
    primaryBg: 'bg-ocean-blue',
    primaryGradient: 'bg-ocean-gradient',
    primaryLight: 'text-ocean-blue-light',
    primaryDark: 'text-ocean-blue-dark',
    
    // Secondary Teal - Innovation, growth, collaboration
    secondary: 'text-teal',
    secondaryBg: 'bg-teal',
    secondaryGradient: 'bg-teal-gradient',
    secondaryLight: 'text-teal-light',
    secondaryDark: 'text-teal-dark',
    
    // Accent combinations
    accent: 'text-teal',
    accentBg: 'bg-teal',
    accentGradient: 'bg-teal-gradient',
    accentLight: 'text-teal-light',
    accentDark: 'text-teal-dark',
    
    // Success, warning, error remain the same
    success: 'text-green-600',
    successBg: 'bg-green-600',
    successGradient: 'bg-gradient-to-r from-green-500 to-green-600',
    
    warning: 'text-amber-600',
    warningBg: 'bg-amber-600',
    warningGradient: 'bg-gradient-to-r from-amber-500 to-amber-600',
    
    error: 'text-red-600',
    errorBg: 'bg-red-600',
    errorGradient: 'bg-gradient-to-r from-red-500 to-red-600',
    
    // Modern backgrounds
    modernBg: 'bg-background',
    modernBgSecondary: 'bg-card',
    modernBgTertiary: 'bg-muted',
    modernNeutral: 'bg-neutral-100',
    modernNeutralLight: 'bg-neutral-50',
    modernNeutralDark: 'bg-neutral-200',
  },

  // Typography system for modern music platform
  typography: {
    header: 'font-bold tracking-wide',
    subheader: 'font-semibold text-lg',
    body: 'font-medium leading-relaxed',
    label: 'font-medium text-sm text-foreground',
    button: 'font-medium tracking-wide',
    caption: 'text-sm text-muted-foreground',
    modern: 'font-sans tracking-tight',
  },

  // Modern patterns for contemporary design
  patterns: {
    card: 'relative overflow-hidden backdrop-blur-sm',
    modern: 'bg-gradient-to-br from-ocean-blue/5 to-teal/5',
    glass: 'backdrop-blur-md bg-white/10 border border-white/20',
    modernFrame: 'border border-ocean-blue/30 shadow-modern-ocean',
    tech: 'bg-gradient-to-br from-teal/5 to-ocean-blue/5',
    premium: 'bg-modern-primary',
  },

  // Component styles with modern aesthetics
  components: {
    // Form elements
    input: 'border-2 border-ocean-blue/20 hover:border-ocean-blue/40 focus:border-ocean-blue rounded-lg transition-all duration-200',
    inputError: 'border-red-500 focus:border-red-500',
    inputSuccess: 'border-green-500 focus:border-green-500',
    
    // Buttons with modern gradients
    primaryButton: 'bg-ocean-gradient text-white shadow-modern-ocean hover:shadow-ocean-glow hover:scale-[1.02] transition-all duration-300',
    secondaryButton: 'border-2 border-teal text-teal hover:bg-teal/10 transition-all duration-200',
    accentButton: 'bg-teal-gradient text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
    successButton: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300',
    warningButton: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300',
    errorButton: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300',
    
    // Cards with modern depth
    card: 'bg-card rounded-xl border border-ocean-blue/20 shadow-modern-ocean hover:shadow-ocean-glow transition-all duration-300',
    profileCard: 'bg-card rounded-xl border border-ocean-blue/20 p-4 relative overflow-hidden',
    premiumCard: 'bg-modern-primary rounded-xl border border-teal/30 shadow-lg',
    glassCard: 'backdrop-blur-md bg-white/10 border border-white/20 rounded-xl',
    
    // Navigation with modern trust elements
    navItem: 'rounded-xl transition-all duration-300 hover:scale-105',
    navActive: 'bg-gradient-to-r from-ocean-blue/20 to-teal/20 text-ocean-blue border border-ocean-blue/30 shadow-modern-trust',
    
    // Loading states with modern aesthetics
    loader: 'animate-spin text-ocean-blue',
    progress: 'bg-ocean-gradient',
    
    // Trust indicators
    verified: 'bg-teal/10 text-teal border border-teal/30',
    premium: 'bg-ocean-gradient text-white shadow-ocean-glow',
  },

  // Modern elements and symbols
  elements: {
    separator: '🎵',
    success: '✅',
    music: '🎶',
    star: '⭐',
    premium: '👑',
    verified: '✓',
    collaboration: '🤝',
    creative: '🎨',
    tech: '⚡',
    community: '👥',
  },

  // Modern gradients for specific use cases
  gradients: {
    primary: 'bg-ocean-gradient',
    secondary: 'bg-teal-gradient',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-amber-500 to-amber-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    modern: 'bg-modern-primary',
    neutral: 'bg-modern-neutral',
    glass: 'backdrop-blur-md bg-white/10',
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
      return cn(baseStyles, 'relative before:absolute before:top-2 before:left-2 before:content-["""] before:text-6xl before:text-ocean-blue/20 before:font-serif');
    case 'premium':
      return cn(baseStyles, culturalStyles.components.premiumCard);
    case 'glass':
      return cn(culturalStyles.components.glassCard);
    default:
      return baseStyles;
  }
};

export const getCulturalButtonStyle = (variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'destructive' = 'primary') => {
  const baseStyles = culturalStyles.typography.button + ' rounded-lg px-6 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ocean-blue/50';
  
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
  const baseStyles = culturalStyles.components.input + ' px-4 py-3 bg-background';
  
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
    'ocean-blue': { light: 'text-white', dark: 'text-gray-900' },
    'teal': { light: 'text-white', dark: 'text-gray-100' },
    'green': { light: 'text-white', dark: 'text-gray-100' },
    'amber': { light: 'text-white', dark: 'text-gray-900' },
    'red': { light: 'text-white', dark: 'text-gray-100' },
  };
  
  return contrastMap[colorName as keyof typeof contrastMap] || { light: 'text-white', dark: 'text-gray-900' };
};
