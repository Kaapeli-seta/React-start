import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {Link} from 'react-router';
import {useUserContext} from '../hooks/contextHooks';

type MediaItemProps = {
  item: MediaItemWithOwner;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
};

const MediaRow = (props: MediaItemProps) => {
  const {item} = props;
  const {user} = useUserContext();
  return (
    <tr>
      <td className="p-1">
        <img
          className="w-65 h-50 object-cover"
          src={item.thumbnail || (item.screenshots && item.screenshots[2]) || undefined}
          alt={item.title}
        />
      </td>
      <td className="p-1">{item.title}</td>
      <td className="p-1">{item.description}</td>
      <td className="p-1">{new Date(item.created_at).toLocaleString('fi-FI')}</td>
      <td className="p-1">{item.filesize}</td>
      <td className="p-1">{item.media_type}</td>
      <td className="p-1">{item.username}</td>
      <td className="p-1 *:my-2 *:w-20 *:rounded-sm *:border-0 *:bg-stone-600 *:p-2 *:text-center *:duration-500 *:hover:bg-stone-900">
        <div>
          <Link to="/single" state={{item}}>
            Show
          </Link>
        </div>

        {user?.user_id === item.user_id || user?.level_name === 'Admin' ? (
          <>
            <button
              onClick={() => {
                console.log('modify pressed');
              }}
            >
              Modify
            </button>
            <button
              onClick={() => {
                console.log('delete pressed');
              }}
            >
              Delete
            </button>
          </>
        ) : (
          ''
        )}
      </td>
    </tr>
  );
};

export default MediaRow;
