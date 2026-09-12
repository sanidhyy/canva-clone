'use client';

import type { Canvas, TMat2D } from 'fabric';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type Editor, MAX_ZOOM, MIN_ZOOM } from '@/features/editor/types';
import { centerOrClampViewport, getWorkspace } from '@/features/editor/utils';

const TRACK_THICKNESS = 8;
const TRACK_EDGE = 4; // distance from container edge (cross axis)
const TRACK_INSET_START = 8; // gap before the track starts
const TRACK_INSET_END = 20; // gap after the track ends (leaves room for the other bar)
const MIN_THUMB_SIZE = 24;

type Axis = 'horizontal' | 'vertical';

interface AxisMetrics {
  axis: Axis;
  zoom: number;
  unionPos: number;
  scrollableSceneSize: number;
  thumbSize: number;
  thumbOffset: number;
  maxThumbOffset: number;
}

interface ThumbDisplay {
  size: number;
  offset: number;
}

interface DragState {
  metrics: AxisMetrics;
  startClient: number;
  startThumbOffset: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const computeAxisMetrics = (canvas: Canvas, axis: Axis): AxisMetrics | null => {
  const workspace = getWorkspace(canvas);
  if (!workspace) return null;

  const isHorizontal = axis === 'horizontal';
  const vpt = canvas.viewportTransform;
  const zoom = isHorizontal ? vpt[0] : vpt[3];
  if (!zoom) return null;

  // Visible region of the scene, derived from the viewport transform.
  const viewportSize = (isHorizontal ? canvas.getWidth() : canvas.getHeight()) / zoom;
  const viewportPos = -(isHorizontal ? vpt[4] : vpt[5]) / zoom;

  // Workspace bounds in scene coordinates.
  const bounds = workspace.getBoundingRect();
  const contentPos = isHorizontal ? bounds.left : bounds.top;
  const contentSize = isHorizontal ? bounds.width : bounds.height;

  const unionPos = Math.min(viewportPos, contentPos);
  const unionEnd = Math.max(viewportPos + viewportSize, contentPos + contentSize);
  const unionSize = unionEnd - unionPos;
  const scrollableSceneSize = unionSize - viewportSize;

  // No scrollbar unless the content overflows the viewport by more than a pixel.
  if (scrollableSceneSize * zoom <= 1) return null;

  const trackLength = (isHorizontal ? canvas.getWidth() : canvas.getHeight()) - TRACK_INSET_START - TRACK_INSET_END;
  if (trackLength <= MIN_THUMB_SIZE) return null;

  const thumbSize = Math.max((viewportSize / unionSize) * trackLength, MIN_THUMB_SIZE);
  const maxThumbOffset = trackLength - thumbSize;
  const thumbOffset = clamp((viewportPos - unionPos) / scrollableSceneSize, 0, 1) * maxThumbOffset;

  return { axis, zoom, unionPos, scrollableSceneSize, thumbSize, thumbOffset, maxThumbOffset };
};

const applyThumbOffset = (canvas: Canvas, metrics: AxisMetrics, thumbOffset: number) => {
  const clamped = clamp(thumbOffset, 0, metrics.maxThumbOffset);
  const scenePos = metrics.unionPos + (metrics.maxThumbOffset ? (clamped / metrics.maxThumbOffset) * metrics.scrollableSceneSize : 0);

  const vpt: TMat2D = [...canvas.viewportTransform];
  vpt[metrics.axis === 'horizontal' ? 4 : 5] = -scenePos * metrics.zoom;

  canvas.setViewportTransform(vpt);
  canvas.requestRenderAll();
};

const panAxisBy = (canvas: Canvas, axis: Axis, deltaPx: number): boolean => {
  if (!deltaPx) return false;

  const metrics = computeAxisMetrics(canvas, axis);
  if (!metrics) return false;

  const index = axis === 'horizontal' ? 4 : 5;
  const vpt: TMat2D = [...canvas.viewportTransform];
  const viewportPos = -vpt[index] / metrics.zoom;
  const next = clamp(viewportPos + deltaPx / metrics.zoom, metrics.unionPos, metrics.unionPos + metrics.scrollableSceneSize);

  if (next !== viewportPos) {
    vpt[index] = -next * metrics.zoom;
    canvas.setViewportTransform(vpt);
    canvas.requestRenderAll();
  }

  return true;
};

const toDisplay = (metrics: AxisMetrics | null): ThumbDisplay | null =>
  metrics
    ? {
        size: Math.round(metrics.thumbSize * 2) / 2,
        offset: Math.round(metrics.thumbOffset * 2) / 2,
      }
    : null;

const displaysEqual = (a: ThumbDisplay | null, b: ThumbDisplay | null) =>
  a === b || (!!a && !!b && a.size === b.size && a.offset === b.offset);

interface CanvasScrollbarsProps {
  editor: Editor | undefined;
}

export const CanvasScrollbars = ({ editor }: CanvasScrollbarsProps) => {
  const canvas = editor?.canvas;

  const [horizontal, setHorizontal] = useState<ThumbDisplay | null>(null);
  const [vertical, setVertical] = useState<ThumbDisplay | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const sync = useCallback(() => {
    if (!canvas) return;

    const nextHorizontal = toDisplay(computeAxisMetrics(canvas, 'horizontal'));
    const nextVertical = toDisplay(computeAxisMetrics(canvas, 'vertical'));

    setHorizontal((prev) => (displaysEqual(prev, nextHorizontal) ? prev : nextHorizontal));
    setVertical((prev) => (displaysEqual(prev, nextVertical) ? prev : nextVertical));
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    canvas.on('after:render', sync);
    canvas.requestRenderAll();

    return () => {
      canvas.off('after:render', sync);
    };
  }, [canvas, sync]);

  useEffect(() => {
    if (!canvas) return;

    const onMouseWheel = ({ e: event }: { e: WheelEvent }) => {
      // Normalize line-based deltas (e.g. Firefox mouse wheels) to pixels.
      const scale = event.deltaMode === 1 ? 16 : 1;
      let deltaX = event.deltaX * scale;
      let deltaY = event.deltaY * scale;

      // Ctrl + wheel (or trackpad pinch) zooms towards the cursor.
      if (event.ctrlKey || event.metaKey) {
        const zoom = clamp(canvas.getZoom() * 0.999 ** deltaY, MIN_ZOOM, MAX_ZOOM);

        canvas.zoomToPoint(canvas.getViewportPoint(event), zoom);
        centerOrClampViewport(canvas);

        event.preventDefault();
        event.stopPropagation();

        return;
      }

      // Shift + wheel scrolls horizontally (when the browser hasn't already swapped the axes).
      if (event.shiftKey && !deltaX) {
        deltaX = deltaY;
        deltaY = 0;
      }

      const handledX = panAxisBy(canvas, 'horizontal', deltaX);
      const handledY = panAxisBy(canvas, 'vertical', deltaY);

      if (handledX || handledY) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    canvas.on('mouse:wheel', onMouseWheel);

    return () => {
      canvas.off('mouse:wheel', onMouseWheel);
    };
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const client = drag.metrics.axis === 'horizontal' ? event.clientX : event.clientY;
      applyThumbOffset(canvas, drag.metrics, drag.startThumbOffset + (client - drag.startClient));
    };

    const onPointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [canvas]);

  const onThumbPointerDown = (axis: Axis, event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!canvas) return;

    const metrics = computeAxisMetrics(canvas, axis);
    if (!metrics) return;

    dragRef.current = {
      metrics,
      startClient: axis === 'horizontal' ? event.clientX : event.clientY,
      startThumbOffset: metrics.thumbOffset,
    };
  };

  const onTrackPointerDown = (axis: Axis, event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!canvas) return;

    const metrics = computeAxisMetrics(canvas, axis);
    if (!metrics) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickPos = axis === 'horizontal' ? event.clientX - rect.left : event.clientY - rect.top;
    const thumbOffset = clamp(clickPos - metrics.thumbSize / 2, 0, metrics.maxThumbOffset);

    applyThumbOffset(canvas, metrics, thumbOffset);

    dragRef.current = {
      metrics,
      startClient: axis === 'horizontal' ? event.clientX : event.clientY,
      startThumbOffset: thumbOffset,
    };
  };

  return (
    <>
      {horizontal && (
        <div
          onPointerDown={(event) => onTrackPointerDown('horizontal', event)}
          className="absolute z-10 touch-none select-none"
          style={{
            left: TRACK_INSET_START,
            right: TRACK_INSET_END,
            bottom: TRACK_EDGE,
            height: TRACK_THICKNESS,
          }}
        >
          <div
            onPointerDown={(event) => onThumbPointerDown('horizontal', event)}
            className="absolute inset-y-0 rounded-full bg-slate-500/50 transition-colors hover:bg-slate-600/70"
            style={{ left: horizontal.offset, width: horizontal.size }}
          />
        </div>
      )}

      {vertical && (
        <div
          onPointerDown={(event) => onTrackPointerDown('vertical', event)}
          className="absolute z-10 touch-none select-none"
          style={{
            top: TRACK_INSET_START,
            bottom: TRACK_INSET_END,
            right: TRACK_EDGE,
            width: TRACK_THICKNESS,
          }}
        >
          <div
            onPointerDown={(event) => onThumbPointerDown('vertical', event)}
            className="absolute inset-x-0 rounded-full bg-slate-500/50 transition-colors hover:bg-slate-600/70"
            style={{ top: vertical.offset, height: vertical.size }}
          />
        </div>
      )}
    </>
  );
};
