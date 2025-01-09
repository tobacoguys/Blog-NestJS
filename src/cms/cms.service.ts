import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import User from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CmsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async signup(signupDto: SignupDto): Promise<{ message: string }> {
        const { email, password } = signupDto;

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new UnauthorizedException('Email already in use');
        }

        const admin = this.userRepository.create({
            username: 'admin',
            email,
            password,
            isActive: true,
        });

        await this.userRepository.save(admin);
        return { 
            message: 'Admin account created successfully',
        };
    }

    async login(loginDto: LoginDto): Promise<{ admin: any, token: string }> {
    const { email, password } = loginDto;
  
    const admin = await this.userRepository.findOne({ where: { email } });
  
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!password) {
        throw new UnauthorizedException('Password wrong');
    }
  
    const token = this.jwtService.sign({
      id: admin.id,
      username: admin.username,
      email: admin.email,
    });
  
    return { admin, token };
    }
}
