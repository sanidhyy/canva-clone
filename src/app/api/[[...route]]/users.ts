import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { users } from '@/db/schema';

const app = new Hono().post(
  '/',
  zValidator(
    'json',
    z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(3).max(24),
    }),
  ),
  async (ctx) => {
    const { name, email, password } = ctx.req.valid('json');

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser[0]) return ctx.json({ error: 'Email already in use.' }, 400);

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    return ctx.json(null);
  },
);

export default app;
