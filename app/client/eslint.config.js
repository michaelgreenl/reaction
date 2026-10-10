import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import pluginPlaywright from 'eslint-plugin-playwright';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default defineConfig([
    {
        name: 'app/files-to-lint',
        files: ['**/*.{js,mjs,jsx,vue}'],
    },

    globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                defineProps: 'readonly',
                defineEmits: 'readonly',
            },
        },
    },

    js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],

    {
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    },

    {
        ...pluginVitest.configs.recommended,
        files: ['src/**/__tests__/*'],
    },

    {
        ...pluginPlaywright.configs['flat/recommended'],
        files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    },
    {
        ...pluginVueA11y.configs['flat/recommended'][0],
        files: ['**/*.vue'],
    },
    skipFormatting,
]);
