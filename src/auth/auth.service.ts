import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/user.entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ user: any; token: string }> {
    const { username, email, password } = signupDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    const token = this.jwtService.sign({ id: user.id });

    return { user, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: any; token: string }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      isCreator: user.isCreator,
    });

    return { user, token };
  }

  validateApiKey(apiKey: string) {
    const apiKeyServer = this.configService.get('API_KEY');
    if (apiKey === apiKeyServer) {
      return true;
    }
    return false;
  }
}
