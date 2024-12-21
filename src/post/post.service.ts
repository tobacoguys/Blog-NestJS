import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { Category } from '../category/category.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Category)
    private readonly userRepository: Repository<Category>,
  ) {}

  async createPost(
    userId: string,
    title: string,
    content: string,
    categoryId: string,
  ) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    const newPost = this.postRepository.create({
      title,
      content,
      category,
      isPublished: true,
    });

    return this.postRepository.save(newPost);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const updatePost = Object.assign(post, updatePostDto);
    return this.postRepository.save(updatePost);
  }

  async getAllPost(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [posts, total] = await this.postRepository.findAndCount({
      skip,
      take: limit,
      relations: ['categories'],
    });

    return {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
