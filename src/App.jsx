import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import User from './pages/User';
import ApplicationLayout from './layouts/ApplicationLayout';
import NotExist from './pages/NotExist';
import ProtectedRoute from './components/ProtectedRoute';
import File from './pages/User/File';
import Board from './pages/User/Board';
import About from './pages/User/About';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <Routes>
      <Route element={<ApplicationLayout />}>
        <Route path="user" element={<ProtectedRoute user={user} />}>
          <Route path="" element={<User />} />
          <Route path="about" element={<About />} />
          <Route path="board" element={<Board />} />
          <Route path=":fileId" element={<File />} />
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
