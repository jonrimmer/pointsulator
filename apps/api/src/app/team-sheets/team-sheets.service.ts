import { Injectable } from '@nestjs/common';
import { TeamSheet, TeamSheetItem } from './team-sheet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, MoreThan } from 'typeorm';
import {
  TeamSheetDTO,
  TeamSheetConfigDTO,
  WeekDTO
} from '@pointsulator/api-interface';

function mapTeamSheetToDTO(ts: TeamSheet): TeamSheetDTO {
  return {
    manager: {
      id: ts.manager.id,
      name: ts.manager.name
    },
    validFrom: ts.validFrom,
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
    validFrom: ts.validFrom
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

  public async clear() {
    await this.itemRepo.delete({});
    await this.itemRepo.query('alter table team_sheet_item AUTO_INCREMENT = 1');
    await this.teamSheetRepo.delete({});
    return this.teamSheetRepo.query(
      'alter table team_sheet AUTO_INCREMENT = 1'
    );
  }

  async findForDate(startDate: Date): Promise<TeamSheetDTO[]> {
    const result = await this.teamSheetRepo
      .createQueryBuilder('ts')
      .leftJoinAndSelect('ts.manager', 'm')
      .leftJoinAndSelect('ts.items', 'i')
      .leftJoinAndSelect('i.asset', 'a')
      .where(
        'ts.id in (select max(id) from team_sheet where validFrom <= :date group by managerId)',
        { date: startDate }
      )
      .getMany();

    return result.map(mapTeamSheetToDTO);
  }
}
