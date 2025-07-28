import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import { SignJwtOptions } from '@clerk/backend/dist/jwt';

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
}): Promise<{ message: string; userId?: string }> {
  const { email, password, name, role } = signUpData;

  let clerkUser;

  try {
    console.log('Attempting to create user in Clerk:', { email, name, role });

    // Create user in Clerk
    clerkUser = await this.clerk.users.createUser({
      emailAddress: [email],
      password,
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
    });

    console.log('Clerk user created:', { userId: clerkUser.id });

    // Sync user to Supabase
    console.log('Syncing user to Supabase:', { uuid: clerkUser.id, email, name, role });
    const newUser = await this.userService.create({
      uuid: clerkUser.id,
      email,
      name,
      role: role || 'commissioning', // Ensure role is not undefined
    });

    console.log('User synced to Supabase:', newUser);

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

    // Rollback Clerk user creation if Supabase fails
    if (clerkUser?.id) {
      console.log('Rolling back Clerk user:', clerkUser.id);
      await this.clerk.users.deleteUser(clerkUser.id).catch((rollbackErr) =>
        console.error('Failed to rollback Clerk user:', rollbackErr),
      );
    }

    // Handle specific Clerk error for existing email
    if (err.status === 422 && err.errors?.some((e: any) => e.code === 'form_identifier_exists')) {
      throw new ConflictException('Email already exists');
    }

    // Handle other errors with a structured response
    throw new HttpException(
      {
        message: 'Failed to create user',
        error: err.message || 'An unexpected error occurred',
        details: err.errors || [],
      },
      err.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

  async signIn(signInData: {
    email: string;
    password: string;
  }): Promise<{ message: string; userId: string; token: string }> {
    const { email, password } = signInData;

    try {
      console.log('Attempting to authenticate user with Clerk:', { email });

      // Fetch user by email
      console.log('Fetching user list from Clerk...');
      const users = await this.clerk.users.getUserList({ emailAddress: [email] });
      if (!users.data || users.data.length === 0) {
        console.log('No user found for email:', email);
        throw new UnauthorizedException('Email not found');
      }

      const user = users.data[0];
      console.log('User found:', { userId: user.id });

      // Verify password
      console.log('Verifying password for user:', user.id);
      const isPasswordValid = await this.clerk.users.verifyPassword({
        userId: user.id,
        password,
      });

      if (!isPasswordValid) {
        console.log('Password verification failed for user:', user.id);
        throw new UnauthorizedException('Incorrect password');
      }

      // Create a new session for the user
      console.log('Creating session for user:', user.id);
      const session = await this.clerk.sessions.createSession({
        userId: user.id,
      });
      console.log('Session created:', { sessionId: session.id });

      // Generate a JWT token using sessions.getToken
      console.log('Generating JWT token for session:', session.id);
      console.log(session);
      const tokenResult = await this.clerk.sessions.getToken(session.id, 'default');
      console.log('Token result:', JSON.stringify(tokenResult, null, 2));
      const token = typeof tokenResult === 'string' ? tokenResult : (tokenResult as any).jwt || tokenResult.toString();
      console.log('Extracted JWT:', token);

      // Sync or fetch user data from Supabase
      console.log('Checking Supabase for user:', user.id);
      let dbUser = await this.userService.findById(user.id);
      if (!dbUser) {
        console.log('User not found in Supabase, syncing:', { userId: user.id });
        dbUser = await this.userService.create({
          uuid: user.id,
          email,
          name: user.firstName || 'Unknown',
          role: 'user', // Default role, adjust as needed
        });
        console.log('User synced to Supabase:', dbUser);
      } else {
        console.log('User found in Supabase:', dbUser);
      }

      return {
        message: 'Sign-in successful',
        userId: user.id,
        token,
      };
    } catch (err: any) {
      console.error('Error in signIn:', {
        message: err.message,
        status: err.status,
        errors: err.errors,
        stack: err.stack,
      });
      if (err.message.includes('Email not found') || (err.status === 422 && err.errors?.some((e: any) => e.code === 'form_identifier_not_found'))) {
        throw new UnauthorizedException('Email not found');
      }
      if (err.message.includes('Incorrect password') || err.errors?.some((e: any) => e.code === 'form_password_incorrect')) {
        throw new UnauthorizedException('Incorrect password');
      }
      throw new InternalServerErrorException(`Failed to sign in: ${err.message}`);
    }
  }

  
}