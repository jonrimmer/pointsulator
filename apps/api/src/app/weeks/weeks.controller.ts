import {
  Get,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Put
} from '@nestjs/common';
import { NewWeekDTO, WeekDetailsDTO } from '@pointsulator/api-interface';
import { WeeksService } from './weeks.service';

@Controller('weeks')
export class WeeksController {
  constructor(private weeksService: WeeksService) {}

  @Get()
  public getWeeks() {
    return this.weeksService.getWeeks();
  }

  @Get(':id')
  public getWeekDetails(@Param('id', new ParseIntPipe()) id: number) {
    return this.weeksService.getWeek(id);
  }

  @Post()
  public createWeek(@Body() dto: NewWeekDTO) {
    return this.weeksService.createWeek(dto);
  }

  @Put(':id')
  public saveWeek(@Body() dto: WeekDetailsDTO) {
    return this.weeksService.saveWeek(dto);
  }
}
