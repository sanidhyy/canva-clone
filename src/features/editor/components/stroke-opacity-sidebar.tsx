import { useMemo, useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { type ActiveTool, type Editor } from '@/features/editor/types';
import { cn } from '@/lib/utils';

import { ToolSidebarClose } from './tool-sidebar-close';
import { ToolSidebarHeader } from './tool-sidebar-header';

interface OpacitySidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const OpacitySidebar = ({ editor, activeTool, onChangeActiveTool }: OpacitySidebarProps) => {
  const selectedObject = useMemo(() => editor?.selectedObjects[0], [editor?.selectedObjects]);
  const selectedOpacity = selectedObject?.get('opacity') || 1;
  const [opacity, setOpacity] = useState(selectedOpacity);
  const [prevSelectedObject, setPrevSelectedObject] = useState(selectedObject);

  if (selectedObject !== prevSelectedObject) {
    setPrevSelectedObject(selectedObject);
    setOpacity(selectedOpacity);
  }

  const onClose = () => onChangeActiveTool('select');

  const onChange = (opacity: number) => {
    editor?.changeOpacity(opacity);
    setOpacity(opacity);
  };

  return (
    <aside className={cn('relative z-40 flex h-full w-[360px] flex-col border bg-white', activeTool === 'opacity' ? 'visible' : 'hidden')}>
      <ToolSidebarHeader title="Opacity" description="Change the opacity of the selected element." />

      <ScrollArea>
        <div className="space-y-4 border-b p-4">
          <Slider value={[opacity]} onValueChange={(values) => onChange(values[0])} max={1} min={0} step={0.01} />
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
