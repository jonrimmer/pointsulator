import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { AssetEventType, WeekStatus } from '@pointsulator/api-interface';
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

  @OneToMany(() => WeekEvent, event => event.asset)
  events: WeekEvent[];

  @ManyToOne(() => Manager)
  @JoinColumn()
  owner: Manager;
}

@Entity()
export class WeekEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WeekAsset, asset => asset.events)
  @JoinColumn()
  asset: WeekAsset;

  @Column({ type: 'enum', default: AssetEventType.Goal, enum: AssetEventType })
  type: AssetEventType;

  @Column()
  count: number;
}
