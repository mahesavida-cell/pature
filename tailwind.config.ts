
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        headline: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'monospace'],
        code: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'monospace'],
      },
      /* Vercel/Geist Typography Scale */
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0' }],           // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.006em' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.011em' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.014em' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.017em' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.019em' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.021em' }],// 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.022em' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],        // 48px
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.027em' }],       // 60px
      },
      /* Vercel Standard Spacing Scale */
      spacing: {
        '4.5': '1.125rem',  // 18px
        '13': '3.25rem',    // 52px
        '15': '3.75rem',    // 60px
        '18': '4.5rem',     // 72px
        '22': '5.5rem',     // 88px
        '26': '6.5rem',     // 104px
        '30': '7.5rem',     // 120px
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0,0,0,0.03)',
        'elevated': '0 4px 8px -2px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'floating': '0 12px 24px -4px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.04)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
