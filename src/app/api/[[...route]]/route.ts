import { initAuthConfig } from '@hono/auth-js';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import authConfig from '@/auth.config';

import ai from './ai';
import images from './images';
import projects from './projects';
import subscriptions from './subscriptions';
import users from './users';

export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

app.use(
  '*',
  initAuthConfig(() => authConfig),
);

const routes = app
  .route('/ai', ai)
  .route('/images', images)
  .route('/projects', projects)
  .route('/subscriptions', subscriptions)
  .route('/users', users);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
