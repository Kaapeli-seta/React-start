import useForm from '../hooks/formHooks';
import {Credentials} from '../types/localtypes';
/* import {useNavigate} from 'react-router';
import {useAuthentication} from '../hooks/apiHooks'; */
import {useUserContext} from '../hooks/contextHooks';

type LoginProps = {
  toggleRegister: () => void;
};

const LoginForm = (props: LoginProps) => {
  const {toggleRegister} = props;
  /*   const navigate = useNavigate();
  const {postLogin} = useAuthentication(); */
  const {handleLogin} = useUserContext();
  const initValues: Credentials = {
    username: '',
    password: '',
  };

  const doLogin = async () => {
    try {
      handleLogin(inputs as Credentials);
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(doLogin, initValues);

  return (
    <>
      <h1>Login</h1>
      <form className="flex w-full flex-col items-center justify-center" onSubmit={handleSubmit}>
        <div className="w-full">
          <label htmlFor="UserWithLevelname">Username</label>
          <input
            className="my-2.5 w-full rounded-md border-2 border-stone-400 bg-stone-900 p-1"
            name="username"
            type="text"
            id="UserWithLevelname"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div className="w-full">
          <label htmlFor="loginpassword">Password</label>
          <input
            className="my-2.5 w-full rounded-md border-2 border-stone-400 bg-stone-900 p-1"
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <button
          className="m-2.5 w-full cursor-pointer rounded-md bg-stone-600 p-2.5 duration-500 hover:bg-stone-700"
          type="submit"
        >
          Login
        </button>
        <button
          className="m-2.5 w-full cursor-pointer rounded-md bg-stone-600 p-2.5 duration-500 hover:bg-stone-700"
          onClick={toggleRegister}
        >
          or register?
        </button>
      </form>
    </>
  );
};

export default LoginForm;
