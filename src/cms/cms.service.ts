import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import User from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/category.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CmsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async signup(signupDto: SignupDto): Promise<{ message: string }> {
        const { email, password } = signupDto;

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new UnauthorizedException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = this.userRepository.create({
            username: 'admin',
            email,
            password: hashedPassword,
            isActive: true,
            role: 'admin',
        });

        await this.userRepository.save(admin);
        return { 
            message: 'Admin account created successfully',
        };
    }

    async login(loginDto: LoginDto): Promise<{ user: any, token: string }> {
    const { email, password } = loginDto;
  
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
    }
  
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  
    return { user, token };
    }

    async validateAdmin(username: string, password: string): Promise<User | null> {
        const admin = await this.userRepository.findOne({ where: { username } });
        if (admin && await bcrypt.compare(password, admin.password)) {
            return admin;
        }
        return null;
      }
}
