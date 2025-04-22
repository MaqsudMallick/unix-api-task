import { Request, Response } from 'express'
import * as userService from '../services/userService'
import { plainToInstance } from 'class-transformer'
import { UserDTO } from '../models/userModel'
import { validate } from 'class-validator'

// Get a single user by their ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id; // Extract user ID from request parameters

        const user = await userService.getUser(id); // Fetch user from service layer

        res.status(200).json({ data: user }); // Return user in response
    } catch (error: any) {
        console.log(error); // Log the error for debugging
        res.status(500).json({ message: error.message }); // Return server error
    }
}

// Create a new user with validated data
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ensure request body is not empty
        if (!req.body) {
            res.status(400).json({ message: 'Body undefined' });
            return;
        }

        // Convert plain object to instance of UserDTO for validation
        const userDto = plainToInstance(UserDTO, req.body);

        // Validate the incoming data
        const errors = await validate(userDto);
        if (errors.length > 0) {
            res.status(400).json({ message: errors }); // Return validation errors
            return;
        }

        // Create user with validated data
        const user = await userService.createUser(req.body);

        res.status(201).json({ data: user }); // Return created user
    } catch (error: any) {
        console.log(error); // Log the error
        res.status(500).json({ message: error.message }); // Return server error
    }
}

// Delete a user by their ID
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id; // Extract user ID from request parameters

        const user = await userService.deleteUser(id); // Delete user using service layer

        res.status(200).json({ data: user }); // Return deleted user data
    } catch (error: any) {
        console.log(error); // Log the error
        res.status(500).json({ message: error.message }); // Return server error
    }
}
