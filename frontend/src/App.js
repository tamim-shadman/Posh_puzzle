import logo from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";

const App = () =>  {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
