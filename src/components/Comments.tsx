import {MediaItemWithOwner} from 'hybrid-types/DBTypes';
import {useUserContext} from '../hooks/contextHooks';
import useForm from '../hooks/formHooks';
import {useCommentStore} from '../store';
import {useEffect, useRef} from 'react';
import {useComment} from '../hooks/apiHooks';

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const user = useUserContext();
  const {comments, setComments} = useCommentStore();
  const {postComment, getCommentsByMediaId} = useComment();

  const initValues = {comment_text: ''};
  const doComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    // TODO: add try-catch & user notification
    await postComment(inputs.comment_text, item.media_id, token);
    getComments();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setInputs(initValues);
  };

  const {handleSubmit, handleInputChange, inputs, setInputs} = useForm(doComment, initValues);

  const getComments = async () => {
    try {
      const comments = await getCommentsByMediaId(item.media_id);
      setComments(comments);
    } catch (error) {
      setComments([]);
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <>
      {user && (
        <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
          <div className="flex w-4/5 flex-col">
            <label htmlFor="comment_text">Post a comment</label>
            <input
              className="my-2.5 rounded-md border p-2.5"
              name="comment_text"
              type="text"
              id="comment_text"
              onChange={handleInputChange}
              autoComplete="off"
              ref={inputRef}
              // value={inputs.username}
            />
          </div>
          <button
            disabled={!inputs.comment_text}
            className="my-2.5 block w-4/5 rounded-md bg-stone-500 p-2 text-center transition-all duration-500 ease-in-out hover:bg-stone-700"
            type="submit"
          >
            Post
          </button>
        </form>
      )}
      {comments.length > 0 && (
        <ul>
          {comments.map((comment) => (
            <li key={comment.comment_id}>
              {comment.username} ({new Date(comment.created_at || '').toLocaleString('fi-FI')}):
              {comment.comment_text}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Comments;
