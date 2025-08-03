import { User } from '@clerk/backend';

export interface ClerkRequest {
  user: User;
  headers: any;
  body: any;
  params: any;
  query: any;
}