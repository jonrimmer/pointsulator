import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from './manager.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>
  ) {}

  findAll(): Promise<Manager[]> {
    return this.managerRepository.find({
      relations: ['squad']
    });
  }

  findById(id: number): Promise<Manager> {
    return this.managerRepository.findOne(id);
  }

  save(asset: Manager) {
    return this.managerRepository.save(asset);
  }
}
