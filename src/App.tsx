import {BrowserRouter, Route, Routes} from 'react-router';
import './App.css';
import Home from './views/Home';
import Upload from './views/Upload';
import Profile from './views/Profile';
import Layout from './components/Layout';
import Single from './views/Single';
import Login from './views/Login';
import Logout from './views/Logout';
import {UserProvider} from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <UserProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />}></Route>
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/single" element={<Single />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
};
export default App;
