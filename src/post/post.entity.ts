import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: true })
  isPublished: boolean;

  @ManyToMany(() => Category, (category) => category.posts, { eager: true })
  @JoinTable()
  categories: Category[];
}
