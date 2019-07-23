export interface AssetRef {
  id: number;
  name: string;
}

export interface AssetDTO extends AssetRef {
  team: string;
  type: AssetType;
  owner?: ManagerRef;
  price: number;
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
  squad?: AssetDTO[];
}
export interface TeamSheetItemDTO {
  asset: AssetDTO;
  substitute: boolean;
  precedence: number;
}

export interface TeamSheetDTO {
  manager: ManagerRef;
  items: TeamSheetItemDTO[];
  validFrom?: Date;
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

export interface WeekAssetDTO {
  id: number;
  asset: AssetDTO;
  substitute: boolean;
  precedence: number;
  didNotPlay: boolean;
  goals: number;
  assists: number;
  conceded: number;
  redCard: boolean;
}

export interface WeekTeamSheetDTO extends Record<AssetType, WeekAssetDTO[]> {
  manager: ManagerRef;
  initialPoints: number;
  points: number;
}

export interface WeekDetailsDTO {
  id: number;
  startDate: Date;
  teams: WeekTeamSheetDTO[];
}

export interface TeamSheetConfigItemDTO {
  assetId: number;
  substitute: boolean;
  precedence: number;
}

export interface TeamSheetConfigDTO {
  managerId: number;
  items: TeamSheetConfigItemDTO[];
  validFrom: Date;
}

export interface NewWeekDTO {
  date: number;
}
