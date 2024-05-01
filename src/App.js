import React from "react";
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Signup from "./components/Signup";
import Login from "./components/Login";
import Expenses from "./Expenses";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/expenses" element={<Expenses />} />
      </Routes>
    </Router>
    
  )
}

export default App;