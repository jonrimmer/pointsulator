import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  BadRequestException,
  ParseIntPipe,
  Put,
  Query
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetDTO } from '@pointsulator/api-interface';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async findAll(@Query('owner') ownerId: number): Promise<AssetDTO[]> {
    return this.assetsService.findAll(ownerId);
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<AssetDTO> {
    return this.assetsService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() asset: AssetDTO
  ) {
    if (id !== asset.id) {
      throw new BadRequestException(
        `Path id <${id}> does not match body <${asset.id}>.`
      );
    }

    await this.assetsService.save(asset);
  }

  @Post()
  create(@Body() asset: AssetDTO) {
    return this.assetsService.save(asset);
  }
}
