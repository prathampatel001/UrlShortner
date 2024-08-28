import { config as envConfig } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../auth/authModel';

envConfig();

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

// Extend the Express Request interface to include user information
export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  
  // Check if the Authorization header is present and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];
  // console.log(token);
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // console.log(decoded);
    
    // Assuming decoded token contains a userId
    req.headers.userId = (decoded as any).userId;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};
