import { Body, Controller, Patch, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';

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

  @Patch('/profile/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const fileName = Date.now() + path.extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }

    const userId = req.user.id;
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    const updatedUser = await this.userService.updateProfileAvatar(userId, avatarUrl);

    return { message: 'Avatar uploaded successfully', data: updatedUser };
  }
}
