import { Injectable } from '@nestjs/common';
import { TeamSheet, TeamSheetItem } from './team-sheet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { TeamSheetDTO, TeamSheetConfigDTO } from '@pointsulator/api-interface';

function mapTeamSheetToDTO(ts: TeamSheet): TeamSheetDTO {
  return {
    manager: {
      id: ts.manager.id,
      name: ts.manager.name
    },
    weekId: ts.week.id,
    items: ts.items.map(i => ({
      substitute: i.substitute,
      asset: i.asset,
      precedence: i.precedence
    }))
  };
}

function mapEntityFromDTO(ts: TeamSheetConfigDTO): DeepPartial<TeamSheet> {
  return {
    manager: {
      id: ts.managerId
    },
    items: ts.items.map(item => ({
      substitute: item.substitute || false,
      asset: {
        id: item.assetId
      },
      precedence: item.precedence
    })),
    week: {
      id: ts.weekId
    }
  };
}

@Injectable()
export class TeamSheetsService {
  constructor(
    @InjectRepository(TeamSheet)
    private readonly teamSheetRepo: Repository<TeamSheet>,
    @InjectRepository(TeamSheetItem)
    private readonly itemRepo: Repository<TeamSheetItem>
  ) {}

  public async findByManagerId(id: number) {
    return this.teamSheetRepo.find({
      where: {
        manager: { id }
      },
      relations: ['week', 'manager', 'items', 'items.asset']
    });
  }

  public async findById(id: number) {
    const result = await this.teamSheetRepo.findOne(id, {
      relations: ['week', 'manager', 'items', 'items.asset']
    });

    return mapTeamSheetToDTO(result);
  }

  public async addTeamSheet(teamSheet: TeamSheetConfigDTO) {
    const toSave = mapEntityFromDTO(teamSheet);
    const result = await this.teamSheetRepo.save(toSave);
    return this.findById(result.id);
  }

  public async clear() {
    await this.itemRepo.delete({});
    await this.itemRepo.query('alter table team_sheet_item AUTO_INCREMENT = 1');
    await this.teamSheetRepo.delete({});
    return this.teamSheetRepo.query(
      'alter table team_sheet AUTO_INCREMENT = 1'
    );
  }
}
