import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiKeyGuard } from 'src/auth/guard/api-key.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseGuards(ApiKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Allows a creator to create a new category.',
  })
  @ApiBody({
    description: 'The details of the category to be created.',
    type: CreateCategoryDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully.',
    schema: {
      example: {
        message: 'Category created successfully',
        data: {
          id: '1',
          name: 'Category Name',
          description: 'Category description',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Creator role is required.',
  })
  async createCategory(
    @Request() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const user = req.user;

    if (!user || !user.isCreator) {
      throw new UnauthorizedException('Access denied. Creator only.');
    }
    const category =
      await this.categoryService.createCategory(createCategoryDto);
    return { message: 'Category created successfully', data: category };
  }

  @Get('/getAll')
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Fetch all categories from the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all categories.',
    schema: {
      example: {
        message: 'All categories',
        data: [
          { id: '1', name: 'Category Name 1', description: 'Description 1' },
          { id: '2', name: 'Category Name 2', description: 'Description 2' },
        ],
      },
    },
  })
  async getAllCategory() {
    const category = await this.categoryService.getAllCategory();
    return { message: 'All categories', data: category };
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Fetch a specific category by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the category to fetch',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Category data retrieved successfully.',
    schema: {
      example: {
        data: {
          id: '1',
          name: 'Category Name',
          description: 'Category description',
        },
      },
    },
  })
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoryService.getCategoryById(id);
    return { data: category };
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(ApiKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a category',
    description: 'Allows a creator to update a category by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the category to update',
    example: '1',
  })
  @ApiBody({
    description: 'The updated details of the category.',
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully.',
    schema: {
      example: {
        message: 'Category updated successfully',
        data: {
          id: '1',
          name: 'Updated Category Name',
          description: 'Updated description',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Creator role is required.',
  })
  async updateCategory(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const user = req.user;

    if (!user || !user.isCreator) {
      throw new UnauthorizedException('Access denied. Creator only.');
    }
    const updateCategory = await this.categoryService.updateCategory(
      id,
      updateCategoryDto,
    );
    return { data: updateCategory };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(ApiKeyGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Allows a creator to delete a category by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the category to delete',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully.',
    schema: {
      example: {
        message: 'Category deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Creator role is required.',
  })
  async deleteCategory(@Param('id') id: string, @Request() req) {
    const isCreator = req.user?.isCreator;
    const category = await this.categoryService.deleteCategory(id, isCreator);
    return category;
  }
}
