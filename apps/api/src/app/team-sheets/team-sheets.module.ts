import { Module } from '@nestjs/common';
import { TeamSheetsController } from './team-sheets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamSheet, TeamSheetItem } from './team-sheet.entity';
import { TeamSheetsService } from './team-sheets.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamSheet, TeamSheetItem])],
  providers: [TeamSheetsService],
  controllers: [TeamSheetsController],
  exports: [TeamSheetsService]
})
export class TeamSheetsModule {}
