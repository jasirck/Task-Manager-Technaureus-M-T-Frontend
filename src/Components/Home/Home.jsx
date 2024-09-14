import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../Api';
import './Home.css';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('tasks/', { params: { status: filter } });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);
  
  const handleAddTask = async () => {
    try {
      await axios.post('tasks/', { title: newTaskTitle, status: 'Pending' });
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleEditTask = (taskId) => navigate(`/edit-task/${taskId}`);

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`tasks/${taskId}/`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleViewDetails = (taskId) => {
    // Implement the logic to view task details
    console.log(`View details for task ${taskId}`);
    // You might want to navigate to a detail page or open a modal
    // navigate(`/task-details/${taskId}`);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );
  

  const handleLogout = () => navigate('/login');

  return (
    <div className="task-manager">
      <div className="container">
        <div className="card">
          <div className="header">
            <h1 className="title">Task Manager</h1>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
          <div className="content">
            <div className="search-add">
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={handleSearch}
                />
                <span className="search-icon">🔍</span>
              </div>
              <button onClick={handleAddTask} className="add-btn">
                Add Task
              </button>
            </div>
            <div className="filter-buttons">
              {['all', 'Complete', 'Pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`filter-btn ${filter === status ? 'active' : ''}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>
  <span className={`status-badge ${String(task.status).toLowerCase()}`}>
    {String(task.status)}
  </span>
</td>

                    <td>
                      <button
                        onClick={() => handleViewDetails(task.id)}
                        className="detail-btn"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleEditTask(task.id)}
                        className="action-btn"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="action-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}