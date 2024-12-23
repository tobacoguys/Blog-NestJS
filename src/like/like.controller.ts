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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Like a post',
    description: 'Allows a user to like a post.',
  })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post to like',
    example: '1',
  })
  @ApiBody({
    description: 'User ID of the user who likes the post',
    schema: {
      example: { userId: '1' },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Post liked successfully.',
    schema: {
      example: {
        message: 'Post liked successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. User needs to be authenticated.',
  })
  async likePost(
    @Param('postId') postId: string,
    @Body('userId') userId: string,
  ) {
    return this.likeService.likePost(postId, userId);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Unlike a post',
    description: 'Allows a user to remove their like from a post.',
  })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post to unlike',
    example: '1',
  })
  @ApiBody({
    description: 'User ID of the user who removes their like from the post',
    schema: {
      example: { userId: '1' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Post unliked successfully.',
    schema: {
      example: {
        message: 'Post unliked successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. User needs to be authenticated.',
  })
  async unlikePost(
    @Param('postId') postId: string,
    @Body('userId') userId: string,
  ) {
    return this.likeService.unlikePost(postId, userId);
  }

  @Get(':postId/count')
  @ApiOperation({
    summary: 'Get the like count of a post',
    description: 'Fetches the number of likes for a specific post.',
  })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post to get the like count',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The like count for the post.',
    schema: {
      example: {
        likes: 10,
      },
    },
  })
  async countLikes(@Param('postId') postId: string) {
    return { likes: await this.likeService.countLikes(postId) };
  }
}
