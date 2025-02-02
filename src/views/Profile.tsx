import {useUser} from '../hooks/apiHooks';
import {useEffect, useState} from 'react';
import {UserWithNoPassword} from 'hybrid-types/DBTypes';
import {UserResponse} from 'hybrid-types/MessageTypes';

const Profile = () => {
  const [user, setUser] = useState<UserWithNoPassword | null>(null);
  const {getUserByToken} = useUser();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const userResponse: UserResponse = await getUserByToken(token);
      setUser(userResponse.user);
    }
  };

  return (
    <>
      <h2>Profile</h2>
      {user && (
        <>
          <p>
            {user.username} ({user.email})
          </p>
          <p>User level: {user.level_name}</p>
          <p>Registered: {new Date(user.created_at).toLocaleString('fi-FI')}</p>
        </>
      )}
    </>
  );
};

export default Profile;
