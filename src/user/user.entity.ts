import { ApiProperty } from '@nestjs/swagger';
import { Like } from 'src/like/like.entity';
import { Post } from 'src/post/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '1',
  })
  id: string;

  @Column()
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  username: string;

  @Column({ unique: true })
  @ApiProperty({
    description: 'The unique email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    description: 'The hashed password of the user',
    example: 'hashed_password',
  })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'The biography of the user (optional)',
    example: 'A software developer',
    required: false,
  })
  bio: string;

  @Column({ nullable: true, type: 'date' })
  @ApiProperty({
    description: 'The birthdate of the user (optional)',
    example: '1990-01-01',
    required: false,
  })
  birthday: Date;

  @Column({ default: false })
  @ApiProperty({
    description: 'Indicates whether the user is a creator or not',
    default: false,
    example: false,
  })
  isCreator: boolean;

  @OneToMany(() => Post, (post) => post.user)
  @ApiProperty({
    description: 'A list of posts created by the user',
    type: () => [Post],
  })
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  @ApiProperty({
    description: 'A list of likes made by the user',
    type: () => [Like],
  })
  likes: Like[];
}

export default User;
