import { useEffect, useRef, useState } from 'react';

import style from './editor.module.css';

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const STROKE_COLOR_SELECTED = '#00FF00';
const STROKE_COLOR = '#FF0000';
const STROKE_WIDTH = 3;

const Editor = ({ image }: { image: string }) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const [box, setBox] = useState<Box | undefined>(undefined);
  const [boxes, setBoxes] = useState<Box[]>([]);

  const [selectedBox, setSelectedBox] = useState<Box | undefined>(undefined);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        const img = new Image();
        img.src = image;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          context.drawImage(img, 0, 0);
        };
      }
    }
  }, [image]);

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
      const updatedBoxes = boxes.map((shape) =>
        shape === selectedBox
          ? {
            ...shape,
            width: offsetX - shape.x,
            height: offsetY - shape.y,
          }
          :shape 
      );

      setBoxes(updatedBoxes);

      setSelectedBox(undefined);
      setBox(undefined);
      setIsDrawing(false);
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
      setBox({
        x: selectedBox.x,
        y: selectedBox.y,
        width: offsetX - sx,
        height: offsetY - sy,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && box) {
      setBoxes([...boxes, box]);
      setBox(undefined);
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    if (image) {
      const img = new Image();
      img.src = image;

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
        }
      };
    }
  }, [boxes, box, selectedBox, image]);

  const removeSelectedBox = () => {
    setBoxes(boxes.filter((shape) => shape !== selectedBox));
    setSelectedBox(undefined);
    setBox(undefined);
    setIsDrawing(false);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      <button onClick={removeSelectedBox}>
        Delete selected
      </button>
    </div>
  );
};

export default Editor;
