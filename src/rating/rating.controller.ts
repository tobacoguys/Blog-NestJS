import { Controller, Post, Body, Get, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { RatingService } from './rating.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingDto } from './dto/rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiTags('Rating')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Rating',
    description: 'Allows a user to create a new rating for a post.',
  })
  @ApiResponse({
    status: 201,
    description: 'Rating created successfully.',
    type: RatingDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRating(
    @Req() req,
    @Body('postId') postId: string,
    @Body('stars') stars: number,
  ) {
    const userId = req.user.id;
    return this.ratingService.createRating(userId, postId, stars);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get('/:postId')
  async getAverageRating(@Req() req, @Param('postId') postId: string) {
    const user = req.user;

    if (!user.isCreator) {
      throw new UnauthorizedException('Access denied. Creator only.');
    }

    const userId = req.user.id;
    return this.ratingService.getAverageRating(userId, postId);
  }
}
