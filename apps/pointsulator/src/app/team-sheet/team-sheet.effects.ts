import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TeamSheetActions from './team-sheet.actions';
import { switchMap, map, concatMap } from 'rxjs/operators';
import { TeamSheetApiService } from './team-sheet-api.service';
import { Store } from '@ngrx/store';
import { State, selectAssetForManager } from '../reducers';

@Injectable()
export class TeamSheetEffects {
  loadTeamSheet$ = createEffect(() =>
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

  startCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamSheetActions.startCreateTeamSheet),
      switchMap(({ managerId }) =>
        this.store.select(selectAssetForManager(managerId))
      ),
      map(assets => TeamSheetActions.initCreateTeamSheet({ assets }))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private readonly teamSheetApi: TeamSheetApiService
  ) {}
}
