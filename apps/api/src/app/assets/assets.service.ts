import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from './asset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>
  ) {}

  findAll(): Promise<Asset[]> {
    return this.assetRepository.find({
      relations: ['owner']
    });
  }

  findById(id: number): Promise<Asset> {
    return this.assetRepository.findOne(id);
  }

  save(asset: Asset) {
    return this.assetRepository.save(asset);
  }
}
