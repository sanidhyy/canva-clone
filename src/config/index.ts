import type { Metadata } from 'next';

export const siteConfig: Metadata = {
  title: 'Image AI',
  description: 'Canva clone with customizable templates and AI-powered features for effortless visual creation.',
  keywords: [
    'reactjs',
    'nextjs',
    'postgresql',
    'postgres',
    'next-auth',
    'react-color',
    'lucide-icons',
    'react-icons',
    'color-picker',
    'shadcn-ui',
    'radix-ui',
    'tailwindcss',
    'lodash',
    'react-query',
    'zustand',
    'sonner',

    'typescript',
    'javascript',
    'vercel',
    'postcss',
    'prettier',
    'eslint',
    'react-dom',
    'html',
    'css',

    'zustand-state-management',
    'infinite-query',
    'real-time-features',
    'ai-features',
    'ai-background-remover',
    'ai-image-generator',
    'ai-generator',
    'ui/ux',
    'neon-db',
    'canva-clone',

    'date-fns',
    'cn',
    'clsx',
    'lucide-react',
  ] as Array<string>,
  authors: {
    name: 'Sanidhya Kumar Verma',
    url: 'https://github.com/sanidhyy',
  },
} as const;

export const links = {
  sourceCode: 'https://github.com/sanidhyy/canva-clone',
} as const;

export const API_KEYS_REQUIRED_MESSAGE = 'Add your OpenAI API key in Settings to use AI image generation.';
