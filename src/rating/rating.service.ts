import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Post } from 'src/post/post.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createRating(userId: string, postId: string, stars: number) {
    if (stars < 1 || stars > 5) {
      throw new BadRequestException('Rating must be between 1 and 5 stars');
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingRating = await this.ratingRepository.findOne({
      where: { userId, postId },
    });

    if (existingRating) {
      existingRating.stars = stars;
      return this.ratingRepository.save(existingRating);
    }

    const newRating = this.ratingRepository.create({ userId, postId, stars });
    return this.ratingRepository.save(newRating);
  }
}
