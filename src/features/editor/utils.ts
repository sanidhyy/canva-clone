import { createId } from '@paralleldrive/cuid2';
import * as fabric from 'fabric';
import type { RGBColor } from 'react-color';

import type { filters } from './types';

const WORKSPACE_NAME = 'clip';

type NamedObject = fabric.FabricObject & { name?: string };

export function isWorkspace(object: fabric.FabricObject) {
  return (object as NamedObject).name === WORKSPACE_NAME;
}

export function getWorkspace(canvas: fabric.Canvas) {
  return canvas.getObjects().find(isWorkspace);
}

export async function transformText(objects: any) {
  if (!objects) return;

  objects.forEach((object: any) => {
    if (object.objects) transformText(object.objects);
    else {
      (object.type === 'text' || object.type === 'Text') && (object.type = 'textbox');
    }
  });
}

export function downloadFile(file: string, type: string) {
  const anchorElement = document.createElement('a');

  anchorElement.href = file;
  anchorElement.download = `${createId()}.${type}`;

  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}

export function isTextType(type: string | undefined) {
  return type === 'text' || type === 'i-text' || type === 'textbox' || type === 'itext';
}

export function rgbaObjectToString(rgba: RGBColor | 'transparent') {
  if (rgba === 'transparent') return `rgba(0, 0, 0, 0)`;

  const alpha = rgba.a === undefined ? 1 : rgba.a;

  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}

export function createFilter(value: (typeof filters)[number]) {
  let effect;

  switch (value) {
    case 'polaroid':
      effect = new fabric.filters.Polaroid();
      break;
    case 'sepia':
      effect = new fabric.filters.Sepia();
      break;
    case 'kodachrome':
      effect = new fabric.filters.Kodachrome();
      break;
    case 'contrast':
      effect = new fabric.filters.Contrast({ contrast: 0.3 });
      break;
    case 'brightness':
      effect = new fabric.filters.Brightness({ brightness: 0.8 });
      break;
    case 'greyscale':
      effect = new fabric.filters.Grayscale();
      break;
    case 'brownie':
      effect = new fabric.filters.Brownie();
      break;
    case 'vintage':
      effect = new fabric.filters.Vintage();
      break;
    case 'technicolor':
      effect = new fabric.filters.Technicolor();
      break;
    case 'pixelate':
      effect = new fabric.filters.Pixelate();
      break;
    case 'invert':
      effect = new fabric.filters.Invert();
      break;
    case 'blur':
      effect = new fabric.filters.Blur({
        blur: 0.6,
      });
      break;
    case 'sharpen':
      effect = new fabric.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    case 'emboss':
      effect = new fabric.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    case 'removecolor':
      effect = new fabric.filters.RemoveColor({
        distance: 0.5,
      });
      break;
    case 'blacknwhite':
      effect = new fabric.filters.BlackWhite();
      break;
    case 'vibrance':
      effect = new fabric.filters.Vibrance({
        vibrance: 1,
      });
      break;
    case 'blendcolor':
      effect = new fabric.filters.BlendColor({
        color: '#00ff00',
        mode: 'multiply',
      });
      break;
    case 'huerotate':
      effect = new fabric.filters.HueRotation({
        rotation: 0.5,
      });
      break;
    case 'resize':
      effect = new fabric.filters.Resize();
      break;
    case 'saturation':
      effect = new fabric.filters.Saturation({
        saturation: 0.7,
      });
      break;
    case 'gamma':
      effect = new fabric.filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });
      break;
    default:
      effect = null;
  }

  return effect;
}
