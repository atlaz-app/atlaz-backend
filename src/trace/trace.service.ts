import { Injectable } from '@nestjs/common';

import { CreateTraceDto } from './trace.dto';
import { PrismaService } from 'src/prisma.service';
import { TrackerVisual } from 'src/shared/enums';

@Injectable()
export class TraceService {
  constructor(private prisma: PrismaService) {}

  async createTrace(userId: number, dto: CreateTraceDto, videoPath?: string) {
    const duration = dto.envelopeData ? Math.round(dto.envelopeData.length / 20) : null;
    const peak = dto.envelopeData ? Math.max(...dto.envelopeData) : dto.peakIntensity;
    const avg = dto.envelopeData
      ? dto.envelopeData.reduce((a, b) => a + b, 0) / dto.envelopeData.length
      : dto.avgIntensity;

    return this.prisma.trace.create({
      data: {
        user: { connect: { id: userId } },
        preset: dto.presetId ? { connect: { id: dto.presetId } } : undefined,
        duration,
        muscle: dto.muscle,
        mode: dto.mode,
        visual: dto.visual,
        videoPath: dto.visual === TrackerVisual.On ? videoPath : null,
        totalReps: dto.totalReps,
        effectiveReps: dto.effectiveReps,
        effectiveness: dto.effectiveness,
        peakIntensity: peak,
        avgIntensity: avg,
        envelopeData: dto.envelopeData ? JSON.stringify(dto.envelopeData) : null,
        repPeaks: dto.repPeaks ? JSON.stringify(dto.repPeaks) : null,
        notes: dto.notes,
      },
    });
  }

  async getTraces(userId: number) {
    return this.prisma.trace.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        presetId: true,
        duration: true,
        muscle: true,
        mode: true,
        visual: true,
        videoPath: true,
        totalReps: true,
        effectiveReps: true,
        effectiveness: true,
        peakIntensity: true,
        avgIntensity: true,
        envelopeData: true,
        repPeaks: true,
        createdAt: true,
      },
    });
  }
}
