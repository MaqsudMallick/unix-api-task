import { Request, Response } from 'express';
import * as userService from '../services/userService';
import bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { AuthenticatedRequest, LoginDTO } from '../models/userModel';
import { validate } from 'class-validator';

// Handles user login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if request body exists
    if (!req.body) {
      res.status(400).json({ message: 'Body undefined' });
      return;
    }
    
    // Convert plain request body into LoginDTO instance and validate it
    const loginDto = plainToInstance(LoginDTO, req.body);
    const errors = await validate(loginDto);
    
    // If validation fails, return bad request with error messages
    if (errors.length > 0) {
      res.status(400).json({ message: errors });
      return;
    }
    
    const { email, password } = req.body;
    
    // Attempt to retrieve user by email
    const user = await userService.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Save user ID and email in session for authentication tracking
    (req as AuthenticatedRequest).session.userId = user.id;
    (req as AuthenticatedRequest).session.email = user.email;
    
    // Remove password before sending user data in response
    const { password: _, ...userWithoutPassword } = user;
    
    // Send success response with user data
    res.status(200).json({ 
      message: 'Login successful',
      data: userWithoutPassword
    });
  } catch (error: any) {
    // Log error and return internal server error
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Handles user logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;

    // Destroy session to log user out
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: 'Failed to logout' });
        return;
      }

      // Clear session cookie and send success response
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error: any) {
    // Handle any unexpected error
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Retrieves the currently logged-in user's information
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).session.userId;

    // Check if session contains userId
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Retrieve user by ID
    const user = await userService.getUser(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove password before returning user data
    const { password, ...userWithoutPassword } = user;

    // Send user data
    res.status(200).json({ data: userWithoutPassword });
  } catch (error: any) {
    // Handle unexpected error
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
