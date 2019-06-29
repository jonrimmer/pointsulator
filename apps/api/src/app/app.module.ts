import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from './assets/assets.module';
import { getConnectionOptions } from 'typeorm';
import { Asset } from './assets/asset.entity';
import { Manager } from './managers/manager.entity';
import { ManagersModule } from './managers/managers.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const connectionOptions = await getConnectionOptions();

        return {
          ...connectionOptions,
          entities: [Asset, Manager]
        };
      }
    }),
    AssetsModule,
    ManagersModule
  ]
})
export class AppModule {}
