import {BrowserRouter, Route, Routes} from 'react-router';
import './App.css';
import Home from './views/Home';
import Upload from './views/Upload';
import Profile from './views/Profile';
import Layout from './components/Layout';
import Single from './views/Single';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/upload" element={<Upload />}></Route>
            <Route path="/single" element={<Single />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default App;
