import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body() signupDto: SignupDto,
  ): Promise<{ user: any; token: string }> {
    const { user, token } = await this.authService.signup(signupDto);
    return { user, token };
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ user: any; token: string }> {
    const { user, token } = await this.authService.login(loginDto);
    return { user, token };
  }
}
