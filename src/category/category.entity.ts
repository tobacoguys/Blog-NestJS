import { Post } from 'src/post/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the category',
    example: '1',
  })
  id: string;

  @Column({ unique: true })
  @ApiProperty({
    description: 'The unique name of the category',
    example: 'Technology',
  })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'A brief description of the category',
    example: 'This category includes all posts related to technology.',
    nullable: true,
  })
  description: string;

  @OneToMany(() => Post, (post) => post.category)
  @ApiProperty({
    description: 'A list of posts that belong to this category',
    type: () => [Post],
  })
  posts: Post[];
}
