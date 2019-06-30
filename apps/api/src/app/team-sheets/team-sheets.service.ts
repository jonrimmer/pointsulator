import { Injectable } from '@nestjs/common';
import { TeamSheet } from './team-sheet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamSheetDTO } from '@pointsulator/api-interface';

function mapTeamSheet(ts: TeamSheet): TeamSheetDTO {
  return {
    manager: {
      id: ts.manager.id,
      name: ts.manager.name
    },
    validFrom: ts.validFrom,
    items: ts.items.map(i => ({
      substitute: i.substitute,
      asset: {
        id: i.asset.id,
        name: i.asset.name
      }
    }))
  };
}

@Injectable()
export class TeamSheetsService {
  constructor(
    @InjectRepository(TeamSheet)
    private readonly teamSheetRepo: Repository<TeamSheet>
  ) {}

  public async findByManagerId(id: number) {
    return this.teamSheetRepo.find({
      where: {
        managerId: id
      },
      relations: ['manager', 'items', 'items.asset']
    });
  }

  public async addTeamSheet(teamSheet: TeamSheetDTO) {
    return mapTeamSheet(await this.teamSheetRepo.save(teamSheet));
  }
}
