# Node.js Project

A basic Node.js project built with Express.js, providing a RESTful API for user management. It uses PostgreSQL as the database and includes features like user creation, retrieval, updating, and deletion with input validation.

## Features

- RESTful API for user management
- PostgreSQL database integration
- Input validation using Joi
- Error handling middleware
- CORS support for cross-origin requests
- Environment variable configuration

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- PostgreSQL database server

## Installation

1. Clone the repository or download the project files.

2. Navigate to the project directory:
   ```
   cd /path/to/your/project
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Environment Setup

1. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```

2. Open the `.env` file and update the values according to your environment:
   - `PORT`: The port number for the server (default: 3000)
   - `NODE_ENV`: Environment mode (e.g., development, production)
   - `DB_HOST`: PostgreSQL host (default: localhost)
   - `DB_PORT`: PostgreSQL port (default: 5432)
   - `DB_NAME`: Database name (e.g., task_management)
   - `DB_USER`: Database username
   - `DB_PASSWORD`: Database password

## Database Setup

1. Ensure PostgreSQL is running on your system.

2. Create a database with the name specified in your `.env` file (e.g., `task_management`).

3. The application will automatically create the necessary tables (`users`) when it starts.

## Running the Application

### Development Mode
To run the application in development mode with automatic restarts:
```
npm run dev
```

### Production Mode
To run the application in production mode:
```
npm start
```

The server will start on the port specified in your `.env` file (default: 3000). You can access the API at `http://localhost:3000`.

## API Endpoints

The API provides the following endpoints under the `/api` prefix:

- `GET /`: Test endpoint to check server and database connection
- `POST /api/user`: Create a new user (requires validation)
- `GET /api/users`: Get all users
- `GET /api/user/:id`: Get a user by ID
- `PUT /api/user/:id`: Update a user by ID (requires validation)
- `DELETE /api/user/:id`: Delete a user by ID

### Example API Usage

Create a user:
```
POST /api/user
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

Get all users:
```
GET /api/users
```

## Project Structure

```
├── index.js                 # Main entry point
├── package.json             # Project dependencies and scripts
├── .env.example             # Environment variables template
├── src/
│   ├── config/
│   │   └── db.js            # Database configuration
│   ├── controllers/
│   │   ├── userController.js # User-related logic
│   │   └── taskController.js # Task-related logic (not yet implemented)
│   ├── data/
│   │   ├── createUsertable.js # User table creation script
│   │   ├── data.sql         # SQL scripts
│   │   └── tasks.js         # Task data (empty)
│   ├── middleware/
│   │   ├── errorHandler.js  # Error handling middleware
│   │   ├── logger.js        # Logging middleware
│   │   └── validation.js    # Input validation middleware
│   ├── routes/
│   │   ├── userRoutes.js    # User API routes
│   │   └── taskRoutes.js    # Task API routes (empty)
│   └── services/
│       └── userModel.js     # User service/model
├── models/
│   └── userModel.js         # User model
└── README.md                # This file
```

## Development

- The project uses ES modules (`"type": "module"` in package.json).
- Nodemon is used for development to automatically restart the server on file changes.
- Joi is used for input validation.
- CORS is enabled for handling cross-origin requests.

## License

This project is licensed under the ISC License.

