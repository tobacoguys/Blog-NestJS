import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The username of the user.',
    example: 'john_doe',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email address' })
  @ApiProperty({
    description: 'The email address of the user.',
    example: 'john_doe@example.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({
    description:
      'The password of the user. It must be at least 6 characters long.',
    example: 'password123',
  })
  password: string;
}
