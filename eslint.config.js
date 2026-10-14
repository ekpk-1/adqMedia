import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
    { ignores: [".next", "node_modules", "public", "dist"] },
    {
        files: ["**/*.{js,jsx,mjs}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.browser, ...globals.node },
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { "react-hooks": reactHooks },
        rules: {
            ...js.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            // Core ESLint doesn't count JSX member tags like <motion.div> as uses.
            "no-unused-vars": ["warn", { varsIgnorePattern: "^([A-Z_]|motion$)" }],
        },
    },
];
