import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type ActiveTool, type Editor } from '@/features/editor/types';
import { cn } from '@/lib/utils';

import { ColorPicker } from './color-picker';
import { ToolSidebarClose } from './tool-sidebar-close';
import { ToolSidebarHeader } from './tool-sidebar-header';

interface SettingsSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const SettingsSidebar = ({ editor, activeTool, onChangeActiveTool }: SettingsSidebarProps) => {
  const workspace = editor?.getWorkspace();

  const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
  const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
  const initialBackground = useMemo(() => workspace?.fill ?? '#fff', [workspace]);

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [background, setBackground] = useState(initialBackground);
  const [prevInitialWidth, setPrevInitialWidth] = useState(initialWidth);
  const [prevInitialHeight, setPrevInitialHeight] = useState(initialHeight);
  const [prevInitialBackground, setPrevInitialBackground] = useState(initialBackground);

  if (initialWidth !== prevInitialWidth) {
    setPrevInitialWidth(initialWidth);
    setWidth(initialWidth);
  }

  if (initialHeight !== prevInitialHeight) {
    setPrevInitialHeight(initialHeight);
    setHeight(initialHeight);
  }

  if (initialBackground !== prevInitialBackground) {
    setPrevInitialBackground(initialBackground);
    setBackground(initialBackground);
  }

  const changeWidth = (width: string) => setWidth(width);
  const changeHeight = (height: string) => setHeight(height);
  const changeBackground = (background: string) => {
    setBackground(background);
    editor?.changeBackground(background);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editor?.changeSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
  };

  const onClose = () => onChangeActiveTool('select');

  return (
    <aside className={cn('relative z-40 flex h-full w-[360px] flex-col border bg-white', activeTool === 'settings' ? 'visible' : 'hidden')}>
      <ToolSidebarHeader title="Settings" description="Change the look of your workspace." />

      <ScrollArea>
        <form className="space-y-4 p-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Height</Label>
            <Input placeholder="Height" min={100} max={5000} value={height} type="number" onChange={(e) => changeHeight(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Width</Label>
            <Input placeholder="Width" min={100} max={5000} value={width} type="number" onChange={(e) => changeWidth(e.target.value)} />
          </div>

          <Button type="submit" className="w-full">
            Resize
          </Button>
        </form>

        <div className="border-t p-4">
          <ColorPicker
            color={background as string} // Gradients and patterns are not passed.
            onChange={changeBackground}
          />
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
