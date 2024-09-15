import React, { useEffect, useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { login,setName } from '../toolkit/Slice'; 
import axios from '../Api';

function Login() {
  const [User, setUser] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);


  useEffect(() => {
    if (accessToken) {
      navigate('/'); 
    }
  }, [accessToken, navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('login/', User);
      dispatch(login(response.data.access));
      dispatch(setName(User.username));
      navigate('/'); 
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={User.username}
          onChange={(e) => setUser({ ...User, username: e.target.value })}
        />
        
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={User.password}
          onChange={(e) => setUser({ ...User, password: e.target.value })}
        />
        
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a onClick={() => navigate('/register')}>Register</a></p>
    </div>
  );
};

export default Login;
