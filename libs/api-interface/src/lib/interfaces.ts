export interface AssetDTO {
  id: number;
  name: string;
  team: string;
  type: AssetType;
}

export enum AssetType {
  Goalkeeper = 'Goalkeeper',
  Defence = 'Defence',
  Midfielder = 'Midfielder',
  Striker = 'Striker'
}

export interface ManagerDTO {
  id: number;
  name: string;
  teamName: string;
}
