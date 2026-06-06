import { verifyAuth } from '@hono/auth-js';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { unsplash } from '@/lib/unsplash';

const DEFAULT_COUNT = 50;
const DEFAULT_COLLECTION_IDS = ['317099'];

const app = new Hono()
  .get('/', verifyAuth(), async (ctx) => {
    const { data: images, error } = await unsplash.GET('/photos/random', {
      params: {
        query: {
          collections: DEFAULT_COLLECTION_IDS,
          count: DEFAULT_COUNT,
        },
      },
    });

    if (error) return ctx.json({ error: 'Something went wrong!' }, 400);

    return ctx.json({ data: !Array.isArray(images) ? [images] : images });
  })
  .post(
    '/download',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        imageId: z.string(),
      }),
    ),
    async (ctx) => {
      const { imageId } = ctx.req.valid('json');

      const { error } = await unsplash.GET('/photos/{id}/download', {
        params: {
          path: {
            id: imageId,
          },
        },
      });

      if (error) return ctx.json({ error: 'Something went wrong!' }, 400);

      return ctx.json({ data: { success: true } });
    },
  );

export default app;
