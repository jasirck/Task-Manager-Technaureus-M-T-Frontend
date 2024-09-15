import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Home from './Components/Home/Home';
import './App.css';

// root Component for navigate

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} /> {/* //home page  */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
