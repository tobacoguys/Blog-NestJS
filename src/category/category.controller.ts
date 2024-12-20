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

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseGuards(ApiKeyGuard)
  async createCategory(
    @Request() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const user = req.user;

    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('Access denied. Admin only.');
    }
    const category =
      await this.categoryService.createCategory(createCategoryDto);
    return { message: 'Category created successfully', data: category };
  }

  @Get('/getAll')
  async getAllCategory() {
    const category = await this.categoryService.getAllCategory();
    return { message: 'All categories', data: category };
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoryService.getCategoryById(id);
    return { data: category };
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(ApiKeyGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const updateCategory = await this.categoryService.updateCategory(
      id,
      updateCategoryDto,
    );
    return { data: updateCategory };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(ApiKeyGuard)
  async deleteCategory(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user?.isAdmin;
    const category = await this.categoryService.deleteCategory(id, isAdmin);
    return category;
  }
}
