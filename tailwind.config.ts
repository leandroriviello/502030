import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/store/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Colores base del sistema Apple
        surface: '#000000',
        'surface-elevated': 'rgba(28, 28, 30, 0.95)',
        'surface-glass': 'rgba(28, 28, 30, 0.75)',
        foreground: '#FFFFFF',
        'foreground-secondary': 'rgba(255, 255, 255, 0.85)',
        'foreground-tertiary': 'rgba(255, 255, 255, 0.6)',
        
        // Colores de acento Apple-style
        'accent-blue': 'rgba(0, 122, 255, 0.8)',
        'accent-green': 'rgba(52, 199, 89, 0.8)',
        'accent-purple': 'rgba(175, 82, 222, 0.8)',
        'accent-orange': 'rgba(255, 149, 0, 0.8)',
        
        // Colores específicos de la regla 50/20/30
        needs: 'rgba(0, 122, 255, 0.4)',
        savings: 'rgba(52, 199, 89, 0.4)',
        wants: 'rgba(175, 82, 222, 0.4)',
        
        // Glass effect colors
        glass: 'rgba(28, 28, 30, 0.82)',
        'glass-border': 'rgba(255, 255, 255, 0.1)'
      },
      backgroundImage: {
        'liquid-glass': 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(28,28,30,0.95) 50%, rgba(0,0,0,0.9) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'accent-gradient': 'linear-gradient(135deg, rgba(0,122,255,0.2) 0%, rgba(175,82,222,0.2) 100%)'
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 16px 64px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'glass-inner': 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)',
        'apple': '0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px'
      },
      fontFamily: {
        'sans': [
          'var(--font-sf-pro-display)', 
          'var(--font-sf-pro-text)', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'SF Pro Display', 
          'SF Pro Text', 
          'Helvetica Neue', 
          'Helvetica', 
          'Arial', 
          'sans-serif'
        ],
        'display': [
          'var(--font-sf-pro-display)', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'SF Pro Display', 
          'Helvetica Neue', 
          'Helvetica', 
          'Arial', 
          'sans-serif'
        ],
        'text': [
          'var(--font-sf-pro-text)', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'SF Pro Text', 
          'Helvetica Neue', 
          'Helvetica', 
          'Arial', 
          'sans-serif'
        ]
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '16px', letterSpacing: '0.01em' }],
        'sm': ['13px', { lineHeight: '18px', letterSpacing: '0.01em' }],
        'base': ['15px', { lineHeight: '20px', letterSpacing: '0.01em' }],
        'lg': ['17px', { lineHeight: '22px', letterSpacing: '0.01em' }],
        'xl': ['19px', { lineHeight: '24px', letterSpacing: '0.01em' }],
        '2xl': ['21px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        '3xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        '4xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.03em' }],
        '5xl': ['32px', { lineHeight: '40px', letterSpacing: '-0.04em' }],
        '6xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.05em' }],
        '7xl': ['42px', { lineHeight: '48px', letterSpacing: '-0.06em' }],
        '8xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.07em' }],
        '9xl': ['56px', { lineHeight: '64px', letterSpacing: '-0.08em' }]
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px'
      }
    }
  },
  plugins: []
};

export default config;
