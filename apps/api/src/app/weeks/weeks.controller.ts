import { Get, Controller, Param, ParseIntPipe } from '@nestjs/common';
import { WeekDetailsDTO, WeekDTO } from '@pointsulator/api-interface';
import { WeeksService } from './weeks.service';

@Controller('weeks')
export class WeeksController {
  constructor(private weeksService: WeeksService) {}

  @Get()
  public getWeeks() {
    return this.weeksService.getWeeks();
  }

  @Get(':id')
  public getWeekDetails(@Param(new ParseIntPipe()) id: number) {
    return this.weeksService.getWeek(id);
  }
}
