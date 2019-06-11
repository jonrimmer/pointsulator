import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>
  ) {}

  findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  findById(id: number): Promise<Player> {
    return this.playerRepository.findOne(id);
  }
}
