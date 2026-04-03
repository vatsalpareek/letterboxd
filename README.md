# Melodex — Setup & Run Instructions

To run the Melodex platform locally, follow these steps to start both the backend server and the frontend application.

## Prerequisites

1.  **Node.js**: Ensure you have Node.js installed.
2.  **PostgreSQL**: Ensure PostgreSQL is running locally and you have created a database named `melodex_db`.
    -   You can create it via: `createdb melodex_db`
    -   Run the schema to create tables: `psql -d melodex_db -f schema.sql`

---

## 1. Start the Backend Server

The backend handles authentication, iTunes API searches, and database caching.

1.  Navigate to the root directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure your `.env` file is configured (one is already provided in the root).
4.  Start the server:
    ```bash
    npm start
    ```
    -   *Server will run at `http://localhost:3000`*

---

## 2. Start the Frontend Application

The frontend is a React + Vite application.

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    -   *The app will typically run at `http://localhost:5173`*

---

## Troubleshooting
- **Database Connection Error**: Double check the `DATABASE_URL` in your `.env` file matches your local PostgreSQL credentials.
- **Port Conflict**: If port 3000 or 5173 is in use, you may need to kill the existing process or change the port in `.env` (for backend) or project settings.
