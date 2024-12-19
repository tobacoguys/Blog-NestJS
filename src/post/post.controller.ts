import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() createPostDto: CreatePostDto) {
    const post = await this.postService.createPost(createPostDto);
    return { message: 'Post created successfully', data: post };
  }
}
