import React from 'react';
import './Add.css';

export default function Add({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
    onClose(); // Call onClose correctly
  };

  if (!isOpen) return null; // Don't render the modal if it's closed

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button onClick={() => onClose(false)} className="close-btn">
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
              required
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
