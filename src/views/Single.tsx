import {MediaItem} from 'hybrid-types/DBTypes';
import {NavigateFunction, useLocation, useNavigate} from 'react-router';

const Single = () => {
  const navigate: NavigateFunction = useNavigate();
  const {state} = useLocation();
  const item: MediaItem = state.item;
  return (
    <>
      <button onClick={() => navigate(-1)}>Go back</button>
      <h2>Single</h2>
      <h3>{item.title}</h3>
      <p>{new Date(item.created_at).toLocaleString('fi-FI')}</p>
      {item.media_type.includes('image') ? (
        <img src={item.filename} alt={item.title} />
      ) : (
        <video src={item.filename} controls />
      )}
      <p>{item.description}</p>
      <p>{item.media_type}</p>
      <p>{Math.round(item.filesize / 1024) + ' kb'}</p>
    </>
  );
};

export default Single;
