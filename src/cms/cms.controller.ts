import { Body, Controller, Post } from '@nestjs/common';
import { CmsService } from './cms.service';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('cms')
export class CmsController {
    constructor(
        private readonly cmsService: CmsService,
        private readonly jwtService: JwtService,
    ) {}

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Create admin account',
        description: 'Creates a new admin account.',
    })
    @ApiResponse({
        status: 201,
        description: 'Admin account created successfully.',
        type: SignupDto,
    })
    @Post('/signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.cmsService.signup(signupDto);
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Admin Login',
        description: 'Logs in an admin and returns admin information along with a JWT token.',
    })
    @ApiResponse({
        status: 200,
        description: 'Admin successfully logged in and token issued.',
        type: LoginDto,
    })
    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.cmsService.login({ email, password });
        return user;
    }
}
