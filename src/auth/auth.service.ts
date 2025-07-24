import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { createClerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class AuthService {
  private clerk: ReturnType<typeof createClerkClient>;
  
  constructor(private userService: UserService) {
    this.clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  }

  async signUp(signUpData: {
    email: string;
    password: string;
    name: string;
    role: string;
  }): Promise<{ message: string; userId: string }> {
    const { email, password, name, role } = signUpData;
    
    try {
      console.log('Attempting to create user in Clerk:', { email, name, role });
      
      // Create user in Clerk
      const clerkUser = await this.clerk.users.createUser({
        emailAddress: [email],
        password,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
      });
      
      console.log('Clerk user created:', { userId: clerkUser.id });
      
      // Sync user to Supabase
      console.log('Syncing user to Supabase:', { uuid: clerkUser.id, email, name, role });
      await this.userService.create({
        uuid: clerkUser.id,
        email,
        name,
        role,
      });
      
      console.log('User synced to Supabase successfully');
      
      return {
        message: 'User created successfully. Please check your email for verification.',
        userId: clerkUser.id,
      };
    } catch (err: any) {
      console.error('Error in signUp:', {
        message: err.message,
        status: err.status,
        errors: err.errors,
        stack: err.stack,
      });
      
      if (err.status === 422 && err.errors?.some((e: any) => e.code === 'form_identifier_exists')) {
        throw new ConflictException('Email already exists');
      }
      
      throw new InternalServerErrorException(`Failed to create user: ${err.message}`);
    }
  }

  
}