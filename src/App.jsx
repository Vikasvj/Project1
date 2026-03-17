import { Routes, Route, Navigate } from "react-router-dom";




import Navbar from "./components/Nabvar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";



export default function App() {




  return (
    <>
      <Navbar />
      <Routes>
       
       <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      
      </Routes>
    </>
  );
}
