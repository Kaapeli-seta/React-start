import {MediaItem, MediaItemWithOwner, UserWithNoPassword} from 'hybrid-types/DBTypes';
import {useEffect, useState} from 'react';
import {fetchData} from '../lib/fetchdata';
import {Credentials, RegisterCredentials} from '../types/localtypes';
import {
  LoginResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from 'hybrid-types/MessageTypes';

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

        console.log(mediaWithOwner);

        setMediaArray(mediaWithOwner);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    getMedia();
  }, []);

  const postMedia = async (file: UploadResponse, inputs: Record<string, string>, token: string) => {
    const media: Omit<
      MediaItem,
      'media_id' | 'user_id' | 'thumbnail' | 'screenshots' | 'created_at'
    > = {
      title: inputs.title,
      description: inputs.description,
      filename: file.data.filename,
      media_type: file.data.media_type,
      filesize: file.data.filesize,
    };
    const options = {
      method: 'POST',
      headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'},
      body: JSON.stringify(media),
    };
    // TODO: return the data
    return await fetchData<MessageResponse>(import.meta.env.VITE_MEDIA_API + '/media', options);
  };
  return {mediaArray, postMedia};
};

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {Authorization: 'Bearer ' + token},
      body: formData,
    };
    return await fetchData<UploadResponse>(import.meta.env.VITE_UPLOAD_API + '/upload', options);
  };
  return {postFile};
};

const useAuthentication = () => {
  const postLogin = async (credentials: Credentials) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {'Content-Type': 'application/json'},
    };
    try {
      return await fetchData<LoginResponse>(import.meta.env.VITE_AUTH_API + '/auth/login', options);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  // TODO: implement auth/user server API connections here
  const getUserByToken = async (token: string) => {
    const options = {
      headers: {Authorization: 'Bearer ' + token},
    };
    return await fetchData<UserResponse>(import.meta.env.VITE_AUTH_API + '/users/token', options);
  };

  const postRegister = async (credentials: RegisterCredentials) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {'Content-Type': 'application/json'},
    };
    try {
      return await fetchData<UserResponse>(import.meta.env.VITE_AUTH_API + '/users', options);
    } catch (error) {
      throw error as Error;
    }
  };

  return {getUserByToken, postRegister};
};

const useComments = () => {
  // TODO: implement media/comments resource API connections here
};

export {useMedia, useAuthentication, useUser, useComments, useFile};
