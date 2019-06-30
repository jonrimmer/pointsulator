import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { TeamSheetDTO } from '@pointsulator/api-interface';

export const loadTeamSheets = createAction(
  '[TeamSheet/API] Load TeamSheets',
  (managerId: number) => ({ managerId })
);

export const loadTeamSheetsSuccess = createAction(
  '[TeamSheet/API] Load TeamSheets success',
  props<{ teamSheets: TeamSheetDTO[] }>()
);

export const addTeamSheet = createAction(
  '[TeamSheet/API] Add TeamSheet',
  props<{ teamSheet: TeamSheetDTO }>()
);

export const upsertTeamSheet = createAction(
  '[TeamSheet/API] Upsert TeamSheet',
  props<{ teamSheet: TeamSheetDTO }>()
);

export const addTeamSheets = createAction(
  '[TeamSheet/API] Add TeamSheets',
  props<{ teamSheets: TeamSheetDTO[] }>()
);

export const upsertTeamSheets = createAction(
  '[TeamSheet/API] Upsert TeamSheets',
  props<{ teamSheets: TeamSheetDTO[] }>()
);

export const updateTeamSheet = createAction(
  '[TeamSheet/API] Update TeamSheet',
  props<{ teamSheet: Update<TeamSheetDTO> }>()
);

export const updateTeamSheets = createAction(
  '[TeamSheet/API] Update TeamSheets',
  props<{ teamSheets: Update<TeamSheetDTO>[] }>()
);

export const deleteTeamSheet = createAction(
  '[TeamSheet/API] Delete TeamSheet',
  props<{ id: string }>()
);

export const deleteTeamSheets = createAction(
  '[TeamSheet/API] Delete TeamSheets',
  props<{ ids: string[] }>()
);

export const clearTeamSheets = createAction('[TeamSheet/API] Clear TeamSheets');
