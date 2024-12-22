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

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const userId = req.user.id;
    return this.commentService.createComment(createCommentDto, userId);
  }
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
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
  async deleteComment(@Param('id') commentId: string, @Req() req) {
    const userId = req.user.id;
    return this.commentService.deleteComment(commentId, userId);
  }
}
