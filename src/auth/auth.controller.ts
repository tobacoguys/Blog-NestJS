import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto): Promise<{ message: string }> {
    return await this.authService.signup(signupDto);
  }
  
  @Post('/verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    return await this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }
  
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ user: any; token: string }> {
    return await this.authService.login(loginDto);
  }
  
}
