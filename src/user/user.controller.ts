import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('User')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update a user profile with JWT authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
    type: UpdateUserDto
  })
  @Patch('/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    const updatedUser = await this.userService.updateProfile(
      userId,
      updateUserDto,
    );
    return { message: 'Profile updated successfully', data: updatedUser };
  }
}
