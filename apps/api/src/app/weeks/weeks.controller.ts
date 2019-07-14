import {
  Get,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Body
} from '@nestjs/common';
import { NewWeekDTO } from '@pointsulator/api-interface';
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
}
