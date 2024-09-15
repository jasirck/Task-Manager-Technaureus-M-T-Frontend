import React, { useState, useEffect } from 'react';
import axios from '../Api'; // Import axios instance for API calls
import './Edit.css';
import { useSelector } from "react-redux";

export default function Edit({ isOpen, onClose, taskId, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true); // Track loading state
  const { accessToken } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails(); // Fetch task details when modal opens
    }
  }, [isOpen, taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`tasks/${taskId}/`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); // Fetch task details by taskId
      setTitle(response.data.title);
      setDescription(response.data.description);
      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      console.error('Failed to fetch task details:', error);
      setLoading(false);
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = { title, description };
      await axios.put(`tasks/${taskId}/`, updatedTask,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }); // Update task
      fetchTasks(); // Refresh task list after update
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's closed

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button onClick={() => onClose(false)} className="close-btn">
            &times;
          </button>
        </div>
        {loading ? ( // Display loading message while fetching task details
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleEditTask} className="modal-form">
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
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
