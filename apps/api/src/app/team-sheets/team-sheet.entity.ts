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
  @JoinColumn()
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
  @JoinColumn()
  teamSheet: TeamSheet;

  @ManyToOne(() => Asset)
  @JoinColumn()
  asset: Asset;
}
