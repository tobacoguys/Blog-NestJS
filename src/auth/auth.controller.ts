import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiTags('Auth')
  @ApiBearerAuth('')
  @ApiOperation({
    summary: 'User Signup',
    description: 'Registers a new user and returns user information along with a JWT token.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered and token issued.',
    type: SignupDto,
  })
  @Post('/signup')
  async signup(@Body() signupDto: SignupDto): Promise<{ message: string }> {
    return await this.authService.signup(signupDto);
  }
  
  @ApiTags('Auth')
  @ApiBearerAuth('')
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Verifies the OTP sent to the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP successfully verified.',
    type: VerifyOtpDto,
  })
  @Post('/verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    return await this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }
  
  @ApiTags('Auth')
  @ApiBearerAuth('')
  @ApiOperation({
    summary: 'User Login',
    description: 'Logs in a user and returns user information along with a JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in and token issued.',
    type: LoginDto,
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ user: any; token: string }> {
    return await this.authService.login(loginDto);
  }
  
}
