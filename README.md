# Task Manager Frontend

This is the frontend part of the Task Manager application built with React. It interfaces with a Django backend to manage tasks.

## Features

1. **Task List Page**
   - Display all tasks with filters for completed and pending tasks.
   - Show task title, description, and status.

2. **Create Task**
   - Form to create a new task with title and description.
   - Refreshes the task list on successful creation.

3. **Edit Task**
   - Ability to edit a task's title and description.
   - Updates the task list on successful update.

4. **Delete Task**
   - Option to delete a task from the task list.
   - Refreshes the task list on successful deletion.

5. **Mark Task as Completed**
   - Toggle a task’s completion status.

6. **Task Detail View**
   - View full details of a task in a new  modal.

7. **Registration**
   - User registration with username, email, password, and confirmation password.

8. **Authentication**
   - User login and token-based authentication.
   - Stores authentication token in local storage.

## Frontend Specifications

- **React Functional Components** with hooks for state management.
- **Axios** for API calls.
- **React Router** for navigation.
- **Redux Toolkit** for state management.
- **SweetAlert2** for alerts and notifications.
- **CSS** for styling.
- Basic error handling for API interactions.
- Responsive and user-friendly UI.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jasirck/Task-Manager-Technaureus-M-T-Frontend.git

2. Navigate to the project directory:
   ```bash
   cd Task-Manager-Technaureus-M-T-Frontend

3. Install dependencies:
   ```bash
   npm install
 
 Start
   ```bash
   npm install


pleace check  in this path:
   /src/Components/Api.js
   baseURL = in your django api 
   eg:(http://127.0.0.1:8001/) /api/
