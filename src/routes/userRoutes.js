import express from 'express';
import { createUser, deleteUser, getAllUsers, getAllUsersByID, updateUser } from '../controllers/userController.js';
import validateUser from '../middleware/validation.js';

const router =  express.Router();

router.post('/user', validateUser, createUser);
router.get('/users', getAllUsers);
router.get('/user/:id', getAllUsersByID);
router.put('/user/:id', validateUser, updateUser);
router.delete('/user/:id', deleteUser);

export default router;
