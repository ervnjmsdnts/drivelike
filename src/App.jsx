import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import User from './pages/User';
import ApplicationLayout from './layouts/ApplicationLayout';
import ForgotPassword from './pages/ForgotPassword';
import SetNewPassword from './pages/SetNewPassword';
import ResetSuccess from './pages/ResetSuccess';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />
      <Route element={<ApplicationLayout />}>
        <Route path="/user">
          <Route path="" element={<User />} />
        </Route>
        <Route path="/admin">
          <Route path="" element={<Admin />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
