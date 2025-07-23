
import { cn } from './utils';

// Cultural design system utilities
export const culturalStyles = {
  // Color system
  colors: {
    primary: 'text-saffron',
    primaryBg: 'bg-saffron',
    primaryGradient: 'bg-gradient-to-r from-saffron to-gold-600',
    secondary: 'text-blue-700',
    secondaryBg: 'bg-blue-700',
    accent: 'text-orange-600',
    accentBg: 'bg-orange-600',
    success: 'text-indian-green-800',
    successBg: 'bg-indian-green-800',
    warning: 'text-red-600',
    warningBg: 'bg-red-600',
  },

  // Typography system
  typography: {
    header: 'font-bold tracking-wide',
    subheader: 'font-semibold text-lg',
    body: 'font-medium leading-relaxed',
    label: 'font-medium text-sm text-foreground',
    button: 'font-medium tracking-wide',
    caption: 'text-sm text-muted-foreground',
  },

  // Cultural patterns
  patterns: {
    card: 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-saffron/5 before:to-gold/5 before:opacity-50',
    phulkari: 'bg-gradient-to-br from-saffron/10 to-amber-500/10',
    traditional: 'border-2 border-saffron/20',
    culturalFrame: 'border border-saffron/30 shadow-lg shadow-saffron/20',
  },

  // Component styles
  components: {
    // Form elements
    input: 'border-2 border-saffron/20 hover:border-saffron/40 focus:border-saffron rounded-lg transition-all duration-200',
    inputError: 'border-red-500 focus:border-red-500',
    inputSuccess: 'border-indian-green-600 focus:border-indian-green-600',
    
    // Buttons
    primaryButton: 'bg-gradient-to-r from-saffron to-gold-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
    secondaryButton: 'border-2 border-blue-700 text-blue-700 hover:bg-blue-700/10 transition-all duration-200',
    
    // Cards
    card: 'bg-white rounded-xl border border-saffron/20 shadow-[0_4px_12px_rgba(255,149,0,0.1)] hover:shadow-[0_8px_24px_rgba(255,149,0,0.2)] transition-all duration-300',
    profileCard: 'bg-white rounded-xl border border-saffron/20 p-4 relative overflow-hidden',
    
    // Navigation
    navItem: 'rounded-xl transition-all duration-300 hover:scale-105',
    navActive: 'bg-gradient-to-r from-saffron/20 to-amber-500/20 text-saffron border border-saffron/30 shadow-lg shadow-saffron/20',
    
    // Loading states
    loader: 'animate-spin text-saffron',
    progress: 'bg-gradient-to-r from-saffron to-gold-600',
  },

  // Cultural elements
  elements: {
    separator: '🌾',
    blessing: '🙏',
    music: '🎵',
    success: '✨',
    celebration: '🎉',
    traditional: '🕉️',
  },
};

// Helper functions for consistent styling
export const getCulturalCardStyle = (variant: 'default' | 'profile' | 'project' | 'testimonial' = 'default') => {
  const baseStyles = culturalStyles.patterns.card + ' ' + culturalStyles.components.card;
  
  switch (variant) {
    case 'profile':
      return cn(baseStyles, culturalStyles.components.profileCard);
    case 'project':
      return cn(baseStyles, 'hover:-translate-y-1');
    case 'testimonial':
      return cn(baseStyles, 'relative before:absolute before:top-2 before:left-2 before:content-["""] before:text-6xl before:text-saffron/20 before:font-serif');
    default:
      return baseStyles;
  }
};

export const getCulturalButtonStyle = (variant: 'primary' | 'secondary' | 'destructive' = 'primary') => {
  const baseStyles = culturalStyles.typography.button + ' rounded-lg px-6 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-saffron/50';
  
  switch (variant) {
    case 'primary':
      return cn(baseStyles, culturalStyles.components.primaryButton);
    case 'secondary':
      return cn(baseStyles, culturalStyles.components.secondaryButton);
    case 'destructive':
      return cn(baseStyles, 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg hover:shadow-xl');
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
