import { useState } from 'react';

const App = () => {
  const [test] = useState();
  return <div className="App">{test}</div>;
};

export default App;
