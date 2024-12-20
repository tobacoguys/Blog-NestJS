import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiKeyGuard } from './guard/api-key.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UseGuards(ApiKeyGuard)
  async signup(
    @Body() signupDto: SignupDto,
  ): Promise<{ user: any; token: string }> {
    const { user, token } = await this.authService.signup(signupDto);
    return { user, token };
  }

  @Post('/login')
  @UseGuards(ApiKeyGuard)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ user: any; token: string }> {
    const { user, token } = await this.authService.login(loginDto);
    return { user, token };
  }
}
