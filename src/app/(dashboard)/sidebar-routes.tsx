'use client';

import { CreditCard, Crown, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsGithub } from 'react-icons/bs';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { links } from '@/config';
import { useBilling } from '@/features/subscriptions/api/use-billing';
import { usePaywall } from '@/features/subscriptions/hooks/use-paywall';

import { SidebarItem } from './sidebar-item';

interface SidebarRoutesProps {
  onClick?: () => void;
}

export const SidebarRoutes = ({ onClick = () => {} }: SidebarRoutesProps) => {
  const pathname = usePathname();
  const { shouldBlock, triggerPaywall, isLoading } = usePaywall();
  const { mutate: checkoutBilling } = useBilling();

  const handleBilling = () => {
    onClick();

    if (shouldBlock) return triggerPaywall();

    checkoutBilling();
  };

  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <div className="px-3">
        {shouldBlock && (
          <>
            <Button
              onClick={() => {
                onClick();
                triggerPaywall();
              }}
              disabled={isLoading}
              className="w-full rounded-xl border-none transition hover:bg-white hover:opacity-75"
              variant="outline"
              size="lg"
            >
              <Crown className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
              Upgrade to Image AI Pro
            </Button>

            <div className="px-3">
              <Separator />
            </div>
          </>
        )}
      </div>

      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem href="/" label="Home" icon={Home} onClick={onClick} isActive={pathname === '/'} />
      </ul>

      <div className="px-3">
        <Separator />
      </div>

      <ul className="flex flex-col gap-y-1 px-3">
        {!shouldBlock && <SidebarItem href={pathname} label="Billing" icon={CreditCard} onClick={handleBilling} />}

        <Link prefetch href={links.sourceCode} onClick={onClick} target="_blank" rel="noreferrer noopener">
          <div className="flex items-center rounded-xl bg-transparent p-3 transition hover:bg-white">
            <BsGithub className="mr-2 size-4" />

            <span className="text-sm font-medium">Source Code</span>
          </div>
        </Link>
      </ul>
    </div>
  );
};
