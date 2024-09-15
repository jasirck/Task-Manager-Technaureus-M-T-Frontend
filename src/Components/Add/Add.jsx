import React, { useState } from 'react';
import axios from '../Api'; // Ensure axios is imported here
import './Add.css';
import { useSelector } from "react-redux";

export default function Add({ isOpen, onClose, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { accessToken } = useSelector((state) => state.auth);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the API to add a new task
      await axios.post('tasks/', { title, description },{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTitle(''); // Reset the title field
      setDescription(''); // Reset the description field
      fetchTasks();
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  if (!isOpen) return null; // Do not render modal if it's not open

  return (
    <div className="modal-overlay" onClick={() => onClose()}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()} // Prevent modal close on inner content click
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
          <button type="submit" className="submit-btn">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
