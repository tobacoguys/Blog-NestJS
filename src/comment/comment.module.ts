import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Post } from '../post/post.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
