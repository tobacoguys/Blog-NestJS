import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import User from 'src/user/user.entity';
import { Post } from 'src/post/post.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  postId: string;

  @Column({ type: 'int', default: 0 })
  stars: number; // Number of stars (1-5)

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Post, (post) => post.id)
  post: Post;
}
