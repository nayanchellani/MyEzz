/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}", "app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Premium Orange Theme
        'brand-primary': '#FF6600',      // Sunset Orange - action color
        'brand-secondary': '#E65C00',    // Burnt Amber - hover states
        'bg-main': '#0B0C10',            // Deep Obsidian - main background
        'bg-surface': '#1F2833',         // Midnight Slate - cards/surfaces
        'accent-trust': '#00C805',       // Emerald Green - ratings/stock
        'text-primary': '#FFFFFF',       // Pure White - headlines
        'text-secondary': '#94A3B8',     // Slate Gray - metadata
        
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'xl': '12px',
      },
      boxShadow: {
        'orange-glow': '0 0 15px rgba(255, 102, 0, 0.3)',
        'orange-glow-lg': '0 0 25px rgba(255, 102, 0, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'Metropolis', 'system-ui', 'sans-serif'],
      },
    },
  },
}
