import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from './assets/assets.module';
import { getConnectionOptions } from 'typeorm';
import { Asset } from './assets/asset.entity';
import { Manager } from './managers/manager.entity';
import { ManagersModule } from './managers/managers.module';
import { TeamSheetsModule } from './team-sheets/team-sheets.module';
import { TeamSheet, TeamSheetItem } from './team-sheets/team-sheet.entity';
import { StartupService } from './startup/startup.service';
import { WeeksModule } from './weeks/weeks.module';
import { Week, WeekEvent } from './weeks/week.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const connectionOptions = await getConnectionOptions();

        return {
          ...connectionOptions,
          entities: [Asset, Manager, TeamSheet, TeamSheetItem, Week, WeekEvent]
        };
      }
    }),
    AssetsModule,
    ManagersModule,
    TeamSheetsModule,
    WeeksModule
  ],
  providers: [StartupService]
})
export class AppModule {}
