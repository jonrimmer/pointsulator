import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { TeamSheetDTO } from '@pointsulator/api-interface';
import * as TeamSheetActions from './team-sheet.actions';

export interface TeamSheetState extends EntityState<TeamSheetDTO> {
  // additional entities state properties
}

export const adapter: EntityAdapter<TeamSheetDTO> = createEntityAdapter<
  TeamSheetDTO
>();

export const initialState: TeamSheetState = adapter.getInitialState({
  // additional entity state properties
});

const teamSheetReducer = createReducer(
  initialState,
  on(TeamSheetActions.addTeamSheet, (state, action) =>
    adapter.addOne(action.teamSheet, state)
  ),
  on(TeamSheetActions.upsertTeamSheet, (state, action) =>
    adapter.upsertOne(action.teamSheet, state)
  ),
  on(TeamSheetActions.addTeamSheets, (state, action) =>
    adapter.addMany(action.teamSheets, state)
  ),
  on(TeamSheetActions.upsertTeamSheets, (state, action) =>
    adapter.upsertMany(action.teamSheets, state)
  ),
  on(TeamSheetActions.updateTeamSheet, (state, action) =>
    adapter.updateOne(action.teamSheet, state)
  ),
  on(TeamSheetActions.updateTeamSheets, (state, action) =>
    adapter.updateMany(action.teamSheets, state)
  ),
  on(TeamSheetActions.deleteTeamSheet, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(TeamSheetActions.deleteTeamSheets, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(TeamSheetActions.loadTeamSheetsSuccess, (state, action) =>
    adapter.addAll(action.teamSheets, state)
  ),
  on(TeamSheetActions.clearTeamSheets, state => adapter.removeAll(state))
);

export function reducer(state: TeamSheetState | undefined, action: Action) {
  return teamSheetReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
