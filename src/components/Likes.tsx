import {Like, MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useEffect, useReducer} from 'react';
import {useLike} from '../hooks/apiHooks';

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  like?: Like | null;
  count?: number;
};

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

const likeReduce = (state: LikeState, action: LikeAction): LikeState => {
  switch (action.type) {
    case 'setLikeCount':
      return {...state, count: action.count ?? 0};
    case 'like':
      return {...state, userLike: action.like ?? null};
    default:
      return state;
  }
};

const Likes = ({item}: {item: MediaItemWithOwner}) => {
  const [LikeState, likeDispatch] = useReducer(likeReduce, likeInitialState);
  const {postLike, deleteLike, getCountByMediaId, getUserLike} = useLike();

  const getLikes = async () => {
    const token = localStorage.getItem('token');
    if (!item || !token) return;
    try {
      const useLikes = await getUserLike(item.media_id, token);
      likeDispatch({type: 'setLikeCount', like: useLikes});
    } catch (error) {
      likeDispatch({type: 'setLikeCount', like: null});
      console.error((error as Error).message);
    }
  };

  const getLikeCount = async () => {
    try {
      const countResponse = await getCountByMediaId(item.media_id);
      likeDispatch({type: 'setLikeCount', count: countResponse.count});
    } catch (error) {
      likeDispatch({type: 'setLikeCount', like: null});
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    getLikes();
    getLikeCount();
  }, [item]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!item || !token) return;
      if (LikeState.userLike) {
        await deleteLike(LikeState.userLike.like_id, token);
        likeDispatch({type: 'like', like: null});
        likeDispatch({type: 'setLikeCount', count: LikeState.count - 1});
      } else {
        await postLike(item.media_id, token);
        getLikes();
        getLikeCount();
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };
  return (
    <>
      <div>Likes: {LikeState.count}</div>
      <button
        className="block w-full bg-indigo-400 p-2 text-center transition-all duration-500 ease-in-out hover:bg-indigo-700"
        onClick={handleLike}
      >
        {LikeState.userLike ? 'Unlike' : 'Like'}
      </button>
    </>
  );
};

export default Likes;
