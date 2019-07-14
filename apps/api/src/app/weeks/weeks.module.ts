import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Week, WeekEvent, WeekAsset } from './week.entity';
import { WeeksController } from './weeks.controller';
import { WeeksService } from './weeks.service';
import { TeamSheetsModule } from '../team-sheets/team-sheets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Week, WeekAsset, WeekEvent]),
    TeamSheetsModule
  ],
  providers: [WeeksService],
  controllers: [WeeksController],
  exports: [WeeksService]
})
export class WeeksModule {}
