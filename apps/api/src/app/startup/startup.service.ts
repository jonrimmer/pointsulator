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
import {
  AssetDTO,
  AssetType,
  ManagerDTO,
  TeamSheetConfigDTO,
  TeamSheetConfigItemDTO
} from '@pointsulator/api-interface';
import { TeamSheetsService } from '../team-sheets/team-sheets.service';
import * as faker from 'faker';
import Faker from 'faker';
import { arrayOf } from '../utils/fake';
import { Manager } from '../managers/manager.entity';
import { DateTime } from 'luxon';

function items(
  assets: AssetDTO[],
  type: AssetType,
  count: number,
  nonSub: number
): TeamSheetConfigItemDTO[] {
  return assets
    .filter(a => a.type === type)
    .slice(0, count)
    .map((a, i) => ({
      assetId: a.id,
      substitute: i >= nonSub,
      precedence: i >= nonSub ? i : null
    }));
}

function fakeTeamsheet(
  assets: AssetDTO[],
  manager: ManagerDTO
): TeamSheetConfigDTO {
  const managersAssets = assets.filter(a => a.owner.id === manager.id);

  return {
    validFrom: null,
    managerId: manager.id,
    items: [
      ...items(managersAssets, AssetType.Goalkeeper, 2, 1),
      ...items(managersAssets, AssetType.Defence, 2, 1),
      ...items(managersAssets, AssetType.Midfielder, 4, 3),
      ...items(managersAssets, AssetType.Forward, 4, 3)
    ]
  };
}

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
      await this.weeksService.clear();
      await this.assetsService.clear();
      await this.managersService.clear();

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
            },
            price: faker.random.number({ min: 1, max: 5, precision: 0.1 })
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
            },
            price: faker.random.number({ min: 1, max: 5, precision: 0.1 })
          }))
        );
      });

      const savedAssets = await this.assetsService.saveMany(assets);

      // Create some teamsheets

      for (const manager of managers) {
        await this.teamSheetsService.addTeamSheet({
          ...fakeTeamsheet(savedAssets, manager),
          validFrom: DateTime.fromObject({
            day: 1,
            month: 3,
            year: 2019
          }).toJSDate()
        });
      }

      await this.weeksService.createWeek({
        date: Date.now()
      });

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
