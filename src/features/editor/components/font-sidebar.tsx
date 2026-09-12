import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type ActiveTool, type Editor, fonts } from '@/features/editor/types';
import { cn } from '@/lib/utils';

import { ToolSidebarClose } from './tool-sidebar-close';
import { ToolSidebarHeader } from './tool-sidebar-header';

interface FontSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FontSidebar = ({ editor, activeTool, onChangeActiveTool }: FontSidebarProps) => {
  const fontFamily = editor?.getActiveFontFamily();

  const onClose = () => onChangeActiveTool('select');

  return (
    <aside className={cn('relative z-40 flex h-full w-90 flex-col border bg-white', activeTool === 'font' ? 'visible' : 'hidden')}>
      <ToolSidebarHeader title="Font" description="Modify the text font." />

      <ScrollArea>
        <div className="space-y-2 border-b p-4">
          {fonts.map((font) => (
            <Button
              key={font}
              variant={fontFamily === font ? 'secondary' : 'outline'}
              size="lg"
              className="h-14 w-full justify-start text-left"
              style={{
                fontFamily: font,
                fontSize: '16px',
                padding: '8px 16px',
              }}
              onClick={() => editor?.changeFontFamily(font)}
            >
              {font}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
