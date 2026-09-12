import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import { db } from '@/db/drizzle';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
