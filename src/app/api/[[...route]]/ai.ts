import { verifyAuth } from '@hono/auth-js';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { API_KEYS_REQUIRED_MESSAGE } from '@/config';
import { createOpenAI } from '@/lib/openai';
import { getUserApiKeys } from '@/lib/user-api-keys';

const app = new Hono().post(
  '/generate-image',
  verifyAuth(),
  zValidator(
    'json',
    z.object({
      prompt: z.string().min(10),
    }),
  ),
  async (ctx) => {
    const apiKeys = await getUserApiKeys();

    if (!apiKeys) {
      return ctx.json({ error: API_KEYS_REQUIRED_MESSAGE }, 400);
    }

    const { prompt } = ctx.req.valid('json');
    const openai = createOpenAI(apiKeys.openaiApiKey);

    const response = await openai.images.generate({
      model: 'gpt-image-2.5-sunburst',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    const b64 = response.data?.[0]?.b64_json;

    if (!b64) return ctx.json({ error: 'Failed to generate image' }, 500);

    return ctx.json({ data: `data:image/png;base64,${b64}` });
  },
);

export default app;
