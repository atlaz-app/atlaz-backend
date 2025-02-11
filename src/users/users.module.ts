import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [AiModule],
  exports: [UsersService],
})
export class UsersModule {}
