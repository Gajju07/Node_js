import express from 'express'; // Adding express.js
import dotenv from 'dotenv'; // Adding .env
import cors from 'cors'; // adding cors for testing/ making HTTP request
import pool from './src/config/db.js'; // Adding database config
import userRoutes from './src/routes/userRoutes.js'; // Importing user routes
import errorHandler from './src/middleware/errorHandler.js'; // Importing error handling middleware
import createUserTable from './src/data/createUsertable.js'; // Create table script
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Load environment variables FIRST
dotenv.config();

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js API',
    version: '1.0.0',
    description: 'A simple Node.js API for user management',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

// Creating a app
const app = express();

// Setting up port 
const server_port = process.env.PORT || 3000;

// Setting middleware 
// IMPORTANT: express.json() must stay above routes to fix the "req.body undefined" error
app.use(express.json()); 
app.use(cors());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Create table if not exists
createUserTable();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check server and database status
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 database:
 *                   type: string
 *       500:
 *         description: Database connection error
 */
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