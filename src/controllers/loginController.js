import bcrypt from 'bcrypt';
// import { loginService } from '../services/userModel.js';

// // Standardized response function (Make sure this is defined or imported)
// const handleResponse = (res, status, message, data = null) => {
//     res.status(status).json({
//         status,
//         message,
//         data
//     });
// };

// export const loginUser = async (req, res, next) => {
//     const { email, password } = req.body;

//     try {
//         // 1. Fetch user by email
//         const user = await loginService(email);
        
//         // 2. Generic error for missing user (Security Best Practice)
//         if (!user) {
//             return handleResponse(res, 400, 'Invalid email or password');
//         }

//         // 3. Compare hashed password
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return handleResponse(res, 400, 'Invalid email or password');
//         }

//         // 4. Success: Strip the password hash before sending
//         const { password: _, ...userData } = user;
//         handleResponse(res, 200, 'Login successful', userData);

//     } catch (error) {
//         // Pass server errors to your global error handler
//         next(error);
//     }
// };