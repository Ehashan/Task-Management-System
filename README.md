# Task Management App

A full-stack task management application built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend. The app supports user authentication, task management, and an admin panel for managing users and tasks.

## Features

- User registration and login
- Protected routes for authenticated users
- Task creation, update, completion, and deletion
- Profile management
- Admin dashboard with user and task management
- Responsive UI with Tailwind CSS

## Project Structure

- backend/: Express API, MongoDB models, auth and task routes
- frontend/: React/Vite client app

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- CORS and Helmet

## Prerequisites

- Node.js (v18 or newer recommended)
- npm
- MongoDB instance (local or cloud, such as MongoDB Atlas)

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

If you are using MongoDB Atlas, replace `MONGODB_URI` with your connection string.

## Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

The API will run at http://localhost:5000.

### Start the frontend

```bash
cd frontend
npm run dev
```

The Vite app will run at http://localhost:5173.

## Seed the Admin User

To create the default admin account:

```bash
cd backend
npm run seed
```

## API Health Check

You can verify the backend is running with:

```bash
curl http://localhost:5000/api/health
```

## Notes

- The frontend expects the backend API at `http://localhost:5000/api` by default.
- If needed, you can override it by setting `VITE_API_URL` in the frontend environment.

## License

This project is licensed under the ISC license.
