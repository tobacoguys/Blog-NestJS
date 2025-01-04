import {
  Controller,
  Post,
  Param,
  Delete,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiTags('Like')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Like a post',
    description: 'Allows a logged-in user to like a post using their token',
  })
  @ApiResponse({
    status: 200,
    description: 'Post liked successfully.',
  })
  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('postId') postId: string, @Req() req: Request) {
    const userId = req['user']['id'];
    return this.likeService.likePost(postId, userId);
  }

  @ApiTags('Like')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Unlike a post',
    description: 'Allows a user to unlike a post.'
  })
  @ApiResponse({
    status: 200,
    description: 'Post unlike successfully.',
  })
  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async unlikePost(
    @Param('postId') postId: string,
    @Req() req: Request,
  ) {
    const userId = req['user']['id'];
    return this.likeService.unlikePost(postId, userId);
  }

  @ApiTags('Like')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Count likes',
    description: 'Allows a user to count the number of likes on a post.'
  })
  @ApiResponse({
    status: 200,
    description: 'Counted likes successfully.',
  })
  @Get(':postId/count')
  async countLikes(@Param('postId') postId: string) {
    return { likes: await this.likeService.countLikes(postId) };
  }
}
