import { verifyAuth } from '@hono/auth-js';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import Stripe from 'stripe';

import { db } from '@/db/drizzle';
import { subscriptions } from '@/db/schema';
import { checkIsActive } from '@/features/subscriptions/utils';
import { stripe } from '@/lib/stripe';

const app = new Hono()
  .post('/billing', verifyAuth(), async (ctx) => {
    const auth = ctx.get('authUser');

    if (!auth.token?.id || !auth.token?.email) {
      return ctx.json('Unauthorized!', 401);
    }

    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, auth.token.id));

    if (!subscription) {
      return ctx.json('No subscription found.', 404);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: process.env.NEXT_PUBLIC_APP_BASE_URL!,
    });

    if (!session.url) {
      return ctx.json('Failed to create session!', 400);
    }

    return ctx.json(session.url);
  })
  .get('/current', verifyAuth(), async (ctx) => {
    const auth = ctx.get('authUser');

    if (!auth.token?.id || !auth.token?.email) {
      return ctx.json('Unauthorized!', 401);
    }

    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, auth.token.id));

    const active = checkIsActive(subscription);

    return ctx.json({ ...subscription, active });
  })
  .post('/checkout', verifyAuth(), async (ctx) => {
    const auth = ctx.get('authUser');

    if (!auth.token?.id || !auth.token?.email) {
      return ctx.json('Unauthorized!', 401);
    }

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}?canceled=1`,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: auth.token.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: auth.token.id,
      },
    });

    const url = session.url;

    if (!url) return ctx.json('Failed to create session!', 400);

    return ctx.json(url);
  })
  .post('/webhook', async (ctx) => {
    const body = await ctx.req.text();
    const signature = ctx.req.header('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      return ctx.json('Invalid signature!', 400);
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (!session?.metadata?.userId) return ctx.json(null);

    if (event.type === 'checkout.session.completed') {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      await db.insert(subscriptions).values({
        status: subscription.status,
        userId: session.metadata.userId,
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
        priceId: subscription.items.data[0].price.product as string,
        currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (event.type === 'invoice.payment_succeeded') {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, subscription.id));
    }

    return ctx.json(null);
  });

export default app;
