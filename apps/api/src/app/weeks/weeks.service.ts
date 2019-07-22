import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Week, WeekScore, WeekAsset } from './week.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import {
  WeekDTO,
  WeekStatus,
  WeekDetailsDTO,
  NewWeekDTO,
  WeekTeamSheetDTO,
  TeamSheetItemDTO,
  AssetType,
  WeekAssetDTO
} from '@pointsulator/api-interface';
import { TeamSheetsService } from '../team-sheets/team-sheets.service';
import { groupBy, flow, map, sortBy } from 'lodash/fp';

@Injectable()
export class WeeksService {
  constructor(
    @InjectRepository(Week) private readonly weeksRepo: Repository<Week>,
    @InjectRepository(WeekScore)
    private readonly weekScoresRepo: Repository<WeekScore>,
    @InjectRepository(WeekAsset)
    private readonly weekAssetsRepo: Repository<WeekAsset>,
    private readonly tsService: TeamSheetsService
  ) {}

  async getWeeks(): Promise<WeekDTO[]> {
    return (await this.weeksRepo.find()).map(week => ({
      id: week.id,
      startDate: week.startDate.valueOf(),
      status: WeekStatus.Future
    }));
  }

  async getWeek(id: number): Promise<WeekDetailsDTO> {
    const week = await this.weeksRepo.findOne(id, {
      relations: [
        'assets',
        'assets.asset',
        'assets.owner',
        'scores',
        'scores.manager'
      ]
    });

    const lastWeek = await this.weeksRepo.findOne(id - 1, {
      relations: ['assets', 'scores'],
      where: {}
    });

    const teamSheets = await this.tsService.findForDate(week.startDate);

    const teams: WeekTeamSheetDTO[] = teamSheets.map(team => ({
      manager: team.manager,
      initialPoints: lastWeek
        ? lastWeek.scores.find(score => score.manager.id === team.manager.id)
            .points
        : 0,
      points: (
        week.scores.find(score => score.manager.id === team.manager.id) || {
          points: 0
        }
      ).points,
      ...(flow(
        map((item: TeamSheetItemDTO) => {
          const weekAsset = week.assets.find(a => a.id === item.asset.id) || {
            id: null,
            didNotPlay: false,
            events: [],
            goals: 0,
            assists: 0,
            conceded: 0,
            redCard: false
          };

          const result: WeekAssetDTO = {
            ...item,
            id: weekAsset.id,
            didNotPlay: weekAsset.didNotPlay,
            goals: weekAsset.goals,
            assists: weekAsset.assists,
            conceded: weekAsset.conceded,
            redCard: weekAsset.redCard
          };

          return result;
        }),
        sortBy(item => item.substitute),
        groupBy(item => item.asset.type)
      )(team.items) as Record<AssetType, WeekAssetDTO[]>)
    }));

    return {
      id: week.id,
      startDate: week.startDate,
      teams
    };
  }

  createWeek(dto: NewWeekDTO) {
    const date = DateTime.fromMillis(dto.date);

    const status =
      date.diffNow().milliseconds > 0
        ? WeekStatus.Future
        : WeekStatus.InProgress;

    return this.weeksRepo.save(
      {
        startDate: new Date(dto.date),
        status
      },
      {
        reload: true
      }
    );
  }

  async saveWeek(dto: WeekDetailsDTO) {
    for (const team of dto.teams) {
      for (const type of Object.keys(AssetType)) {
        await this.weekAssetsRepo.save(
          team[type].map((asset: WeekAssetDTO) => ({
            id: asset.id,
            asset: {
              id: asset.asset.id
            },
            week: {
              id: dto.id
            },
            owner: {
              id: team.manager.id
            },
            didNotPlay: asset.didNotPlay,
            goals: asset.goals,
            assists: asset.assists,
            conceded: asset.conceded,
            redCard: asset.redCard
          }))
        );
      }
    }

    await this.weekScoresRepo.delete({
      week: {
        id: dto.id
      }
    });

    await this.weekScoresRepo.save(
      dto.teams.map(t => ({
        week: {
          id: dto.id
        },
        manager: {
          id: t.manager.id
        },
        points: t.points
      }))
    );
  }

  async clear() {
    await this.weekAssetsRepo.delete({});
    await this.weekAssetsRepo.query(
      'alter table week_asset AUTO_INCREMENT = 1'
    );

    await this.weekScoresRepo.delete({});
    await this.weekScoresRepo.query(
      'alter table week_score AUTO_INCREMENT = 1'
    );
    await this.weeksRepo.delete({});
    return this.weeksRepo.query('alter table week AUTO_INCREMENT = 1');
  }
}
