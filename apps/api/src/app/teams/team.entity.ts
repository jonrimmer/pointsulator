import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TeamEntry } from './team-entry.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createDate: Date;

  @OneToMany(() => TeamEntry, entry => entry.team)
  entries: TeamEntry[];
}
