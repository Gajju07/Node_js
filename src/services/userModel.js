import pool from "../config/db.js";

export const getAllUsersService = async () => {
 const result = await pool.query('SELECT * FROM users;');
 return result.rows;
}

export const getUserByIDService = async (id) => {
 const result = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
 return result.rows[0];
}

export const createUserService = async (user) => {
 const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, user.password]);
 return result.rows[0];
}

export const updateUserService = async (id, name, email, password) => {
 const result = await pool.query('UPDATE users SET name = $1, email = $2, password = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *;', [name, email, password, id]);
 return result.rows[0];
}

export const deleteUserService = async (id) => {
 const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);
 return result.rows[0];
}

// experiment 
// export const getUserStreakService = async (id) => {
//  const result = await pool.query('SELECT * FROM user_streaks WHERE user_id = $1;', [id]);
//  return result.rows[0];
// } 



// // User model/service for business logic
// let users = [];
// let userIdCounter = 1;

// export const createUser = (userData) => {
//     const user = {
//         id: userIdCounter++,
//         ...userData,
//         createdAt: new Date()
//     };
//     users.push(user);
//     return user;
// };

// export const getAllUsers = () => {
//     return users;
// };

// export const getAllUsersByID = (id) => {
//     return users.find(user => user.id === parseInt(id));
// };

// export const updateUser = (id, name, email) => {
//     const user = users.find(user => user.id === parseInt(id));
//     if (user) {
//         if (name) user.name = name;
//         if (email) user.email = email;
//         user.updatedAt = new Date();
//     }
//     return user;
// };

// export const deleteUser = (id) => {
//     const index = users.findIndex(user => user.id === parseInt(id));
//     if (index !== -1) {
//         const deletedUser = users[index];
//         users.splice(index, 1);
//         return deletedUser;
//     }
//     return null;
// };
