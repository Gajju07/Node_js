import pool from '../config/db.js';

// // Get all tasks
// export const getAllTasks = async (req, res, next) => {
//     try {
//         const { status, priority } = req.query;
//         let query = 'SELECT * FROM tasks WHERE 1=1';
//         const params = [];

//         if (status) {
//             query += ' AND status = $' + (params.length + 1);
//             params.push(status);
//         }

//         if (priority) {
//             query += ' AND priority = $' + (params.length + 1);
//             params.push(priority);
//         } 

//         query += ' ORDER BY created_at DESC';
//         const result = await pool.query(query, params);
//         res.json(result.rows);
//     } catch (error) {
//         next(error);
//     }
// };

// // Get single task
// export const getTaskById = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         res.json(result.rows[0]);
//     } catch (error) {
//         next(error);
//     }
// };

// // Create task
// export const createTask = async (req, res, next) => {
//     try {
//         const { title, description, priority, due_date } = req.body;

//         if (!title) {
//             return res.status(400).json({ error: 'Title is required' });
//         }

//         const result = await pool.query(
//             'INSERT INTO tasks (title, description, priority, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
//             [title, description, priority || 'medium', due_date]
//         );

//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         next(error);
//     }
// };

// // Update task
// export const updateTask = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { title, description, status, priority, due_date } = req.body;

//         const result = await pool.query(
//             'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), priority = COALESCE($4, priority), due_date = COALESCE($5, due_date), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
//             [title, description, status, priority, due_date, id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         res.json(result.rows[0]);
//     } catch (error) {
//         next(error);
//     }
// };

// // Delete task
// export const deleteTask = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'Task not found' });
//         }

//         res.json({ message: 'Task deleted', task: result.rows[0] });
//     } catch (error) {
//         next(error);
//     }
// };
