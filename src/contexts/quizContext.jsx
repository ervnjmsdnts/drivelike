import { createContext, useContext, useMemo, useState } from 'react';

const QuizContext = createContext();

const QuizProvider = ({ children }) => {
  const [quiz, setQuiz] = useState([]);

  const addQuiz = (payload = {}) => {
    setQuiz([...quiz, payload]);
  };

  const removeQuiz = (index) => {
    const updatedQuiz = [...quiz];
    updatedQuiz.splice(index, 1);
    setQuiz(updatedQuiz);
  };

  const updateQuiz = (index, payload) => {
    console.log({ payload });
    const updatedQuiz = [...quiz];
    updatedQuiz[index] = payload;
    setQuiz(updatedQuiz);
  };

  const clearQuiz = () => {
    setQuiz([]);
  };

  console.log({ quiz });

  const value = useMemo(
    () => ({ quiz, addQuiz, removeQuiz, clearQuiz, setQuiz, updateQuiz }),
    [quiz, addQuiz, removeQuiz, clearQuiz, setQuiz, updateQuiz]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => useContext(QuizContext);

export default QuizProvider;
