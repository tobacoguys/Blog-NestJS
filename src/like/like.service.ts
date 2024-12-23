import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../post/post.entity';
import User from '../user/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async likePost(postId: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (existingLike) {
      throw new BadRequestException('You have already liked this post');
    }

    const like = this.likeRepository.create({
      post,
      user: { id: userId } as User,
    });

    return this.likeRepository.save(like);
  }

  async unlikePost(postId: string, userId: string) {
    const like = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    return this.likeRepository.remove(like);
  }

  async countLikes(postId: string): Promise<number> {
    return this.likeRepository.count({ where: { post: { id: postId } } });
  }
}
