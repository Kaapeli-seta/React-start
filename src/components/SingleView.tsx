// SingleView.tsx
import {MediaItem} from '../types/DBTypes';

const SingleView = (props: {
  item: MediaItem | undefined;
  setSelectedItem: (item: MediaItem | undefined) => void;
}) => {
  const {item, setSelectedItem} = props;
  console.log(item)
  return (
    // TODO: Add JSX for displaying a mediafile here
    // - use e.g. a <dialog> element for creating a modal
    // - use item prop to render the media item details
    // - use img tag for displaying images
    // - use video tag for displaying videos
    <>
    <dialog open>
      {item &&
      <img src={item.filename} alt={item.title}></img>
      }
    </dialog>
    </>
  );
};
export default SingleView;
