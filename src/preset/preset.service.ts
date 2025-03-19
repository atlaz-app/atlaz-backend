import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePresetDto } from './preset.dto';

@Injectable()
export class PresetService {
  constructor(private prisma: PrismaService) {}

  async getPresets(userId: number) {
    return this.prisma.preset.findMany({ where: { userId } });
  }

  async createPreset(userId: number, preset: CreatePresetDto) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        presets: {
          create: preset,
        },
      },
      include: {
        presets: true,
      },
    });

    return this.prisma.preset.findMany({ where: { userId } });
  }

  async deletePreset(userId: number, presetId: number) {
    await this.prisma.preset.delete({ where: { id: presetId, userId } });

    return this.getPresets(userId);
  }
}
