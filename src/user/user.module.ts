import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  imports: [AiModule],
  exports: [UserService],
})
export class UserModule {}
