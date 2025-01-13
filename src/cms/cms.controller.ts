import { Body, Controller, Post, UseGuards, Request, Patch, UnauthorizedException, Param, Delete, Get } from '@nestjs/common';
import { CmsService } from './cms.service';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { CreatePostDto } from 'src/post/dto/create-post.dto';

@Controller('cms')
export class CmsController {
    constructor(
        private readonly cmsService: CmsService,
        private readonly jwtService: JwtService,
    ) {}

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Create admin account',
        description: 'Creates a new admin account.',
    })
    @ApiResponse({
        status: 201,
        description: 'Admin account created successfully.',
        type: SignupDto,
    })
    @Post('/signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.cmsService.signup(signupDto);
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Admin Login',
        description: 'Logs in an admin and returns admin information along with a JWT token.',
    })
    @ApiResponse({
        status: 200,
        description: 'Admin successfully logged in and token issued.',
        type: LoginDto,
    })
    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.cmsService.login({ email, password });
        return user;
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Create Category',
        description: 'Creates a new category.',
    })
    @ApiResponse({
        status: 201,
        description: 'Category created successfully.',
        type: CreateCategoryDto,
    })
    @Post('/category/create')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async createCategory(
        @Request() req,
        @Body() createCategoryDto: CreateCategoryDto,
    ) {
        const category = await this.cmsService.createCategory(createCategoryDto);
        return { message: 'Category created successfully', data: category };
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Update Category',
        description: 'Updates a category.',
    })
    @ApiResponse({
        status: 200,
        description: 'Category updated successfully.',
        type: UpdateCategoryDto,
    })
    @Patch('/category/:id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async updateCategory(
        @Request() req,
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        const user = req.user;
    
        if (!user || !user.isCreator) {
            throw new UnauthorizedException('Access denied. Creator only.');
        }
        const updateCategory = await this.cmsService.updateCategory(
            id,
            updateCategoryDto,
        );
        return { data: updateCategory };
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Delete Category',
        description: 'Deletes a category.',
    })
    @ApiResponse({
        status: 200,
        description: 'Category deleted successfully.',
    })
    @Delete('/category/:id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async deleteCategory(@Param('id') id: string, @Request() req) {
        const isCreator = req.user?.isCreator;
        const category = await this.cmsService.deleteCategory(id, isCreator);
        return category;
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Get All Categories',
        description: 'Returns all categories.',
    })
    @ApiResponse({
        status: 200,
        description: 'All categories returned successfully.',
        type: CreateCategoryDto,
    })
    @Get('/category/get-all')
      async getAllCategory() {
        const category = await this.cmsService.getAllCategory();
        return { message: 'All categories', data: category };
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Get Category By Id',
        description: 'Returns a category by ID.',
    })
    @ApiResponse({
        status: 200,
        description: 'Category returned successfully.',
        type: CreateCategoryDto,
    })
    @Get('/category/:id')
    async getCategoryById(@Param('id') id: string) {
      const category = await this.cmsService.getCategoryById(id);
      return { data: category };
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Calculate Daily Earnings',
        description: 'Manually calculates daily earnings.',
    })
    @ApiResponse({
        status: 200,
        description: 'Daily earnings calculated successfully.',
    })
    @Post('/wallet/daily')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async calculateDailyEarnings() {
        return this.cmsService.calculateDailyEarning();
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Delete User',
        description: 'Deletes a user by ID.',
    })
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully.',
    })
    @Delete('/user/:id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async deleteUser(@Param('id') id: string) {
        return this.cmsService.deleteUser(id);
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
      summary: 'Delete a post',
      description: 'Allows a creator to delete a post by ID.',
    })
    @ApiResponse({
      status: 200,
      description: 'The post was deleted successfully',
      type: CreatePostDto,
    })
    @Delete('/post/:id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async deletePost(@Param('id') id: string) {
      const post = await this.cmsService.deletePost(id);
      return post;
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Notify posted report',
        description: 'Notifies a creator that their post has been deleted.',
    })
    @ApiResponse({
        status: 200,
        description: 'Notification sent successfully.',
    })
    @Post('/notify')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async notifyPostDeletion(
      @Body() body: { postId: string },
    ) {
      const { postId } = body;

      const post = await this.cmsService.findPostById(postId);
      if (!post || !post.user || !post.user.isCreator) {
        throw new UnauthorizedException('Post not found or user is not a creator');
      }

      return this.cmsService.notifyPostDeletion(post.user.id, post.title);
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Get List of Views',
        description: 'Returns a list of views for all posts along with the amount to be paid.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of views returned successfully.',
    })
    @Get('/views')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getListOfViews() {
        return this.cmsService.getListOfViews();
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Get All Users',
        description: 'Returns all users.',
    })
    @ApiResponse({
        status: 200,
        description: 'All users returned successfully.',
    })
    @Get('/users')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getAllUsers() {
        const users = await this.cmsService.getAllUsers();
        return { message: 'All users', data: users };
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Get All Post Reports',
        description: 'Returns all post reports.',
    })
    @ApiResponse({
        status: 200,
        description: 'All post reports returned successfully.',
    })
    @Get('/report/post/get-all')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getAllPostReport() {
        const report = await this.cmsService.getAllPostReport();
        return { message: 'All post reports', data: report };
    }

    @ApiTags('Cms')
    @ApiBearerAuth('admin')
    @ApiOperation({
        summary: 'Get All Comment Reports',
        description: 'Returns all comment reports.',
    })
    @ApiResponse({
        status: 200,
        description: 'All comment reports returned successfully.',
    })
    @Get('/report/comment/get-all')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async getAllCommentReport() {
        const report = await this.cmsService.getAllCommentReport();
        return { message: 'All comment reports', data: report };
    }
}
