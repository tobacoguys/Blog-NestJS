import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { Category } from '../category/category.entity';
import User from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, User])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
