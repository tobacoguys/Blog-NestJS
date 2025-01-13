import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Post } from 'src/post/post.entity';
import User from 'src/user/user.entity';
import { Comment } from 'src/comment/comment.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  reason: string;

  @ManyToOne(() => Post, (post) => post.reports, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'SET NULL' })
  reportedBy: User;

  @ManyToOne(() => Comment, (comment) => comment.reports, { nullable: true })
  comment: Comment;

  @CreateDateColumn()
  reportedAt: Date;
}
