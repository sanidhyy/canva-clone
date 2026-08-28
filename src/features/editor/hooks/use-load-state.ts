import * as fabric from 'fabric';
import { useEffect, useRef } from 'react';

import { JSON_KEYS } from '@/features/editor/types';

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: React.MutableRefObject<string | undefined>;
  canvasHistory: React.MutableRefObject<string[]>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useLoadState = ({ canvas, autoZoom, initialState, canvasHistory, setHistoryIndex }: UseLoadStateProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialState?.current && canvas) {
      const data = JSON.parse(initialState.current);

      void canvas.loadFromJSON(data).then(() => {
        const currentState = JSON.stringify(canvas.toObject(JSON_KEYS));

        canvasHistory.current = [currentState];
        setHistoryIndex(0);
        autoZoom();
      });

      initialized.current = true;
    }
  }, [
    canvas,
    autoZoom,
    initialState, // No need, this is a ref
    canvasHistory, // No need, this is a ref
    setHistoryIndex, // No need, this is a dispatch
  ]);
};
