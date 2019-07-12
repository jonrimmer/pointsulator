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

  @OneToMany(() => WeekEvent, event => event.week)
  events: WeekEvent[];
}

@Entity()
export class WeekEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Week, week => week.events)
  week: Week;

  @ManyToOne(() => Asset)
  @JoinColumn()
  asset: Asset;

  @Column({ type: 'enum', default: AssetEventType.Goal, enum: AssetEventType })
  type: AssetEventType;

  @Column()
  count: number;
}
