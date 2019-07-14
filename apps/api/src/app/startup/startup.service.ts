import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { WeeksService } from '../weeks/weeks.service';
import { AssetsService } from '../assets/assets.service';
import { environment } from '../../environments/environment';
import csv from 'csv-parser';
import stripBom from 'strip-bom-stream';
import * as fs from 'fs';
import * as path from 'path';
import { Asset } from '../assets/asset.entity';
import { ManagersService } from '../managers/managers.service';
import { DeepPartial } from 'typeorm';
import { AssetDTO, AssetType } from '@pointsulator/api-interface';
import { TeamSheetsService } from '../team-sheets/team-sheets.service';
import * as faker from 'faker';
import Faker from 'faker';
import { arrayOf } from '../utils/fake';
import { Manager } from '../managers/manager.entity';

console.log(faker.seed);

@Injectable()
export class StartupService implements OnApplicationBootstrap {
  constructor(
    private readonly weeksService: WeeksService,
    private readonly assetsService: AssetsService,
    private readonly managersService: ManagersService,
    private readonly teamSheetsService: TeamSheetsService
  ) {}

  async onApplicationBootstrap() {
    if (environment.recreate) {
      await this.teamSheetsService.clear();
      await this.assetsService.clear();
      await this.managersService.clear();
      await this.weeksService.clear();

      await this.weeksService.createWeeks(new Date().getFullYear());

      Faker.seed(1);
      Faker.setLocale('en');

      const managers = await this.managersService.saveMany(
        arrayOf<DeepPartial<Manager>>(5, () => ({
          name: faker.name.findName(),
          teamName: `${faker.address.city()} FC`
        }))
      );

      const teams = arrayOf<string>(10, () => `${faker.address.city()} FC`);

      const assets: DeepPartial<Asset>[] = [];

      // Keepers and defences
      [AssetType.Goalkeeper, AssetType.Defence].forEach(type => {
        assets.push(
          ...teams.map(team => ({
            team,
            name: team,
            type,
            owner: {
              id: faker.random.arrayElement(managers).id
            }
          }))
        );
      });

      // Midfielders and forwards
      [AssetType.Midfielder, AssetType.Forward].forEach(type => {
        assets.push(
          ...arrayOf<DeepPartial<AssetDTO>>(30, () => ({
            team: faker.random.arrayElement(teams),
            name: `${faker.name.firstName(0)} ${faker.name.lastName()}`,
            type,
            owner: {
              id: faker.random.arrayElement(managers).id
            }
          }))
        );
      });

      this.assetsService.saveMany(assets);

      // const rows: DeepPartial<Asset>[] = [];

      // await new Promise(resolve => {
      //   fs.createReadStream(path.resolve(process.cwd(), 'data/assets.csv'))
      //     .pipe(stripBom())
      //     .pipe(csv())
      //     .on('error', error => {
      //       console.error(error);
      //     })
      //     .on('data', (row: DeepPartial<Asset>) => {
      //       row.owner = {
      //         id: managers[0].id
      //       };

      //       rows.push(row);
      //     })
      //     .on('end', () => {
      //       resolve(this.assetsService.saveMany(rows));
      //     });
      // });
    }
  }
}
