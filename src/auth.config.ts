import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { NextAuthConfig } from 'next-auth';
import 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { users } from '@/db/schema';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string | undefined;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string | undefined;
  }
}

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) return null;

        return user;
      },
    }),
    GitHub,
    Google,
  ],
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: ({ session, token }) => {
      if (token.id) session.user.id = token.id;

      return session;
    },
    jwt: ({ token, user }) => {
      if (user) token.id = user.id;

      return token;
    },
  },
} satisfies NextAuthConfig;
