import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';
import { getConnectionOptions } from 'typeorm';
import { Player } from './players/player.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const connectionOptions = await getConnectionOptions();

        return {
          ...connectionOptions,
          entities: [Player]
        };
      }
    }),
    PlayersModule
  ]
})
export class AppModule {}
