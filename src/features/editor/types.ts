import type { Canvas, FabricObject, TextboxProps } from 'fabric';
import material from 'material-colors';

export const JSON_KEYS = ['name', 'gradientAngle', 'selectable', 'hasControls', 'linkData', 'editable', 'extensionType', 'extension'];

export const filters = [
  'none',
  'polaroid',
  'sepia',
  'kodachrome',
  'contrast',
  'brightness',
  'greyscale',
  'brownie',
  'vintage',
  'technicolor',
  'pixelate',
  'invert',
  'blur',
  'sharpen',
  'emboss',
  'removecolor',
  'blacknwhite',
  'vibrance',
  'blendcolor',
  'huerotate',
  'resize',
  'saturation',
  'gamma',
] as const;

export const fonts = [
  'Arial',
  'Arial Black',
  'Verdana',
  'Helvetica',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Brush Script MT',
  'Palatino',
  'Bookman',
  'Comic Sans MS',
  'Impact',
  'Lucida Sans Unicode',
  'Geneva',
  'Lucida Console',
];

export const selectionDependentTools = ['fill', 'font', 'filter', 'opacity', 'remove-bg', 'stroke-color', 'stroke-width'];

export const colors = [
  material.red['500'],
  material.pink['500'],
  material.purple['500'],
  material.deepPurple['500'],
  material.indigo['500'],
  material.blue['500'],
  material.lightBlue['500'],
  material.cyan['500'],
  material.teal['500'],
  material.green['500'],
  material.lightGreen['500'],
  material.lime['500'],
  material.yellow['500'],
  material.amber['500'],
  material.orange['500'],
  material.deepOrange['500'],
  material.brown['500'],
  material.blueGrey['500'],
  'transparent',
];

export type ActiveTool =
  | 'select'
  | 'shapes'
  | 'text'
  | 'images'
  | 'draw'
  | 'fill'
  | 'stroke-color'
  | 'stroke-width'
  | 'font'
  | 'opacity'
  | 'filter'
  | 'settings'
  | 'ai'
  | 'remove-bg'
  | 'templates';

export const FILL_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = [];
export const FONT_SIZE = 32;
export const FONT_FAMILY = 'Arial';
export const FONT_WEIGHT = 400;
export const FONT_STYLE = 'normal';
export const FONT_LINETHROUGH = false;
export const FONT_UNDERLINE = false;
export const TEXT_ALIGN = 'left';

export const TEXT_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};

export const CIRCLE_OPTIONS = {
  radius: 225,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const RECTANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const TRIANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const DIAMOND_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 600,
  height: 600,
  angle: 0,
};

export interface EditorHookProps {
  defaultState?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  clearSelectionCallback?: () => void;
  saveCallback?: (values: { json: string; height: number; width: number }) => void;
}

export type BuildEditorProps = {
  save: (skip?: boolean) => void;
  canRedo: () => boolean;
  canUndo: () => boolean;
  undo: () => void;
  redo: () => void;
  autoZoom: () => void;
  copy: () => void;
  paste: () => void;
  canvas: Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  strokeDashArray: number[];
  setStrokeDashArray: (strokeDashArray: number[]) => void;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  selectedObjects: FabricObject[];
};

export interface Editor {
  savePNG: () => void;
  saveJPG: () => void;
  saveJPEG: () => void;
  saveJSON: () => void;
  loadJSON: (json: string) => void;
  autoZoom: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  getWorkspace: () => FabricObject | undefined;
  zoomIn: () => void;
  zoomOut: () => void;
  changeBackground: (background: string) => void;
  changeSize: (size: { width: number; height: number }) => void;
  enableDrawingMode: () => void;
  disableDrawingMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onPaste: () => void;
  changeImageFilter: (effect: (typeof filters)[number]) => void;
  addImage: (imageUrl: string) => void;
  delete: () => void;
  changeOpacity: (opacity: number) => void;
  bringForward: () => void;
  sendBackwards: () => void;
  changeFontSize: (fontSize: number) => void;
  changeTextAlign: (textAlign: string) => void;
  changeFontUnderline: (underline: boolean) => void;
  changeFontLinethrough: (linethrough: boolean) => void;
  changeFontStyle: (fontStyle: string) => void;
  changeFontWeight: (fontWeight: number) => void;
  changeFontFamily: (fontFamily: string) => void;
  changeFillColor: (color: string) => void;
  changeStrokeColor: (color: string) => void;
  changeStrokeWidth: (width: number) => void;
  changeStrokeDashArray: (strokeDashArray: number[]) => void;
  addText: (text: string, options?: Partial<TextboxProps>) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  getActiveFontSize: () => number;
  getActiveTextAlign: () => string;
  getActiveFontUnderline: () => boolean;
  getActiveFontLinethrough: () => boolean;
  getActiveFontStyle: () => string;
  getActiveFontWeight: () => number;
  getActiveFontFamily: () => string;
  getActiveOpacity: () => number;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number;
  getActiveStrokeDashArray: () => number[];

  canvas: Canvas;
  selectedObjects: FabricObject[];
}
