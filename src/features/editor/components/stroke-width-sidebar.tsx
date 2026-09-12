import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { type ActiveTool, type Editor, STROKE_DASH_ARRAY, STROKE_WIDTH } from '@/features/editor/types';
import { cn } from '@/lib/utils';

import { ToolSidebarClose } from './tool-sidebar-close';
import { ToolSidebarHeader } from './tool-sidebar-header';

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeWidthSidebar = ({ editor, activeTool, onChangeActiveTool }: StrokeWidthSidebarProps) => {
  const width = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const type = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;

  const onClose = () => onChangeActiveTool('select');

  const onChange = (width: number) => {
    editor?.changeStrokeWidth(width);
  };

  const onChangeStrokeType = (strokeDashArray: number[]) => {
    editor?.changeStrokeDashArray(strokeDashArray);
  };

  return (
    <aside className={cn('relative z-40 flex h-full w-90 flex-col border bg-white', activeTool === 'stroke-width' ? 'visible' : 'hidden')}>
      <ToolSidebarHeader title="Stroke options" description="Modify the stroke of your element." />

      <ScrollArea>
        <div className="space-y-4 border-b p-4">
          <Label className="text-sm">Stroke width</Label>

          <Slider value={[width]} onValueChange={(values) => onChange(values[0])} />
        </div>

        <div className="space-y-4 border-b p-4">
          <Label className="text-sm">Stroke type</Label>

          <Button
            onClick={() => onChangeStrokeType(STROKE_DASH_ARRAY)}
            variant={JSON.stringify(type) === JSON.stringify(STROKE_DASH_ARRAY) ? 'secondary' : 'outline'}
            size="lg"
            className="h-16 w-full justify-start text-left"
            style={{
              padding: '8px 16px',
            }}
          >
            <div aria-hidden className="w-full rounded-full border-4 border-black" />
          </Button>

          <Button
            onClick={() => onChangeStrokeType([5, 5])}
            variant={JSON.stringify(type) === JSON.stringify([5, 5]) ? 'secondary' : 'outline'}
            size="lg"
            className="h-16 w-full justify-start text-left"
            style={{
              padding: '8px 16px',
            }}
          >
            <div aria-hidden className="w-full rounded-full border-4 border-dashed border-black" />
          </Button>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
