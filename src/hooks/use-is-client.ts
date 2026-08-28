import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export const useIsClient = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
};
