import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { TraceService } from './trace.service';
import { CreateTraceDto } from './trace.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { UploadthingService } from 'src/uploadthing/uploadthing.service';

@Controller('traces')
export class TraceController {
  constructor(
    private readonly traceService: TraceService,
    private readonly uploadthingService: UploadthingService,
  ) {}

  @Get()
  async getTraces(@Req() req: Request & { user: { id: number } }) {
    const userId = req.user.id;
    return this.traceService.getTraces(userId);
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `trace-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['video/mp4', 'video/quicktime', 'video/mpeg'];
        if (!allowedMimes.includes(file.mimetype)) {
          return cb(new Error('Only video files (mp4, mov, mpeg) are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    }),
  )
  async createTrace(
    @Req() req: Request & { user: { id: number } },
    @Body('data') data: string | object, // Allow string or pre-parsed object
    @UploadedFile() video?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    let createTraceDto: CreateTraceDto;

    console.log('Raw data field:', data, 'Type:', typeof data); // Debug

    try {
      if (typeof data === 'string') {
        createTraceDto = JSON.parse(data); // Parse if string
      } else if (typeof data === 'object' && data !== null) {
        createTraceDto = data as CreateTraceDto; // Use as-is if object
      } else {
        throw new Error('Invalid data field');
      }
      console.log('Processed DTO:', createTraceDto);
    } catch (e) {
      console.error('Data processing error:', e);
      throw new BadRequestException('Invalid data field: ' + e.message);
    }

    let videoPath: string | undefined;
    if (video) {
      console.log(video);
      videoPath = await this.uploadthingService.uploadVideo(
        video.path, // Local file path
        video.filename, // e.g., trace-123456789.mov
        video.mimetype, // e.g., video/quicktime
      );
      fs.unlinkSync(video.path); // Clean up local file
    }

    console.log('Saved video path:', videoPath);
    return this.traceService.createTrace(userId, createTraceDto, videoPath);
  }

  @Get(':id')
  async getTraceById(@Req() req: Request & { user: { id: number } }, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.traceService.getTraceById(userId, id);
  }
}
