import pool from '../config/db.js';

export const getAllUsers = async () => {
    // Note: In production, avoid 'SELECT *' to keep passwords hidden
    const result = await pool.query('SELECT id, name, email FROM users;'); 
    return result.rows;
}

export const getUserById = async (id) => {
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1;', [id]);
    return result.rows[0];
}

export const createUser = async (name, email, password) => {
    // Added password to the INSERT statement
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email;', 
        [name, email, password]
    );
    return result.rows[0];
}

export const updateUser = async (id, name, email, password) => {
    // Updated to allow password changes
    const result = await pool.query(
        'UPDATE users SET name = $1, email = $2, password = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email;', 
        [name, email, password, id]
    );
    return result.rows[0];
}

export const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, name, email;', [id]);
    return result.rows[0];
}