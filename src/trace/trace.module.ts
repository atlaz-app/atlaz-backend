import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { TraceController } from './trace.controller';
import { TraceService } from './trace.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TraceController],
  providers: [TraceService, PrismaService],
  imports: [UserModule],
  exports: [TraceService],
})
export class TraceModule {}
