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
        surface: '#050505',
        foreground: '#F5F5F5',
        glass: 'rgba(15,15,15,0.82)',
        needs: 'rgba(56,139,255,0.35)',
        savings: 'rgba(16,242,170,0.35)',
        wants: 'rgba(166,128,255,0.35)'
      },
      backgroundImage: {
        'liquid-glass':
          'radial-gradient(circle at top left, rgba(26,26,26,0.9), rgba(5,5,5,1) 60%)'
      },
      boxShadow: {
        glass: '0 20px 60px rgba(5, 5, 5, 0.6)',
        'glass-inner': 'inset 0 0 0.5px rgba(255,255,255,0.5)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans]
      }
    }
  },
  plugins: []
};

export default config;
