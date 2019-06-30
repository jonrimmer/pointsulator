import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { TeamSheetsService } from './team-sheets.service';

@Controller('team-sheets')
export class TeamSheetsController {
  constructor(private readonly teamsService: TeamSheetsService) {}

  @Get()
  getTeamSheetsForManager(
    @Query('manager', new ParseIntPipe()) managerId: number
  ) {
    return this.teamsService.findByManagerId(managerId);
  }
}
