import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { TraceController } from './trace.controller';
import { TraceService } from './trace.service';
import { UserModule } from 'src/user/user.module';
import { UploadthingModule } from 'src/uploadthing/uploadthing.module';

@Module({
  controllers: [TraceController],
  providers: [TraceService, PrismaService],
  imports: [UserModule, UploadthingModule],
  exports: [TraceService],
})
export class TraceModule {}
