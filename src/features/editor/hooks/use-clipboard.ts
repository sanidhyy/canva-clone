import * as fabric from 'fabric';
import { useCallback, useRef } from 'react';

interface UseClipboardProps {
  canvas: fabric.Canvas | null;
}

export const useClipboard = ({ canvas }: UseClipboardProps) => {
  const clipboard = useRef<fabric.FabricObject | null>(null);

  const copy = useCallback(() => {
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    void activeObject.clone().then((cloned) => {
      clipboard.current = cloned;
    });
  }, [canvas]);

  const paste = useCallback(() => {
    const cloned = clipboard.current;
    if (!cloned || !canvas) return;

    void cloned.clone().then((clonedObject) => {
      canvas.discardActiveObject();
      clonedObject.set({
        left: (clonedObject.left ?? 0) + 10,
        top: (clonedObject.top ?? 0) + 10,
        evented: true,
      });

      if (clonedObject instanceof fabric.ActiveSelection) {
        clonedObject.canvas = canvas;
        clonedObject.forEachObject((object) => {
          canvas.add(object);
        });

        clonedObject.setCoords();
      } else {
        canvas.add(clonedObject);
      }

      cloned.set({
        left: (cloned.left ?? 0) + 10,
        top: (cloned.top ?? 0) + 10,
      });

      canvas.setActiveObject(clonedObject);
      canvas.requestRenderAll();
    });
  }, [canvas]);

  return { copy, paste };
};
