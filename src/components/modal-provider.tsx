'use client';

import { RenameProjectModal } from '@/features/projects/components/rename-project-modal';
import { CancelModal } from '@/features/subscriptions/components/cancel-modal';
import { SubscriptionModal } from '@/features/subscriptions/components/subscription-modal';
import { SuccessModal } from '@/features/subscriptions/components/success-modal';
import { useIsClient } from '@/hooks/use-is-client';

export const ModalProvider = () => {
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <>
      <RenameProjectModal />
      <CancelModal />
      <SubscriptionModal />
      <SuccessModal />
    </>
  );
};
