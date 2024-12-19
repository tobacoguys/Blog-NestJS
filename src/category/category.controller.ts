import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Private } from 'src/auth/decorator/private.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @Private()
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
}
