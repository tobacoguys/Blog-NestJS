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
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiTags('Post')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Allows a creator to create a new post.',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully.',
    type: CreatePostDto
  })
  @Post('create')
  @UseGuards(JwtAuthGuard)
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

  @ApiTags('Post')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Allows a creator to update an existing post by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully.',
    type: UpdatePostDto,
  })
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const updatePost = await this.postService.updatePost(id, updatePostDto);
    return { data: updatePost };
  }

  @ApiTags('Post')
  @ApiBearerAuth('')
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Fetches a paginated list of all posts.',
  })
  @ApiResponse({
    status: 200,
    description: 'All posts',
    type: CreatePostDto,
  })
  @Get('/getAll')
  async getAllPosts(@Query('page') page = 1, @Query('limit') limit = 4) {
    return this.postService.getAllPost(page, limit);
  }

  @ApiTags('Post')
  @ApiBearerAuth('')
  @ApiOperation({
    summary: 'Get posts by category',
    description: 'Fetches posts belonging to a specific category.',
  })
  @ApiResponse({
    status: 200,
    description: 'Posts belonging to a specific category',
    type: CreatePostDto,
  })
  @Get('GetByCategory/:id')
  async getPostsByCategory(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.postService.getPostByCategory(id, page, limit);
  }

  @ApiTags('Post')
  @ApiBearerAuth('')
  @ApiOperation({
    summary: 'Get a post by ID',
    description: 'Fetches the details of a single post by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Post details',
    type: CreatePostDto,
  })

  @ApiTags('Post')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Allows a creator to delete a post by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The post was deleted successfully',
    type: CreatePostDto,
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param('id') id: string, @Request() req) {
    const isCreator = req.user?.isCreator;
    const post = await this.postService.deletePost(id, isCreator);
    return post;
  }

  @ApiTags('Post')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Upload an image to a post',
    description: 'Allows a creator to upload an image to a post by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    type: CreatePostDto,
  })
  @Patch('/:id/upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/posts',
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(@Param('id') id: string, @UploadedFile() file, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = `/uploads/posts/${file.filename}`;

    const isCreator = req.user?.isCreator;
    const updatedImg = await this.postService.updatePostImage(id, imageUrl, isCreator);
    if (!updatedImg) {
      throw new InternalServerErrorException('Failed to upload image');
    }

    return {
      message: 'Image uploaded successfully',
      data: {
        data: updatedImg,
      },
    };
  }

  @ApiTags('Post')
  @ApiBearerAuth('')
  @ApiOperation({
    summary: 'View a post',
    description: 'Fetches the details of a single post by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Post details',
    type: CreatePostDto,
  })
  @Get('/:postId')
  async viewPost(@Param('postId') postId: string) {
    return this.postService.getPostById(postId);
  }
}
