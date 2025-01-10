import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createReport(@Body() createReportDto: CreateReportDto, @Request() req) {
    const userId = req.user.id;
    const report = await this.reportService.createReport(createReportDto, userId);
    return {
      message: 'Report created successfully',
      data: report,
    };
  }
}
