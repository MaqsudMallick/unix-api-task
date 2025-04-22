import express from 'express';
import taskRoute from './routes/taskRoutes';
import userRoute from './routes/userRoutes';  
import authRoute from './routes/authRoutes';  
import session from 'express-session';
import { isAuthenticated } from './middleware/authMiddleware';

const app = express();
const port = 3000;

// Configure session with more options
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
  }
}));

app.use(express.json());

// Public routes
app.use('/auth', authRoute);
app.use('/users', userRoute);

// Protected routes
app.use('/tasks', isAuthenticated, taskRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});