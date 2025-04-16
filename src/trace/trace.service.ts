import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { TrackerVisual } from 'src/shared/enums';
import { CreateTraceDto } from './trace.dto';

@Injectable()
export class TraceService {
  constructor(private prisma: PrismaService) {}

  async createTrace(userId: number, dto: CreateTraceDto, videoPath?: string) {
    const envelopeData = dto.envelopeData;

    const reps = this.extractReps(envelopeData, dto.envelopeBase);

    const avgPeakIntensity = reps.length > 0 ? reps.reduce((sum, rep) => sum + rep.peakValue, 0) / reps.length : 0;

    const firstThreeAvg = reps.slice(0, 3).reduce((sum, rep) => sum + rep.peakValue, 0) / 3;
    const lastThreeAvg = reps.slice(-3).reduce((sum, rep) => sum + rep.peakValue, 0) / 3;

    const fatigue = firstThreeAvg > 0 ? (firstThreeAvg - lastThreeAvg) / firstThreeAvg : 0;

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
        avgPeakIntensity,
        fatigue,
        envelopeBase: dto.envelopeBase,
        repData: JSON.stringify(reps),
        envelopeData: JSON.stringify(dto.envelopeData),
        notes: dto.notes,
      },
    });
  }

  extractReps(
    data: {
      position: string;
      value: number;
      timestamp: number;
    }[],
    base: number,
  ): {
    repNumber: number;
    startTimestamp: number;
    peakTimestamp: number;
    endTimestamp: number;
    contraction: number;
    extension: number;
    duration: number;
    peakValue: number;
    peakMultiplier: number;
  }[] {
    const reps: {
      repNumber: number;
      startTimestamp: number;
      peakTimestamp: number;
      endTimestamp: number;
      contraction: number;
      extension: number;
      duration: number;
      peakValue: number;
      peakMultiplier: number;
    }[] = [];
    let current = { start: null, peak: null, end: null };
    let repCount = 0;

    for (let i = 0; i < data.length; i++) {
      const point = data[i];

      if (point.position === 'bottom') {
        if (current.start === null) {
          // Start of a new rep
          current.start = point;
        } else if (current.peak && current.end === null) {
          // End of current rep
          current.end = point;

          const contraction = current.peak.timestamp - current.start.timestamp;
          const extension = current.end.timestamp - current.peak.timestamp;
          const duration = current.end.timestamp - current.start.timestamp;
          const peakMultiplier = current.peak.value / base;

          reps.push({
            repNumber: ++repCount,
            startTimestamp: current.start.timestamp,
            peakTimestamp: current.peak.timestamp,
            endTimestamp: current.end.timestamp,
            duration,
            contraction,
            extension,
            peakValue: current.peak.value,
            peakMultiplier,
          });

          // Reset for next rep
          current = { start: point, peak: null, end: null };
        }
      }

      if (point.position === 'peak' && current.start) {
        current.peak = point;
      }
    }

    return reps;
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
        avgPeakIntensity: true,
        envelopeBase: true,
        envelopeData: true,
        repData: true,
        fatigue: true,
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
        avgPeakIntensity: true,
        envelopeBase: true,
        envelopeData: true,
        repData: true,
        fatigue: true,
        createdAt: true,
        notes: true,
      },
    });

    if (!trace) {
      throw new NotFoundException(`Trace with ID ${traceId} not found or not accessible`);
    }

    return trace;
  }
}
