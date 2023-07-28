import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {Profile} from "./pages/Profile";
import Test from "./pages/Test";
import Page404 from "./pages/Page404";
import BlogPost from "./pages/BlogPost";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/auth/login" element={<LoginPage />} />
      <Route exact path="/auth/register" element={<RegisterPage />} />
      <Route path="/:username" element={<Profile />} />
      <Route path="/posts/:postId" element={<BlogPost />} />
      <Route path="/test" element={<Test />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
