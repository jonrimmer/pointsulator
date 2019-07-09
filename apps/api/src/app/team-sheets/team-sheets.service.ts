import { Injectable } from '@nestjs/common';
import { TeamSheet } from './team-sheet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { TeamSheetDTO, TeamSheetConfigDTO } from '@pointsulator/api-interface';

function mapTeamSheetToDTO(ts: TeamSheet): TeamSheetDTO {
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

function mapEntityFromDTO(ts: TeamSheetConfigDTO): DeepPartial<TeamSheet> {
  return {
    manager: {
      id: ts.managerId
    },
    items: ts.items.map(item => ({
      substitute: item.substitute || false,
      asset: {
        id: item.assetId
      }
    })),
    validFrom: new Date(ts.validFrom)
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

  public async findById(id: number) {
    const result = await this.teamSheetRepo.findOne(id, {
      relations: ['manager', 'items', 'items.asset']
    });

    return mapTeamSheetToDTO(result);
  }

  public async addTeamSheet(teamSheet: TeamSheetConfigDTO) {
    const toSave = mapEntityFromDTO(teamSheet);
    const result = await this.teamSheetRepo.save(toSave);
    return this.findById(result.id);
  }
}
