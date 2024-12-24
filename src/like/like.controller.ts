import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Param('postId') postId: string,
    @Body('userId') userId: string,
  ) {
    return this.likeService.likePost(postId, userId);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async unlikePost(
    @Param('postId') postId: string,
    @Body('userId') userId: string,
  ) {
    return this.likeService.unlikePost(postId, userId);
  }

  @Get(':postId/count')
  async countLikes(@Param('postId') postId: string) {
    return { likes: await this.likeService.countLikes(postId) };
  }
}
