import {
  Controller,
  Get,
  ParseIntPipe,
  BadRequestException,
  Param,
  Put,
  Body,
  Post
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagerDTO } from '@pointsulator/api-interface';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get()
  async findAll() {
    return this.managersService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<ManagerDTO> {
    return this.managersService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() asset: ManagerDTO
  ) {
    if (id !== asset.id) {
      throw new BadRequestException(
        `Path id <${id}> does not match body <${asset.id}>.`
      );
    }

    await this.managersService.save(asset);
  }

  @Post()
  create(@Body() asset: ManagerDTO) {
    return this.managersService.save(asset);
  }
}
