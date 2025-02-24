import {useEffect, useState} from 'react';
import {useUser} from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';
import {RegisterCredentials} from '../types/localtypes';

type LoginProps = {
  toggleRegister: () => void;
};

const RegisterForm = (props: LoginProps) => {
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const {postRegister, getEmailAvailable, getUsernameAvailable} = useUser();
  const {toggleRegister} = props;
  const initValues: RegisterCredentials = {
    username: '',
    password: '',
    email: '',
  };

  const doRegister = async () => {
    try {
      const registerResult = await postRegister(inputs as RegisterCredentials);
      console.log('doLogin result', registerResult);
    } catch (error) {
      console.error((error as Error).message);
      // Display error to user here(?)
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(doRegister, initValues);

  useEffect(() => {
    const main = async () => {
      if (inputs.username.length < 3) return;
      const tulos = await getUsernameAvailable(inputs.username);
      if (!tulos) return;
      setUsernameAvailable(tulos.available);
    };
    main();
  }, [inputs.username]);

  useEffect(() => {
    const main = async () => {
      if (inputs.email.length < 5) return;
      const tulos = await getEmailAvailable(inputs.email);
      if (!tulos) return;
      setEmailAvailable(tulos.available);
    };
    main();
  }, [inputs.email]);

  return (
    <>
      <h1>Register</h1>
      <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
        <div className="w-full">
          <label htmlFor="regusername">Username</label>
          <input
            className="my-2.5 w-full rounded-md border-2 border-stone-400 bg-stone-900 p-1"
            name="username"
            type="text"
            id="regusername"
            onChange={handleInputChange}
            autoComplete="username"
          />
          {!usernameAvailable && <p className="text-right text-red-500">Username not available</p>}
        </div>
        <div className="w-full">
          <label htmlFor="regpassword">Password</label>
          <input
            className="my-2.5 w-full rounded-md border-2 border-stone-400 bg-stone-900 p-1"
            name="password"
            type="password"
            id="regpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <div className="w-full">
          <label htmlFor="regemail">Email</label>
          <input
            className="my-2.5 w-full rounded-md border-2 border-stone-400 bg-stone-900 p-1"
            name="email"
            type="email"
            id="regemail"
            onChange={handleInputChange}
            autoComplete="email"
          />
          {!emailAvailable && <p className="text-right text-red-500">Email already in use</p>}
        </div>
        <button
          className="m-2.5 w-full cursor-pointer rounded-md bg-stone-600 p-2.5 duration-500 hover:bg-stone-700"
          type="submit"
        >
          Register
        </button>
        <button
          className="m-2.5 w-full cursor-pointer rounded-md bg-stone-600 p-2.5 duration-500 hover:bg-stone-700"
          onClick={toggleRegister}
        >
          or login?
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
