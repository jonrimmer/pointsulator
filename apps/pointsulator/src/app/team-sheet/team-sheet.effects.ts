import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TeamSheetActions from './team-sheet.actions';
import { switchMap, map } from 'rxjs/operators';
import { TeamSheetApiService } from './team-sheet-api.service';

@Injectable()
export class TeamSheetEffects {
  loadTeamSheet = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamSheetActions.loadTeamSheets),
      switchMap(({ managerId }) =>
        this.teamSheetApi
          .getForManager(managerId)
          .pipe(
            map(teamSheets =>
              TeamSheetActions.loadTeamSheetsSuccess({ teamSheets })
            )
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly teamSheetApi: TeamSheetApiService
  ) {}
}
