/** @type {import('prettier').Config} */
export default {
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/app/globals.css',
  semi: true,
  singleQuote: true,
  printWidth: 140,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
