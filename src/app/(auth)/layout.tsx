import type { PropsWithChildren } from 'react';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-full flex-col bg-[url(/bg.jpg)] bg-cover bg-top">
      <div className="z-4 flex size-full flex-col items-center justify-center">
        <div className="size-full md:h-auto md:w-[420px]">{children}</div>
      </div>

      <div aria-hidden className="fixed inset-0 z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.8),rgba(0,0,0,0.4),rgba(0,0,0,0.8))]" />
    </div>
  );
};

export default AuthLayout;
