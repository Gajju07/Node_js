import express from 'express'; // Adding express.js
import dotenv from 'dotenv'; // Adding .env
import cors from 'cors'; // adding cors for testing/ making HTTP request
import pool from './src/config/db.js'; // Adding database config
import userRoutes from './src/routes/userRoutes.js'; // Importing user routes
import errorHandler from './src/middleware/errorHandler.js'; // Importing error handling middleware
import createUserTable from './src/data/createUsertable.js'; // Create table script

// Load environment variables FIRST
dotenv.config();

// Creating a app
const app = express();

// Setting up port 
const server_port = process.env.PORT || 3000;

// Setting middleware 
// IMPORTANT: express.json() must stay above routes to fix the "req.body undefined" error
app.use(express.json()); 
app.use(cors());

// Create table if not exists
createUserTable();

// Testing Postgres database connection and server status
app.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT current_database();");
        res.json({ 
            message: 'Server is running',
            database: result.rows[0].current_database 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Using user routes
app.use('/api', userRoutes);

// Using error handling middleware
// IMPORTANT: This must be the very last middleware added to the stack
app.use(errorHandler); 

// Listening the server
app.listen(server_port, () => {
    console.log(`Server is running on port ${server_port}`);
});