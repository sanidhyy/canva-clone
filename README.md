<a name="readme-top"></a>

# Canva clone with customizable templates and AI-powered features

![Canva clone with customizable templates and AI-powered features](/.github/images/img_main.png 'Canva clone with customizable templates and AI-powered features')

[![Ask Me Anything!](https://flat.badgen.net/static/Ask%20me/anything?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy 'Ask Me Anything!')
[![GitHub license](https://flat.badgen.net/github/license/sanidhyy/canva-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/canva-clone/blob/main/LICENSE 'GitHub license')
[![Maintenance](https://flat.badgen.net/static/Maintained/yes?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/canva-clone/commits/main 'Maintenance')
[![GitHub branches](https://flat.badgen.net/github/branches/sanidhyy/canva-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/canva-clone/branches 'GitHub branches')
[![Github commits](https://flat.badgen.net/github/commits/sanidhyy/canva-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/canva-clone/commits 'Github commits')
[![GitHub issues](https://flat.badgen.net/github/issues/sanidhyy/canva-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/canva-clone/issues 'GitHub issues')
[![GitHub pull requests](https://flat.badgen.net/github/prs/sanidhyy/canva-clone?icon=github&color=black&scale=1.01)](https://github.com/sanidhyy/canva-clone/pulls 'GitHub pull requests')
[![Vercel status](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://clone-canva.vercel.app/ 'Vercel status')

<!-- Table of Contents -->
<details>

<summary>

# :notebook_with_decorative_cover: Table of Contents

</summary>

- [Folder Structure](#bangbang-folder-structure)
- [Getting Started](#toolbox-getting-started)
- [Screenshots](#camera-screenshots)
- [Tech Stack](#gear-tech-stack)
- [Stats](#wrench-stats)
- [Contribute](#raised_hands-contribute)
- [Acknowledgements](#gem-acknowledgements)
- [Buy Me a Coffee](#coffee-buy-me-a-coffee)
- [Follow Me](#rocket-follow-me)
- [Learn More](#books-learn-more)
- [Deploy on Vercel](#page_with_curl-deploy-on-vercel)
- [Give A Star](#star-give-a-star)
- [Star History](#star2-star-history)
- [Give A Star](#star-give-a-star)

</details>

## :bangbang: Folder Structure

Here is the folder structure of this app.

```bash
canva-clone/
  |- drizzle/
  |- public/
    |-- bg.svg
    |-- car_sale.json
    |-- car_sale.png
    |-- coming_soon.json
    |-- coming_soon.png
    |-- flash_sale.json
    |-- flash_sale.png
    |-- logo.svg
    |-- travel.json
    |-- travel.png
  |- src/
    |-- app/
        |--- (auth)/
        |--- (dashboard)/
        |--- api/
            |---- api/[[...route]]/
            |---- auth/
            |---- uploadthing/
        |--- editor/[projectId]/
        |--- apple-icon.png
        |--- error.tsx
        |--- favicon.ico
        |--- globals.css
        |--- icon1.png
        |--- icon2.png
        |--- layout.tsx
        |--- not-found.tsx
    |-- components/
        |--- ui/
        |--- hint.tsx
        |--- modal-provider.tsx
        |--- providers.tsx
        |--- query-provider.tsx
    |-- config/
        |--- drizzle.ts
        |--- schema.ts
    |-- db/
        |--- index.ts
    |-- features/
        |--- ai/
        |--- auth/
        |--- editor/
        |--- images/
        |--- projects/
        |--- subscriptions/
    |-- hooks/
        |--- use-confirm.tsx
    |-- lib/
        |--- hono.ts
        |--- replicate.ts
        |--- stripe.ts
        |--- unsplash.ts
        |--- uploadthing.ts
        |--- utils.ts
    |-- auth.config.ts
    |-- auth.ts
    |-- middleware.ts
  |- .env.example
  |- .env.local
  |- .eslintrc.json
  |- .gitignore
  |- .prettierrc.json
  |- .prettierrc.mjs
  |- bun.lockb
  |- components.json
  |- drizzle.config.ts
  |- environment.d.ts
  |- next.config.mjs
  |- package.json
  |- postcss.config.js
  |- README.md
  |- tailwind.config.ts
  |- tsconfig.json
```

<br />

## :toolbox: Getting Started

1. Make sure **Git** and **NodeJS** is installed.
2. Clone this repository to your local computer.
3. Create `.env.local` file in **root** directory.
4. Contents of `.env.local`:

```env
# .env.local

# disable next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# app base url
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000

# unsplash api access key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=x-X-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# uploadthing token
UPLOADTHING_TOKEN='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

# replicate api token
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Added by `npx auth`. Read more: https://cli.authjs.dev
AUTH_SECRET="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# github oauth id and secret
AUTH_GITHUB_ID=XXXXXXXXXXXXXXXX
AUTH_GITHUB_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

AUTH_GOOGLE_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="XXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# postgres neon db url
DATABASE_URL="postgresql://<username>:<password>@<hostname>:<port>/image-ai?sslmode=require"

# stripe secret key and price id and webhook secret
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_PRICE_ID=price_XXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

```

### 5. Disable Next.js Telemetry

This disables Next.js telemetry (optional).

- **Variable**: `NEXT_TELEMETRY_DISABLED`
- **Value**: `1` (default for disabling telemetry)

### 6. App Base URL

Set the base URL where your app will be running locally or in production.

### 7. Unsplash API Access Key

To get the `Unsplash API Access Key`, follow these steps:

- Go to [Unsplash Developers](https://unsplash.com/developers).
- Log in with your Unsplash account.
- Create a new application under "Your Applications."
- Copy the **Access Key** from the application details.

### 8. UploadThing Token

To get the UploadThing token:

- Visit [UploadThing](https://uploadthing.com/) and sign up.
- Create a new project which will generate an API token.
- Copy the token.

### 9. Replicate API Token

To get the Replicate API token:

- Sign up at [Replicate](https://replicate.com/).
- Go to your account settings and find the API section.
- Copy the **API token**.

### 10. Auth.js Secret

This is automatically generated by `npx auth` or `bunx auth` and used for session encryption. Keep this secret safe.

### 11. GitHub OAuth Client ID and Secret

To obtain GitHub OAuth credentials:

- Go to [GitHub Developer Settings](https://github.com/settings/developers).
- Create a new OAuth app:
  - Homepage URL: Your app's base URL (e.g., `http://localhost:3000`).
  - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`.
- After creation, you'll get **Client ID** and **Client Secret**.

### 12. Google OAuth Client ID and Secret

To obtain Google OAuth credentials:

- Visit the [Google Cloud Console](https://console.cloud.google.com/).
- Create a new project and configure **OAuth consent screen** with default settings.
- Create **OAuth 2.0 credentials**:
  - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`.
- After creation, you'll receive a **Client ID** and **Client Secret**.

### 13. PostgreSQL Neon Database URL

To get the Neon PostgreSQL database URL:

- Sign up at [Neon](https://neon.tech/).
- Create a new database and retrieve the connection URL.
  - Replace `<username>`, `<password>`, `<hostname>`, `<port>` in the URL.
- Ensure SSL mode is enabled (`sslmode=require`).

### 14. Stripe API Keys

To get the Stripe API keys:

- Sign up at [Stripe](https://dashboard.stripe.com/).
- Create a new account or use an existing one.
- Go to **Developers** → **API keys** to get your **Secret Key**.
- To create a **Price ID**, navigate to **Products** → **Create a Product** and set a price.
- For **Webhook Secret**, set up a webhook in **Developers** → **Webhooks**:
  - Endpoint: `http://localhost:3000/api/subscriptions/webhook`.

15. Install Project Dependencies using `npm install --legacy-peer-deps` or `yarn install --legacy-peer-deps` or `bun install --legacy-peer-deps`.

16. Now app is fully configured 👍 and you can start using this app using either one of `npm run dev` or `yarn dev` or `bun dev`.

**NOTE:** Please make sure to keep your API keys and configuration values secure and do not expose them publicly.

## :camera: Screenshots

![Modern UI/UX](/.github/images/img1.png 'Modern UI/UX')

![Fully functional Fabric.js editor](/.github/images/img2.png 'Fully functional Fabric.js editor')

![Multi Template Feature](/.github/images/img3.png 'Multi Template Feature')

![Unsplash Images and Custom Upload Support](/.github/images/img4.png 'Unsplash Images and Custom Upload Support')

## :gear: Tech Stack

[![React JS](https://skillicons.dev/icons?i=react 'React JS')](https://react.dev/ 'React JS') [![Next JS](https://skillicons.dev/icons?i=next 'Next JS')](https://nextjs.org/ 'Next JS') [![Typescript](https://skillicons.dev/icons?i=ts 'Typescript')](https://www.typescriptlang.org/ 'Typescript') [![PostgreSQL](https://skillicons.dev/icons?i=postgres 'PostgreSQL')](https://www.postgresql.org/ 'PostgreSQL') [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind 'Tailwind CSS')](https://tailwindcss.com/ 'Tailwind CSS') [![Vercel](https://skillicons.dev/icons?i=vercel 'Vercel')](https://vercel.app/ 'Vercel')

## :wrench: Stats

[![Stats for Canva Clone](/.github/images/stats.svg 'Stats for Canva Clone')](https://pagespeed.web.dev/analysis?url=https://clone-canva.vercel.app/ 'Stats for Canva Clone')

## :raised_hands: Contribute

You might encounter some bugs while using this app. You are more than welcome to contribute. Just submit changes via pull request and I will review them before merging. Make sure you follow community guidelines.

## :gem: Acknowledgements

Useful resources and dependencies that are used in Canva Clone.

- Thanks to CodeWithAntonio: https://codewithantonio.com/
- [@auth/core](https://www.npmjs.com/package/@auth/core): ^0.37.0
- [@auth/drizzle-adapter](https://www.npmjs.com/package/@auth/drizzle-adapter): ^1.7.0
- [@hono/auth-js](https://www.npmjs.com/package/@hono/auth-js): ^1.0.11
- [@hono/zod-validator](https://www.npmjs.com/package/@hono/zod-validator): ^0.4.1
- [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless): ^0.10.1
- [@paralleldrive/cuid2](https://www.npmjs.com/package/@paralleldrive/cuid2): ^2.2.2
- [@radix-ui/react-alert-dialog](https://www.npmjs.com/package/@radix-ui/react-alert-dialog): ^1.1.2
- [@radix-ui/react-avatar](https://www.npmjs.com/package/@radix-ui/react-avatar): ^1.1.1
- [@radix-ui/react-dialog](https://www.npmjs.com/package/@radix-ui/react-dialog): ^1.1.2
- [@radix-ui/react-dropdown-menu](https://www.npmjs.com/package/@radix-ui/react-dropdown-menu): ^2.1.2
- [@radix-ui/react-label](https://www.npmjs.com/package/@radix-ui/react-label): ^2.1.0
- [@radix-ui/react-scroll-area](https://www.npmjs.com/package/@radix-ui/react-scroll-area): ^1.2.0
- [@radix-ui/react-separator](https://www.npmjs.com/package/@radix-ui/react-separator): ^1.1.0
- [@radix-ui/react-slider](https://www.npmjs.com/package/@radix-ui/react-slider): ^1.2.1
- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot): ^1.1.0
- [@radix-ui/react-tooltip](https://www.npmjs.com/package/@radix-ui/react-tooltip): ^1.1.3
- [@radix-ui/react-visually-hidden](https://www.npmjs.com/package/@radix-ui/react-visually-hidden): ^1.1.0
- [@tanstack/react-query](https://www.npmjs.com/package/@tanstack/react-query): ^5.59.13
- [@uploadthing/react](https://www.npmjs.com/package/@uploadthing/react): ^7.0.3
- [bcryptjs](https://www.npmjs.com/package/bcryptjs): ^2.4.3
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority): ^0.7.0
- [clsx](https://www.npmjs.com/package/clsx): ^2.1.1
- [crypto](https://www.npmjs.com/package/crypto): ^1.0.1
- [date-fns](https://www.npmjs.com/package/date-fns): ^4.1.0
- [drizzle-orm](https://www.npmjs.com/package/drizzle-orm): ^0.35.1
- [drizzle-zod](https://www.npmjs.com/package/drizzle-zod): ^0.5.1
- [fabric](https://www.npmjs.com/package/fabric): 5.3.0-browser
- [hono](https://www.npmjs.com/package/hono): ^4.6.4
- [jsdom](https://www.npmjs.com/package/jsdom): ^25.0.1
- [lodash.debounce](https://www.npmjs.com/package/lodash.debounce): ^4.0.8
- [lucide-react](https://www.npmjs.com/package/lucide-react): ^0.447.0
- [material-colors](https://www.npmjs.com/package/material-colors): ^1.2.6
- [next](https://www.npmjs.com/package/next): 14.2.14
- [next-auth](https://www.npmjs.com/package/next-auth): ^5.0.0-beta.22
- [next-themes](https://www.npmjs.com/package/next-themes): ^0.3.0
- [react](https://www.npmjs.com/package/react): ^18
- [react-color](https://www.npmjs.com/package/react-color): ^2.19.3
- [react-dom](https://www.npmjs.com/package/react-dom): ^18
- [react-icons](https://www.npmjs.com/package/react-icons): ^5.3.0
- [react-use](https://www.npmjs.com/package/react-use): ^17.5.1
- [replicate](https://www.npmjs.com/package/replicate): ^1.0.0
- [sonner](https://www.npmjs.com/package/sonner): ^1.5.0
- [stripe](https://www.npmjs.com/package/stripe): ^17.2.1
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge): ^2.5.3
- [tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate): ^1.0.7
- [unsplash-js](https://www.npmjs.com/package/unsplash-js): ^7.0.19
- [uploadthing](https://www.npmjs.com/package/uploadthing): ^7.1.0
- [use-file-picker](https://www.npmjs.com/package/use-file-picker): ^2.1.2
- [zod](https://www.npmjs.com/package/zod): ^3.23.8
- [zustand](https://www.npmjs.com/package/zustand): ^5.0.0
- [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser): ^7.25.7
- [@trivago/prettier-plugin-sort-imports](https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports): ^4.3.0
- [@types/bcryptjs](https://www.npmjs.com/package/@types/bcryptjs): ^2.4.6
- [@types/fabric](https://www.npmjs.com/package/@types/fabric): 5.3.0
- [@types/lodash.debounce](https://www.npmjs.com/package/@types/lodash.debounce): ^4.0.9
- [@types/material-colors](https://www.npmjs.com/package/@types/material-colors): ^1.2.3
- [@types/node](https://www.npmjs.com/package/@types/node): ^20
- [@types/react](https://www.npmjs.com/package/@types/react): ^18
- [@types/react-color](https://www.npmjs.com/package/@types/react-color): ^3.0.12
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom): ^18
- [dotenv](https://www.npmjs.com/package/dotenv): ^16.4.5
- [drizzle-kit](https://www.npmjs.com/package/drizzle-kit): ^0.26.2
- [eslint](https://www.npmjs.com/package/eslint): ^8
- [eslint-config-next](https://www.npmjs.com/package/eslint-config-next): 14.2.14
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier): ^9.1.0
- [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier): ^5.2.1
- [pg](https://www.npmjs.com/package/pg): ^8.13.0
- [postcss](https://www.npmjs.com/package/postcss): ^8
- [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss): ^0.6.8
- [sort-classes](https://www.npmjs.com/package/sort-classes): npm:prettier-plugin-tailwindcss
- [tailwindcss](https://www.npmjs.com/package/tailwindcss): ^3.4.1
- [tidy-imports](https://www.npmjs.com/package/tidy-imports): npm:@trivago/prettier-plugin-sort-imports
- [typescript](https://www.npmjs.com/package/typescript): ^5.6.2

## :coffee: Buy Me a Coffee

[<img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" width="200" />](https://www.buymeacoffee.com/sanidhy 'Buy me a Coffee')

## :rocket: Follow Me

[![Follow Me](https://img.shields.io/github/followers/sanidhyy?style=social&label=Follow&maxAge=2592000)](https://github.com/sanidhyy 'Follow Me')
[![Tweet about this project](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FTechnicalShubam)](https://twitter.com/intent/tweet?text=Check+out+this+amazing+app:&url=https%3A%2F%2Fgithub.com%2Fsanidhyy%2Fcanva-clone 'Tweet about this project')
[![Subscribe to my YouTube Channel](https://img.shields.io/youtube/channel/subscribers/UCNAz_hUVBG2ZUN8TVm0bmYw)](https://www.youtube.com/@OPGAMER./?sub_confirmation=1 'Subscribe to my YouTube Channel')

## :books: Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## :page_with_curl: Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## :star: Give A Star

You can also give this repository a star to show more people and they can use this repository.

## :star2: Star History

<a href="https://star-history.com/#sanidhyy/canva-clone&Timeline">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=sanidhyy/canva-clone&type=Timeline&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=sanidhyy/canva-clone&type=Timeline" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=sanidhyy/canva-clone&type=Timeline" />
</picture>
</a>

<br />
<p align="right">(<a href="#readme-top">back to top</a>)</p>
