export type EditorImage = {
  id?: number;
  image: string;
  origin_image: string;
  boxes?: Box[];
};

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Handle = {
  x: number;
  y: number;
  position: HandlePosition;
};

export enum HandlePosition {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  BottomRight = 'bottomRight'
}