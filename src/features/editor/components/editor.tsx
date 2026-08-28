'use client';

import * as fabric from 'fabric';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useEditor } from '@/features/editor/hooks/use-editor';
import { type ActiveTool, selectionDependentTools } from '@/features/editor/types';
import type { ResponseType } from '@/features/projects/api/use-get-project';
import { useUpdateProject } from '@/features/projects/api/use-update-project';

import { AiSidebar } from './ai-sidebar';
import { DrawSidebar } from './draw-sidebar';
import { FillColorSidebar } from './fill-color-sidebar';
import { FilterSidebar } from './filter-sidebar';
import { FontSidebar } from './font-sidebar';
import { Footer } from './footer';
import { ImageSidebar } from './image-sidebar';
import { Navbar } from './navbar';
import { RemoveBgSidebar } from './remove-bg-sidebar';
import { SettingsSidebar } from './settings-sidebar';
import { ShapeSidebar } from './shape-sidebar';
import { Sidebar } from './sidebar';
import { StrokeColorSidebar } from './stroke-color-sidebar';
import { OpacitySidebar } from './stroke-opacity-sidebar';
import { StrokeWidthSidebar } from './stroke-width-sidebar';
import { TemplateSidebar } from './template-sidebar';
import { TextSidebar } from './text-sidebar';
import { Toolbar } from './toolbar';

interface EditorProps {
  initialData: ResponseType;
}

export const Editor = ({ initialData }: EditorProps) => {
  const { mutate: updateProject } = useUpdateProject(initialData.id);

  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((values: { json: string; height: number; width: number }) => {
      updateProject(values);
    }, 500),
    [updateProject],
  );

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) setActiveTool('select');
  }, [activeTool]);

  const { init, editor } = useEditor({
    defaultState: initialData.json,
    defaultWidth: initialData.width,
    defaultHeight: initialData.height,
    clearSelectionCallback: onClearSelection,
    saveCallback: debouncedSave,
  });

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === 'draw') {
        editor?.enableDrawingMode();
      }

      if (activeTool === 'draw') {
        editor?.disableDrawingMode();
      }

      if (tool === activeTool) return setActiveTool('select');

      setActiveTool(tool);
    },
    [activeTool, editor],
  );

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const containerEl = containerRef.current;
    if (!canvasEl || !containerEl) return;

    const canvas = new fabric.Canvas(canvasEl, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerEl,
    });

    return () => {
      void canvas.dispose();
    };
  }, [init]);

  return (
    <div className="flex h-full flex-col">
      <Navbar
        id={initialData.id}
        title={initialData.name}
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />

      <div className="absolute top-[68px] flex h-[calc(100%_-_68px)] w-full">
        <Sidebar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <ShapeSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <FillColorSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <StrokeColorSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <StrokeWidthSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <OpacitySidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <TextSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <FontSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <ImageSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <FilterSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <AiSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <RemoveBgSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <DrawSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <SettingsSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
        <TemplateSidebar editor={editor} activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />

        <main className="relative flex flex-1 flex-col overflow-auto bg-muted">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />

          <div className="h-[calc(100%_-_124px)] flex-1 bg-muted" ref={containerRef}>
            <canvas ref={canvasRef} />
          </div>

          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
};
