import {
  Like,
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
  Comment,
} from 'hybrid-types/DBTypes';
import {useEffect, useState} from 'react';
import {fetchData} from '../lib/fetchdata';
import {Credentials, RegisterCredentials} from '../types/localtypes';
import {
  AvailableResponse,
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

  const getUsernameAvailable = async (username: string) => {
    // fetch from endpoint /users/username/:username
    const tulos: AvailableResponse = await fetchData(
      import.meta.env.VITE_AUTH_API + '/users/username/' + username,
    );
    return tulos;
  };

  const getEmailAvailable = async (email: string) => {
    const tulos: AvailableResponse = await fetchData(
      import.meta.env.VITE_AUTH_API + '/users/email/' + email,
    );
    return tulos;
  };

  const getUserById = async (id: number) => {
    return await fetchData<UserWithNoPassword>(import.meta.env.VITE_AUTH_API + '/users/' + id);
  };

  return {getUserByToken, postRegister, getUsernameAvailable, getEmailAvailable, getUserById};
};

const useComment = () => {
  const {getUserById} = useUser();
  const postComment = async (comment_text: string, media_id: number, token: string) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({media_id, comment_text}),
    };
    return await fetchData<MessageResponse>(import.meta.env.VITE_MEDIA_API + '/comments', options);
  };

  const getCommentsByMediaId = async (media_id: number) => {
    // Send a GET request to /comments/bymedia/:media_id to get the comments.
    const comments = await fetchData<Comment[]>(
      import.meta.env.VITE_MEDIA_API + '/comments/bymedia/' + media_id,
    );
    // Send a GET request to auth api and add username to all comments
    const commentsWithUsername = await Promise.all<Comment & {username: string}>(
      comments.map(async (comment) => {
        const user = await getUserById(comment.user_id);
        return {...comment, username: user.username};
      }),
    );
    return commentsWithUsername;
  };

  return {postComment, getCommentsByMediaId};
};

const useLike = () => {
  const postLike = async (media_id: number, token: string) => {
    console.log('**********************************************' + token);
    const options = {
      method: 'POST',
      headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'},
      body: JSON.stringify({media_id}),
    };
    return await fetchData<MessageResponse>(import.meta.env.VITE_MEDIA_API + '/likes', options);
  };

  const deleteLike = async (like_id: number, token: string) => {
    console.log('**********************************************' + token);
    const options = {
      method: 'DELETE',
      headers: {Authorization: 'Bearer ' + token},
    };
    return await fetchData<MessageResponse>(
      import.meta.env.VITE_MEDIA_API + '/likes/' + like_id,
      options,
    );
  };

  const getCountByMediaId = async (media_id: number) => {
    return await fetchData<{count: number}>(
      import.meta.env.VITE_MEDIA_API + '/likes/count/' + media_id,
    );
  };

  const getUserLike = async (media_id: number, token: string) => {
    const options = {
      method: 'GET',
      headers: {Authorization: 'Bearer ' + token},
    };
    return await fetchData<Like>(
      import.meta.env.VITE_MEDIA_API + '/likes/bymedia/user/' + media_id,
      options,
    );
  };

  return {postLike, deleteLike, getCountByMediaId, getUserLike};
};

export {useMedia, useAuthentication, useUser, useComment, useFile, useLike};
