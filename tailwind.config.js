/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.html", "./projects/**/*.{html,ts}"],
    theme: {
        colors: {
            gray: {
                50: "#f8f9fa",
                100: "#f1f3f4",
                200: "#e8eaed",
                300: "#dadce0",
                400: "#bdc1c6",
                500: "#9aa0a6",
                600: "#80868b",
                700: "#5f6368",
                800: "#3c4043",
                846: "#2e3134",
                868: "#282a2d",
                900: "#202124",
                928: "#17181b",
                958: "#0e1013"
            },
            primary: "rgb(var(--primary) / <alpha-value>)",
            secondary: "rgb(var(--secondary) / <alpha-value>)",
            background: "rgb(var(--background) / <alpha-value>)",
            border: "rgb(var(--border) / <alpha-value>)",
            text: "rgb(var(--text) / <alpha-value>)"
        },
        extend: {}
    },
    plugins: [require("tailwindcss/nesting"), require("tailwindcss"), require("autoprefixer")],
    prefix: "mona-"
};
