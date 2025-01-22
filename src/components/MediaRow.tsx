import {MediaItem} from 'hybrid-types/DBTypes';
import {Link} from 'react-router';

type MediaItemProps = {
  item: MediaItem;
  setSelectedItem: (item: MediaItem) => void;
};

// src/components/MediaRow.tsx
const MediaRow = (props: MediaItemProps) => {
  const {item} = props;
  return (
    <tr>
      <td>
        <img src={item.thumbnail || undefined} alt={item.title} />
      </td>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{new Date(item.created_at).toLocaleString('fi-FI')}</td>
      <td>{item.filesize}</td>
      <td>{item.media_type}</td>
      <td>
        <Link to="/single" state={{item}}>
          Show
        </Link>
      </td>
    </tr>
  );
};
export default MediaRow;
