import { Injectable } from '@nestjs/common';
import { Team } from './team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>
  ) {}

  public void addTeam() {
    
  }
}
