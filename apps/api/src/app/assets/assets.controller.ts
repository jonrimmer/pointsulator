import { Controller, Get, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetDTO } from '@pointsulator/api-interface';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async findAll(): Promise<AssetDTO[]> {
    return this.assetsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<AssetDTO> {
    return this.assetsService.findById(id);
  }
}
