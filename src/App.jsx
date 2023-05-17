import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ApplicationLayout from './layouts/ApplicationLayout';
import NotExist from './pages/NotExist';
import ProtectedRoute from './components/ProtectedRoute';
import File from './pages/User/File';
import Board from './pages/User/Board';
import About from './pages/User/About';
import Topic from './pages/User/Topic';
import Material from './pages/User/Material';
import Module from './pages/User/Module';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <Routes>
      <Route element={<ApplicationLayout />}>
        <Route path="user" element={<ProtectedRoute user={user} />}>
          <Route path="" element={<Topic />} />
          <Route path="about" element={<About />} />
          <Route path="board" element={<Board />} />
          <Route path=":folderId" element={<Material />} />
          <Route path=":folderId/module/:moduleId" element={<Module />} />
          <Route path=":folderId/module/:moduleId/:fileId" element={<File />} />
        </Route>
        <Route path="admin" element={<ProtectedRoute user={user} />}>
          <Route path="" element={<Admin />} />
        </Route>
      </Route>
      <Route path="/" element={<ProtectedRoute user={user} />}>
        <Route path="" element={<Login />} />
      </Route>
      <Route path="*" element={<NotExist />} />
    </Routes>
  );
};

export default App;
