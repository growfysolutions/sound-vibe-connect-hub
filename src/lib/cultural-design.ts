
import { cn } from './utils';

// Modern Ocean Blue music platform design system utilities
export const culturalStyles = {
  // Modern Ocean Blue Color System using CSS variables
  colors: {
    // Primary Ocean Blue - Trust, professionalism, creativity
    primary: 'text-hsl(var(--ocean-blue))',
    primaryBg: 'bg-hsl(var(--ocean-blue))',
    primaryGradient: 'bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--ocean-blue-light))',
    primaryLight: 'text-hsl(var(--ocean-blue-light))',
    primaryDark: 'text-hsl(var(--ocean-blue-dark))',
    
    // Secondary Teal - Innovation, growth, collaboration
    secondary: 'text-hsl(var(--teal))',
    secondaryBg: 'bg-hsl(var(--teal))',
    secondaryGradient: 'bg-gradient-to-r from-hsl(var(--teal)) to-hsl(var(--teal-light))',
    secondaryLight: 'text-hsl(var(--teal-light))',
    secondaryDark: 'text-hsl(var(--teal-dark))',
    
    // Accent combinations
    accent: 'text-hsl(var(--teal))',
    accentBg: 'bg-hsl(var(--teal))',
    accentGradient: 'bg-gradient-to-r from-hsl(var(--teal)) to-hsl(var(--teal-light))',
    accentLight: 'text-hsl(var(--teal-light))',
    accentDark: 'text-hsl(var(--teal-dark))',
    
    // Success, warning, error using defined variables
    success: 'text-hsl(var(--color-success-500))',
    successBg: 'bg-hsl(var(--color-success-500))',
    successGradient: 'bg-gradient-to-r from-hsl(var(--color-success-500)) to-hsl(var(--color-success-900))',
    
    warning: 'text-hsl(var(--color-warning-500))',
    warningBg: 'bg-hsl(var(--color-warning-500))',
    warningGradient: 'bg-gradient-to-r from-hsl(var(--color-warning-500)) to-hsl(var(--warm-gold))',
    
    error: 'text-hsl(var(--color-error-500))',
    errorBg: 'bg-hsl(var(--color-error-500))',
    errorGradient: 'bg-gradient-to-r from-hsl(var(--color-error-500)) to-hsl(var(--destructive))',
    
    // Modern backgrounds using defined variables
    modernBg: 'bg-background',
    modernBgSecondary: 'bg-card',
    modernBgTertiary: 'bg-muted',
    modernNeutral: 'bg-hsl(var(--color-neutral-100))',
    modernNeutralLight: 'bg-hsl(var(--color-neutral-50))',
    modernNeutralDark: 'bg-hsl(var(--color-neutral-200))',
  },

  // Typography system for modern music platform
  typography: {
    header: 'font-bold tracking-wide text-foreground',
    subheader: 'font-semibold text-lg text-foreground',
    body: 'font-medium leading-relaxed text-foreground',
    label: 'font-medium text-sm text-foreground',
    button: 'font-medium tracking-wide',
    caption: 'text-sm text-muted-foreground',
    modern: 'font-sans tracking-tight text-foreground',
  },

  // Modern patterns for contemporary design
  patterns: {
    card: 'relative overflow-hidden backdrop-blur-sm',
    modern: 'bg-gradient-to-br from-hsl(var(--ocean-blue))/5 to-hsl(var(--teal))/5',
    glass: 'backdrop-blur-md bg-card/50 border border-border',
    modernFrame: 'border border-hsl(var(--ocean-blue))/30 shadow-lg shadow-hsl(var(--ocean-blue))/10',
    tech: 'bg-gradient-to-br from-hsl(var(--teal))/5 to-hsl(var(--ocean-blue))/5',
    premium: 'bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--teal))',
  },

  // Component styles with modern aesthetics
  components: {
    // Form elements
    input: 'border-2 border-hsl(var(--ocean-blue))/20 hover:border-hsl(var(--ocean-blue))/40 focus:border-hsl(var(--ocean-blue)) rounded-lg transition-all duration-200 bg-background text-foreground',
    inputError: 'border-hsl(var(--color-error-500)) focus:border-hsl(var(--color-error-500))',
    inputSuccess: 'border-hsl(var(--color-success-500)) focus:border-hsl(var(--color-success-500))',
    
    // Buttons with modern gradients
    primaryButton: 'bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--ocean-blue-light)) text-white shadow-lg shadow-hsl(var(--ocean-blue))/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
    secondaryButton: 'border-2 border-hsl(var(--teal)) text-hsl(var(--teal)) hover:bg-hsl(var(--teal))/10 transition-all duration-200',
    accentButton: 'bg-gradient-to-r from-hsl(var(--teal)) to-hsl(var(--teal-light)) text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
    successButton: 'bg-gradient-to-r from-hsl(var(--color-success-500)) to-hsl(var(--color-success-900)) text-white shadow-lg hover:shadow-xl transition-all duration-300',
    warningButton: 'bg-gradient-to-r from-hsl(var(--color-warning-500)) to-hsl(var(--warm-gold)) text-white shadow-lg hover:shadow-xl transition-all duration-300',
    errorButton: 'bg-gradient-to-r from-hsl(var(--color-error-500)) to-hsl(var(--destructive)) text-white shadow-lg hover:shadow-xl transition-all duration-300',
    
    // Cards with modern depth
    card: 'bg-card rounded-xl border border-hsl(var(--ocean-blue))/20 shadow-lg shadow-hsl(var(--ocean-blue))/5 hover:shadow-xl hover:shadow-hsl(var(--ocean-blue))/10 transition-all duration-300',
    profileCard: 'bg-card rounded-xl border border-hsl(var(--ocean-blue))/20 p-4 relative overflow-hidden',
    premiumCard: 'bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--teal)) rounded-xl border border-hsl(var(--teal))/30 shadow-lg text-white',
    glassCard: 'backdrop-blur-md bg-card/50 border border-border rounded-xl',
    
    // Navigation with modern trust elements
    navItem: 'rounded-xl transition-all duration-300 hover:scale-105',
    navActive: 'bg-gradient-to-r from-hsl(var(--ocean-blue))/20 to-hsl(var(--teal))/20 text-hsl(var(--ocean-blue)) border border-hsl(var(--ocean-blue))/30 shadow-lg shadow-hsl(var(--ocean-blue))/10',
    
    // Loading states with modern aesthetics
    loader: 'animate-spin text-hsl(var(--ocean-blue))',
    progress: 'bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--teal))',
    
    // Trust indicators
    verified: 'bg-hsl(var(--teal))/10 text-hsl(var(--teal)) border border-hsl(var(--teal))/30',
    premium: 'bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--teal)) text-white shadow-lg shadow-hsl(var(--ocean-blue))/25',
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
    primary: 'bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--ocean-blue-light))',
    secondary: 'bg-gradient-to-r from-hsl(var(--teal)) to-hsl(var(--teal-light))',
    success: 'bg-gradient-to-r from-hsl(var(--color-success-500)) to-hsl(var(--color-success-900))',
    warning: 'bg-gradient-to-r from-hsl(var(--color-warning-500)) to-hsl(var(--warm-gold))',
    error: 'bg-gradient-to-r from-hsl(var(--color-error-500)) to-hsl(var(--destructive))',
    modern: 'bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--teal))',
    neutral: 'bg-gradient-to-r from-hsl(var(--color-neutral-100)) to-hsl(var(--color-neutral-200))',
    glass: 'backdrop-blur-md bg-card/50',
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
      return cn(baseStyles, 'relative before:absolute before:top-2 before:left-2 before:content-["""] before:text-6xl before:text-hsl(var(--ocean-blue))/20 before:font-serif');
    case 'premium':
      return cn(baseStyles, culturalStyles.components.premiumCard);
    case 'glass':
      return cn(culturalStyles.components.glassCard);
    default:
      return baseStyles;
  }
};

export const getCulturalButtonStyle = (variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'destructive' = 'primary') => {
  const baseStyles = culturalStyles.typography.button + ' rounded-lg px-6 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hsl(var(--ocean-blue))/50';
  
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
  const baseStyles = culturalStyles.components.input + ' px-4 py-3';
  
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
    'ocean-blue': { light: 'text-white', dark: 'text-foreground' },
    'teal': { light: 'text-white', dark: 'text-foreground' },
    'success': { light: 'text-white', dark: 'text-foreground' },
    'warning': { light: 'text-white', dark: 'text-foreground' },
    'error': { light: 'text-white', dark: 'text-foreground' },
  };
  
  return contrastMap[colorName as keyof typeof contrastMap] || { light: 'text-white', dark: 'text-foreground' };
};
