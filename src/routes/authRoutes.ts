import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

// Route for user login
router.post('/login', authController.login);

// Route for user logout
router.post('/logout', authController.logout);

// Route to get current logged-in user info
router.get('/me', authController.getCurrentUser);

export default router;
