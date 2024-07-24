import { useEffect, useState } from 'react';

import ImageLoader from '@/components/image-loader/ImageLoader';
import Editor from '@/components/editor/Editor';

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Image = {
  id?: number;
  image: string;
  origin_image: string;
  boxes?: Box[];
};

const App = () => {
  const [image, setImage] = useState<Image | null>(null);
  const [imageList, setImageList] = useState<Image[]>([]);

  const [userImage, setUserImage] = useState<string | null>(null);

  const handleClose = () => {};

  const handleSave = () => {};

  const handleDelete = async (imageId: number) => {
    const response = await fetch(`http://127.0.0.1:5000/delete/${imageId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Image deleted');
    } else {
      console.error('Failed to delete image');
    }
  };

  const handleLoad = async (imageId: number) => {
    const response = await fetch(`http://127.0.0.1:5000/load/${imageId}`);
    const data = await response.json();

    setImage(data);
  };

  useEffect(() => {
    const url = 'http://127.0.0.1:5000/overview';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setImageList(data);
        }
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
