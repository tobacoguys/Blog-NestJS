import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
class User {
  @PrimaryGeneratedColumn()
  id: number;

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
  isAdmin: boolean;
}

export default User;
