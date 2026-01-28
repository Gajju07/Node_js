// Standardized response function
import {
    createUserService,
    getAllUsersService, 
    getUserByIDService,
    updateUserService,
    deleteUserService
} from '../services/userModel.js';

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
};

import bcrypt from 'bcrypt';

export const createUser = (req, res, next) => { 
    const {name, email, password} = req.body;
    try {
        const saltRound = 10;
        const hashPassword = bcrypt.hashSync(password, saltRound);
        const user = {
            name,
            email,
            password: hashPassword
        };
        const newUser = createUserService(user);
        handleResponse(res, 200, 'User created successfully', newUser);
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        handleResponse(res, 200, 'All User fetched successfully', users);
    } catch (error) {
        next(error);
    }
};

export const getAllUsersByID = async (req, res, next) => { 
    try {
        const user = await getUserByIDService(req.params.id);
        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User fetched by ID successfully', user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => { 
    const {name, email, password} = req.body;
    try {
        const saltRound = 10;
        const hashPassword = await bcrypt.hashSync(password, saltRound);
        const updatedUser = await updateUserService(req.params.id, name, email, hashPassword);
         if (!updatedUser) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User updated successfully', updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => { 
    try {
        const deleteUser = await deleteUserService(req.params.id);
         if (!deleteUser) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User deleted successfully', deleteUser);
    } catch (error) {
        next(error);
    }
};