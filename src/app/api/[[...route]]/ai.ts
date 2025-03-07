import { verifyAuth } from '@hono/auth-js';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { replicate } from '@/lib/replicate';

const app = new Hono()
  .post(
    '/remove-bg',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        image: z.string(),
      }),
    ),
    async (ctx) => {
      const { image } = ctx.req.valid('json');

      const output: unknown = await replicate.run('cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003', {
        input: {
          image,
        },
      });

      const res = output as string;

      return ctx.json({ data: res });
    },
  )
  .post(
    '/generate-image',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        prompt: z.string().min(10),
      }),
    ),
    async (ctx) => {
      const { prompt } = ctx.req.valid('json');

      const output: unknown = await replicate.run(
        'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
        {
          input: {
            prompt,
            scheduler: 'K_EULER',
          },
        },
      );

      const res = output as Array<string>;

      return ctx.json({ data: res[0] });
    },
  );

export default app;
