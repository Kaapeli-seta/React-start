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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="UserWithLevelname">Username</label>
          <input
            name="username"
            type="text"
            id="UserWithLevelname"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="loginpassword">Password</label>
          <input
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
        <button onClick={toggleRegister}>register</button>
      </form>
    </>
  );
};

export default LoginForm;
