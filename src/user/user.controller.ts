import { Body, Controller, Patch, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Private } from '../auth/decorator/private.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/profile')
  @Private()
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    const updatedUser = await this.userService.updateProfile(
      userId,
      updateUserDto,
    );
    return { message: 'Profile updated successfully', data: updatedUser };
  }
}
