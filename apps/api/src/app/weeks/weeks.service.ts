import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Week, WeekEvent } from './week.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import {
  WeekDTO,
  WeekStatus,
  WeekDetailsDTO,
  WeekAssetDTO
} from '@pointsulator/api-interface';
import { Asset } from '../assets/asset.entity';

@Injectable()
export class WeeksService {
  constructor(
    @InjectRepository(Week) private readonly weeksRepo: Repository<Week>,
    @InjectRepository(WeekEvent)
    private readonly eventsRepo: Repository<WeekEvent>
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
        'assets.event',
        'assets.owner',
        'teamSheets',
        'teamSheets.manager'
      ]
    });

    return {
      id: week.id,
      startDate: week.startDate,
      teams: week.teamSheets.map(ts => ({
        manager: {
          id: ts.manager.id,
          name: ts.manager.name
        },
        items: ts.items
      })),
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

  createWeeks(year: number) {
    // 30 weeks should be enough for anyone.

    const startDate = DateTime.local(year, 7, 27);

    const weeks = Array.from(
      { length: 30 },
      (_, i) => new Week(startDate.plus({ weeks: i }).toJSDate())
    );

    this.weeksRepo.save(weeks);
  }

  async clear() {
    await this.eventsRepo.delete({});
    await this.eventsRepo.query('alter table week_event AUTO_INCREMENT = 1');
    await this.weeksRepo.delete({});
    return this.weeksRepo.query('alter table week AUTO_INCREMENT = 1');
  }
}
