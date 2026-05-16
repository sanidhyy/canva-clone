import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRemoveBg } from '@/features/ai/api/use-remove-bg';
import { type ActiveTool, type Editor } from '@/features/editor/types';
import { usePaywall } from '@/features/subscriptions/hooks/use-paywall';
import { cn } from '@/lib/utils';

import { ToolSidebarClose } from './tool-sidebar-close';
import { ToolSidebarHeader } from './tool-sidebar-header';

interface RemoveBgSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const RemoveBgSidebar = ({ editor, activeTool, onChangeActiveTool }: RemoveBgSidebarProps) => {
  const { shouldBlock, triggerPaywall } = usePaywall();

  const { mutate: removeBg, isPending: isRemovingBg } = useRemoveBg();

  const selectedObject = editor?.selectedObjects[0];

  // @ts-ignore original element attribute types aren't added.
  const imageSrc = selectedObject?._originalElement?.currentSrc;

  const onClose = () => onChangeActiveTool('select');

  const onRemove = () => {
    if (shouldBlock) return triggerPaywall();

    removeBg(
      {
        image: imageSrc,
      },
      {
        onSuccess: ({ data }) => {
          if (data) editor?.addImage(data);
        },
        onError: (error) => {
          console.error(error);
          toast.error('Something went wrong!');
        },
      },
    );
  };

  return (
    <aside
      className={cn('relative z-40 flex h-full w-[360px] flex-col border bg-white', activeTool === 'remove-bg' ? 'visible' : 'hidden')}
    >
      <ToolSidebarHeader title="Background Removal" description="Remove background from image using AI." />

      {imageSrc ? (
        <ScrollArea>
          <div className="space-y-4 p-4">
            <div className={cn('relative aspect-square overflow-hidden rounded-md bg-muted transition', isRemovingBg && 'opacity-50')}>
              <Image src={imageSrc} alt="Selected image" fill className="object-cover" />
            </div>

            <Button disabled={isRemovingBg} onClick={onRemove} className="w-full">
              Remove background
            </Button>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
          <AlertTriangle className="size-4 text-muted-foreground" />

          <p className="text-xs text-muted-foreground">Feature not available for this object.</p>
        </div>
      )}

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
