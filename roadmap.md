Phase 1: Foundation (Must Start Here)
HTTP Request/Response Cycle - Core conceptual foundation  1
Http Messages - Understanding what's being sent/received  1
Http Basics - Practical HTTP fundamentals 1   
Express Basics - Framework introduction
Express - App Example - First working server
Phase 2: Core Backend Skills (High Priority)
Middleware - Setup - Critical for request processing
APP.USE - Middleware application (essential pattern)
Methods - GET - Basic HTTP method handling
Methods - POST - Data submission handling
Methods - POST (Form Example) - Real-world data handling
Route Params - URL parameter extraction
Query String - Query parameter handling
Phase 3: Modern Best Practices (Critical for Long-term)
Async Patterns - Setup Promises - Foundation of async JavaScript
Async Patterns - Refactor To Async - Modern async/await patterns
Async Patterns - Node's Native Option - Understanding callbacks vs promises vs async/await
Events Emitter - Code Example - Event-driven architecture understanding
Phase 4: Advanced Concepts (Build After Foundation)
Express Router - Setup - Code organization and scalability
Express Router - Controllers - Proper separation of concerns
Methods - PUT & DELETE - RESTful API completeness
Streams - Read File - Performance optimization patterns
Middleware (Multiple Functions) - Advanced middleware chaining
Phase 5: Practical Tools & Testing
Install Postman - Essential testing tool
Starter Project Install & Overview - Project setup best practices

---

## **Capstone Mini Project: Task Management API**

### **Project Overview**
Build a complete REST API for a Task Management system that consolidates all learned concepts into a production-like application.

### **Project Requirements**

#### **1. Core Features**
- **Tasks CRUD Operations**
  - GET /api/tasks - Retrieve all tasks with optional filtering
  - GET /api/tasks/:id - Retrieve a single task by ID
  - POST /api/tasks - Create a new task
  - PUT /api/tasks/:id - Update an existing task
  - DELETE /api/tasks/:id - Delete a task

#### **2. Query Filtering Features**
- /api/tasks?status=completed - Filter by status
- /api/tasks?priority=high - Filter by priority
- /api/tasks?sort=createdAt - Sort results

#### **3. Middleware Implementation**
- Request logging middleware (log method, path, timestamp)
- Error handling middleware
- Request validation middleware
- CORS middleware

#### **4. Best Practices to Implement**
- **Code Organization**: Use Express Router and Controllers pattern
  - `/routes/taskRoutes.js` - Define routes
  - `/controllers/taskController.js` - Handle business logic
  - `/middleware/validation.js` - Validate requests
  - `/middleware/errorHandler.js` - Handle errors

- **Async/Await**: Use modern async patterns for all operations
  - Proper error handling with try-catch
  - No callback hell

- **Data Persistence**: Use in-memory array (no database required initially)
  - Easy to swap with a database later

#### **5. Testing with Postman**
- Create comprehensive requests for all endpoints
- Test error scenarios (invalid ID, missing fields)
- Test filtering and sorting

Note :- 

### **Project Structure**
```
project-root/
├── index.js (server setup)
├── routes/
│   └── taskRoutes.js
├── controllers/
│   └── taskController.js
├── middleware/
│   ├── errorHandler.js
│   ├── validation.js
│   └── logger.js
├── data/
│   └── tasks.js (in-memory storage)
├── .env
├── package.json
└── README.md
```

### **Learning Outcomes**
✅ Build production-like REST API architecture
✅ Master Express routing and controllers
✅ Implement multiple middleware layers
✅ Use async/await for clean code
✅ Practice error handling
✅ Learn code organization best practices
✅ Test with Postman like a real backend developer

---

## **Phase 6: PostgreSQL Integration**

### **PostgreSQL Setup & Installation**

#### **1. Install PostgreSQL**
- **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
- **macOS**: `brew install postgresql@15`
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

#### **2. Start PostgreSQL Service**
```bash
# Ubuntu/Debian
sudo systemctl start postgresql

# macOS
brew services start postgresql

# Windows (should start automatically)
```

#### **3. Create Database & User**
```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database
CREATE DATABASE task_management;

-- Create user with password
CREATE USER task_user WITH PASSWORD 'secure_password';

-- Grant privileges
ALTER ROLE task_user SET client_encoding TO 'utf8';
ALTER ROLE task_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE task_user SET default_transaction_deferrable TO on;
ALTER ROLE task_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE task_management TO task_user;

-- Exit
\q
```

### **Node.js PostgreSQL Integration**

#### **1. Install Required Packages**
```bash
npm install pg dotenv
# pg: PostgreSQL client for Node.js
# dotenv: Environment variable management
```

#### **2. Database Connection Setup**
Create `/db/connection.js`:
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
```

#### **3. Update .env File**
```env
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=task_user
DB_PASSWORD=secure_password
```

#### **4. Create Database Schema**
Create migration file `/db/init.sql`:
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date DATE
);

-- Create index for faster queries
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
```

Run migration:
```bash
psql -U task_user -d task_management -f db/init.sql
```

#### **5. Update Controller with Database Queries**
Create `/controllers/taskController.js`:
```javascript
const pool = require('../db/connection');

// Get all tasks with filtering
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, sort } = req.query;
    
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = $' + (params.length + 1);
      params.push(status);
    }

    if (priority) {
      query += ' AND priority = $' + (params.length + 1);
      params.push(priority);
    }

    if (sort === 'createdAt') {
      query += ' ORDER BY created_at DESC';
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get single task
exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Create task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    const result = await pool.query(
      'INSERT INTO tasks (title, description, priority, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, priority, dueDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [title, description, status, priority, dueDate, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted', task: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
```

### **Updated Project Structure with Database**
```
project-root/
├── index.js (server setup)
├── db/
│   ├── connection.js (PostgreSQL connection)
│   └── init.sql (database schema)
├── routes/
│   └── taskRoutes.js
├── controllers/
│   └── taskController.js
├── middleware/
│   ├── errorHandler.js
│   ├── validation.js
│   └── logger.js
├── .env
├── package.json
└── README.md
```

### **Key Concepts to Learn**

1. **Connection Pooling** - Reuse database connections efficiently
2. **Parameterized Queries** - Prevent SQL injection (`$1`, `$2`, etc.)
3. **ACID Transactions** - Data consistency and reliability
4. **Indexes** - Query performance optimization
5. **Error Handling** - Database connection failures
6. **Migration Strategy** - Managing database schema changes

### **Best Practices**
✅ Use connection pooling for production apps
✅ Always use parameterized queries (prevent SQL injection)
✅ Handle database errors gracefully
✅ Use indexes for frequently queried columns
✅ Keep database logic separate from business logic
✅ Use environment variables for credentials

---

## **Phase 7: TypeScript with Express & PostgreSQL**

### **TypeScript Fundamentals**

#### **1. Why TypeScript?**
- **Type Safety** - Catch errors during development, not production
- **Better IDE Support** - Autocomplete, refactoring, inline documentation
- **Self-Documenting Code** - Types serve as inline documentation
- **Production Ready** - Used by major companies (Microsoft, Google, Uber)

#### **2. Install TypeScript & Dependencies**
```bash
npm install -D typescript @types/node @types/express ts-node nodemon
npm install pg dotenv express
```

Package explanations:
- `typescript` - TypeScript compiler
- `@types/node` - Type definitions for Node.js
- `@types/express` - Type definitions for Express
- `ts-node` - Run TypeScript directly without compilation
- `nodemon` - Auto-reload on file changes

#### **3. Initialize TypeScript Configuration**
```bash
npx tsc --init
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### **4. Update package.json Scripts**
```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "watch": "tsc --watch"
  }
}
```

### **TypeScript Basics for Node.js Backend**

#### **1. Basic Types**
```typescript
// Primitive types
const name: string = 'John';
const age: number = 25;
const isActive: boolean = true;
const nullable: string | null = null;

// Arrays
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ['a', 'b'];

// Union types
const id: string | number = 123;

// Any (avoid when possible - defeats purpose of TypeScript)
const data: any = 'could be anything';

// Unknown (safer than any)
const unknown: unknown = 'something';
if (typeof unknown === 'string') {
  console.log(unknown.toUpperCase());
}
```

#### **2. Interfaces & Type Aliases**
```typescript
// Interface (preferred for objects)
interface Task {
  id: number;
  title: string;
  description?: string; // optional property
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

// Type alias
type TaskStatus = 'pending' | 'in_progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

// Using interface
const task: Task = {
  id: 1,
  title: 'Learn TypeScript',
  status: 'in_progress',
  priority: 'high',
  createdAt: new Date(),
  updatedAt: new Date()
};
```

#### **3. Functions with Types**
```typescript
// Function parameters and return type
function addTask(title: string, priority: string): Task {
  return {
    id: 1,
    title,
    status: 'pending',
    priority: priority as TaskPriority,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Arrow function
const calculateTotal = (prices: number[]): number => {
  return prices.reduce((sum, price) => sum + price, 0);
};

// Optional and default parameters
function createTask(title: string, priority: TaskPriority = 'medium'): Task {
  // implementation
}

// Async functions
async function fetchTask(id: number): Promise<Task> {
  // implementation
  return {} as Task;
}
```

#### **4. Classes in TypeScript**
```typescript
class TaskManager {
  private tasks: Task[] = [];
  protected maxTasks: number = 100;

  constructor(private userId: string) {}

  public addTask(task: Task): void {
    if (this.tasks.length < this.maxTasks) {
      this.tasks.push(task);
    }
  }

  public getTasks(): Task[] {
    return this.tasks;
  }

  protected validateTask(task: Task): boolean {
    return task.title.length > 0;
  }
}
```

### **Converting Project to TypeScript**

#### **Project Structure**
```
project-root/
├── src/
│   ├── index.ts
│   ├── db/
│   │   ├── connection.ts
│   │   └── init.sql
│   ├── routes/
│   │   └── taskRoutes.ts
│   ├── controllers/
│   │   └── taskController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── logger.ts
│   └── types/
│       └── task.ts
├── dist/ (generated)
├── tsconfig.json
├── .env
└── package.json
```

#### **1. Create Types File** (`src/types/task.ts`)
```typescript
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: Date;
  updated_at: Date;
  due_date?: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: Date;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: Date;
}
```

#### **2. Database Connection** (`src/db/connection.ts`)
```typescript
import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
```

#### **3. Controllers** (`src/controllers/taskController.ts`)
```typescript
import { Request, Response, NextFunction } from 'express';
import pool from '../db/connection';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, priority, sort } = req.query;

    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = $' + (params.length + 1);
      params.push(status);
    }

    if (priority) {
      query += ' AND priority = $' + (params.length + 1);
      params.push(priority);
    }

    if (sort === 'createdAt') {
      query += ' ORDER BY created_at DESC';
    }

    const result = await pool.query(query, params);
    res.json(result.rows as Task[]);
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(result.rows[0] as Task);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, priority, due_date }: CreateTaskRequest = req.body;

    const result = await pool.query(
      'INSERT INTO tasks (title, description, priority, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, priority || 'medium', due_date]
    );

    res.status(201).json(result.rows[0] as Task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date }: UpdateTaskRequest = req.body;

    const result = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), priority = COALESCE($4, priority), due_date = COALESCE($5, due_date), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [title, description, status, priority, due_date, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(result.rows[0] as Task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted', task: result.rows[0] as Task });
  } catch (err) {
    next(err);
  }
};
```

#### **4. Middleware** (`src/middleware/errorHandler.ts`)
```typescript
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${status}] ${message}`, err);

  res.status(status).json({
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === 'development' && { details: err })
    }
  });
};
```

#### **5. Routes** (`src/routes/taskRoutes.ts`)
```typescript
import { Router } from 'express';
import * as taskController from '../controllers/taskController';

const router = Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
```

#### **6. Main Server** (`src/index.ts`)
```typescript
import express, { Express } from 'express';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### **TypeScript Best Practices**

✅ **Always use strict mode** (`"strict": true` in tsconfig.json)
✅ **Avoid `any` type** - Use `unknown` or more specific types
✅ **Use interfaces for data contracts**
✅ **Create separate types file** for reusable interfaces
✅ **Use generic types** for reusable components
✅ **Enable source maps** for easier debugging
✅ **Use enums** for fixed sets of values (instead of strings)

### **Running TypeScript Project**
```bash
# Development (watch mode with auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

### **Learning Outcomes**
✅ Understand TypeScript types and interfaces
✅ Set up TypeScript in Node.js project
✅ Write type-safe Express application
✅ Integrate TypeScript with PostgreSQL
✅ Catch errors at compile-time (not runtime)
✅ Write production-ready, maintainable code
✅ Use advanced TypeScript features (generics, decorators)