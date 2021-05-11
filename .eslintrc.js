module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react-hooks'
    ],
    extends: [
        'eslint:recommended',
        "plugin:react-hooks/recommended",
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:cypress/recommended'
    ],
    "rules": {
        "react-hooks/rules-of-hooks": 'warn',
        "react-hooks/exhaustive-deps": 'warn'
    }
};