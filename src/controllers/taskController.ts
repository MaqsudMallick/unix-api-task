import { Request, Response } from 'express';
import * as taskService from '../services/taskService';
import { Status, TaskDTO, TaskUpdateDto } from '../models/taskModel';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AuthenticatedRequest } from '../models/userModel';

// Retrieve all tasks for the authenticated user
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as unknown as AuthenticatedRequest).session.userId;

        // Ensure user is authenticated
        if(!userId) {
            res.status(401).json({ message: 'Unauthorized. User not logged in.' });
            return;
        }

        // Fetch tasks belonging to the user
        const tasks = await taskService.getTasksByUserId(userId!);
        res.status(200).json({ data: tasks });
    }
    catch (error: any) {
        // Return server error if something fails
        res.status(500).json({ message: error.message });
    }
};

// Create a new task for the authenticated user
export const createNewTask = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body
        if (!req.body) {
            res.status(400).json({ message: 'Body undefined' });
            return;
        } 
        
        const taskDto = plainToInstance(TaskDTO, req.body);
        const errors = await validate(taskDto);

        // Return validation errors if any
        if (errors.length > 0) {
            res.status(400).json({ message: errors });
            return;
        }

        const userId = (req as AuthenticatedRequest).session.userId;

        // Ensure user is authenticated
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. User not logged in.' });
            return;
        }

        // Prepare new task data
        const newTask = {
            name: req.body.name,
            status: Status.PROCESSING,
            userId: userId,
        };

        // Save new task to database
        const created = await taskService.createTask(newTask);
        res.status(201).json({ data: created });
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;

        // Task ID is required for update
        if (!id)  {
            res.status(400).json({ message: 'Id is required' });
            return;
        }

        const userId = (req as AuthenticatedRequest).session.userId;

        // Ensure user is authenticated
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. User not logged in.' });
            return;
        }

        // Check if the task exists
        const task = await taskService.getTaskById(id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        // Only the owner of the task can update it
        if (task.userId !== userId) {
            res.status(403).json({ message: 'Forbidden. You can only update your own tasks.' });
            return;
        }

        // Validate update payload
        const taskDto = plainToInstance(TaskUpdateDto, req.body);
        const errors = await validate(taskDto);

        if (errors.length > 0) {
            res.status(400).json({ message: errors });
            return;
        }

        // Update task with new data
        const updated = await taskService.updateTask(id, req.body);

        // Respond based on update result
        if (updated) res.status(200).json({ data: updated });
        else res.status(404).json({ message: 'Task not found' });
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;

        // Task ID is required for deletion
        if (!id) {
            res.status(400).json({ message: 'Id is required' });
            return;
        }

        const userId = (req as AuthenticatedRequest).session.userId;

        // Ensure user is authenticated
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. User not logged in.' });
            return;
        }

        // Retrieve task by ID
        const task = await taskService.getTaskById(id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        // Ensure the task belongs to the current user
        if (task.userId !== userId) {
            res.status(403).json({ message: 'Forbidden. You can only delete your own tasks.' });
            return;
        }

        // Proceed with deletion
        const deleted = await taskService.deleteTask(id);

        // Respond based on deletion result
        if (deleted) res.status(204).json({ data: deleted });
        else res.status(404).json({ message: 'Task not found' });
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
