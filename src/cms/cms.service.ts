import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import User from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { Category } from 'src/category/category.entity';
import * as bcrypt from 'bcrypt';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';

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

    async createCategory(
        createCategoryDto: CreateCategoryDto,
    ): Promise<Category>{
        const { name } = createCategoryDto;
        const category = this.categoryRepository.create(createCategoryDto);
        const existingCategory = await this.categoryRepository.findOne({ where: { name } });
        if (existingCategory) {
            throw new UnauthorizedException('Category already exists');
        }
        await this.categoryRepository.save(category);
        return category;
    }

    async updateCategory(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        const { name } = updateCategoryDto;

        const category = await this.categoryRepository.findOne({ where: { id } });
    
        const existingCategory = await this.categoryRepository.findOne({ where: { name } });
        if (existingCategory) {
            throw new UnauthorizedException('Category already exists');
        }
        if (!category) {
          throw new NotFoundException('Category not found');
        }
        const updateCategory = Object.assign(category, updateCategoryDto);
        return this.categoryRepository.save(updateCategory);
    }

    async deleteCategory(
        id: string,
        isCreator: boolean,
    ): Promise<{ message: string }> {
        if (!isCreator) {
          throw new UnauthorizedException('Access denied. Creator only.');
        }
    
        const category = await this.categoryRepository.findOne({ where: { id } });
    
        if (!category) {
          throw new NotFoundException('Category not found');
        }
    
        await this.categoryRepository.remove(category);
    
        return { message: 'Category deleted successfully' };
    }
}
