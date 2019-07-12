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
  Forward = 'Forward'
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
  asset: AssetDTO;
  substitute: boolean;
}

export interface TeamSheetDTO {
  manager: ManagerRef;
  items: TeamSheetItemDTO[];
  validFrom: any;
}

export interface ScoreboardEntryDTO {
  manager: ManagerRef;
  points: number;
}

export enum AssetEventType {
  Goal = 'Goal',
  OwnGoal = 'Own Goal',
  RedCard = 'Red Card',
  CleanSheet = 'Clean Sheet',
  Assist = 'Assist'
}

export interface AssetEventDTO {
  id?: number;
  type: AssetEventType;
  count: number;
  owner: ManagerRef;
}

export enum WeekStatus {
  Completed = 'Completed',
  InProgress = 'In Progress',
  Future = 'Future'
}

export interface WeekDTO {
  id: number;
  startDate: number;
  status: WeekStatus;
}

export interface WeekDetailsDTO {
  id: number;
  startDate: Date;
  teams: TeamSheetDTO[];
  scoreboard: {
    before: ScoreboardEntryDTO[];
    after?: ScoreboardEntryDTO[];
  };
  assets: WeekAssetDTO[];
}

export interface WeekAssetDTO {
  assetId: number;
  didNotPlay: boolean;
  events: AssetEventDTO[];
}

export interface TeamSheetConfigItemDTO {
  assetId: number;
  substitute: boolean;
}

export interface TeamSheetConfigDTO {
  managerId: number;
  items: TeamSheetConfigItemDTO[];
  validFrom: any;
}
