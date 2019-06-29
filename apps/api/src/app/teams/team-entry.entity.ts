import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Team } from './team.entity';
import { Asset } from '../assets/asset.entity';

@Entity()
export class TeamEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, team => team.entries)
  team: Team;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Asset;
}
