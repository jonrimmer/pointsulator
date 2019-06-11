import { Controller, Get, Param } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDTO } from '../../../../../libs/api-interface/src';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async findAll(): Promise<PlayerDTO[]> {
    return this.playersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<PlayerDTO> {
    return this.playersService.findById(id);
  }
}
