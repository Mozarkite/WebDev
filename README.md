# TooDoo™ – Productivity and Organization App

TooDoo™ is a full-stack productivity and task management web application designed to help users organize tasks, manage priorities, and track personal workflows. The system supports secure authentication, predefined and user-created tasks, favourites, analytics, and full account management — all delivered through a Single Page Application (SPA).

---

## Features

- User registration and login with JWT authentication
- Secure password hashing using bcrypt
- Browse and search predefined database tasks
- Create, manage, and track personal tasks
- Add tasks to a personal to-do list
- Mark tasks as completed
- Favourite user-created tasks
- Task category analytics and statistics
- Profile management (update username, delete account)
- SPA navigation without page reloads

---

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- bcrypt
- JSON Web Tokens (JWT)
- dotenv

### Frontend
- HTML5
- Bootstrap 5
- Font Awesome
- Vanilla JavaScript
- Single Page Application (SPA)

---

## Project Structure

WebDev/
├── server.js # Express server and API routes
├── db.js # PostgreSQL connection pooling
├── index.html # SPA entry point
├── script.js # Frontend logic and API interaction
├── style.css # Custom styles
├── Assets/ # Images and static assets
├── js/
│ └── charts/
│ └── categoryChart.js
├── package.json
└── README.md



---

## Authentication & Security

- Passwords are hashed using **bcrypt**
- Authentication is handled using **JWT**
- Tokens expire after 7 days
- Protected routes require an `Authorization: Bearer <token>` header
- Ownership is enforced on all user-specific database operations
- PostgreSQL transactions are used for atomic operations

---

## API Overview

### Public Routes
- `POST /register` – Create a new user account
- `POST /login` – Authenticate an existing user
- `GET /db_tasks` – Fetch predefined database tasks (supports search)

### Protected Routes (JWT Required)
- `POST /update-username`
- `POST /delete-account`
- `POST /add-db-task`
- `GET /my-tasks`
- `POST /complete-task`
- `GET /user-tasks`
- `POST /create-user-task`
- `GET /task-category-distribution`
- `POST /toggle-user-task-favourite`
- `GET /favourite-user-tasks`
- `GET /favourited-user-task-ids`

---

## Environment Variables

Create a `.env` file in the project root:


---

## How to Run the Project

### 1. Clone the Repository

git clone https://github.com/Mozarkite/WebDev.git


### 2. Open the Project
Open the folder in **VS Code**, then navigate to the project directory:

cd /home/User/WebDev


### 3. Install Dependencies
npm install


### 4. Start the Server
node file.js


### 5. Open in Browser
Copy the following into your browser:
http://localhost:3000

## Application Notes

- The Express server serves both API endpoints and static frontend files
- All SPA routes fall back to `index.html`
- Session persistence is handled via `localStorage`
- XSS protection is implemented using HTML escaping on dynamic content
- UI state updates optimistically where appropriate

---

## Developers

- **Mozarkite** – https://github.com/Mozarkite  
- **10xyou** – https://github.com/10xyou  

---

## License

This project is provided for educational and development purposes.
