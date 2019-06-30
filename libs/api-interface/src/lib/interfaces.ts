export interface AssetRef {
  id: number;
  name: string;
}

export interface AssetDTO extends AssetRef {
  team: string;
  type: AssetType;
  owner?: ManagerRef;
}

export enum AssetType {
  Goalkeeper = 'Goalkeeper',
  Defence = 'Defence',
  Midfielder = 'Midfielder',
  Striker = 'Striker'
}

export interface ManagerRef {
  id: number;
  name: string;
}

export interface ManagerDTO extends ManagerRef {
  teamName: string;
  squad?: AssetRef[];
}

export enum EventType {
  Goal = 'Goal',
  RedCard = 'RedCard'
}

export interface EventDTO {
  assetId: number;
  type: EventType;
}

export interface TeamSheetItemDTO {
  asset: AssetRef;
  substitute: boolean;
}

export interface TeamSheetDTO {
  manager: ManagerRef;
  items: TeamSheetItemDTO[];
  validFrom: any;
}

export interface WeekDTO {
  id: number;
  startDate: Date;
  teams: [];
}
