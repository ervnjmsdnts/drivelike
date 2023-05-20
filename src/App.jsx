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
import CreateQuiz from './pages/User/CreateQuiz';
import ForgotPassword from './pages/ForgotPassword';
import QuizProvider from './contexts/quizContext';
import Quiz from './pages/User/Quiz';
import UserMaterials from './pages/Admin/UserMaterials';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <QuizProvider>
      <Routes>
        <Route element={<ApplicationLayout />}>
          <Route path="user" element={<ProtectedRoute user={user} />}>
            <Route path="" element={<Topic />} />
            <Route path="about" element={<About />} />
            <Route path="board" element={<Board />} />
            <Route path=":folderId" element={<Material />} />
            <Route path=":folderId/module/:moduleId" element={<Module />} />
            <Route
              path=":folderId/edit-quiz/:quizId"
              element={<CreateQuiz />}
            />
            <Route path=":folderId/quiz/:quizId" element={<Quiz />} />
            <Route
              path=":folderId/module/:moduleId/:fileId"
              element={<File />}
            />
            <Route path=":folderId/create-quiz" element={<CreateQuiz />} />
          </Route>
          <Route path="admin" element={<ProtectedRoute user={user} />}>
            <Route path="" element={<Admin />} />
            <Route path="materials" element={<UserMaterials />} />
            <Route path="materials/:fileId" element={<File />} />
          </Route>
        </Route>
        <Route path="/" element={<ProtectedRoute user={user} />}>
          <Route path="" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<NotExist />} />
      </Routes>
    </QuizProvider>
  );
};

export default App;
