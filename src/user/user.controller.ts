import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiKeyGuard } from 'src/auth/guard/api-key.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/profile')
  @UseGuards(JwtAuthGuard)
  @UseGuards(ApiKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Allows users to update their profile information.',
  })
  @ApiResponse({
    status: 200,
    description: 'The user profile was updated successfully.',
    schema: {
      example: {
        message: 'Profile updated successfully',
        data: {
          id: '1',
          username: 'updatedUser',
          email: 'updated@example.com',
          bio: 'Updated biography.',
          birthday: '2000-01-01',
          isCreator: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing JWT token or API key.',
  })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    const updatedUser = await this.userService.updateProfile(
      userId,
      updateUserDto,
    );
    return { message: 'Profile updated successfully', data: updatedUser };
  }
}
