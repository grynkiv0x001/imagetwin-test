import { EditorImage } from '@/types/common';

import style from './imageGallery.module.scss';

type ImageGalleryProps = {
  images: EditorImage[];
  handleLoad: (id?: number) => void;
  handleDelete: (id?: number) => void;
};

const ImageGallery = ({ images, handleLoad, handleDelete }: ImageGalleryProps) => {
  if (!images.length) {
    return (
      <p className={style.imageGallery_empty}>
        No images, click on &quot;OPEN IMAGE&quot; to add one
      </p>
    );
  }

  return (
    <div className={style.imageGallery}>
      {images.map((image) => (
        <div
          key={image.id}
          onClick={() => handleLoad(image.id)}
          className={style.imageGallery_item}
        >
          <img
            src={image.image}
            alt="image"
            className={style.imageGallery_img}
          />

          <div className={style.imageGallery_actions}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(image.id);
              }}
              className={style.imageGallery_deleteBtn}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
