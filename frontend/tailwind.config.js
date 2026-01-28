/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#135bec",
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#135bec",
                    600: "#1048c4",
                    700: "#0e3a9e",
                    800: "#0c2d78",
                    900: "#0a2562",
                },
                background: {
                    light: "#f6f6f8",
                    dark: "#101622",
                },
                surface: {
                    light: "#ffffff",
                    dark: "#1a2332",
                },
                text: {
                    light: "#1f2937",
                    dark: "#f3f4f6",
                }
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                "2xl": "1rem",
                full: "9999px",
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'medium': '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 12px 28px -4px rgba(0, 0, 0, 0.06)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
