import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTraceDto } from './trace.dto';
import { PrismaService } from 'src/prisma.service';
import { TrackerVisual } from 'src/shared/enums';

@Injectable()
export class TraceService {
  constructor(private prisma: PrismaService) {}

  async createTrace(userId: number, dto: CreateTraceDto, videoPath?: string) {
    const peak = Math.max(...dto.envelopeData);
    const avg = dto.envelopeData.reduce((a, b) => a + b, 0) / dto.envelopeData.length;

    return this.prisma.trace.create({
      data: {
        user: { connect: { id: userId } },
        preset: dto.presetId ? { connect: { id: dto.presetId } } : undefined,
        duration: dto.duration,
        muscle: dto.muscle,
        mode: dto.mode,
        visual: dto.visual,
        videoPath: dto.visual === TrackerVisual.On ? videoPath : null,
        totalReps: dto.totalReps,
        effectiveReps: dto.effectiveReps,
        effectiveness: dto.effectiveness,
        peakIntensity: peak || null,
        avgIntensity: avg || null,
        envelopeBase: dto.envelopeBase,
        envelopeData: JSON.stringify(dto.envelopeData),
        repPeaks: JSON.stringify(dto.repPeaks),
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
        notes: true,
        preset: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getTraceById(userId: number, traceId: number) {
    const trace = await this.prisma.trace.findFirst({
      where: {
        id: traceId,
        userId,
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

    if (!trace) {
      throw new NotFoundException(`Trace with ID ${traceId} not found or not accessible`);
    }

    return trace;
  }
}
