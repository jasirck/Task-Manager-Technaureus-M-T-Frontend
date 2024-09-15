import React, { useState, useEffect } from 'react';
import axios from '../Api'; 
import './Edit.css';
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';



export default function Edit({ isOpen, onClose, taskId, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(''); 
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails(); 
    }
  }, [isOpen, taskId]);

  const fetchTaskDetails = async () => {
    try {
      setError('');
      const response = await axios.get(`tasks/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); 
      setTitle(response.data.title);
      setDescription(response.data.description);
    } catch (error) {
      console.error('Failed to fetch task details:', error);
      setError('Failed to fetch task details. Please try again.');
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = { title, description };
      await axios.put(`tasks/${taskId}/`, updatedTask, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); 
      fetchTasks()
      Swal.fire({
        title: 'Success!',
        text: 'Task successfully Edited!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        onClose(); 
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      setError('Failed to update task. Please try again.');
    } 
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button onClick={() => onClose(false)} className="close-btn">
            &times;
          </button>
        </div>
        { (
          <form onSubmit={handleEditTask} className="modal-form">
            {error && <p className="error">{error}</p>} 
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
            <button type="submit" className="submit-btn" >
            Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
