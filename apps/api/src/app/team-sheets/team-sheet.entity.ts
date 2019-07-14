import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Manager } from '../managers/manager.entity';
import { Asset } from '../assets/asset.entity';
import { Week } from '../weeks/week.entity';

@Entity()
export class TeamSheet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Week)
  @JoinColumn()
  week: Week;

  @OneToMany(() => TeamSheetItem, item => item.teamSheet, {
    cascade: true
  })
  items: TeamSheetItem[];

  @ManyToOne(() => Manager, manager => manager.teamSheets)
  manager: Manager;
}

@Entity()
export class TeamSheetItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: false
  })
  substitute: boolean;

  @Column({
    nullable: true
  })
  precedence: number;

  @ManyToOne(() => TeamSheet, teamSheet => teamSheet.items)
  teamSheet: TeamSheet;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Asset;
}
