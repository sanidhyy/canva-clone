import { ScrollArea } from '@/components/ui/scroll-area';
import { type ActiveTool, type Editor, FILL_COLOR } from '@/features/editor/types';
import { cn } from '@/lib/utils';

import { ColorPicker } from './color-picker';
import { ToolSidebarClose } from './tool-sidebar-close';
import { ToolSidebarHeader } from './tool-sidebar-header';

interface FillColorSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FillColorSidebar = ({ editor, activeTool, onChangeActiveTool }: FillColorSidebarProps) => {
  const color = editor?.getActiveFillColor() || FILL_COLOR;

  const onClose = () => onChangeActiveTool('select');

  const onChange = (color: string) => {
    editor?.changeFillColor(color);
  };

  return (
    <aside className={cn('relative z-40 flex h-full w-90 flex-col border bg-white', activeTool === 'fill' ? 'visible' : 'hidden')}>
      <ToolSidebarHeader title="Fill color" description="Add fill color to your element." />

      <ScrollArea>
        <div className="space-y-6 p-4">
          <ColorPicker color={color} onChange={onChange} />
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
