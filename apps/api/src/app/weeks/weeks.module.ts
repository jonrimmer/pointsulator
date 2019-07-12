import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Week, WeekEvent } from './week.entity';
import { WeeksController } from './weeks.controller';
import { WeeksService } from './weeks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Week, WeekEvent])],
  providers: [WeeksService],
  controllers: [WeeksController],
  exports: [WeeksService]
})
export class WeeksModule {}
