/** @type {import('tailwindcss').Config} */
// Force reload
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1', // Indigo 500
                    hover: '#4f46e5',   // Indigo 600
                    glow: 'rgba(99, 102, 241, 0.5)'
                },
                secondary: '#ec4899', // Pink 500
                accent: '#8b5cf6',    // Violet 500
                dark: '#020617',      // Slate 950 (Deeper Dark)
                card: '#1e293b',      // Slate 800
                'card-hover': '#334155', // Slate 700
                text: {
                    main: '#f8fafc', // Slate 50
                    muted: '#94a3b8' // Slate 400
                },
                border: '#1e293b',    // Slate 800 matched to card for subtlety
                'border-light': '#334155' // Lighter border for hover
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'], // Added Outfit for a modern heading look
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
            boxShadow: {
                'glow': '0 0 20px rgba(99, 102, 241, 0.35)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }
        },
    },
    plugins: [],
}
