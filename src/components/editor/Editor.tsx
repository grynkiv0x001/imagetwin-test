import { useCallback, useEffect, useRef, useState } from 'react';

import { Box, Handle, HandlePosition, EditorImage } from '@/types/common';

import style from './editor.module.scss';

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const STROKE_COLOR_SELECTED = '#00FF00';
const STROKE_COLOR = '#FF0000';
const STROKE_WIDTH = 3;

const HANDLE_SIZE = 20;

type EditorProps = {
  image: EditorImage;
  handleSave: (image: EditorImage) => void;
  handleClose: () => void;
};

const Editor = ({ image, handleSave, handleClose }: EditorProps) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const [box, setBox] = useState<Box | undefined>(undefined);
  const [boxes, setBoxes] = useState<Box[]>([]);

  const [selectedBox, setSelectedBox] = useState<Box | undefined>(undefined);
  const [selectedHandle, setSelectedHandle] = useState<Handle | undefined>(undefined);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (image.boxes) {
        setBoxes(image.boxes);
      }

      if (context) {
        const img = new Image();
        img.src = image.origin_image;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);
        };
      }
    }
  }, [image]);

  const getHandleUnderMouse = (offsetX: number, offsetY: number, box: Box): Handle | undefined => {
    const handles = [
      {
        x: box.x + box.width,
        y: box.y + box.height,
        position: HandlePosition.BottomRight,
      }
    ];

    return handles.find(
      handle =>
        offsetX >= handle.x - HANDLE_SIZE / 2 &&
        offsetX <= handle.x + HANDLE_SIZE / 2 &&
        offsetY >= handle.y - HANDLE_SIZE / 2 &&
        offsetY <= handle.y + HANDLE_SIZE / 2
    ) || undefined;
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { nativeEvent } = event;
    const { offsetX, offsetY } = nativeEvent;

    const clickedBox = boxes.find(
      (shape) =>
        offsetX >= shape.x &&
        offsetX <= shape.x + shape.width &&
        offsetY >= shape.y &&
        offsetY <= shape.y + shape.height
    );

    setSelectedBox(clickedBox);
    setIsDrawing(clickedBox ? false : true);

    if (selectedBox && box) {
      const handleUnderMouse = getHandleUnderMouse(offsetX, offsetY, selectedBox);

      if (handleUnderMouse) {
        setSelectedHandle(handleUnderMouse);
      } else {
        setSelectedHandle(undefined);
      }
    }

    setBox({ x: offsetX, y: offsetY, width: 0, height: 0 });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { nativeEvent } = event;
    const { offsetX, offsetY } = nativeEvent;

    if (!box) return;

    const {x: sx, y: sy} = box;

    if (isDrawing) {
      setBox({
        x: sx,
        y: sy,
        width: offsetX - sx,
        height: offsetY - sy,
      });
    }

    if (selectedBox) {
      if (selectedHandle) {
        setBox({
          x: selectedBox.x,
          y: selectedBox.y,
          width: offsetX - selectedBox.x,
          height: offsetY - selectedBox.y,
        });
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { nativeEvent } = event;
    const { offsetX, offsetY } = nativeEvent;

    if (isDrawing && box) {
      setBoxes([...boxes, box]);
      setBox(undefined);
      setIsDrawing(false);
    }

    if (selectedHandle) {
      setSelectedHandle(undefined);

      const updatedBoxes = boxes.map((shape) =>
        shape === selectedBox
          ? {
            ...shape,
            width: offsetX - shape.x,
            height: offsetY - shape.y,
          }
          : shape
      );

      setBoxes(updatedBoxes);

      setSelectedBox(undefined);
    }
  };

  const removeSelectedBox = useCallback(() => {
    setBoxes(boxes.filter((shape) => shape !== selectedBox));
    setSelectedBox(undefined);
    setBox(undefined);
    setIsDrawing(false);
  }, [boxes, selectedBox]);

  const onSave = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const img = canvas.toDataURL('image/png');

      const body = {
        id: image.id,
        image: img,
        origin_image: image.origin_image,
        boxes,
      };

      handleSave(body);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    const handleBackspace = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!selectedBox) return;

        removeSelectedBox();
      }
    };

    window.addEventListener('keydown', handleBackspace);

    if (image) {
      const img = new Image();
      img.src = image.origin_image;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);

        boxes.forEach((box) => {
          context.beginPath();

          context.strokeStyle = STROKE_COLOR;
          context.lineWidth = STROKE_WIDTH;

          context.rect(box.x, box.y, box.width, box.height);
          context.stroke();
        });

        if (box) {
          context.beginPath();
          context.rect(box.x, box.y, box.width, box.height);
          context.stroke();
        }

        if (selectedBox) {
          context.beginPath();
          context.strokeStyle = STROKE_COLOR_SELECTED;
          context.rect(selectedBox.x, selectedBox.y, selectedBox.width, selectedBox.height);
          context.stroke();

          const handles = [
            {
              x: selectedBox.x + selectedBox.width,
              y: selectedBox.y + selectedBox.height,
              position: HandlePosition.BottomRight,
            },
          ];

          handles.forEach(handle => {
            context.beginPath();
            context.rect(handle.x - HANDLE_SIZE / 2, handle.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
            context.fillStyle = STROKE_COLOR_SELECTED;
            context.fill();
            context.stroke();
          });
        }
      };
    }

    return () => {
      window.removeEventListener('keydown', handleBackspace);
    };
  }, [boxes, box, selectedBox, removeSelectedBox, image]);

  return (
    <div className={style.editor}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={style.editor_canvas}
      />

      <div className={style.editor_actions}>
        <div>
          <button onClick={onSave}>
            Save
          </button>
          <button onClick={handleClose}>
            Close
          </button>
        </div>

        <button
          onClick={removeSelectedBox}
          className={style.editor_btn__delete}
        >
          Delete selected
        </button>
      </div>
    </div>
  );
};

export default Editor;
