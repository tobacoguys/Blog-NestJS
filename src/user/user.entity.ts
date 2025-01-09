import { Like } from 'src/like/like.entity';
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

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isCreator: boolean;

  @Column({ default: 'admin' })
  role: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true, type: 'timestamp' })
  otpExpiry: Date;

  @Column({ default: false })
  isActive: boolean;

}

export default User;
