import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import { extractRouterConfig } from 'uploadthing/server';

import { appFileRouter } from '@/app/api/uploadthing/core';
import { auth } from '@/auth';
import { ModalProvider } from '@/components/modal-provider';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config';
import { SubscriptionAlert } from '@/features/subscriptions/components/subscription-alert';
import { cn } from '@/lib/utils';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = siteConfig;

const RootLayout = async ({ children }: Readonly<PropsWithChildren>) => {
  const session = await auth();

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={0}>
      <html lang="en">
        <body className={cn(inter.className, 'antialiased')}>
          <Providers>
            <NextSSRPlugin routerConfig={extractRouterConfig(appFileRouter)} />
            <Toaster theme="light" closeButton richColors />
            <ModalProvider />
            <SubscriptionAlert />

            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
};

export default RootLayout;
