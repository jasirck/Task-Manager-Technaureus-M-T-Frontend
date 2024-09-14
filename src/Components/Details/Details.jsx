import React from 'react';
import './Details.css';

export default function Details({ isOpen, onClose, task }) {
  if (!isOpen) return null; // Don't render the modal if it's closed

  return (
    <div className="modal-overlay" onClick={() => onClose()}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="modal-header">
          <h2>Task Details</h2>
          <button onClick={() => onClose()} className="close-btn">
            &times;
          </button>
        </div>
        <div className="modal-content">
          <div className="detail-group">
            <strong>Title:</strong>
            <p>{task.title}</p>
          </div>
          <div className="detail-group">
            <strong>Description:</strong>
            <p>{task.description}</p>
          </div>
          <div className="detail-group">
            <strong>Status:</strong>
            <p className={`status ${task.status ? 'complete' : 'pending'}`}>
              {task.status ? 'Complete' : 'Pending'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
