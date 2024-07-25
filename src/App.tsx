import { useEffect, useState } from 'react';

import { EditorImage } from '@/types/common';
import { deleteImage, getImages, loadImage, saveImage } from '@/api';

import ImageGallery from '@/components/image-gallery/ImageGallery';
import ImageLoader from '@/components/image-loader/ImageLoader';
import Editor from '@/components/editor/Editor';

import style from './app.module.scss';

const App = () => {
  const [image, setImage] = useState<EditorImage | null>(null);
  const [imageList, setImageList] = useState<EditorImage[]>([]);
  const [userImage, setUserImage] = useState<string | null>(null);

  const handleSave = (imageData: EditorImage) => {
    saveImage(imageData).then(() => {
      handleClose();
    });
  };

  const handleClose = () => {
    setImage(null);
    handleOverview();
  };

  const handleDelete = async (imageId?: number) => {
    if (!imageId) return;

    deleteImage(imageId).then(() => {
      handleOverview();
    });
  };

  const handleLoad = async (imageId?: number) => {
    if (!imageId) return;

    const imageData = await loadImage(imageId);
    setImage(imageData);
  };

  const handleOverview = () => {
    getImages().then((data) => {
      setImageList(data);
    });
  };

  useEffect(() => {
    handleOverview();
  }, []);

  useEffect(() => {
    if (userImage) {
      setImage({
        origin_image: userImage,
        image: userImage,
      });
    }
  }, [userImage]);

  return (
    <div className={style.app}>
      <header className={style.app_header}>
        <p className={style.app_header_heading}>Image Editor</p>

        <ImageLoader
          image={userImage}
          setImage={setUserImage}
        />
      </header>

      {image ? (
        <div className={style.app_body}>
          <Editor
            image={image}
            handleSave={handleSave}
            handleClose={handleClose}
          />
        </div>
      ) : (
        <ImageGallery
          images={imageList}
          handleLoad={handleLoad}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default App;
