import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AssetsPageActions from './assets-page/assets-page.actions';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { AssetsService } from './assets.service';
import * as AssetsActions from './assets.actions';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetsEffects {
  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssetsPageActions.loadAssets),
      exhaustMap(() =>
        this.assetsService.getAll().pipe(
          map(assets => AssetsActions.loadAssets({ assets })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly assetsService: AssetsService
  ) {}
}
