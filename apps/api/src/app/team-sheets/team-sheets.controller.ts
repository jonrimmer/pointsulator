import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Post,
  Body,
  Param
} from '@nestjs/common';
import { TeamSheetsService } from './team-sheets.service';
import { TeamSheetConfigDTO } from '@pointsulator/api-interface';

@Controller('team-sheets')
export class TeamSheetsController {
  constructor(private readonly teamsService: TeamSheetsService) {}

  @Get()
  getTeamSheetsForManager(
    @Query('manager', new ParseIntPipe()) managerId: number
  ) {
    return this.teamsService.findByManagerId(managerId);
  }

  @Post()
  postTeamSheet(@Body() teamSheet: TeamSheetConfigDTO) {
    return this.teamsService.addTeamSheet(teamSheet);
  }

  @Get(':id')
  getTeamSheet(@Param('id', new ParseIntPipe()) id: number) {
    return this.teamsService.findById(id);
  }
}
