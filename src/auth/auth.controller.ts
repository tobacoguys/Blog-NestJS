import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({
    summary: 'User Signup',
    description:
      'Registers a new user and returns user information along with a JWT token.',
  })
  @ApiBody({
    description: 'User registration details',
    type: SignupDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered and token issued.',
    schema: {
      example: {
        user: {
          id: '123',
          username: 'john_doe',
          email: 'john@example.com',
        },
        token: 'jwt_token_here',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation error in provided user data.',
  })
  async signup(
    @Body() signupDto: SignupDto,
  ): Promise<{ user: any; token: string }> {
    const { user, token } = await this.authService.signup(signupDto);
    return { user, token };
  }

  @Post('/login')
  @ApiOperation({
    summary: 'User Login',
    description:
      'Logs in an existing user and returns user information along with a JWT token.',
  })
  @ApiBody({
    description: 'User login credentials',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in and token issued.',
    schema: {
      example: {
        user: {
          id: '123',
          username: 'john_doe',
          email: 'john@example.com',
        },
        token: 'jwt_token_here',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ user: any; token: string }> {
    const { user, token } = await this.authService.login(loginDto);
    return { user, token };
  }
}
