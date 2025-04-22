import express from 'express';
import * as taskController from '../controllers/taskController';

const router = express.Router();

// Get all tasks for the logged-in user
router.get('/', taskController.getTasks);

// Create a new task for the logged-in user
router.post('/', taskController.createNewTask);

// Update an existing task by ID (only if it belongs to the logged-in user)
router.put('/:id', taskController.updateTask);

// Delete a task by ID (only if it belongs to the logged-in user)
router.delete('/:id', taskController.deleteTask);

export default router;
