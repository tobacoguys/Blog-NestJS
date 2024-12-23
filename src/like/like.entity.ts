import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post/post.entity';
import User from '../user/user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the like',
    example: '1',
  })
  id: string;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  @ApiProperty({
    description: 'The post associated with this like',
    type: () => Post,
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ description: 'The user who liked the post', type: () => User })
  user: User;
}
