import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { MonumentsModule } from './monuments/monuments.module';

@Module({
  imports: [MonumentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
