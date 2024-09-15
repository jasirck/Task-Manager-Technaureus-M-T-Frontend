import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../Api';
import Add from '../Add/Add'; // Import Add modal component
import Edit from '../Edit/Edit'; // Import Edit modal component
import Details from '../Details/Details'; // Import Details modal component
import './Home.css';
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../toolkit/Slice';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Details modal state
  const [taskToEdit, setTaskToEdit] = useState(null); // Task data for editing
  const [taskDetails, setTaskDetails] = useState(null); // Task data for details
  const { accessToken, name } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accessToken) {
      console.log('No access token, redirecting to login.');
      navigate('/login');
    } else {
      console.log(accessToken);
      
      fetchTasks();
    }
  }, [filter, search, accessToken, navigate]);

  const fetchTasks = async () => {
    try {
      let query = `tasks/?`;
      let params = [];
  
      // Append status filter if not 'all'
      if (filter !== 'all') {
        params.push(`status=${filter === 'Complete'}`);
      }
  
      // Append search query if there's any search input
      if (search) {
        params.push(`search=${search}`);
      }
  
      // Join parameters with '&'
      if (params.length > 0) {
        query += params.join('&');
      }
  
      console.log(query, 'query');
      
      const response = await axios.get(query, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      dispatch(logout());
    navigate('/login');

    }
  };
  

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchTasks();  
  };


  const handleEditModalOpen = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`tasks/${taskId}/`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleViewDetails = (task) => {
    setTaskDetails(task);
    setIsDetailsModalOpen(true);
  };

  const handleCheckboxChange = async (taskId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle the status
    try {
      await axios.patch(`tasks/${taskId}/`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="task-manager">
      <div className="container">
        <div className="card">
          <div className="header">
            <h1 className="title">Hello {name}</h1>
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
              <button onClick={() => setIsAddModalOpen(true)} className="add-btn">
                Add Task
              </button>
            </div>
            <div className="filter-buttons">
              <button
                onClick={() => setFilter('all')}
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('Complete')}
                className={`filter-btn ${filter === 'Complete' ? 'active' : ''}`}
              >
                Complete
              </button>
              <button
                onClick={() => setFilter('Pending')}
                className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
              >
                Pending
              </button>
            </div>
            <table className="task-table">
              <thead>
                <tr>
                  <th></th> {/* Checkbox column */}
                  <th>Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks
                  .filter((task) => {
                    if (filter === 'all') {
                      return true;
                    } else if (filter === 'Complete') {
                      return task.status === true;
                    } else if (filter === 'Pending') {
                      return task.status === false;
                    }
                    return true;
                  })
                  // .filter((task) =>
                  //   task.title.toLowerCase().includes(search.toLowerCase())
                  // )
                  .map((task) => (
                    <tr key={task.id}>
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={task.status}
                          onChange={() => handleCheckboxChange(task.id, task.status)}
                        />
                      </td>
                      <td>{task.title}</td>
                      <td>
                        <span className={`status-badge ${task.status ? 'complete' : 'pending'}`}>
                          {task.status ? 'Complete' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleViewDetails(task)} className="detail-btn">
                          Details
                        </button>
                        <button onClick={() => handleEditModalOpen(task)} className="action-btn">
                          ✏️
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="action-btn">
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
      <Add
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        fetchTasks={fetchTasks}
      />
      {taskToEdit && (
  <Edit
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    taskId={taskToEdit.id}
    fetchTasks={fetchTasks}
  />
)}

      {taskDetails && (
        <Details
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          task={taskDetails}
        />
      )}
    </div>
  );
}
