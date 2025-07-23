
import { cn } from './utils';

// Cultural design system utilities with authentic Punjabi color palette
export const culturalStyles = {
  // Authentic Punjabi Color System
  colors: {
    // Primary Kesri (Saffron) - Courage, sacrifice, spirituality
    primary: 'text-kesri-saffron',
    primaryBg: 'bg-kesri-saffron',
    primaryGradient: 'bg-kesri-gradient',
    primaryLight: 'text-kesri-saffron-light',
    primaryDark: 'text-kesri-saffron-dark',
    
    // Secondary Neela (Royal Blue) - Trust, stability, Sikh heritage
    secondary: 'text-neela-royal',
    secondaryBg: 'bg-neela-royal',
    secondaryGradient: 'bg-cultural-trust',
    secondaryLight: 'text-neela-royal-light',
    secondaryDark: 'text-neela-royal-dark',
    
    // Accent Basanti (Mustard) - Agricultural prosperity, harvest celebration
    accent: 'text-basanti-mustard',
    accentBg: 'bg-basanti-mustard',
    accentGradient: 'bg-basanti-gradient',
    accentLight: 'text-basanti-mustard-light',
    accentDark: 'text-basanti-mustard-dark',
    
    // Success Hara (Green) - Growth, prosperity, natural abundance
    success: 'text-hara-green',
    successBg: 'bg-hara-green',
    successGradient: 'bg-cultural-prosperity',
    successLight: 'text-hara-green-light',
    successDark: 'text-hara-green-dark',
    
    // Warning/Celebration Surkh (Deep Red) - Celebration, energy, festivities
    warning: 'text-surkh-red',
    warningBg: 'bg-surkh-red',
    warningLight: 'text-surkh-red-light',
    warningDark: 'text-surkh-red-dark',
    
    // Cultural backgrounds
    culturalBg: 'bg-cultural-cream',
    culturalWarm: 'bg-cultural-warm-gray',
    culturalNeutral: 'bg-cultural-neutral',
    culturalNeutralLight: 'bg-cultural-neutral-light',
    culturalNeutralDark: 'bg-cultural-neutral-dark',
  },

  // Typography system with cultural sensitivity
  typography: {
    header: 'font-bold tracking-wide',
    subheader: 'font-semibold text-lg',
    body: 'font-medium leading-relaxed',
    label: 'font-medium text-sm text-foreground',
    button: 'font-medium tracking-wide',
    caption: 'text-sm text-muted-foreground',
    cultural: 'font-serif', // For Gurmukhi text elements
  },

  // Cultural patterns inspired by traditional Punjabi art
  patterns: {
    card: 'relative overflow-hidden before:absolute before:inset-0 before:bg-cultural-cream-texture before:opacity-30',
    phulkari: 'bg-gradient-to-br from-kesri-saffron/10 to-basanti-mustard/10',
    traditional: 'border-2 border-kesri-saffron/20',
    culturalFrame: 'border border-kesri-saffron/30 shadow-cultural-warm',
    wheat: 'bg-gradient-to-br from-basanti-mustard/5 to-hara-green/5',
    celebration: 'bg-cultural-celebration',
  },

  // Component styles with cultural authenticity
  components: {
    // Form elements
    input: 'border-2 border-kesri-saffron/20 hover:border-kesri-saffron/40 focus:border-kesri-saffron rounded-lg transition-all duration-200',
    inputError: 'border-surkh-red focus:border-surkh-red',
    inputSuccess: 'border-hara-green focus:border-hara-green',
    
    // Buttons with cultural gradients
    primaryButton: 'bg-kesri-gradient text-white shadow-cultural-warm hover:shadow-cultural-glow hover:scale-[1.02] transition-all duration-300',
    secondaryButton: 'border-2 border-neela-royal text-neela-royal hover:bg-neela-royal/10 transition-all duration-200',
    accentButton: 'bg-basanti-gradient text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
    successButton: 'bg-cultural-prosperity text-white shadow-lg hover:shadow-xl transition-all duration-300',
    
    // Cards with cultural depth
    card: 'bg-white rounded-xl border border-kesri-saffron/20 shadow-cultural-warm hover:shadow-cultural-glow transition-all duration-300',
    profileCard: 'bg-white rounded-xl border border-kesri-saffron/20 p-4 relative overflow-hidden',
    celebrationCard: 'bg-cultural-celebration rounded-xl border border-surkh-red/30 shadow-lg',
    
    // Navigation with cultural trust elements
    navItem: 'rounded-xl transition-all duration-300 hover:scale-105',
    navActive: 'bg-gradient-to-r from-kesri-saffron/20 to-basanti-mustard/20 text-kesri-saffron border border-kesri-saffron/30 shadow-cultural-trust',
    
    // Loading states with cultural authenticity
    loader: 'animate-spin text-kesri-saffron',
    progress: 'bg-kesri-gradient',
    
    // Trust indicators
    verified: 'bg-neela-royal/10 text-neela-royal border border-neela-royal/30',
    premium: 'bg-basanti-gradient text-white shadow-cultural-glow',
  },

  // Cultural elements and symbols
  elements: {
    separator: '🌾', // Wheat symbol for agricultural heritage
    blessing: '🙏', // Universal prayer/blessing
    music: '🎵', // Musical note
    success: '✨', // Celebration sparkle
    celebration: '🎉', // Party/festival
    traditional: '🕉️', // Sacred symbol
    dhol: '🥁', // Traditional drum
    saffron: '🌸', // Saffron flower
    wheat: '🌾', // Wheat for prosperity
    community: '👥', // Community/sangat
  },

  // Cultural gradients for specific use cases
  gradients: {
    warm: 'bg-cultural-warm', // Saffron to mustard to blue
    celebration: 'bg-cultural-celebration', // Red to saffron to mustard
    prosperity: 'bg-cultural-prosperity', // Green to mustard
    trust: 'bg-cultural-trust', // Blue gradient
    primary: 'bg-kesri-gradient', // Saffron gradient
    accent: 'bg-basanti-gradient', // Mustard gradient
  },
};

// Helper functions for consistent cultural styling
export const getCulturalCardStyle = (variant: 'default' | 'profile' | 'project' | 'testimonial' | 'celebration' = 'default') => {
  const baseStyles = culturalStyles.patterns.card + ' ' + culturalStyles.components.card;
  
  switch (variant) {
    case 'profile':
      return cn(baseStyles, culturalStyles.components.profileCard);
    case 'project':
      return cn(baseStyles, 'hover:-translate-y-1');
    case 'testimonial':
      return cn(baseStyles, 'relative before:absolute before:top-2 before:left-2 before:content-["""] before:text-6xl before:text-kesri-saffron/20 before:font-serif');
    case 'celebration':
      return cn(baseStyles, culturalStyles.components.celebrationCard);
    default:
      return baseStyles;
  }
};

export const getCulturalButtonStyle = (variant: 'primary' | 'secondary' | 'accent' | 'success' | 'destructive' = 'primary') => {
  const baseStyles = culturalStyles.typography.button + ' rounded-lg px-6 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-kesri-saffron/50';
  
  switch (variant) {
    case 'primary':
      return cn(baseStyles, culturalStyles.components.primaryButton);
    case 'secondary':
      return cn(baseStyles, culturalStyles.components.secondaryButton);
    case 'accent':
      return cn(baseStyles, culturalStyles.components.accentButton);
    case 'success':
      return cn(baseStyles, culturalStyles.components.successButton);
    case 'destructive':
      return cn(baseStyles, 'bg-gradient-to-r from-surkh-red to-surkh-red-dark text-white shadow-lg hover:shadow-xl');
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

// Cultural color palette accessibility helper
export const getCulturalColorContrast = (colorName: string) => {
  const contrastMap = {
    'kesri-saffron': { light: 'text-white', dark: 'text-gray-900' },
    'basanti-mustard': { light: 'text-gray-900', dark: 'text-white' },
    'neela-royal': { light: 'text-white', dark: 'text-gray-100' },
    'hara-green': { light: 'text-white', dark: 'text-gray-100' },
    'surkh-red': { light: 'text-white', dark: 'text-gray-100' },
  };
  
  return contrastMap[colorName as keyof typeof contrastMap] || { light: 'text-white', dark: 'text-gray-900' };
};
