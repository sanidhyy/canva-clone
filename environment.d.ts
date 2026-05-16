// This file is needed to support autocomplete for process.env
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // app base url
      NEXT_PUBLIC_APP_BASE_URL: string;

      // unsplash api access key
      NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: string;

      // replicate api token
      REPLICATE_API_TOKEN: string;

      // Added by `npx auth`. Read more: https://cli.authjs.dev
      AUTH_SECRET: string;

      // postgres neon db url
      DATABASE_URL: string;

      // stripe secret key and price id and webhook secret
      STRIPE_SECRET_KEY: string;
      STRIPE_PRICE_ID: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
}
