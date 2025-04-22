import { Request, Response, NextFunction } from 'express';
import { Session } from 'express-session';

// Define a custom interface extending the Request
interface AuthenticatedRequest extends Request {
  session: Session & {
    userId?: string;
    email?: string;
  };
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.session.userId) {
    res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  next();
};