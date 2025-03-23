import { Controller, Post, Body, Req, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TraceService } from './trace.service';
import { CreateTraceDto } from './trace.dto';
import { Request } from 'express';

@Controller('traces')
export class TraceController {
  constructor(private readonly traceService: TraceService) {}

  @Post('create')
  async createTrace(@Req() req: Request, @Body() createTraceDto: CreateTraceDto) {
    const userId = req.user.id;
    const videoPath = undefined;
    return this.traceService.createTrace(userId, createTraceDto, videoPath);
  }

  @Get()
  async getTraces(@Req() req: Request & { user: { id: number } }) {
    const userId = req.user.id;
    return this.traceService.getTraces(userId);
  }

  @Get(':id')
  async getTraceById(@Req() req: Request & { user: { id: number } }, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.traceService.getTraceById(userId, id);
  }
}
