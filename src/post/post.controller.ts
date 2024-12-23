import {
  Controller,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
  Post,
  Req,
  UnauthorizedException,
  Delete,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Allows a creator to create a new post.',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully.',
    schema: {
      example: {
        id: '1',
        title: 'Post Title',
        content: 'Post content',
        categoryId: '1',
        userId: '1',
        createdAt: '2023-01-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Only creators are allowed to create posts.',
  })
  async createPost(
    @Req() req,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('categoryId') categoryId: string,
  ) {
    const user = req.user;

    if (!user || !user.isCreator) {
      throw new UnauthorizedException('Access denied. Creator only.');
    }
    const userId = req.user.id;
    return this.postService.createPost(userId, title, content, categoryId);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a post',
    description: 'Allows a creator to update an existing post by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the post to update',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully.',
    schema: {
      example: {
        id: '1',
        title: 'Updated Title',
        content: 'Updated content',
        categoryId: '1',
        updatedAt: '2023-01-02T12:00:00.000Z',
      },
    },
  })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const updatePost = await this.postService.updatePost(id, updatePostDto);
    return { data: updatePost };
  }

  @Get('/getAll')
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Fetches a paginated list of all posts.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of posts per page',
    example: 10,
  })
  async getAllPosts(@Query('page') page = 1, @Query('limit') limit = 4) {
    return this.postService.getAllPost(page, limit);
  }

  @Get('GetByCategory/:id')
  @ApiOperation({
    summary: 'Get posts by category',
    description: 'Fetches posts belonging to a specific category.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the category', example: '1' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of posts per page',
    example: 10,
  })
  async getPostsByCategory(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.postService.getPostByCategory(id, page, limit);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a post by ID',
    description: 'Fetches the details of a single post by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the post', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'The post details.',
    schema: {
      example: {
        id: '1',
        title: 'Post Title',
        content: 'Post content',
        categoryId: '1',
        userId: '1',
        createdAt: '2023-01-01T12:00:00.000Z',
      },
    },
  })
  async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPostById(id);
    return { data: post };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Allows a creator to delete a post by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the post to delete',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The post was deleted successfully.',
    schema: {
      example: {
        message: 'Post deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Only creators can delete posts.',
  })
  async deleteCategory(@Param('id') id: string, @Request() req) {
    const isCreator = req.user?.isCreator;
    const post = await this.postService.deletePost(id, isCreator);
    return post;
  }
}
