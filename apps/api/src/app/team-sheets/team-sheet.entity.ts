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

@Entity()
export class TeamSheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  validFrom: Date;

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

  @ManyToOne(() => TeamSheet, teamSheet => teamSheet.items)
  teamSheet: TeamSheet;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Asset;
}
