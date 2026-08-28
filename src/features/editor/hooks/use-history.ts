import * as fabric from 'fabric';
import { useCallback, useRef, useState } from 'react';

import { JSON_KEYS } from '@/features/editor/types';
import { getWorkspace } from '@/features/editor/utils';

interface UseHistoryProps {
  canvas: fabric.Canvas | null;
  saveCallback?: (values: { json: string; height: number; width: number }) => void;
}

export const useHistory = ({ canvas, saveCallback }: UseHistoryProps) => {
  const [historyIndex, setHistoryIndex] = useState(0);

  const canvasHistoryRef = useRef<string[]>([]);
  const skipSave = useRef(false);

  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistoryRef.current.length - 1;
  }, [historyIndex]);

  const save = useCallback(
    (skip = false) => {
      if (!canvas) return;

      const currentState = canvas.toObject(JSON_KEYS);
      const json = JSON.stringify(currentState);

      if (!skip && !skipSave.current) {
        canvasHistoryRef.current.push(json);
        setHistoryIndex(canvasHistoryRef.current.length - 1);
      }

      const workspace = getWorkspace(canvas);
      const height = workspace?.height || 0;
      const width = workspace?.width || 0;

      saveCallback?.({ json, height, width });
    },
    [canvas, saveCallback],
  );

  const undo = useCallback(() => {
    if (canUndo()) {
      skipSave.current = true;
      canvas?.clear();
      canvas?.renderAll();

      const previousIndex = historyIndex - 1;
      const previousState = JSON.parse(canvasHistoryRef.current[previousIndex]);

      void canvas?.loadFromJSON(previousState).then(() => {
        canvas.renderAll();
        setHistoryIndex(previousIndex);
        skipSave.current = false;
      });
    }
  }, [canUndo, canvas, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo()) {
      skipSave.current = true;
      canvas?.clear();
      canvas?.renderAll();

      const nextIndex = historyIndex + 1;
      const nextState = JSON.parse(canvasHistoryRef.current[nextIndex]);

      void canvas?.loadFromJSON(nextState).then(() => {
        canvas.renderAll();
        setHistoryIndex(nextIndex);
        skipSave.current = false;
      });
    }
  }, [canRedo, canvas, historyIndex]);

  return { save, canUndo, canRedo, undo, redo, setHistoryIndex, canvasHistoryRef };
};
