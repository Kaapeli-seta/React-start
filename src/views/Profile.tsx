import {useUserContext} from '../hooks/contextHooks';

const Profile = () => {
  const {user} = useUserContext();

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
