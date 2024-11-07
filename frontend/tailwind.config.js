/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
       'xs': '0.625rem',  // Extra small text (10px)
        'sm': '0.75rem',   // Small text (12px)
        'tiny': '0.8125rem', // Tiny text (13px)
        'base': '0.875rem', // Default base text size (14px)
        'lg': '1rem',      // Large text (16px)
        'xl': '1.125rem',  // Extra large text (18px)
        '2xl': '1.25rem',  // 2x extra large text (20px)
        // Add more custom sizes as needed
      },
      colors: {
        'scrollbar-thumb': 'rgb(49 46 129)', // Custom scrollbar thumb color
        'scrollbar-track': 'black', // Custom scrollbar track color
      },
      scrollbar: {
        DEFAULT: 'scrollbar-thumb scrollbar-track',
      },
    },
  },
  plugins: [
    function({ addComponents, theme }) {
      addComponents({
        '.scrollbar': {
          /* For WebKit browsers (Chrome, Safari) */
          '&::-webkit-scrollbar': {
            width: '12px', // Width of the scrollbar
            heiggt: '20px'
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.scrollbar-track'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.scrollbar-thumb'),
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme('colors.scrollbar-thumb'),
          },

          /* For Firefox */
          scrollbarWidth: 'thin', // 'auto' or 'thin'
          scrollbarColor: `${theme('colors.scrollbar-thumb')} ${theme('colors.scrollbar-track')}`,
        },
      });
    },
  ],
}

