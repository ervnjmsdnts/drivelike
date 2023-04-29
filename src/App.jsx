import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import User from './pages/User';
import ApplicationLayout from './layouts/ApplicationLayout';
import NotExist from './pages/NotExist';
import ProtectedRoute from './components/ProtectedRoute';
import Folder from './pages/User/Folder';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <Routes>
      <Route element={<ApplicationLayout />}>
        <Route path="user" element={<ProtectedRoute user={user} />}>
          <Route path="" element={<User />} />
          <Route path=":folderId" element={<Folder />} />
          <Route path=":folderId/:moduleId" element={<User />} />
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
