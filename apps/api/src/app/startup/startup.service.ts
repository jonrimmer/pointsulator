import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { WeeksService } from '../weeks/weeks.service';
import { AssetsService } from '../assets/assets.service';
import { environment } from '../../environments/environment';
import csv from 'csv-parser';
import stripBom from 'strip-bom-stream';
import * as fs from 'fs';
import * as path from 'path';
import { Asset } from '../assets/asset.entity';

@Injectable()
export class StartupService implements OnApplicationBootstrap {
  constructor(
    private readonly weeksService: WeeksService,
    private readonly assetsService: AssetsService
  ) {}

  async onApplicationBootstrap() {
    const weeks = await this.weeksService.getWeeks();

    if (weeks.length === 0) {
      await this.weeksService.createWeeks(new Date().getFullYear());
    }

    if (!environment.production) {
      const assets = await this.assetsService.findAll();

      if (assets.length === 0) {
        const rows: Asset[] = [];

        await new Promise(resolve => {
          fs.createReadStream(path.resolve(process.cwd(), 'data/assets.csv'))
            .pipe(stripBom())
            .pipe(csv())
            .on('error', error => {
              console.error(error);
            })
            .on('data', (row: any) => {
              console.log(row);
              rows.push(row);
            })
            .on('end', () => {
              resolve(this.assetsService.saveMany(rows));
            });
        });
      }
    }
  }
}
