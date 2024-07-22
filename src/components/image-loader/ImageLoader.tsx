import style from './imageLoader.module.scss';

const ImageLoader = () => {
  return (
    <div className={style.imageLoader}>
      <input type="file" id="file-input"/>
      <button id="file-button">Open Image</button>
    </div>
  );
};

export default ImageLoader;
