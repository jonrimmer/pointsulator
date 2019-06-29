import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Asset } from '../assets/asset.entity';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public name: string;

  @Column()
  public teamName: string;

  @OneToMany(() => Asset, asset => asset.owner)
  squad: Asset[];
}
