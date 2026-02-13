/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                /* Swiss Clarity Color System */
                swiss: {
                    black: '#0a0a0a',
                    white: '#ffffff',
                    gray: {
                        50: '#fafafa',
                        100: '#f5f5f5',
                        200: '#e5e5e5',
                        400: '#a3a3a3',
                        600: '#666666',
                        800: '#1a1a1a',
                    },
                    red: '#e63946',
                    success: '#06d6a0',
                    warning: '#ffa500',
                    error: '#d32f2f',
                },
                /* Semantic aliases */
                primary: {
                    DEFAULT: '#0a0a0a',
                    light: '#1a1a1a',
                },
                accent: {
                    DEFAULT: '#0a0a0a',
                    red: '#e63946',
                },
                success: '#06d6a0',
                warning: '#ffa500',
                error: '#d32f2f',
                background: '#fafafa',
                surface: '#ffffff',
            },
            fontFamily: {
                sans: ['Helvetica Neue', 'Helvetica', 'Arial', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            spacing: {
                /* 8pt grid system */
                'swiss-1': '8px',
                'swiss-2': '16px',
                'swiss-3': '24px',
                'swiss-4': '32px',
                'swiss-5': '40px',
                'swiss-6': '48px',
                'swiss-8': '64px',
                'swiss-10': '80px',
                /* Mobile header offset */
                '18': '4.5rem',
            },
            fontSize: {
                /* Swiss typography scale */
                'h1': ['56px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
                'h2': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
                'h3': ['28px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
                'h4': ['20px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '700' }],
                'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
                'body': ['15px', { lineHeight: '1.5', fontWeight: '400' }],
                'body-sm': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
                'button': ['13px', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '700' }],
                'label': ['11px', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '700' }],
            },
            boxShadow: {
                /* Swiss hard shadows */
                'swiss': '-8px 8px 0 #0a0a0a',
                'swiss-sm': '-4px 4px 0 #0a0a0a',
                'swiss-input': '4px 4px 0 #0a0a0a',
                'none': 'none',
            },
            borderRadius: {
                /* Swiss = no curves */
                'none': '0',
                'swiss': '0',
            },
            borderWidth: {
                'swiss': '2px',
            },
            transitionDuration: {
                'swiss': '200ms',
            },
            transitionTimingFunction: {
                'swiss': 'ease',
            },
        },
    },
    plugins: [],
}
