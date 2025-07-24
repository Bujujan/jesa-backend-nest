import { Controller, Post, Body, ConflictException, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpData: { email: string; password: string; name: string; role: string },
  ): Promise<{ message: string; userId: string }> {
    try {
      return await this.authService.signUp(signUpData);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to process signup request');
    }
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