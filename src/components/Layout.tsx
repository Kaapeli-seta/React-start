import {Link, Outlet} from 'react-router';
import {useUserContext} from '../hooks/contextHooks';
import {useEffect} from 'react';

const Layout = () => {
  const {user, handleAutoLogin} = useUserContext();
  useEffect(() => {
    if (!user) {
      handleAutoLogin();
    }
  });

  return (
    <div>
      <nav>
        <ul className="m-0 flex list-none justify-end bg-stone-600 p-0">
          <li>
            <Link
              className="block p-4 text-center transition-all duration-500 hover:bg-stone-700"
              to="/"
            >
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  className="block p-4 text-center transition-all duration-500 hover:bg-stone-700"
                  to="/profile"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  className="block p-4 text-center transition-all duration-500 hover:bg-stone-700"
                  to="/upload"
                >
                  Upload
                </Link>
              </li>
              <li>
                <Link
                  className="block p-4 text-center transition-all duration-500 hover:bg-stone-700"
                  to="/logout"
                >
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link
                className="block p-4 text-center transition-all duration-500 hover:bg-stone-700"
                to="/login"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
};

export default Layout;
