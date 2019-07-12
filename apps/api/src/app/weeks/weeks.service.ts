import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Week } from './week.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class WeeksService {
  constructor(
    @InjectRepository(Week) private readonly weeksRepo: Repository<Week>
  ) {}

  getWeeks() {
    return this.weeksRepo.find();
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
}
