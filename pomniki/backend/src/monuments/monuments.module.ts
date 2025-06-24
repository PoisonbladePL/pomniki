import { Module } from '@nestjs/common';
import { MonumentsService } from './monuments.service';
import { MonumentsController } from './monuments.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [MonumentsService, PrismaService],
  controllers: [MonumentsController],
})
export class MonumentsModule {}
