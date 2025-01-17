import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import NavBar from './component/NavBar';
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";

function App() {
  return (
    <>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
