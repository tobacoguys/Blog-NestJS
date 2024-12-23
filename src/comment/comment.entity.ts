import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post/post.entity';
import User from '../user/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the comment',
    example: '1',
  })
  id: string;

  @Column()
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great post!',
  })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    description: 'The user who created the comment',
    type: () => User,
  })
  user: User;

  @ManyToOne(() => Post, (post) => post.id, { eager: true })
  @JoinColumn({ name: 'postId' })
  @ApiProperty({
    description: 'The post associated with this comment',
    type: () => Post,
  })
  post: Post;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date when the comment was created',
    example: '2023-01-01T12:00:00.000Z',
  })
  createdAt: Date;
}
