import { Minimize, ZoomIn, ZoomOut } from 'lucide-react';

import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import type { Editor } from '@/features/editor/types';

interface FooterProps {
  editor: Editor | undefined;
}

export const Footer = ({ editor }: FooterProps) => {
  return (
    <footer className="z-49 flex h-[52px] w-full shrink-0 flex-row-reverse items-center gap-x-1 overflow-x-auto border-t bg-white p-2 px-4">
      <Hint label="Reset" side="top" sideOffset={10}>
        <Button onClick={() => editor?.autoZoom()} size="icon" variant="ghost" className="h-full">
          <Minimize className="size-4" />
        </Button>
      </Hint>

      <Hint label="Zoom in" side="top" sideOffset={10}>
        <Button onClick={() => editor?.zoomIn()} size="icon" variant="ghost" className="h-full">
          <ZoomIn className="size-4" />
        </Button>
      </Hint>

      <Hint label="Zoom out" side="top" sideOffset={10}>
        <Button onClick={() => editor?.zoomOut()} size="icon" variant="ghost" className="h-full">
          <ZoomOut className="size-4" />
        </Button>
      </Hint>
    </footer>
  );
};
