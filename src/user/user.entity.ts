import { Post } from 'src/post/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, type: 'date' })
  birthday: Date;

  @Column({ default: false })
  isCreator: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}

export default User;
