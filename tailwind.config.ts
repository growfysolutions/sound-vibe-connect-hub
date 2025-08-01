import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Ocean Blue Theme Colors
				'ocean-blue': {
					DEFAULT: 'hsl(var(--ocean-blue))',
					light: 'hsl(var(--ocean-blue-light))',
					dark: 'hsl(var(--ocean-blue-dark))',
					50: 'hsl(210 100% 95%)',
					100: 'hsl(210 100% 90%)',
					200: 'hsl(210 100% 80%)',
					300: 'hsl(210 100% 70%)',
					400: 'hsl(210 100% 60%)',
					500: 'hsl(var(--ocean-blue))',
					600: 'hsl(210 100% 40%)',
					700: 'hsl(210 100% 30%)',
					800: 'hsl(210 100% 20%)',
					900: 'hsl(210 100% 10%)',
				},
				'teal': {
					DEFAULT: 'hsl(var(--teal))',
					light: 'hsl(var(--teal-light))',
					dark: 'hsl(var(--teal-dark))',
					50: 'hsl(175 100% 95%)',
					100: 'hsl(175 100% 90%)',
					200: 'hsl(175 100% 80%)',
					300: 'hsl(175 100% 70%)',
					400: 'hsl(175 100% 60%)',
					500: 'hsl(var(--teal))',
					600: 'hsl(175 100% 30%)',
					700: 'hsl(175 100% 20%)',
					800: 'hsl(175 100% 15%)',
					900: 'hsl(175 100% 10%)',
				},
				// Modern Music Platform Colors
				'music-purple': {
					DEFAULT: 'hsl(var(--music-purple))',
					light: 'hsl(var(--music-purple-light))',
					dark: 'hsl(var(--music-purple-dark))',
				},
				'electric-blue': {
					DEFAULT: 'hsl(var(--electric-blue))',
					light: 'hsl(var(--electric-blue-light))',
					dark: 'hsl(var(--electric-blue-dark))',
				},
				'vibrant-green': {
					DEFAULT: 'hsl(var(--vibrant-green))',
					light: 'hsl(var(--vibrant-green-light))',
					dark: 'hsl(var(--vibrant-green-dark))',
				},
				'modern-orange': {
					DEFAULT: 'hsl(var(--modern-orange))',
					light: 'hsl(var(--modern-orange-light))',
					dark: 'hsl(var(--modern-orange-dark))',
				},
				'modern-red': {
					DEFAULT: 'hsl(var(--modern-red))',
					light: 'hsl(var(--modern-red-light))',
					dark: 'hsl(var(--modern-red-dark))',
				},
				// Modern Background System
				'modern-bg': {
					primary: 'hsl(var(--modern-bg-primary))',
					secondary: 'hsl(var(--modern-bg-secondary))',
					tertiary: 'hsl(var(--modern-bg-tertiary))',
				},
				'modern-neutral': {
					light: 'hsl(var(--modern-neutral-light))',
					DEFAULT: 'hsl(var(--modern-neutral))',
					dark: 'hsl(var(--modern-neutral-dark))',
				},
				// Authentic Punjabi Cultural Colors
				'kesri-saffron': {
					DEFAULT: 'hsl(var(--kesri-saffron))',
					light: 'hsl(var(--kesri-saffron-light))',
					dark: 'hsl(var(--kesri-saffron-dark))',
				},
				'basanti-mustard': {
					DEFAULT: 'hsl(var(--basanti-mustard))',
					light: 'hsl(var(--basanti-mustard-light))',
					dark: 'hsl(var(--basanti-mustard-dark))',
				},
				'neela-royal': {
					DEFAULT: 'hsl(var(--neela-royal))',
					light: 'hsl(var(--neela-royal-light))',
					dark: 'hsl(var(--neela-royal-dark))',
				},
				'hara-green': {
					DEFAULT: 'hsl(var(--hara-green))',
					light: 'hsl(var(--hara-green-light))',
					dark: 'hsl(var(--hara-green-dark))',
				},
				'surkh-red': {
					DEFAULT: 'hsl(var(--surkh-red))',
					light: 'hsl(var(--surkh-red-light))',
					dark: 'hsl(var(--surkh-red-dark))',
				},
				// Cultural Background System
				'cultural-cream': 'hsl(var(--cultural-cream))',
				'cultural-warm-gray': 'hsl(var(--cultural-warm-gray))',
				'cultural-neutral': {
					light: 'hsl(var(--cultural-neutral-light))',
					DEFAULT: 'hsl(var(--cultural-neutral))',
					dark: 'hsl(var(--cultural-neutral-dark))',
				},
				// Legacy compatibility - mapped to new colors
				saffron: {
					DEFAULT: 'hsl(var(--ocean-blue))',
					50: 'hsl(210 100% 95%)',
					100: 'hsl(210 100% 90%)',
					200: 'hsl(210 100% 80%)',
					300: 'hsl(210 100% 70%)',
					400: 'hsl(210 100% 60%)',
					500: 'hsl(var(--ocean-blue))',
					600: 'hsl(210 100% 40%)',
					700: 'hsl(210 100% 30%)',
					800: 'hsl(210 100% 20%)',
					900: 'hsl(210 100% 10%)',
				},
				'indian-green': {
					DEFAULT: 'hsl(var(--hara-green))',
					50: 'hsl(142 71% 95%)',
					100: 'hsl(142 71% 90%)',
					200: 'hsl(142 71% 80%)',
					300: 'hsl(142 71% 70%)',
					400: 'hsl(142 71% 60%)',
					500: 'hsl(142 71% 50%)',
					600: 'hsl(142 71% 40%)',
					700: 'hsl(142 71% 30%)',
					800: 'hsl(var(--hara-green))',
					900: 'hsl(142 71% 15%)',
				},
				// Keep existing color systems for compatibility
				space: {
					black: '#0A0A0F',
					'deep-blue': '#0F0F23',
					'cosmic-purple': '#1A0B2E',
					'nebula-pink': '#2D1B69',
					'stellar-blue': '#0066CC',
					'aurora-cyan': '#00FFFF',
					'electric-blue': '#0080FF',
					'cosmic-gray': '#6B7280',
					'stellar-white': '#F8FAFC',
				},
				youtube: {
					red: '#FF0000',
					'red-dark': '#CC0000',
					'red-light': '#FF4444',
					'red-bg': '#FFF5F5',
					gray: '#606060',
					'gray-light': '#F9F9F9',
					'gray-dark': '#212121',
					blue: '#065FD4',
					green: '#00A693',
					orange: '#FF6D00',
					purple: '#8E24AA',
				},
				vibrant: {
					pink: '#FF1493',
					cyan: '#00BFFF',
					lime: '#32CD32',
					gold: '#FFD700',
					coral: '#FF6B47',
					lavender: '#E6E6FA',
				},
				cosmic: {
					50: '#f0f4ff',
					100: '#e0e7ff',
					400: '#a78bfa',
					500: '#6366f1',
					600: '#4f46e5',
					700: '#4338ca',
					800: '#3730a3',
					900: '#312e81',
				},
				gold: {
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
				},
			},
			backgroundImage: {
				// Ocean Blue Theme Gradients
				'ocean-gradient': 'linear-gradient(135deg, hsl(var(--ocean-blue)) 0%, hsl(var(--ocean-blue-dark)) 100%)',
				'teal-gradient': 'linear-gradient(135deg, hsl(var(--teal)) 0%, hsl(var(--teal-dark)) 100%)',
				'ocean-teal-gradient': 'linear-gradient(135deg, hsl(var(--ocean-blue)) 0%, hsl(var(--teal)) 100%)',
				'modern-primary': 'linear-gradient(135deg, hsl(var(--ocean-blue)) 0%, hsl(var(--teal)) 50%, hsl(var(--ocean-blue-light)) 100%)',
				'modern-secondary': 'linear-gradient(135deg, hsl(var(--teal)) 0%, hsl(var(--ocean-blue)) 100%)',
				'modern-neutral': 'linear-gradient(135deg, hsl(var(--color-neutral-200)) 0%, hsl(var(--color-neutral-300)) 100%)',
				// Modern Music Platform Gradients
				'music-gradient': 'linear-gradient(135deg, hsl(var(--music-purple)) 0%, hsl(var(--music-purple-dark)) 100%)',
				'electric-gradient': 'linear-gradient(135deg, hsl(var(--electric-blue)) 0%, hsl(var(--electric-blue-dark)) 100%)',
				'success-gradient': 'linear-gradient(135deg, hsl(var(--vibrant-green)) 0%, hsl(var(--vibrant-green-dark)) 100%)',
				'warning-gradient': 'linear-gradient(135deg, hsl(var(--modern-orange)) 0%, hsl(var(--modern-orange-dark)) 100%)',
				'error-gradient': 'linear-gradient(135deg, hsl(var(--modern-red)) 0%, hsl(var(--modern-red-dark)) 100%)',
				// Cultural Punjabi Gradients
				'kesri-gradient': 'linear-gradient(135deg, hsl(var(--kesri-saffron)) 0%, hsl(var(--kesri-saffron-dark)) 100%)',
				'basanti-gradient': 'linear-gradient(135deg, hsl(var(--basanti-mustard)) 0%, hsl(var(--basanti-mustard-dark)) 100%)',
				'cultural-warm': 'linear-gradient(135deg, hsl(var(--kesri-saffron)) 0%, hsl(var(--basanti-mustard)) 50%, hsl(var(--neela-royal)) 100%)',
				'cultural-celebration': 'linear-gradient(135deg, hsl(var(--surkh-red)) 0%, hsl(var(--kesri-saffron)) 50%, hsl(var(--basanti-mustard)) 100%)',
				'cultural-trust': 'linear-gradient(135deg, hsl(var(--neela-royal)) 0%, hsl(var(--neela-royal-light)) 100%)',
				'cultural-prosperity': 'linear-gradient(135deg, hsl(var(--hara-green)) 0%, hsl(var(--basanti-mustard)) 100%)',
				'cultural-cream-texture': 'radial-gradient(circle at 30% 40%, hsl(var(--cultural-warm-gray)) 0%, transparent 50%), radial-gradient(circle at 80% 10%, hsl(var(--kesri-saffron)) 0%, transparent 90%)',
				// Keep existing gradients for compatibility
				'space-dark': 'radial-gradient(ellipse at center, #1A0B2E 0%, #0F0F23 40%, #0A0A0F 100%)',
				'cosmic-glow': 'radial-gradient(circle at 30% 40%, #2D1B69 0%, transparent 50%), radial-gradient(circle at 80% 10%, #0066CC 0%, transparent 50%), radial-gradient(circle at 40% 80%, #1A0B2E 0%, transparent 50%)',
				'nebula-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #1A0B2E 25%, #2D1B69 50%, #0F0F23 75%, #0A0A0F 100%)',
				'aurora-gradient': 'linear-gradient(135deg, #00FFFF 0%, #0080FF 50%, #2D1B69 100%)',
				'stellar-gradient': 'linear-gradient(135deg, #0066CC 0%, #00FFFF 100%)',
				'youtube-gradient': 'linear-gradient(135deg, #FF0000 0%, #FF4444 100%)',
				'cheerful-gradient': 'linear-gradient(135deg, #FFD700 0%, #FF6B47 50%, #FF1493 100%)',
				'lively-bg': 'linear-gradient(135deg, #FFF5F5 0%, #F0F8FF 50%, #F5FFFA 100%)',
				'energy-burst': 'radial-gradient(circle at center, #FF4444 0%, #FFD700 50%, #00BFFF 100%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'4xl': '2rem',
				'5xl': '2.5rem',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 128, 255, 0.2)',
						textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
					},
					'50%': { 
						boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 128, 255, 0.4)',
						textShadow: '0 0 20px rgba(0, 255, 255, 0.8)'
					}
				},
				'float-cosmic': {
					'0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
					'33%': { transform: 'translateY(-15px) translateX(5px)' },
					'66%': { transform: 'translateY(5px) translateX(-5px)' }
				},
				'slide-in-cosmic': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(50px)',
						filter: 'blur(10px)'
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0)',
						filter: 'blur(0px)'
					}
				},
				'fade-in-glow': {
					'0%': { 
						opacity: '0',
						transform: 'scale(0.8)',
						filter: 'blur(5px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'scale(1)',
						filter: 'blur(0px)'
					}
				},
				'star-twinkle': {
					'0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.2)' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'pulse-grow': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.15)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'pop-in': {
					'0%': { transform: 'scale(0) rotate(36deg)', opacity: '0' },
					'100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
				},
				'float-gentle': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'33%': { transform: 'translateY(-10px) rotate(1deg)' },
					'66%': { transform: 'translateY(5px) rotate(-1deg)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'float-cosmic': 'float-cosmic 6s ease-in-out infinite',
				'slide-in-cosmic': 'slide-in-cosmic 1s ease-out',
				'fade-in-glow': 'fade-in-glow 0.8s ease-out',
				'star-twinkle': 'star-twinkle 2s ease-in-out infinite',
				'bounce-in': 'bounce-in 0.6s ease-out',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'pulse-grow': 'pulse-grow 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.8s ease-out',
				'pop-in': 'pop-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'float-gentle': 'float-gentle 4s ease-in-out infinite',
			},
			fontSize: {
				'10xl': '10rem',
				'11xl': '12rem',
			},
			boxShadow: {
				'ocean-glow': '0 0 20px hsl(var(--ocean-blue) / 0.3), 0 0 40px hsl(var(--teal) / 0.2)',
				'ocean-glow-lg': '0 0 30px hsl(var(--ocean-blue) / 0.4), 0 0 60px hsl(var(--teal) / 0.3)',
				'modern-ocean': '0 4px 20px hsla(var(--ocean-blue), 0.3)',
				'modern-teal': '0 4px 20px hsla(var(--teal), 0.3)',
				'modern-trust': '0 4px 16px hsla(var(--ocean-blue), 0.25)',
				'cosmic-glow': '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 128, 255, 0.2)',
				'cosmic-glow-lg': '0 0 30px rgba(0, 255, 255, 0.4), 0 0 60px rgba(0, 128, 255, 0.3)',
				'glass-cosmic': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
				'chunky': '0 8px 30px rgba(0, 0, 0, 0.12)',
				'chunky-hover': '0 15px 40px rgba(0, 0, 0, 0.2)',
				'youtube': '0 4px 20px rgba(255, 0, 0, 0.3)',
				// Modern shadows
				'modern-purple': '0 4px 20px hsla(var(--music-purple), 0.3)',
				'modern-glow': '0 0 20px hsla(var(--music-purple), 0.3), 0 0 40px hsla(var(--electric-blue), 0.2)',
				'modern-success': '0 4px 16px hsla(var(--vibrant-green), 0.25)',
				// Cultural shadows
				'cultural-warm': '0 4px 20px hsla(var(--kesri-saffron), 0.3)',
				'cultural-glow': '0 0 20px hsla(var(--kesri-saffron), 0.3), 0 0 40px hsla(var(--basanti-mustard), 0.2)',
				'cultural-trust': '0 4px 16px hsla(var(--neela-royal), 0.25)',
			}
		}
	  },
  plugins: [require("tailwindcss-animate"),]
} satisfies Config;
