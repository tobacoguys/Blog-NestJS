import { Body, Controller, Post, UseGuards, Request, Param } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiTags('Report')
  @ApiBearerAuth('token')
  @ApiOperation({ 
    summary: 'Create a report',
    description: 'Allows a logged-in user to report a post'  
  }) 
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
    type: CreateReportDto,
  })
  @Post('/post/:postId')
  @UseGuards(JwtAuthGuard)
  async createReport(@Param('postId') postId: string, @Body('reason') reason: string, @Request() req) {
    const userId = req.user.id;
    const report = await this.reportService.createReport(reason, postId, userId);
    return {
      message: 'Report created successfully',
      data: report,
    };
  }

  @ApiTags('Report')
  @ApiBearerAuth('token')
  @ApiOperation({ 
    summary: 'Create a comment report',
    description: 'Allows a logged-in user to report a comment'  
  }) 
  @ApiResponse({
    status: 201,
    description: 'Comment report created successfully',
    type: CreateReportDto,
  })
  @Post('/comment/:commentId')
  @UseGuards(JwtAuthGuard)
  async createCommentReport(@Param('commentId') commentId: string, @Body('reason') reason: string, @Request() req) {
    const userId = req.user.id;
    const report = await this.reportService.createCommentReport(reason, commentId, userId);
    return {
      message: 'Comment report created successfully',
      data: report,
    };
  }
}
