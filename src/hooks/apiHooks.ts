import {MediaItem, MediaItemWithOwner, UserWithNoPassword} from 'hybrid-types/DBTypes';
import {fetchData} from '../lib/fetchdata';
import {useEffect, useState} from 'react';

// TODO: add necessary imports
const useMedia = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

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
            return mediaItem;
          }),
        );
        setMediaArray(mediaWithOwner);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    getMedia();
  }, []);

  // TODO: move mediaArray state here
  // TODO: move getMedia function here
  // TODO: move useEffect here
  return {mediaArray};
};
const useUser = () => {};

const useComments = () => {};

export {useMedia, useUser, useComments};
