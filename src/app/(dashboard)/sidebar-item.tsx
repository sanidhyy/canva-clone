import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: LucideIcon | IconType;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarItem = ({ icon: Icon, label, href, isActive, onClick }: SidebarItemProps) => {
  return (
    <Link prefetch href={href} onClick={onClick}>
      <div className={cn('flex items-center rounded-xl bg-transparent p-3 transition hover:bg-white', isActive && 'bg-white')}>
        <Icon className="mr-2 size-4" />

        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};
