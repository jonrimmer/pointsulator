export interface AssetDTO {
  id: number;
  name: string;
  team: string;
  type: AssetType;
  manager?: ManagerDTO;
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
  squad?: AssetDTO[];
}

export enum EventType {
  Goal = 'Goal',
  RedCard = 'RedCard'
}

export interface EventDTO {
  assetId: number;
  type: EventType;
}

export interface TeamItemDTO {
  assetId: number;
  substitute: boolean;
  didNotPlay: boolean;
}

export interface TeamDTO {
  managerId: number;
  createdDate: Date;
  items: TeamItemDTO[];
}

export interface WeekDTO {
  id: number;
  startDate: Date;
  teams: [];
}
