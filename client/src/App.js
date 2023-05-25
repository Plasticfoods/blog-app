import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/Profile';
import Post from './pages/Post';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/auth/login' element={<LoginPage />} />
      <Route exact path='/auth/register' element={<RegisterPage />} />
      <Route path='/:username' element={<ProfilePage />} />
      <Route path='/posts/:postId' element={<Post />} />
    </Routes>
  );
}

export default App;
