import {MediaItem, MediaItemWithOwner, UserWithNoPassword} from 'hybrid-types/DBTypes';
import MediaRow from '../components/MediaRow';
import {useEffect, useState} from 'react';
import SingleView from '../components/SingleView';
import {fetchData} from '../lib/fetchdata';

const Home = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItemWithOwner | undefined>(undefined);

  useEffect(() => {
    const getMedia = async () => {
      try {
        // kaikki mediat ilman omistajan tietoja
        const media = await fetchData<MediaItem[]>(import.meta.env.VITE_MEDIA_API + '/media');
        // haetaan omistajat id:n perusteella
        const mediaWithOwner: MediaItemWithOwner[] = await Promise.all(
          media.map(async (item) => {
            const owner = await fetchData<UserWithNoPassword>(
              import.meta.env.VITE_AUTH_API + '/users/' + item.user_id,
            );

            const mediaItem: MediaItemWithOwner = {
              ...item,
              username: owner.username,
            };

            /* tän voi poistaa, koska sain bäkin korjattua, nyt sieltä tulee string[] eikä string, päivitä tyypit npm:llä
            if (
              mediaItem.screenshots &&
              typeof mediaItem.screenshots === 'string'
            ) {
              mediaItem.screenshots = JSON.parse(mediaItem.screenshots);
            }
            */

            return mediaItem;
          }),
        );

        console.log(mediaWithOwner);

        setMediaArray(mediaWithOwner);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    getMedia();
  }, []);

  console.log(mediaArray);

  return (
    <>
      {selectedItem && <SingleView item={selectedItem} setSelectedItem={setSelectedItem} />}
      <h2>My Media</h2>
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Size</th>
            <th>Type</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {mediaArray.map((item) => (
            <MediaRow item={item} key={item.media_id} setSelectedItem={setSelectedItem} />
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Home;
