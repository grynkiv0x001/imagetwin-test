import { useEffect, useRef, useState } from 'react';

import style from './editor.module.css';

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const DEFAULT_CANVAS_WIDTH = 300;
const DEFAULT_CANVAS_HEIGHT = 300;

const DEFAULT_STROKE_COLOR = '#FF0000';
const DEFAULT_STROKE_WIDTH = 3;

const Editor = ({ image }: { image: string }) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const [box, setBox] = useState<Box | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);

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

    setBox({ x: offsetX, y: offsetY, width: 0, height: 0 });
    setIsDrawing(true);
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
  };

  const handleMouseUp = () => {
    if (isDrawing && box) {
      setBoxes([...boxes, box]);
      setBox(null);
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

          context.strokeStyle = DEFAULT_STROKE_COLOR;
          context.lineWidth = DEFAULT_STROKE_WIDTH;

          context.rect(box.x, box.y, box.width, box.height);
          context.stroke();
        });

        if (box) {
          context.beginPath();
          context.rect(box.x, box.y, box.width, box.height);
          context.stroke();
        }
      };
    }
  }, [boxes, box, image]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={DEFAULT_CANVAS_WIDTH}
        height={DEFAULT_CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Editor;
