import { Get, Controller } from '@nestjs/common';
import { WeekDetailsDTO } from '@pointsulator/api-interface';
import { WeeksService } from './weeks.service';

@Controller('weeks')
export class WeeksController {
  constructor(private weeksService: WeeksService) {}

  @Get()
  public getWeeks(): WeekDetailsDTO {
    return null;
  }
}
