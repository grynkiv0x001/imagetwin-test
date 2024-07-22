import style from './imageLoader.module.scss';

type Props = {
  image: string | null,
  setImage: (image: string | null) => void,
};

const ImageLoader = ({ setImage }: Props) => {
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) {
          return;
        }

        setImage(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={style.imageLoader}>
      <input type="file" id="file-input" onChange={handleFileInput}/>
      <button id="file-button">Open Image</button>
    </div>
  );
};

export default ImageLoader;
