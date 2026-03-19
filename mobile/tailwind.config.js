const {Colors} = require('./constants/Colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: Colors.light.background,
          card: Colors.light.card,
          text: Colors.light.text,
          muted: Colors.light.muted,
          border: Colors.light.border,
          primary: Colors.light.primary,
          secondary: Colors.light.secondary,
          accent: Colors.light.accent,
          success: Colors.light.success,
          error: Colors.light.error,
          warning: Colors.light.warning,
        },
        dark: {
          background: Colors.dark.background,
          card: Colors.dark.card,
          text: Colors.dark.text,
          muted: Colors.dark.muted,
          border: Colors.dark.border,
          primary: Colors.dark.primary,
          secondary: Colors.dark.secondary,
          accent: Colors.dark.accent,
          success: Colors.dark.success,
          error: Colors.dark.error,
          warning: Colors.dark.warning,
        },
      },
      fontFamily: {
        logo: ['ArchivoBlack_400Regular'],
        road: ['Barlow_600SemiBold'],
        gauge: ['ChakraPetch_700Bold'],
        sans: ['Inter_400Regular'],
        'sans-bold': ['Inter_700Bold'],
        'sans-semibold': ['Inter_600SemiBold'],
        'sans-light': ['Inter_300Light'],
      },
    },
  },
  presets: [require('nativewind/preset')],
  plugins: [],
};
