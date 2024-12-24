import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'The title of the post.',
    example: 'Updated title for the post.',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'The content of the post.',
    example: 'Updated content for the post...',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: 'List of category IDs the post belongs to.',
    example: ['1', '3'],
    required: false,
  })
  categoryIds?: string[];
}
