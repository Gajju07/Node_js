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

export const createUser = (req, res, next) => { 
    const {name, email} = req.body;
    try {
        const user = {
            name,
            email
        };
        const newUser = createUserService(user);
        handleResponse(res, 200, 'User created successfully', newUser);
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = (req, res, next) => { 
    try {
        const users = getAllUsersService();
        handleResponse(res, 200, 'All User fetched successfully', users);
    } catch (error) {
        next(error);
    }
};

export const getAllUsersByID = (req, res, next) => { 
    try {
        const user = getUserByIDService(req.params.id);
        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User fetched by ID successfully', user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => { 
    const {name, email} = req.body;
    try {
        const updatedUser = await updateUserService(req.params.id, name, email);
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
        const user = await deleteUserService(req.params.id);
         if (!user) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User deleted successfully', user);
    } catch (error) {
        next(error);
    }
};