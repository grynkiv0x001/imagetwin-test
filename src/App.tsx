import { useState } from 'react';

import ImageLoader from '@/components/image-loader/ImageLoader';
import Editor from '@/components/editor/Editor';

const App = () => {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div>
      <ImageLoader
        image={image}
        setImage={setImage}
      />

      {image && (
        <div>
          <Editor image={image}/>
        </div>
      )}
    </div>
  );
};

export default App;
