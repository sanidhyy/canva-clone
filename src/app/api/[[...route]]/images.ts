import { verifyAuth } from '@hono/auth-js';
import { Hono } from 'hono';

import { unsplash } from '@/lib/unsplash';

const DEFAULT_COUNT = 50;
const DEFAULT_COLLECTION_IDS = ['317099'];

const app = new Hono().get('/', verifyAuth(), async (ctx) => {
  const { data: images, error } = await unsplash.GET('/photos/random', {
    params: {
      query: {
        collections: DEFAULT_COLLECTION_IDS,
        count: DEFAULT_COUNT,
      },
    },
  });

  console.log({ error, images });

  if (error) return ctx.json({ error: 'Something went wrong!' }, 400);

  return ctx.json({ data: !Array.isArray(images) ? [images] : images });
});

export default app;
