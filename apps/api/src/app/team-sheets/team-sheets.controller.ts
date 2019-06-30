import { Controller } from '@nestjs/common';
import { TeamSheetsService } from './team-sheets.service';

@Controller('team-sheets')
export class TeamSheetsController {
  constructor(private readonly teamsService: TeamSheetsService) {}
}
