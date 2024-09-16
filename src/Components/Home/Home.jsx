import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../Api';
import Add from '../Add/Add'; 
import Edit from '../Edit/Edit'; 
import Details from '../Details/Details'; 
import './Home.css';
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../toolkit/Slice';
import Swal from 'sweetalert2';


export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); 
  const [taskDetails, setTaskDetails] = useState(null); 
  const { accessToken, name } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let query = `tasks/?`;
  useEffect(() => {
    if (!accessToken) {
      console.log('No access token, redirecting to login.');
      navigate('/login');
    } else {
      console.log(accessToken);
      
      fetchTasks();
    }
  }, [filter, search, accessToken, navigate,query]);

  const fetchTasks = async () => {
    try {
      query = `tasks/?`;
  
      if (filter !== 'all') {
        query += `status=${filter === 'Complete'}&`;
      }
  
      if (search) {
        query += `search=${search}&`;
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
  
  
// search api call
  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchTasks();  
  };


  const handleEditModalOpen = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  // API for deletion
    const handleDelete = async (taskId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`tasks/${taskId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        fetchTasks();
  
        Swal.fire({
          title: 'Deleted!',
          text: 'Task has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };
  const handleDetails = (task) => {
    setTaskDetails(task);
    setIsDetailsModalOpen(true);
  };

  const handleCheckbox = async (taskId, currentStatus) => {
    const newStatus = !currentStatus; 
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
            {/* Filter button options */}
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
                  <th></th> 
                  <th>Title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks
                // Filtering based buttons
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
                  .map((task) => (
                    <tr key={task.id}>
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={task.status}
                          onChange={() => handleCheckbox(task.id, task.status)}
                        />
                      </td>
                      <td>{task.title}</td>
                      <td>
                        <span className={`status-badge ${task.status ? 'complete' : 'pending'}`}>
                          {task.status ? 'Complete' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleDetails(task)} className="detail-btn">
                          Details
                        </button>
                        <button onClick={() => handleEditModalOpen(task)} className="action-btn">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="action-btn">
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
      {/* Add Modal  */}
      <Add
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        fetchTasks={fetchTasks}
      />
      {/* Edit Modal */}
      {taskToEdit && (
  <Edit
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    taskId={taskToEdit.id}
    fetchTasks={fetchTasks}
  />
)}
       
       {/* Details Modal */}
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
