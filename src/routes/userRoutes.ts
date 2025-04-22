import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

// Get a user by their ID
router.get('/:id', userController.getUser);

// Create a new user
router.post('/', userController.createUser);

// Delete a user by their ID
router.delete('/:id', userController.deleteUser);

export default router;
