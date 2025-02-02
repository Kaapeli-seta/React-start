import useForm from '../hooks/formHooks';
import {Credentials} from '../types/localtypes';
import {useNavigate} from 'react-router';
import {useAuthentication} from '../hooks/apiHooks';

const LoginForm = () => {
  const navigate = useNavigate();
  const {postLogin} = useAuthentication();
  const initValues: Credentials = {
    username: '',
    password: '',
  };

  const doLogin = async () => {
    try {
      const loginResult = await postLogin(inputs as Credentials);
      console.log('doLogin result', loginResult);
      if (loginResult) {
        localStorage.setItem('token', loginResult.token);
        navigate('/');
      }
    } catch (error) {
      console.error((error as Error).message);
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
      </form>
    </>
  );
};

export default LoginForm;
