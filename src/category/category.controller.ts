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
import { ApiKeyGuard } from 'src/auth/guard/api-key.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiTags('Category')
  @ApiBearerAuth('api-key')
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Allows a creator to create a new category.',
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully.',
    type: CreateCategoryDto,
  })
  @Post('/create')
  @UseGuards(ApiKeyGuard)
  async createCategory(
    @Request() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const category =
      await this.categoryService.createCategory(createCategoryDto);
    return { message: 'Category created successfully', data: category };
  }

  @ApiTags('Category')
  @ApiBearerAuth('')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'All categories',
    type: CreateCategoryDto,
  })
  @Get('/getAll')
  async getAllCategory() {
    const category = await this.categoryService.getAllCategory();
    return { message: 'All categories', data: category };
  }

  @ApiTags('Category')
  @ApiBearerAuth('')
  @ApiOperation({ summary: 'Get a single category by id' })
  @ApiResponse({
    status: 200,
    description: 'A single category',
    type: CreateCategoryDto,
  })
  @Get('/:id')
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoryService.getCategoryById(id);
    return { data: category };
  }

  @ApiTags('Category')
  @ApiBearerAuth('api-key')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully.',
    type: UpdateCategoryDto,
  })
  @Patch('/:id')
  @UseGuards(ApiKeyGuard)
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

  @ApiTags('Category')
  @ApiBearerAuth('')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully.'
  })
  @Delete('/:id')
  @UseGuards(ApiKeyGuard)
  async deleteCategory(@Param('id') id: string, @Request() req) {
    const isCreator = req.user?.isCreator;
    const category = await this.categoryService.deleteCategory(id, isCreator);
    return category;
  }
}
