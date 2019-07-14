import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from './asset.entity';
import { Repository, DeepPartial } from 'typeorm';
import { AssetDTO } from '@pointsulator/api-interface';

function mapAsset(a: Asset): AssetDTO {
  return {
    id: a.id,
    name: a.name,
    team: a.team,
    type: a.type,
    owner: a.owner
      ? {
          id: a.owner.id,
          name: a.owner.name
        }
      : null
  };
}
@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>
  ) {}

  async findAll(ownerId?: number): Promise<AssetDTO[]> {
    const assets = await this.assetRepository.find({
      relations: ['owner'],
      where: ownerId ? { owner: { id: ownerId } } : null
    });

    return assets.map(mapAsset);
  }

  async findById(id: number): Promise<AssetDTO> {
    return mapAsset(await this.assetRepository.findOne(id));
  }

  async save(asset: DeepPartial<AssetDTO> | DeepPartial<Asset>) {
    return mapAsset(await this.assetRepository.save(asset));
  }

  async saveMany(assets: DeepPartial<Asset>[]) {
    return (await this.assetRepository.save(assets)).map(mapAsset);
  }

  async clear() {
    await this.assetRepository.delete({});
    return this.assetRepository.query('alter table asset AUTO_INCREMENT = 1');
  }
}
