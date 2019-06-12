import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from './assets/assets.module';
import { getConnectionOptions } from 'typeorm';
import { Asset } from './assets/asset.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const connectionOptions = await getConnectionOptions();

        return {
          ...connectionOptions,
          entities: [Asset]
        };
      }
    }),
    AssetsModule
  ]
})
export class AppModule {}
