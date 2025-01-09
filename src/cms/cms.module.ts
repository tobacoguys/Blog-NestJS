import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import User from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'yourSecretKey', // replace with your secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}
