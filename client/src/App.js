import './App.css';
import {Route,Routes} from "react-router-dom"
import Post from "./Post";
import Header from "./Header"; 
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<IndexPage />} />
          <Route path={'/login'} element={<Login/>} />
          <Route path={'/register'} element={<Register/>} />
          <Route path={'/create'} element={<CreatePost/>} />
          <Route path={'/post/:id'} element={<PostPage/>} />
          <Route path={'/edit/:id'} element={<EditPost/>} />
        </Route>
      </Routes>
    </UserContextProvider>
    
  );
}

export default App;
