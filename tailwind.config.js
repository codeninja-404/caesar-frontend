/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    darkMode: 'class', // Enable dark mode with 'dark' class
    theme: {
        extend: {
            animation: {
                'in': 'in 300ms ease-out',
                'out': 'out 300ms ease-in',
            },
            keyframes: {
                'in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
};