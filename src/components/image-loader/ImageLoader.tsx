import style from './imageLoader.module.scss';

type ImageLoaderProps = {
  image: string | null,
  setImage: (image: string | null) => void,
};

const ImageLoader = ({ setImage }: ImageLoaderProps) => {
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (!event.target) {
          return;
        }

        setImage(event.target.result?.toString() || null);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={style.imageLoader}>
      <label className={style.imageLoader_label}>
        Open Image
        <input
          type="file"
          onChange={handleFileInput}
          accept='image/png, image/jpeg'
        />
      </label>
    </div>
  );
};

export default ImageLoader;
