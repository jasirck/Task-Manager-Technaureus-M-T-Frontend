import React, { useState } from 'react';
import axios from '../Api'; // Ensure axios is imported here
import './Add.css';
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';


export default function Add({ isOpen, onClose, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { accessToken } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('tasks/', { title, description }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTitle(''); 
      setDescription(''); 
      fetchTasks(); 
      Swal.fire({
        title: 'Success!',
        text: 'New Task successfully Added!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        onClose(); 
      });
      
    } catch (error) {
      setError('Failed to add task. Please try again.');
      console.error('Failed to add task:', error);
    } 
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>} 
          <button type="submit" className="submit-btn" >
          Add Task          </button>
        </form>
      </div>
    </div>
  );
}
