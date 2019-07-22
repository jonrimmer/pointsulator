import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { WeekStatus } from '@pointsulator/api-interface';
import { Manager } from '../managers/manager.entity';

@Entity()
export class Week {
  constructor(startDate?: Date) {
    if (startDate) {
      this.startDate = startDate;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column({ type: 'enum', default: WeekStatus.Future, enum: WeekStatus })
  status: WeekStatus;

  @OneToMany(() => WeekAsset, event => event.week)
  assets: WeekAsset[];

  @OneToMany(() => WeekScore, score => score.week)
  scores: WeekScore[];
}

@Entity()
export class WeekAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Week, week => week.assets)
  @JoinColumn()
  week: Week;

  @ManyToOne(() => Asset)
  @JoinColumn()
  asset: Asset;

  @Column()
  didNotPlay: boolean;

  @Column()
  goals: number;

  @Column()
  assists: number;

  @Column()
  conceded: number;

  @Column()
  redCard: boolean;

  @ManyToOne(() => Manager)
  @JoinColumn()
  owner: Manager;
}

@Entity()
export class WeekScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Week, week => week.scores)
  @JoinColumn()
  week: Week;

  @ManyToOne(() => Manager, manager => manager.weekScores)
  @JoinColumn()
  manager: Manager;

  @Column()
  points: number;
}
