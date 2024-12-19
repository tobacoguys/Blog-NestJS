import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { Category } from '../category/category.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const { title, content, categoryIds } = createPostDto;

    let categories: Category[] = [];
    if (categoryIds && categoryIds.length > 0) {
      categories = await this.categoryRepository.findByIds(categoryIds);
      if (categories.length !== categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }
    }

    const post = this.postRepository.create({
      title,
      content,
      categories,
    });

    return await this.postRepository.save(post);
  }
}
