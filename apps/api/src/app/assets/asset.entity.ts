import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AssetType } from '@pointsulator/api-interface';

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
    default: AssetType.Striker
  })
  type: AssetType;
}
