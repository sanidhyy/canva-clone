import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, ChevronDown, Copy, SquareSplitHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { BsBorderWidth } from 'react-icons/bs';
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from 'react-icons/fa';
import { RxTransparencyGrid } from 'react-icons/rx';
import { TbColorFilter } from 'react-icons/tb';

import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import {
  type ActiveTool,
  type Editor,
  FILL_COLOR,
  FONT_FAMILY,
  FONT_LINETHROUGH,
  FONT_SIZE,
  FONT_STYLE,
  FONT_UNDERLINE,
  FONT_WEIGHT,
  STROKE_COLOR,
  TEXT_ALIGN,
} from '@/features/editor/types';
import { isTextType } from '@/features/editor/utils';

import { FontSizeInput } from './font-size-input';

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Toolbar = ({ editor, activeTool, onChangeActiveTool }: ToolbarProps) => {
  const initialFillColor = editor?.getActiveFillColor() || FILL_COLOR;
  const initialStrokeColor = editor?.getActiveStrokeColor() || STROKE_COLOR;
  const initialFontFamily = editor?.getActiveFontFamily() || FONT_FAMILY;
  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const initialFontStyle = editor?.getActiveFontStyle() || FONT_STYLE;
  const initialFontLinethrough = editor?.getActiveFontLinethrough() || FONT_LINETHROUGH;
  const initialFontUnderline = editor?.getActiveFontUnderline() || FONT_UNDERLINE;
  const initialTextAlign = editor?.getActiveTextAlign() || TEXT_ALIGN;
  const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE;

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontLinethrough: initialFontLinethrough,
    fontUnderline: initialFontUnderline,
    textAlign: initialTextAlign,
    fontSize: initialFontSize,
  });

  const selectedObject = editor?.selectedObjects[0];
  const isText = isTextType(selectedObject?.type);
  const isImage = selectedObject?.type === 'image';

  const onChangeFontSize = (fontSize: number) => {
    if (!selectedObject) return;
    if (fontSize < 1 || fontSize > 100) return;

    editor?.changeFontSize(fontSize);

    setProperties((prevProperties) => ({
      ...prevProperties,
      fontSize,
    }));
  };

  const onChangeTextAlign = (textAlign: string) => {
    if (!selectedObject) return;

    editor?.changeTextAlign(textAlign);

    setProperties((prevProperties) => ({
      ...prevProperties,
      textAlign,
    }));
  };

  const toggleBold = () => {
    if (!selectedObject) return;

    const newValue = properties.fontWeight > 500 ? 500 : 700;

    editor?.changeFontWeight(newValue);

    setProperties((prevProperties) => ({
      ...prevProperties,
      fontWeight: newValue,
    }));
  };

  const toggleItalic = () => {
    if (!selectedObject) return;

    const isItalic = properties.fontStyle === 'italic';
    const newValue = isItalic ? 'normal' : 'italic';

    editor?.changeFontStyle(newValue);

    setProperties((prevProperties) => ({
      ...prevProperties,
      fontStyle: newValue,
    }));
  };

  const toggleLinethrough = () => {
    if (!selectedObject) return;

    const newValue = properties.fontLinethrough ? false : true;

    editor?.changeFontLinethrough(newValue);

    setProperties((prevProperties) => ({
      ...prevProperties,
      fontLinethrough: newValue,
    }));
  };

  const toggleUnderline = () => {
    if (!selectedObject) return;

    const newValue = properties.fontUnderline ? false : true;

    editor?.changeFontUnderline(newValue);

    setProperties((prevProperties) => ({
      ...prevProperties,
      fontUnderline: newValue,
    }));
  };

  if (editor?.selectedObjects.length === 0) {
    return <div className="z-49 flex h-[56px] w-full shrink-0 items-center gap-x-2 overflow-x-auto border-b bg-white p-2" />;
  }

  return (
    <div className="z-49 flex h-[56px] w-full shrink-0 items-center gap-x-2 overflow-x-auto border-b bg-white p-2">
      {!isImage && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Color" side="bottom" sideOffset={5}>
            <Button onClick={() => onChangeActiveTool('fill')} size="icon" variant={activeTool === 'fill' ? 'secondary' : 'ghost'}>
              <div
                aria-hidden
                className="size-4 rounded-sm border"
                style={{
                  backgroundColor: properties.fillColor,
                }}
              />
            </Button>
          </Hint>
        </div>
      )}

      {!isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Stroke Color" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool('stroke-color')}
              size="icon"
              variant={activeTool === 'stroke-color' ? 'secondary' : 'ghost'}
            >
              <div
                aria-hidden
                className="size-4 rounded-sm border-2 bg-white"
                style={{
                  borderColor: properties.strokeColor,
                }}
              />
            </Button>
          </Hint>
        </div>
      )}

      {!isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Stroke Width" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool('stroke-width')}
              size="icon"
              variant={activeTool === 'stroke-width' ? 'secondary' : 'ghost'}
            >
              <BsBorderWidth className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Font" side="bottom" sideOffset={5}>
            <Button onClick={() => onChangeActiveTool('font')} size="sm" variant={activeTool === 'font' ? 'secondary' : 'ghost'}>
              <div className="max-w-[100px] truncate">{properties.fontFamily}</div>
              <ChevronDown className="ml-2 size-4 shrink-0" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Bold" side="bottom" sideOffset={5}>
            <Button onClick={toggleBold} size="icon" variant={properties.fontWeight > 500 ? 'secondary' : 'ghost'}>
              <FaBold className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Italic" side="bottom" sideOffset={5}>
            <Button onClick={toggleItalic} size="icon" variant={properties.fontStyle === 'italic' ? 'secondary' : 'ghost'}>
              <FaItalic className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Underline" side="bottom" sideOffset={5}>
            <Button onClick={toggleUnderline} size="icon" variant={properties.fontUnderline ? 'secondary' : 'ghost'}>
              <FaUnderline className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Strike" side="bottom" sideOffset={5}>
            <Button onClick={toggleLinethrough} size="icon" variant={properties.fontLinethrough ? 'secondary' : 'ghost'}>
              <FaStrikethrough className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Align left" side="bottom" sideOffset={5}>
            <Button onClick={() => onChangeTextAlign('left')} size="icon" variant={properties.textAlign === 'left' ? 'secondary' : 'ghost'}>
              <AlignLeft className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Align center" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign('center')}
              size="icon"
              variant={properties.textAlign === 'center' ? 'secondary' : 'ghost'}
            >
              <AlignCenter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Align right" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign('right')}
              size="icon"
              variant={properties.textAlign === 'right' ? 'secondary' : 'ghost'}
            >
              <AlignRight className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex h-full items-center justify-center">
          <FontSizeInput value={properties.fontSize} onChange={onChangeFontSize} />
        </div>
      )}

      {isImage && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Filters" side="bottom" sideOffset={5}>
            <Button onClick={() => onChangeActiveTool('filter')} size="icon" variant={activeTool === 'filter' ? 'secondary' : 'ghost'}>
              <TbColorFilter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isImage && (
        <div className="flex h-full items-center justify-center">
          <Hint label="Remove Background" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool('remove-bg')}
              size="icon"
              variant={activeTool === 'remove-bg' ? 'secondary' : 'ghost'}
            >
              <SquareSplitHorizontal className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      <div className="flex h-full items-center justify-center">
        <Hint label="Bring Forward" side="bottom" sideOffset={5}>
          <Button onClick={() => editor?.bringForward()} size="icon" variant="ghost">
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className="flex h-full items-center justify-center">
        <Hint label="Send Backwards" side="bottom" sideOffset={5}>
          <Button onClick={() => editor?.sendBackwards()} size="icon" variant="ghost">
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className="flex h-full items-center justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button onClick={() => onChangeActiveTool('opacity')} size="icon" variant={activeTool === 'opacity' ? 'secondary' : 'ghost'}>
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className="flex h-full items-center justify-center">
        <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <Button
            onClick={() => {
              editor?.onCopy();
              editor?.onPaste();
            }}
            size="icon"
            variant="ghost"
          >
            <Copy className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className="flex h-full items-center justify-center">
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button onClick={() => editor?.delete()} size="icon" variant="ghost">
            <Trash className="size-4 text-destructive" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
