import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from '../Api';
import Swal from 'sweetalert2';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      try {
        await axios.post('register/', { email, username, password });
        Swal.fire({
          title: 'Success!',
          text: 'Registration successful!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/login');
        });
      } catch (error) {
        const Message = error.response?.data?.email || error.response?.data?.username || error.response?.data?.detail || 'Registration failed. Please try again.';
        setError(Message);
        Swal.fire({
          title: 'Error!',
          text: Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a onClick={() => navigate('/login')}>Login</a></p>
    </div>
  );
}

export default Register;
