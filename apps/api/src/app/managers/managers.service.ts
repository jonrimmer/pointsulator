import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from './manager.entity';
import { ManagerDTO } from '@pointsulator/api-interface';

function mapManager(m: Manager): ManagerDTO {
  return {
    id: m.id,
    name: m.name,
    teamName: m.teamName,
    squad: m.squad
      ? m.squad.map(a => ({
          id: a.id,
          name: a.name
        }))
      : null
  };
}
@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>
  ) {}

  async findAll(): Promise<ManagerDTO[]> {
    const managers = await this.managerRepository.find({
      relations: ['squad']
    });

    return managers.map(mapManager);
  }

  async findById(id: number): Promise<ManagerDTO> {
    return mapManager(await this.managerRepository.findOne(id));
  }

  async save(asset: ManagerDTO): Promise<ManagerDTO> {
    return mapManager(await this.managerRepository.save(asset));
  }
}
