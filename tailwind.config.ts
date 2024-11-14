import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        '4xl': ['40px', '40px'],
        '3xl': ['32px', '36px'],
        '2xl': ['28px', '32px'],
        xl: ['24px', '32px'],
        lg: ['20px', '28px'],
        md: ['16px', '24px'],
        sm: ['14px', '20px'],
        xs: ['12px', '16px'],
        '2xs': ['10px', '12px'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
