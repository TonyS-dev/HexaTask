/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0F172A', // Slate 900
                    light: '#1E293B',
                    dark: '#020617',
                },
                accent: {
                    DEFAULT: '#3B82F6', // Blue 500
                    light: '#60A5FA',
                    dark: '#2563EB',
                },
                success: {
                    DEFAULT: '#10B981', // Emerald 500
                    light: '#34D399',
                    dark: '#059669',
                },
                background: '#F8FAFC', // Slate 50
                surface: '#FFFFFF',
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
            },
            boxShadow: {
                'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
}
