import { useEffect, useState } from 'react';

import ImageLoader from '@/components/image-loader/ImageLoader';
import Editor from '@/components/editor/Editor';

import { EditorImage } from '@/types/common';
import { deleteImage, getImages, loadImage, saveImage } from '@/api';

const App = () => {
  const [image, setImage] = useState<EditorImage | null>(null);
  const [imageList, setImageList] = useState<EditorImage[]>([]);
  const [userImage, setUserImage] = useState<string | null>(null);

  const handleSave = (imageData: EditorImage) => {
    saveImage(imageData);
  };

  const handleClose = () => {
    setImage(null);
  };

  const handleDelete = async (imageId?: number) => {
    if (!imageId) return;

    deleteImage(imageId);
  };

  const handleLoad = async (imageId?: number) => {
    if (!imageId) return;

    const imageData = await loadImage(imageId);
    setImage(imageData);
  };

  useEffect(() => {
    getImages().then((data) => {
      setImageList(data);
    });
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
    <div>
      <ImageLoader
        image={userImage}
        setImage={setUserImage}
      />

      <p>Image List</p>

      {imageList.map((image) => (
        <div key={image.id} onClick={() => handleLoad(image.id)}>
          <img src={image.image} alt="image"/>
          <button onClick={() => handleDelete(image.id)}>Delete image</button>
        </div>
      ))}

      {image && (
        <div>
          <Editor
            image={image}
            handleSave={handleSave}
            handleClose={handleClose}
          />
        </div>
      )}
    </div>
  );
};

export default App;
