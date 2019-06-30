import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { TeamSheet } from '../team-sheets/team-sheet.entity';

@Entity()
class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public name: string;

  @Column()
  public teamName: string;

  @OneToMany(() => Asset, asset => asset.owner)
  squad?: Asset[];

  @OneToMany(() => TeamSheet, teamSheet => teamSheet.manager)
  teamSheets: TeamSheet[];
}

export { Manager };
