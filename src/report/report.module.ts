import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Post } from 'src/post/post.entity';
import User from 'src/user/user.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Comment } from 'src/comment/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Post, User, Comment])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
