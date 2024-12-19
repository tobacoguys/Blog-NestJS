import {
  Body,
  Controller,
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
}
