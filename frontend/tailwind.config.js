/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all relevant files in the src directory
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],       // Primary font for body text, UI elements
        display: ['Poppins', 'sans-serif'],  // Secondary font for headings, prominent text
      },
      colors: {
        brand: {
          primary: '#3B82F6',   // Calming Blue: For primary actions, key info, trust
          secondary: '#60A5FA', // Lighter Blue: For backgrounds, borders, highlights
          accent: '#10B981',    // Vibrant Green: For CTAs, success states, positive data
        },
        status: {
          success: '#10B981', // Consistent with accent for positive feedback
          warning: '#F59E0B', // Amber: For warnings, attention needed
          error: '#EF4444',   // Red: For errors, critical alerts
        },
        // Utilize Tailwind's default neutral palette which aligns with the plan:
        // gray-50: #F9FAFB (Light Background)
        // white: #FFFFFF (Card/Element Background)
        // gray-500: #6B7280 (Body Text)
        // gray-800: #1F2937 (Headings)
      },
    },
  },
  plugins: [
    // No specific Tailwind plugins required by Headless UI for basic setup
    // Consider adding '@tailwindcss/forms' if complex forms are needed later
  ],
};
