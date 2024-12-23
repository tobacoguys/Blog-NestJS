import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../category/category.entity';
import User from '../user/user.entity';
import { Like } from 'src/like/like.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the post',
    example: '1',
  })
  id: string;

  @Column()
  @ApiProperty({
    description: 'The title of the post',
    example: 'A Comprehensive Guide to TypeScript',
  })
  title: string;

  @Column()
  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the body of the post...',
  })
  content: string;

  @ManyToOne(() => Category, (category) => category.posts, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  @ApiProperty({
    description: 'The category this post belongs to',
    type: () => Category,
  })
  category: Category;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({
    description: 'The user who created the post',
    type: () => User,
  })
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  @ApiProperty({
    description: 'A list of likes associated with this post',
    type: () => [Like],
  })
  likes: Like[];

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether the post is published or not',
    example: false,
    default: false,
  })
  isPublished: boolean;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date when the post was created',
    example: '2023-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'The date when the post was last updated',
    example: '2023-01-02T12:00:00.000Z',
  })
  updatedAt: Date;
}
