import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import User from 'src/user/user.entity';
import { Category } from '../category/category.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category]),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    AuthModule,
  ],
  controllers: [CmsController],
  providers: [
    CmsService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtAuthGuard,
  ],
})
export class CmsModule {}
