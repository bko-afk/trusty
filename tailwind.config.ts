import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/(frontend)/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Фиолетовая палитра — ближе к визуальному стилю eto-razvod.ru
          DEFAULT: '#6D28D9',
          dark: '#4C1D95',
          light: '#F3E8FF',
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
