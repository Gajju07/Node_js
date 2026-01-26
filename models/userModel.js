import pool from '../config/db.js';

export const getAllUsers = async (req, res, next) => {
    const result = await pool.query('SELECT * FROM users;');
    return result.rows;
}

export const getUserById = async (req, res, next) => {
    const result = await pool.query('SELECT * FROM USERS WHERE id = $1;', [req.params.id]);
    return result.rows[0];
}

export const createUser = async (req, res, next) => {
    const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;', [req.body.name, req.body.email]);
    return result.rows[0];
}

export const updateUser = async (req, res, next) => {
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *;', [req.body.name, req.body.email, req.params.id]);
    return result.rows[0];
}

export const deleteUser = async (req, res, next) => {
 const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [req.params.id]);
 return result.rows[0];
}

