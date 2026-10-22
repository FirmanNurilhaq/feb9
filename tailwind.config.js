import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    rose: '#E59AA6',
                    'rose-light': '#FDF4F5',
                    'rose-subtle': '#F7DDE2',
                    'rose-hover': '#DB8B97',
                    'rose-dark': '#B86875',
                    charcoal: '#27272A',
                    'charcoal-light': '#3F3F46',
                    'charcoal-dark': '#18181B',
                    muted: '#959595',
                    'muted-light': '#B3B3B3',
                    'muted-subtle': '#E8E8E9',
                    alabaster: '#FCFCFC',
                    pearl: '#F5F5F7',
                },
                status: {
                    alert: '#D9777F',
                    'alert-bg': '#FCF0F1',
                    success: '#7A9D8C',
                    'success-bg': '#EFF6F2',
                    warning: '#D4B872',
                    'warning-bg': '#FAF5EC',
                },
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                serif: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
                display: ['"Playfair Display"', 'serif'],
            },
            boxShadow: {
                diffused: '0 8px 30px -4px rgba(39, 39, 42, 0.04), 0 2px 6px -1px rgba(39, 39, 42, 0.02)',
                'card-soft': '0 2px 12px 0 rgba(39, 39, 42, 0.03), 0 1px 3px 0 rgba(39, 39, 42, 0.02)',
            },
            transitionTimingFunction: {
                'luxury-ease': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },

    plugins: [forms],
};
