import { User } from '../models/user.entity';

declare module 'express' {
  interface Request {
    user?: User | { uuid: string }; // Adjust based on your auth middleware's user object
  }
}