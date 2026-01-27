import {
    createUserService,
    getAllUsersService,
    getUserByIDService,
    updateUserService,
    deleteUserService
} from '../services/userModel.js';

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
};

export const createUser = async (req, res, next) => {
    const { name, email } = req.body;
    try {
        const user = { name, email };
        // Added await here so we wait for the DB to insert the user
        const newUser = await createUserService(user);
        
        // Changed status to 201 (Created) which is standard for creation
        handleResponse(res, 201, 'User created successfully', newUser);
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        // Added await here
        const users = await getAllUsersService();
        
        // FIXED BUG: changed 'user' to 'users' to match the variable above
        handleResponse(res, 200, 'All Users fetched successfully', users);
    } catch (error) {
        next(error);
    }
};

export const getAllUsersByID = async (req, res, next) => {
    try {
        // Added await here
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
    const { name, email } = req.body;
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