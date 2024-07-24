import { EditorImage } from '@/types/common';

const API_URL = 'http://127.0.0.1:5000';

enum ENDPOINTS {
  OVERVIEW = '/overview',
  SAVE = '/save',
  LOAD = '/load',
  DELETE = '/delete',
}

const getEndpoint = (endpoint: keyof typeof ENDPOINTS, param?: string | number): string => {
  return `${API_URL}${ENDPOINTS[endpoint]}${param ? `/${param}` : ''}`;
};

export const getImages = async (): Promise<EditorImage[]> => fetch(getEndpoint('OVERVIEW'))
  .then((res) => res.json())
  .then((data) => {
    return data;
  });

export const saveImage = async (image: EditorImage): Promise<EditorImage> => {
  return fetch(
    getEndpoint('SAVE'),
    {
      method: 'POST',
      body: JSON.stringify(image),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data);
};

export const loadImage = async (id: number): Promise<EditorImage> => fetch(getEndpoint('LOAD', id))
  .then((res) => res.json())
  .then((data) => data);

export const deleteImage = async (id: number): Promise<void> => {
  return fetch(
    getEndpoint('DELETE', id),
    { method: 'DELETE' }
  )
    .then(() => {
      return;
    });
};
