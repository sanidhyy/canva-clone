import type { Canvas, FabricObject } from 'fabric';
import { useEffect } from 'react';

interface UseCanvasEventsProps {
  canvas: Canvas | null;
  save: () => void;
  setSelectedObjects: (selectedObjects: FabricObject[]) => void;
  clearSelectionCallback?: () => void;
}

export const useCanvasEvents = ({ canvas, save, setSelectedObjects, clearSelectionCallback }: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on('object:added', () => save());
      canvas.on('object:removed', () => save());
      canvas.on('object:modified', () => save());

      canvas.on('selection:created', (e) => {
        setSelectedObjects(e.selected || []);
      });

      canvas.on('selection:updated', (e) => {
        setSelectedObjects(e.selected || []);
      });

      canvas.on('selection:cleared', () => {
        setSelectedObjects([]);
        clearSelectionCallback?.();
      });
    }

    return () => {
      if (canvas) {
        canvas.off('object:added', save);
        canvas.off('object:removed', save);
        canvas.off('object:modified', save);
        canvas.off('selection:created');
        canvas.off('selection:updated');
        canvas.off('selection:cleared');
      }
    };
  }, [
    canvas,
    save,
    setSelectedObjects, // No need, this is from set state
    clearSelectionCallback,
  ]);
};
