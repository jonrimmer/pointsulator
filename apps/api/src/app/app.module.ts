import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [TypeOrmModule.forRoot(), PlayersModule]
})
export class AppModule {}
