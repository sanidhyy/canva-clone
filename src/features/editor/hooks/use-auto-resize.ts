import * as fabric from 'fabric';
import { useCallback, useEffect } from 'react';

import { getWorkspace } from '@/features/editor/utils';

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.setDimensions({ width, height });

    const center = canvas.getCenterPoint();

    const zoomRatio = 0.85;
    const localWorkspace = getWorkspace(canvas);

    if (!localWorkspace) return;

    const scale = fabric.util.findScaleToFit(localWorkspace, {
      width,
      height,
    });

    const zoom = zoomRatio * scale;

    canvas.setViewportTransform([...fabric.iMatrix]);
    canvas.zoomToPoint(center, zoom);

    const workspaceCenter = localWorkspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;

    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;

    viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];

    viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

    canvas.setViewportTransform(viewportTransform);

    void localWorkspace.clone().then((cloned) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        autoZoom();
      });

      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};
