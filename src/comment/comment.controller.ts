import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a comment',
    description: 'Allows a user to create a comment on a post.',
  })
  @ApiBody({
    description: 'The content of the comment to be created.',
    type: CreateCommentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully.',
    schema: {
      example: {
        message: 'Comment created successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. User needs to be authenticated.',
  })
  async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const userId = req.user.id;
    return this.commentService.createComment(createCommentDto, userId);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a comment',
    description: 'Allows a user to update a specific comment.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the comment to update',
    example: '1',
  })
  @ApiBody({
    description: 'The new content for the comment.',
    type: UpdateCommentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully.',
    schema: {
      example: {
        message: 'Comment updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. User needs to be authenticated.',
  })
  async updateComment(
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.commentService.updateComment(
      commentId,
      userId,
      updateCommentDto,
    );
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a comment',
    description: 'Allows a user to delete a specific comment.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the comment to delete',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully.',
    schema: {
      example: {
        message: 'Comment deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. User needs to be authenticated.',
  })
  async deleteComment(@Param('id') commentId: string, @Req() req) {
    const userId = req.user.id;
    return this.commentService.deleteComment(commentId, userId);
  }
}
