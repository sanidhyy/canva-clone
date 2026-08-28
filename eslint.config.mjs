import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  eslintPluginPrettierRecommended,
  {
    settings: {
      react: {
        version: '19.2.4',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'drizzle/**',
    'next-env.d.ts',
    'eslint.config.mjs',
    '.prettierrc.mjs',
    'postcss.config.mjs',
    'next.config.mjs',
  ]),
]);

export default eslintConfig;
