import * as fabric from 'fabric';
import { useEvent } from 'react-use';

interface UseHotkeysProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => void;
  paste: () => void;
}

export const useHotkeys = ({ canvas, undo, redo, save, copy, paste }: UseHotkeysProps) => {
  useEvent('keydown', (event) => {
    const isCtrlKey = event.ctrlKey || event.metaKey;
    const isRemove = event.key === 'Backspace' || event.key === 'Delete';
    const isInput = ['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName);

    if (isInput) return;

    if (isRemove) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }

    if (isCtrlKey && (event.key === 'z' || event.key === 'Z')) {
      event.preventDefault();
      undo();
    }

    if (isCtrlKey && (event.key === 'y' || event.key === 'Y')) {
      event.preventDefault();
      redo();
    }

    if (isCtrlKey && (event.key === 'c' || event.key === 'C')) {
      event.preventDefault();
      copy();
    }

    if (isCtrlKey && (event.key === 'v' || event.key === 'V')) {
      event.preventDefault();
      paste();
    }

    if (isCtrlKey && (event.key === 's' || event.key === 'S')) {
      event.preventDefault();
      save(true);
    }

    if (isCtrlKey && (event.key === 'a' || event.key === 'A')) {
      event.preventDefault();
      canvas?.discardActiveObject();

      const allObjects = canvas?.getObjects().filter((object) => object.selectable) ?? [];

      if (canvas && allObjects.length > 0) {
        canvas.setActiveObject(new fabric.ActiveSelection(allObjects, { canvas }));
        canvas.renderAll();
      }
    }
  });
};
