import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { PresetController } from './preset.controller';
import { PresetService } from './preset.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PresetController],
  providers: [PresetService, PrismaService],
  imports: [UserModule],
  exports: [PresetService],
})
export class PresetModule {}
