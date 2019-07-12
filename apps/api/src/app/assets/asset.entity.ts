import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AssetType } from '@pointsulator/api-interface';
import { Manager } from '../managers/manager.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  team: string;

  @Column({
    type: 'enum',
    enum: AssetType,
    default: AssetType.Forward
  })
  type: AssetType;

  @ManyToOne(() => Manager, owner => owner.squad)
  owner?: Manager;
}
