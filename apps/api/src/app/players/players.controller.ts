import { Controller, Get, Param } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.playersService.findById(id);
  }
}
