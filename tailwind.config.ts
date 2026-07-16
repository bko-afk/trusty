import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/(frontend)/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1f6feb',
          dark: '#0b4fa8',
          light: '#e8f1ff',
        },
      },
      container: {
        center: true,
        padding: '1rem',
        screens: { lg: '1120px', xl: '1200px' },
      },
    },
  },
  plugins: [],
}

export default config
