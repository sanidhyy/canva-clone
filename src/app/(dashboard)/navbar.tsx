import { UserButton } from '@/features/auth/components/user-button';

import { Logo } from './logo';
import { MobileSidebar } from './mobile-sidebar';

export const Navbar = () => {
  return (
    <nav className="flex h-17 w-full items-center p-4">
      <Logo className="lg:hidden" />

      <div className="ml-auto flex items-center gap-x-3">
        <UserButton />

        <MobileSidebar />
      </div>
    </nav>
  );
};
