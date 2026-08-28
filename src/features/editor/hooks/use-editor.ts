import * as fabric from 'fabric';
import { useCallback, useMemo, useRef, useState } from 'react';

import {
  type BuildEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  type Editor,
  EditorHookProps,
  FILL_COLOR,
  FONT_FAMILY,
  FONT_LINETHROUGH,
  FONT_SIZE,
  FONT_STYLE,
  FONT_UNDERLINE,
  FONT_WEIGHT,
  JSON_KEYS,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_ALIGN,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
} from '@/features/editor/types';
import { createFilter, downloadFile, getWorkspace as findWorkspace, isTextType, transformText } from '@/features/editor/utils';

import { useAutoResize } from './use-auto-resize';
import { useCanvasEvents } from './use-canvas-events';
import { useClipboard } from './use-clipboard';
import { useHistory } from './use-history';
import { useHotkeys } from './use-hotkeys';
import { useLoadState } from './use-load-state';

const ensureFreeDrawingBrush = (canvas: fabric.Canvas) => {
  if (!canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  }

  return canvas.freeDrawingBrush;
};

const buildEditor = ({
  save,
  canRedo,
  canUndo,
  undo,
  redo,
  autoZoom,
  copy,
  paste,
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  strokeDashArray,
  setStrokeDashArray,
  fontFamily,
  setFontFamily,
  selectedObjects,
}: BuildEditorProps): Editor => {
  const addToCanvas = (object: fabric.FabricObject) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as fabric.Rect;

    return {
      format: 'png' as const,
      quality: 1,
      multiplier: 1,
      width,
      height,
      left,
      top,
    };
  };

  const savePNG = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, 'png');
    autoZoom();
  };

  const saveJPEG = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, 'jpeg');
    autoZoom();
  };

  const saveJPG = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, 'jpg');
    autoZoom();
  };

  const saveJSON = async () => {
    const dataUrl = canvas.toObject(JSON_KEYS);

    await transformText(dataUrl.objects);

    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataUrl, null, '\t'))}`;

    downloadFile(fileString, 'json');
  };

  const loadJSON = (json: string) => {
    const data = JSON.parse(json);

    void canvas.loadFromJSON(data).then(() => {
      autoZoom();
    });
  };

  const getWorkspace = () => {
    return findWorkspace(canvas);
  };

  const center = (object: fabric.FabricObject) => {
    const workspace = getWorkspace();
    const centerPoint = workspace?.getCenterPoint();

    if (!centerPoint) return;

    object.setXY(centerPoint, 'center', 'center');
    object.setCoords();
  };

  return {
    savePNG,
    saveJPG,
    saveJPEG,
    saveJSON,
    loadJSON,
    autoZoom,
    canUndo,
    canRedo,
    getWorkspace,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;

      const centerPoint = canvas.getCenterPoint();
      canvas.zoomToPoint(centerPoint, zoomRatio > 0.8 ? 0.8 : zoomRatio);
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;

      const centerPoint = canvas.getCenterPoint();
      canvas.zoomToPoint(centerPoint, zoomRatio < 0.2 ? 0.2 : zoomRatio);
    },
    changeSize: (size: { width: number; height: number }) => {
      const workspace = getWorkspace();

      workspace?.set(size);
      autoZoom();

      save();
    },
    changeBackground: (background: string) => {
      const workspace = getWorkspace();

      workspace?.set({ fill: background });
      canvas.renderAll();

      save();
    },
    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();

      const brush = ensureFreeDrawingBrush(canvas);
      brush.width = strokeWidth;
      brush.color = strokeColor;
      canvas.isDrawingMode = true;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    onUndo: () => undo(),
    onRedo: () => redo(),
    onCopy: () => copy(),
    onPaste: () => paste(),
    changeImageFilter: (effect) => {
      const objects = canvas.getActiveObjects();

      objects.forEach((object) => {
        if (object instanceof fabric.FabricImage) {
          const filter = createFilter(effect);

          object.filters = filter ? [filter] : [];

          object.applyFilters();
          canvas.renderAll();
        }
      });
    },
    addImage: (imageUrl) => {
      void fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((image) => {
        const workspace = getWorkspace();

        image.scaleToWidth(workspace?.width || 0);
        image.scaleToHeight(workspace?.height || 0);

        addToCanvas(image);
      });
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();

      canvas.renderAll();
    },
    changeOpacity: (opacity) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity });
      });

      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringObjectForward(object);
      });

      canvas.renderAll();

      const workspace = getWorkspace();
      if (workspace) canvas.sendObjectToBack(workspace);
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendObjectBackwards(object);
      });

      canvas.renderAll();

      const workspace = getWorkspace();
      if (workspace) canvas.sendObjectToBack(workspace);
    },
    changeFontSize: (fontSize) => {
      canvas.getActiveObjects().forEach((object) => {
        if (object instanceof fabric.FabricText) object.set({ fontSize });
      });

      canvas.renderAll();
    },
    changeTextAlign: (textAlign) => {
      canvas.getActiveObjects().forEach((object) => {
        if (object instanceof fabric.FabricText) object.set({ textAlign });
      });

      canvas.renderAll();
    },
    changeFontUnderline: (underline) => {
      canvas.getActiveObjects().forEach((object) => {
        if (object instanceof fabric.FabricText) object.set({ underline });
      });

      canvas.renderAll();
    },
    changeFontLinethrough: (linethrough) => {
      canvas.getActiveObjects().forEach((object) => {
        if (object instanceof fabric.FabricText) object.set({ linethrough });
      });

      canvas.renderAll();
    },
    changeFontStyle: (fontStyle) => {
      canvas.getActiveObjects().forEach((object) => {
        if (object instanceof fabric.FabricText) object.set({ fontStyle });
      });

      canvas.renderAll();
    },
    changeFontWeight: (fontWeight) => {
      canvas.getActiveObjects().forEach((object) => {
        if (object instanceof fabric.FabricText) object.set({ fontWeight });
      });

      canvas.renderAll();
    },
    changeFontFamily: (fontFamily) => {
      setFontFamily(fontFamily);

      canvas.getActiveObjects().forEach((object) => {
        if (object instanceof fabric.FabricText) object.set({ fontFamily });
      });

      canvas.renderAll();
    },
    changeFillColor: (color) => {
      setFillColor(color);

      canvas.getActiveObjects().forEach((object) => object.set({ fill: color }));
      canvas.renderAll();
    },
    changeStrokeColor: (color) => {
      setStrokeColor(color);

      canvas.getActiveObjects().forEach((object) => {
        // Text types don't have strokes
        if (isTextType(object.type)) {
          object.set({ fill: color });
          return;
        }

        object.set({ stroke: color });
      });

      const brush = canvas.freeDrawingBrush;
      if (brush) brush.color = color;
      canvas.renderAll();
    },
    changeStrokeWidth: (width) => {
      setStrokeWidth(width);

      canvas.getActiveObjects().forEach((object) => object.set({ strokeWidth: width }));

      const brush = canvas.freeDrawingBrush;
      if (brush) brush.width = width;
      canvas.renderAll();
    },
    changeStrokeDashArray: (strokeDashArray: number[]) => {
      setStrokeDashArray(strokeDashArray);

      canvas.getActiveObjects().forEach((object) => object.set({ strokeDashArray }));
      canvas.renderAll();
    },
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });

      addToCanvas(object);
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        strokeDashArray,
      });

      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        strokeDashArray,
      });

      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        strokeDashArray,
      });

      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth,
        strokeDashArray,
      });

      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          {
            x: 0,
            y: 0,
          },
          {
            x: WIDTH,
            y: 0,
          },
          {
            x: WIDTH / 2,
            y: HEIGHT,
          },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
          strokeDashArray,
        },
      );

      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          {
            x: WIDTH / 2,
            y: 0,
          },
          {
            x: WIDTH,
            y: HEIGHT / 2,
          },
          {
            x: WIDTH / 2,
            y: HEIGHT,
          },
          {
            x: 0,
            y: HEIGHT / 2,
          },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
          strokeDashArray,
        },
      );

      addToCanvas(object);
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!(selectedObject instanceof fabric.FabricText)) return FONT_SIZE;

      return selectedObject.get('fontSize') || FONT_SIZE;
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];

      if (!(selectedObject instanceof fabric.FabricText)) return TEXT_ALIGN;

      return selectedObject.get('textAlign') || TEXT_ALIGN;
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!(selectedObject instanceof fabric.FabricText)) return FONT_UNDERLINE;

      return selectedObject.get('underline') || FONT_UNDERLINE;
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];

      if (!(selectedObject instanceof fabric.FabricText)) return FONT_LINETHROUGH;

      return selectedObject.get('linethrough') || FONT_LINETHROUGH;
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!(selectedObject instanceof fabric.FabricText)) return FONT_STYLE;

      return selectedObject.get('fontStyle') || FONT_STYLE;
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];

      if (!(selectedObject instanceof fabric.FabricText)) return FONT_WEIGHT;

      return selectedObject.get('fontWeight') || FONT_WEIGHT;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];

      if (!(selectedObject instanceof fabric.FabricText)) return fontFamily;

      return selectedObject.get('fontFamily') || fontFamily;
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) return 1;

      const value = selectedObject.get('opacity') || 1;

      return value;
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) return fillColor;

      const value = selectedObject.get('fill') || fillColor;

      // Gradients and patterns are not passed.
      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) return strokeColor;

      const value = selectedObject.get('stroke') || strokeColor;

      return value as string;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) return strokeWidth;

      const value = selectedObject.get('strokeWidth') || strokeWidth;

      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) return strokeDashArray;

      const value = selectedObject.get('strokeDashArray') || strokeDashArray;

      return value;
    },

    canvas,
    selectedObjects,
  };
};

export const useEditor = ({ defaultState, defaultWidth, defaultHeight, clearSelectionCallback, saveCallback }: EditorHookProps) => {
  const initialState = useRef(defaultState);
  const initialWidth = useRef(defaultWidth);
  const initialHeight = useRef(defaultHeight);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.FabricObject[]>([]);

  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);

  const { save, canRedo, canUndo, undo, redo, canvasHistory, setHistoryIndex } = useHistory({
    canvas,
    saveCallback,
  });

  const { copy, paste } = useClipboard({
    canvas,
  });

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    save,
    setSelectedObjects,
    clearSelectionCallback,
  });

  useHotkeys({
    canvas,
    undo,
    redo,
    save,
    copy,
    paste,
  });

  useLoadState({
    canvas,
    autoZoom,
    initialState,
    canvasHistory,
    setHistoryIndex,
  });

  Object.assign(fabric.FabricObject.ownDefaults, {
    cornerColor: '#fff',
    cornerStyle: 'circle',
    borderColor: '#3b82f6',
    borderScaleFactor: 1.5,
    transparentCorners: false,
    borderOpacityWhenMoving: 1,
    cornerStrokeColor: '#3b82f6',
  });

  const editor = useMemo(() => {
    if (canvas)
      return buildEditor({
        save,
        canRedo,
        canUndo,
        undo,
        redo,
        autoZoom,
        copy,
        paste,
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        strokeDashArray,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
        selectedObjects,
      });

    return undefined;
  }, [
    save,
    canRedo,
    canUndo,
    undo,
    redo,
    autoZoom,
    copy,
    paste,
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    strokeDashArray,
    fontFamily,
    selectedObjects,
  ]);

  const init = useCallback(
    ({ initialCanvas, initialContainer }: { initialCanvas: fabric.Canvas; initialContainer: HTMLDivElement }) => {
      const initialWorkspace = new fabric.Rect({
        width: initialWidth.current,
        height: initialHeight.current,
        name: 'clip',
        fill: 'white',
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: 'rgba(0, 0, 0, 0.8)',
          blur: 5,
        }),
      });

      initialCanvas.setDimensions({
        width: initialContainer.offsetWidth,
        height: initialContainer.offsetHeight,
      });

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const currentState = JSON.stringify(initialCanvas.toObject(JSON_KEYS));

      canvasHistory.current = [currentState];
      setHistoryIndex(0);
    },
    // No need, this is from set state
    [canvasHistory, setHistoryIndex],
  );

  return { init, editor };
};
