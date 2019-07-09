import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromTeamSheets from './team-sheet.reducer';

export const selectTeamSheetsState = createFeatureSelector<
  fromTeamSheets.TeamSheetState
>('teamSheets');

export const selectTeamSheets = createSelector(
  selectTeamSheetsState,
  fromTeamSheets.selectAll
);

export const selectTeamSheet = (teamSheetId: number) =>
  createSelector(
    selectTeamSheetsState,
    fromTeamSheets.selectEntities,
    entities => entities.entities[teamSheetId]
  );

export const selectDraftTeamSheet = () =>
  createSelector(
    selectDraftTeamSheet,
    state => state.draft
  );
