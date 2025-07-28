import { Controller, Post, Body, ConflictException, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpData: { email: string; password: string; name: string; role?: string },
  ): Promise<{ message: string; userId: string }> {
    try {
      // Set default role to 'commissioning' if not provided
      const dataWithDefaultRole = { ...signUpData, role: signUpData.role || 'commissioning' };
      return await this.authService.signUp(dataWithDefaultRole) as any;
    } catch (err) {
      throw err; // Let NestJS handle the error for proper HTTP response
    }
  }

  @Post('signin')
  async signIn(@Body() signInData: { email: string; password: string }) {
    return this.authService.signIn(signInData);
  }

//   @Post('signin')
//   async signIn(
//     @Body() signInData: { email: string; password: string },
//   ): Promise<{ message: string; userId: string; token: string }> {
//     try {
//       return await this.authService.signIn(signInData);
//     } catch (err) {
//       if (err instanceof UnauthorizedException || err instanceof UnprocessableEntityException) {
//         throw err;
//       }
//       throw new UnprocessableEntityException(`Failed to process signin request: ${err.message}`);
//     }
//   }
}