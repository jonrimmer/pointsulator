import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Week, WeekEvent } from './week.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import {
  WeekDTO,
  WeekStatus,
  WeekDetailsDTO,
  NewWeekDTO
} from '@pointsulator/api-interface';
import { TeamSheetsService } from '../team-sheets/team-sheets.service';

@Injectable()
export class WeeksService {
  constructor(
    @InjectRepository(Week) private readonly weeksRepo: Repository<Week>,
    @InjectRepository(WeekEvent)
    private readonly eventsRepo: Repository<WeekEvent>,
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
      relations: ['assets', 'assets.asset', 'assets.events', 'assets.owner']
    });

    const teamSheets = await this.tsService.findForDate(week.startDate);

    return {
      id: week.id,
      startDate: week.startDate,
      teams: teamSheets,
      scoreboard: {
        before: [],
        after: []
      },
      assets: week.assets.map(wa => ({
        assetId: wa.asset.id,
        didNotPlay: wa.didNotPlay,
        owner: {
          id: wa.owner.id,
          name: wa.owner.name
        },
        events: wa.events
      }))
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

  async clear() {
    await this.eventsRepo.delete({});
    await this.eventsRepo.query('alter table week_event AUTO_INCREMENT = 1');
    await this.weeksRepo.delete({});
    return this.weeksRepo.query('alter table week AUTO_INCREMENT = 1');
  }
}
